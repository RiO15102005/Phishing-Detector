"""
Hybrid Retriever (Dense + BM25 Rerank)

Bọc 1 RetrieverPort dense (vd: PineconeRetriever) để tăng độ chính
xác truy vấn bằng kỹ thuật Hybrid Search:

1. Lấy 1 tập candidate RỘNG HƠN từ Vector Search (dense, ngữ nghĩa).
2. Tính điểm BM25 (khớp từ khóa, lexical) cho từng candidate so với
   query.
3. Kết hợp điểm dense (đã chuẩn hóa 0-1) + điểm BM25 (đã chuẩn hóa
   0-1) theo trọng số `alpha`, xếp hạng lại, lấy top_k cuối cùng.

Lưu ý về giới hạn: đây là Hybrid dạng "retrieve rộng bằng dense rồi
rerank bằng BM25 trên chính tập candidate đó" — không cần Pinecone hỗ
trợ sparse vector hay reindex lại dữ liệu, chỉ cần đổi code, áp dụng
được ngay. Nếu cần Hybrid "đúng nghĩa" (BM25 chạy trên toàn bộ corpus
thay vì chỉ tập candidate của dense) thì cần thêm 1 sparse index
(Pinecone hybrid index hoặc Elasticsearch/OpenSearch riêng) và
reindex toàn bộ dữ liệu — có thể làm ở giai đoạn sau nếu vẫn chưa đủ
chính xác.
"""

from __future__ import annotations

from rank_bm25 import BM25Okapi

from application.ports.retriever_port import RetrieverPort

from domain.entities.retrieved_document import RetrievedDocument


def _tokenize(text: str) -> list[str]:
    return text.lower().split()


def _normalize(values: list[float]) -> list[float]:

    if not values:
        return values

    low = min(values)
    high = max(values)

    if high - low < 1e-9:
        return [1.0 for _ in values]

    return [(v - low) / (high - low) for v in values]


class HybridRetriever(RetrieverPort):

    def __init__(
        self,
        *,
        dense_retriever: RetrieverPort,
        alpha: float = 0.5,
        candidate_multiplier: int = 4,
    ):
        """
        alpha:
            Trọng số cho điểm dense (0-1). BM25 dùng trọng số
            (1 - alpha). alpha=1 -> chỉ dùng dense (như cũ).
            alpha=0 -> chỉ dùng BM25. Mặc định 0.5 -> cân bằng
            ngữ nghĩa (dense) và khớp từ khóa (BM25) — quan trọng
            với văn bản luật vì thuật ngữ pháp lý (vd: "Điều 8",
            tên văn bản, số hiệu) cần khớp từ chính xác, thứ mà
            dense embedding hay bỏ lỡ.

        candidate_multiplier:
            Lấy candidate pool = top_k * candidate_multiplier từ
            dense search trước khi rerank, để BM25 có đủ ứng viên
            so khớp từ khóa, không chỉ giới hạn trong đúng top_k gốc.
        """
        self._dense = dense_retriever
        self._alpha = alpha
        self._candidate_multiplier = candidate_multiplier

    async def retrieve(
        self,
        *,
        query: str,
        top_k: int,
        namespace: str,
    ) -> list[RetrievedDocument]:

        candidate_k = max(
            top_k * self._candidate_multiplier,
            top_k + 10,
        )

        candidates = await self._dense.retrieve(
            query=query,
            top_k=candidate_k,
            namespace=namespace,
        )

        if not candidates:
            return candidates

        corpus = [
            _tokenize(doc.content)
            for doc in candidates
        ]

        bm25 = BM25Okapi(corpus)

        bm25_scores = bm25.get_scores(
            _tokenize(query),
        )

        dense_norm = _normalize(
            [doc.score for doc in candidates],
        )

        bm25_norm = _normalize(
            list(bm25_scores),
        )

        rescored = []

        for doc, d_score, b_score in zip(
            candidates,
            dense_norm,
            bm25_norm,
        ):

            hybrid_score = (
                self._alpha * d_score
                + (1 - self._alpha) * b_score
            )

            rescored.append(
                RetrievedDocument(
                    id=doc.id,
                    content=doc.content,
                    source=doc.source,
                    score=hybrid_score,
                    metadata=doc.metadata,
                )
            )

        rescored.sort(
            key=lambda d: d.score,
            reverse=True,
        )

        return rescored[:top_k]

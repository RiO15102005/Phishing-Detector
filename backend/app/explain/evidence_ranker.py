"""
Evidence Ranker

Chọn những Evidence quan trọng nhất
để giải thích cho người dùng.

Không thay đổi nội dung Evidence.

Author: Anti Scam Detector
"""

from __future__ import annotations

from app.schemas.evidence import Evidence
from app.schemas.evidence_result import EvidenceResult


class EvidenceRanker:

    """
    Evidence Ranker
    """

    def __init__(

        self,

        limit: int = 10

    ):

        self.limit = limit

    #
    # Rank
    #

    def rank(

        self,

        result: EvidenceResult

    ) -> list[Evidence]:

        evidences = result.evidences

        evidences.sort(

            key=self._score,

            reverse=True

        )

        return evidences[: self.limit]

    #
    # Evidence Score
    #

    def _score(

        self,

        evidence: Evidence

    ) -> int:

        score = 0

        #
        # Context
        #

        if evidence.context:

            score += 2

        #
        # Metadata
        #

        if evidence.metadata:

            score += 1

        #
        # Detector Weight
        #

        weights = {

            "BrandDetector": 10,

            "URLDetector": 9,

            "HTMLDetector": 8,

            "KeywordDetector": 7,

            "SSLDetector": 6,

            "HTTPDetector": 5,

            "NetworkDetector": 4

        }

        score += weights.get(

            evidence.detector,

            0

        )

        return score
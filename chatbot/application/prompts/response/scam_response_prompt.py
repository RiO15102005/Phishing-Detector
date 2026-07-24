from application.prompts.response.base_response_prompt import (
    BASE_RESPONSE_PROMPT,
)

SCAM_RESPONSE_PROMPT = BASE_RESPONSE_PROMPT + """

Question

{question}

Evidence

{evidence}

========================

Risk

{risk_level}

{risk_score}

========================

Nguồn đã tra cứu (dùng để trích dẫn, KHÔNG tự bịa nguồn khác)

{sources}

========================

YÊU CẦU

TUYỆT ĐỐI không quá 200 từ (không tính phần Nguồn tham khảo).

Không tư vấn pháp luật. Chỉ tư vấn về:

- hình thức lừa đảo
- dấu hiệu nhận biết
- cách hoạt động
- mức độ rủi ro
- cách phòng tránh

Cấu trúc BẮT BUỘC (mỗi mục 2-3 câu hoặc gạch đầu dòng, không viết
thành đoạn văn dài):

### 📌 Nhận định

### 🔍 Dấu hiệu nhận biết

Trình bày dạng gạch đầu dòng nếu có từ 2 dấu hiệu trở lên.

### ⚠️ Mức độ rủi ro

### 💡 Khuyến nghị

1-2 câu, thực tế và hành động được ngay.

### 📚 Nguồn tham khảo

Chỉ thêm mục này nếu "Nguồn đã tra cứu" ở trên không rỗng; liệt kê
lại đúng danh sách đó dạng gạch đầu dòng.
"""

# Phishing Detector — Backend

## Current Version

1.0

## Kiến trúc thực tế


Chrome Extension
      │
      ▼
FastAPI (app/api/analyze.py)
      │
      ▼
AnalyzerService (app/services/analyzer_service.py)
      │
      ├─ TTL Cache (bỏ qua toàn bộ pipeline nếu URL vừa được phân tích)
      │
      ▼
OSINT Agent (ChongLuaDao allowlist/denylist)
      │  (nếu không có kết quả)
      ▼
Collector Agent
      │  (HTML + DNS song song → WHOIS + Network song song)
      ▼
Evidence Builder
      │  (7 detector: brand, keyword, url, html, http, ssl, network —
      │   chỉ trả quan sát thô, KHÔNG kết luận fake/scam)
      ▼
Prompt Builder (V5)
      │  (evidence-based, không chứa Rule/Risk/Score/Judgment)
      ▼
Model AI
      │
      ▼
LLM Parser + Response Validator
      │
      ▼
LLMResult (risk_score, status, level, confidence, categories,
           indicators, reason)
      │
      ▼
API Response (Extension đọc trực tiếp)
```

### Nguyên tắc thiết kế

- **Detector chỉ quan sát, không kết luận.** Không có field kiểu
  `brand_impersonation=True` hay `suspicious_url=True` được đưa thẳng
  vào prompt — mọi kết luận (`safe`/`suspicious`/`malicious`) do mô hình AI
  tự suy luận từ evidence thô, tránh việc AI chỉ "đóng dấu" lại kết
  luận rule-based đã có sẵn.
- **Evidence có context.** Keyword đi kèm nguyên câu chứa nó (để phân
  biệt "Đừng nhập OTP" — cảnh báo — với "Nhập OTP để xác thực" — yêu
  cầu thật).
- **Fail-safe không fail-closed về malicious.** Khi mô hình AI lỗi/timeout,
  trả `status: "unknown"` thay vì tự động gắn nhãn nguy hiểm cho site
  chưa phân tích được.

## Cài đặt

### 1. Tạo virtual environment (nếu chưa có)

```powershell
python -m venv .venv
```

### 2. Kích hoạt virtual environment

```powershell
.\.venv\Scripts\Activate.ps1
```

> Nếu PowerShell chặn script (`running scripts is disabled`), chạy 1
> lần: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### 3. Cài dependencies

```powershell
pip install -r requirements.txt
```

### 4. Cấu hình `.env`

APP_NAME=Phishing Detector
APP_VERSION=1.0.0
DEBUG=true
HOST=0.0.0.0
PORT=8000
```

## Cách chạy

```powershell
.\.venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload
```



## Cấu trúc thư mục chính

```
backend/
├── main.py                    # FastAPI entry point
├── requirements.txt
├── .env                       
└── app/
    ├── api/                    # FastAPI routes
    ├── agents/                 # OSINT / Collector / AI Analysis Agent
    ├── collectors/              # HTML / DNS / WHOIS / Network
    ├── detectors/                # Brand / Keyword / URL / HTML / SSL / Network
    ├── evidence/                 # Evidence Builder (gộp detector -> EvidenceResult)
    ├── ai/                        # Prompt Builder / Gemini / Parser / Validator
    ├── explain/                    # Explanation Engine (đang phát triển)
    ├── response/                    # Response Builder + formatters (đang tích hợp)
    ├── schemas/                      # Pydantic models
    ├── services/                      # AnalyzerService (điều phối pipeline)
    └── utils/                          # Logger, TTL Cache
```

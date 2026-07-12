from pathlib import Path
import os

from dotenv import load_dotenv

# backend/
BASE_DIR = Path(__file__).resolve().parents[2]

ENV_FILE = BASE_DIR / ".env"

print("ENV FILE =", ENV_FILE)

load_dotenv(dotenv_path=ENV_FILE)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-2.5-flash"
)

print("API KEY =", GEMINI_API_KEY)
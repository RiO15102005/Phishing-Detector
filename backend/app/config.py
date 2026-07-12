from pathlib import Path
from dotenv import load_dotenv
import os

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR.parent / ".env")

APP_NAME = os.getenv("APP_NAME", "Phishing Detector")

VERSION = os.getenv("APP_VERSION", "1.0.0")

API_PREFIX = "/api/v1"

DEBUG = os.getenv("DEBUG", "true").lower() == "true"

HOST = os.getenv("HOST", "0.0.0.0")

PORT = int(os.getenv("PORT", 8000))
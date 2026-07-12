"""
Benchmark Result Schema

Kết quả của một lần chạy Benchmark.

Author: Anti Scam Detector
"""

from __future__ import annotations

from dataclasses import dataclass
from dataclasses import field


@dataclass(slots=True)
class BenchmarkResult:

    #
    # Test Case
    #

    case_id: str

    #
    # Prediction
    #

    predicted: str

    #
    # Confidence
    #

    confidence: float

    #
    # Risk Score
    #

    risk_score: int

    #
    # Correct
    #

    correct: bool

    #
    # Latency (ms)
    #

    latency: float

    #
    # Prompt Tokens
    #

    prompt_tokens: int = 0

    #
    # Completion Tokens
    #

    completion_tokens: int = 0

    #
    # Total Tokens
    #

    total_tokens: int = 0

    #
    # Reason
    #

    reason: list[str] = field(
        default_factory=list
    )
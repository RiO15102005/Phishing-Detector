"""
Evaluation Report Schema

Tổng hợp toàn bộ Benchmark.

Author: Anti Scam Detector
"""

from __future__ import annotations

from dataclasses import dataclass
from dataclasses import field

from app.evaluation.schemas.benchmark_result import BenchmarkResult


@dataclass(slots=True)
class EvaluationReport:

    #
    # Model
    #

    model: str

    #
    # Version
    #

    version: str

    #
    # Benchmark Results
    #

    results: list[BenchmarkResult] = field(
        default_factory=list
    )

    #
    # Metrics
    #

    accuracy: float = 0.0

    precision: float = 0.0

    recall: float = 0.0

    f1_score: float = 0.0

    false_positive_rate: float = 0.0

    false_negative_rate: float = 0.0

    average_latency: float = 0.0

    average_confidence: float = 0.0
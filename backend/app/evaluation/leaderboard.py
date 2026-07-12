"""
Benchmark Leaderboard

Lưu lịch sử Benchmark.

Author: Anti Scam Detector
"""

from __future__ import annotations

import json

from pathlib import Path
from dataclasses import asdict

from app.evaluation.schemas import EvaluationReport


class Leaderboard:

    """
    Benchmark Leaderboard
    """

    def __init__(

        self,

        path: str = "reports/leaderboard.json"

    ):

        self.path = Path(path)

        self.path.parent.mkdir(

            parents=True,

            exist_ok=True

        )

    #
    # Add
    #

    def add(

        self,

        report: EvaluationReport

    ) -> None:

        data = self.load()

        data.append({

            "model": report.model,

            "version": report.version,

            "accuracy": report.accuracy,

            "precision": report.precision,

            "recall": report.recall,

            "f1_score": report.f1_score,

            "false_positive_rate": report.false_positive_rate,

            "false_negative_rate": report.false_negative_rate,

            "average_latency": report.average_latency,

            "average_confidence": report.average_confidence

        })

        self.path.write_text(

            json.dumps(

                data,

                indent=4,

                ensure_ascii=False

            ),

            encoding="utf-8"

        )

    #
    # Load
    #

    def load(

        self

    ) -> list:

        if not self.path.exists():

            return []

        return json.loads(

            self.path.read_text(

                encoding="utf-8"

            )

        )

    #
    # Best Accuracy
    #

    def best_accuracy(

        self

    ):

        records = self.load()

        if not records:

            return None

        return max(

            records,

            key=lambda x: x["accuracy"]

        )
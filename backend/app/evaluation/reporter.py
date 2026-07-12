"""
Evaluation Report Generator

Xuất Benchmark Report.

Author: Anti Scam Detector
"""

from __future__ import annotations

import csv
import json

from pathlib import Path
from dataclasses import asdict

from app.evaluation.schemas import EvaluationReport


class ReportGenerator:

    """
    Report Generator
    """

    def __init__(

        self,

        output_dir: str = "reports"

    ):

        self.output_dir = Path(

            output_dir

        )

        self.output_dir.mkdir(

            parents=True,

            exist_ok=True

        )

    #
    # Export All
    #

    def export(

        self,

        report: EvaluationReport,

        filename: str

    ) -> None:

        self.export_json(

            report,

            filename

        )

        self.export_csv(

            report,

            filename

        )

        self.export_markdown(

            report,

            filename

        )

    #
    # JSON
    #

    def export_json(

        self,

        report,

        filename

    ):

        path = self.output_dir / f"{filename}.json"

        with path.open(

            "w",

            encoding="utf-8"

        ) as f:

            json.dump(

                asdict(report),

                f,

                indent=4,

                ensure_ascii=False

            )

    #
    # CSV
    #

    def export_csv(

        self,

        report,

        filename

    ):

        path = self.output_dir / f"{filename}.csv"

        with path.open(

            "w",

            newline="",

            encoding="utf-8"

        ) as f:

            writer = csv.writer(f)

            writer.writerow([

                "Case",

                "Expected",

                "Predicted",

                "Correct",

                "Confidence",

                "Latency(ms)"

            ])

            for result in report.results:

                writer.writerow([

                    result.case_id,

                    result.expected,

                    result.predicted,

                    result.correct,

                    result.confidence,

                    result.latency

                ])

    #
    # Markdown
    #

    def export_markdown(

        self,

        report,

        filename

    ):

        path = self.output_dir / f"{filename}.md"

        lines = [

            "# Evaluation Report",

            "",

            f"Model: {report.model}",

            f"Version: {report.version}",

            "",

            "## Metrics",

            "",

            f"- Accuracy: {report.accuracy:.2%}",

            f"- Precision: {report.precision:.2%}",

            f"- Recall: {report.recall:.2%}",

            f"- F1 Score: {report.f1_score:.2%}",

            f"- False Positive Rate: {report.false_positive_rate:.2%}",

            f"- False Negative Rate: {report.false_negative_rate:.2%}",

            f"- Average Confidence: {report.average_confidence:.2%}",

            f"- Average Latency: {report.average_latency:.2f} ms",

            "",

            "## Benchmark Results",

            "",

            "| Case | Expected | Predicted | Correct | Confidence |",

            "|------|----------|-----------|---------|------------|"

        ]

        for result in report.results:

            lines.append(

                f"| {result.case_id} "

                f"| {result.expected} "

                f"| {result.predicted} "

                f"| {result.correct} "

                f"| {result.confidence:.2f} |"

            )

        path.write_text(

            "\n".join(lines),

            encoding="utf-8"

        )
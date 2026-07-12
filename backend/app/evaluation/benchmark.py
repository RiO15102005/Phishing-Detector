"""
Benchmark Runner

Chạy toàn bộ Evaluation Dataset.

Author: Anti Scam Detector
"""

from __future__ import annotations

import time

from app.services.analyzer_service import AnalyzerService

from app.evaluation.loader import DatasetLoader

from app.evaluation.schemas import (

    BenchmarkResult,

    EvaluationReport

)


class BenchmarkRunner:

    """
    Benchmark Runner
    """

    def __init__(

        self,

        dataset_root: str

    ):

        self.loader = DatasetLoader(

            dataset_root

        )

        self.analyzer = AnalyzerService()

    #
    # Run
    #

    def run(

        self

    ) -> EvaluationReport:

        report = EvaluationReport(

            model="Gemini",

            version="4.5"

        )

        cases = self.loader.load()

        for case in cases:

            result = self._run_case(

                case

            )

            report.results.append(

                result

            )

        return report

    #
    # Run One Case
    #

    def _run_case(

        self,

        case

    ) -> BenchmarkResult:

        start = time.perf_counter()

        response = self.analyzer.analyze(

            case.url

        )

        latency = (

            time.perf_counter()

            - start

        ) * 1000

        predicted = response.status

        confidence = response.confidence

        risk = response.risk_score

        reason = response.reason

        return BenchmarkResult(

            case_id=case.id,

            predicted=predicted,

            confidence=confidence,

            risk_score=risk,

            correct=(

                predicted == case.expected

            ),

            latency=latency,

            prompt_tokens=getattr(

                response,

                "prompt_tokens",

                0

            ),

            completion_tokens=getattr(

                response,

                "completion_tokens",

                0

            ),

            total_tokens=getattr(

                response,

                "total_tokens",

                0

            ),

            reason=reason

        )
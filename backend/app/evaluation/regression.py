"""
Regression Test

So sánh Benchmark giữa hai phiên bản.

Author: Anti Scam Detector
"""

from __future__ import annotations

from app.evaluation.schemas import EvaluationReport


class RegressionTester:

    """
    Regression Tester
    """

    def compare(

        self,

        previous: EvaluationReport,

        current: EvaluationReport

    ) -> dict:

        result = {

            "accuracy": (

                current.accuracy

                - previous.accuracy

            ),

            "precision": (

                current.precision

                - previous.precision

            ),

            "recall": (

                current.recall

                - previous.recall

            ),

            "f1_score": (

                current.f1_score

                - previous.f1_score

            ),

            "false_positive_rate": (

                current.false_positive_rate

                - previous.false_positive_rate

            ),

            "false_negative_rate": (

                current.false_negative_rate

                - previous.false_negative_rate

            ),

            "average_latency": (

                current.average_latency

                - previous.average_latency

            )

        }

        result["passed"] = self._passed(

            result

        )

        return result

    #
    # Pass / Fail
    #

    def _passed(

        self,

        metrics: dict

    ) -> bool:

        #
        # Accuracy giảm
        #

        if metrics["accuracy"] < 0:

            return False

        #
        # FP tăng
        #

        if metrics["false_positive_rate"] > 0:

            return False

        #
        # FN tăng
        #

        if metrics["false_negative_rate"] > 0:

            return False

        return True
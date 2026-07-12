"""
Evaluation Error Analyzer

Phân tích Prediction sai.

Author: Anti Scam Detector
"""

from __future__ import annotations

from app.evaluation.schemas import EvaluationReport


class ErrorAnalyzer:

    """
    Error Analyzer
    """

    def analyze(
        self,
        report: EvaluationReport
    ) -> dict:

        false_positive = []

        false_negative = []

        suspicious = []

        for result in report.results:

            #
            # False Positive
            #

            if (

                result.expected == "safe"

                and

                result.predicted == "malicious"

            ):

                false_positive.append(

                    result

                )

            #
            # False Negative
            #

            elif (

                result.expected == "malicious"

                and

                result.predicted == "safe"

            ):

                false_negative.append(

                    result

                )

            #
            # Suspicious
            #

            elif (

                result.predicted == "suspicious"

            ):

                suspicious.append(

                    result

                )

        return {

            "false_positive": false_positive,

            "false_negative": false_negative,

            "suspicious": suspicious

        }
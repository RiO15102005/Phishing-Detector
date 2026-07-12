"""
Evaluation Metrics

Tính toán Benchmark Metrics.

Author: Anti Scam Detector
"""

from __future__ import annotations

from app.evaluation.schemas import EvaluationReport


class MetricsCalculator:

    """
    Metrics Calculator
    """

    def calculate(

        self,

        report: EvaluationReport

    ) -> EvaluationReport:

        results = report.results

        if not results:

            return report

        total = len(results)

        #
        # Accuracy
        #

        correct = sum(

            result.correct

            for result in results

        )

        report.accuracy = correct / total

        #
        # Binary Classification
        #

        tp = fp = fn = tn = 0

        for result in results:

            predicted = result.predicted

            expected = result.expected

            positive_pred = predicted == "malicious"

            positive_true = expected == "malicious"

            if positive_true and positive_pred:
                tp += 1

            elif not positive_true and positive_pred:
                fp += 1

            elif positive_true and not positive_pred:
                fn += 1

            else:
                tn += 1

        #
        # Precision
        #

        if tp + fp:

            report.precision = tp / (tp + fp)

        #
        # Recall
        #

        if tp + fn:

            report.recall = tp / (tp + fn)

        #
        # F1
        #

        if report.precision + report.recall:

            report.f1_score = (

                2

                * report.precision

                * report.recall

                /

                (

                    report.precision

                    + report.recall

                )

            )

        #
        # False Positive Rate
        #

        if fp + tn:

            report.false_positive_rate = (

                fp

                /

                (

                    fp

                    + tn

                )

            )

        #
        # False Negative Rate
        #

        if fn + tp:

            report.false_negative_rate = (

                fn

                /

                (

                    fn

                    + tp

                )

            )

        #
        # Average Confidence
        #

        report.average_confidence = (

            sum(

                r.confidence

                for r in results

            )

            / total

        )

        #
        # Average Latency
        #

        report.average_latency = (

            sum(

                r.latency

                for r in results

            )

            / total

        )

        return report
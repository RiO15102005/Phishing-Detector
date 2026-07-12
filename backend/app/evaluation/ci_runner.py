"""
Continuous Benchmark Runner

Tự động chạy Benchmark và Regression.

Author: Anti Scam Detector
"""

from __future__ import annotations

from app.evaluation.benchmark import BenchmarkRunner
from app.evaluation.metrics import MetricsCalculator
from app.evaluation.regression import RegressionTester
from app.evaluation.reporter import ReportGenerator
from app.evaluation.leaderboard import Leaderboard


class ContinuousBenchmark:

    """
    Continuous Benchmark
    """

    def __init__(

        self,

        dataset_root: str,

        previous_report=None

    ):

        self.runner = BenchmarkRunner(

            dataset_root

        )

        self.metrics = MetricsCalculator()

        self.reporter = ReportGenerator()

        self.regression = RegressionTester()

        self.leaderboard = Leaderboard()

        self.previous_report = previous_report

    def run(self):

        #
        # Benchmark
        #

        report = self.runner.run()

        #
        # Metrics
        #

        report = self.metrics.calculate(

            report

        )

        #
        # Export
        #

        self.reporter.export(

            report,

            report.version

        )

        #
        # Leaderboard
        #

        self.leaderboard.add(

            report

        )

        #
        # Regression
        #

        if self.previous_report:

            regression = self.regression.compare(

                self.previous_report,

                report

            )

            return report, regression

        return report, None
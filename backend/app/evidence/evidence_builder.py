"""
Evidence Builder

Điều phối toàn bộ Detector.

Không chứa:
- Rule
- Risk
- AI
- Prompt

Author: Anti Scam Detector
"""

from __future__ import annotations

from app.detectors.brand_detector import BrandDetector
from app.detectors.keyword_detector import KeywordDetector
from app.detectors.url_detector import URLDetector
from app.detectors.html_detector import HTMLDetector
from app.detectors.http_detector import HTTPDetector
from app.detectors.ssl_detector import SSLDetector
from app.detectors.network_detector import NetworkDetector

from app.schemas.collector_result import CollectorResult
from app.schemas.evidence_result import EvidenceResult


class EvidenceBuilder:

    """
    Build Evidence Result.
    """

    def __init__(self):

        self.detectors = [

            BrandDetector(),

            KeywordDetector(),

            URLDetector(),

            HTMLDetector(),

            HTTPDetector(),

            SSLDetector(),

            NetworkDetector()

        ]

    def build(

        self,

        collector: CollectorResult

    ) -> EvidenceResult:

        result = EvidenceResult()

        for detector in self.detectors:

            group = detector.detect(

                collector

            )

            if group.empty:

                continue

            result.add_group(

                group

            )

        return result
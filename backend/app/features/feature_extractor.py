"""
Feature Extractor

Pipeline

CollectorResult
        │
        ▼
BrandDetector
        │
        ▼
FormDetector
        │
        ▼
KeywordDetector
        │
        ▼
URLDetector
        │
        ▼
HTMLDetector
        │
        ▼
FeatureResult
"""

from __future__ import annotations

import time

from app.features.feature_result import FeatureResult
from app.features.detectors.brand_detector import BrandDetector
from app.features.detectors.form_detector import FormDetector
from app.features.detectors.keyword_detector import KeywordDetector
from app.features.detectors.url_detector import URLDetector
from app.features.detectors.html_detector import HTMLDetector
from app.schemas.collector_result import CollectorResult
from app.utils.logger import logger


class FeatureExtractor:
    """
    Feature Extractor

    Chỉ trích xuất Feature.

    Không AI.

    Không chấm điểm.

    Không kết luận.
    """

    def __init__(self):
        self.brand_detector = BrandDetector()
        self.form_detector = FormDetector()
        self.keyword_detector = KeywordDetector()
        self.url_detector = URLDetector()
        self.html_detector = HTMLDetector()

    def extract(
        self,
        collector: CollectorResult
    ) -> FeatureResult:
        start = time.perf_counter()

        logger.info("=" * 80)
        logger.info("Feature Extractor")

        text = collector.visible_text or ""
        html = collector.html or ""
        domain = collector.domain or ""
        url = collector.final_url or collector.url or ""

        data = {}

        #
        # Brand Detector
        #
        try:
            brand = self.brand_detector.detect(
                text=text,
                domain=domain
            )
            data.update(brand)
        except Exception as ex:
            logger.exception(ex)

        #
        # Form Detector
        #
        try:
            form = self.form_detector.detect(
                html
            )
            data.update(form)
        except Exception as ex:
            logger.exception(ex)

        #
        # Keyword Detector
        #
        try:
            keyword = self.keyword_detector.detect(
                text
            )
            data.update(keyword)
        except Exception as ex:
            logger.exception(ex)

        #
        # URL Detector
        #
        try:
            result = self.url_detector.detect(
                url
            )
            data.update(result)
        except Exception as ex:
            logger.exception(ex)

        #
        # HTML Detector
        #
        try:
            result = self.html_detector.detect(
                html
            )
            data.update(result)
        except Exception as ex:
            logger.exception(ex)

        feature = FeatureResult(
            **data
        )

        logger.info(
            f"Brand              : {feature.detected_brand}"
        )
        logger.info(
            f"Brand Fake         : {feature.brand_impersonation}"
        )
        logger.info(
            f"Login Form         : {feature.has_login_form}"
        )
        logger.info(
            f"Password Inputs    : {feature.password_inputs}"
        )
        logger.info(
            f"Email Inputs       : {feature.email_inputs}"
        )
        logger.info(
            f"Hidden Inputs      : {feature.hidden_inputs}"
        )
        logger.info(
            f"External Form      : {feature.external_form_action}"
        )
        logger.info(
            f"Iframe Count       : {feature.iframe_count}"
        )
        logger.info(
            f"Script Count       : {feature.script_count}"
        )
        logger.info(
            f"Hidden Elements    : {feature.hidden_elements}"
        )
        logger.info(
            f"Suspicious URL     : {feature.suspicious_url}"
        )
        logger.info(
            f"Bank Keywords      : {feature.bank_keywords}"
        )
        logger.info(
            f"Crypto Keywords    : {feature.crypto_keywords}"
        )
        logger.info(
            f"Gambling Keywords  : {feature.gambling_keywords}"
        )
        logger.info(
            f"Suspicious Words   : {feature.suspicious_keywords}"
        )
        logger.info(
            f"Extract Time       : {time.perf_counter() - start:.3f}s"
        )
        logger.info("=" * 80)

        return feature
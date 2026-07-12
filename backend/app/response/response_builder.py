"""
Response Builder
"""

from __future__ import annotations

from app.response.schemas import APIResponse
from app.schemas.llm_result import LLMResult
from app.schemas.collector_result import CollectorResult


class ResponseBuilder:
    """
    Build final API response.
    """

    def build(
        self,
        collector: CollectorResult,
        llm: LLMResult,
        explanation: str,
        elapsed: float,
    ) -> APIResponse:

        return APIResponse(

            #
            # Website
            #

            url=collector.final_url,

            #
            # AI Result
            #

            status=llm.status,

            confidence=llm.confidence,

            risk_score=llm.risk_score,

            level=llm.level,

            analysis_type=llm.analysis_type,

            model=llm.model,

            categories=llm.categories,

            indicators=llm.indicators,

            #
            # Explanation
            #

            explanation=explanation,

            #
            # Metadata
            #

            processing_time=elapsed,

            timestamp=llm.timestamp,
        )
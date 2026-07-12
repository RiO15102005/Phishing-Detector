"""
Dashboard Formatter

Convert APIResponse
to DashboardResponse.

Author: Anti Scam Detector
"""

from __future__ import annotations

from app.response.schemas import (

    APIResponse,

    DashboardResponse

)


class DashboardFormatter:

    """
    Dashboard Formatter
    """

    def format(

        self,

        response: APIResponse

    ) -> DashboardResponse:

        return DashboardResponse(

            url=response.url,

            title=getattr(response, "title", ""),

            hostname=getattr(response, "hostname", ""),

            status=response.status,

            level=response.level,

            confidence=response.confidence,

            risk_score=response.risk_score,

            model=response.model,

            processing_time=response.processing_time,

            categories=response.categories,

            indicators=response.indicators,

            explanation=response.explanation

        )
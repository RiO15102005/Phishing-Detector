"""
Dashboard Response Schema

Author: Anti Scam Detector
"""

from __future__ import annotations

from dataclasses import dataclass, field

from app.explain.schemas import Explanation


@dataclass(slots=True)
class DashboardResponse:

    #
    # Website
    #

    url: str

    title: str

    hostname: str

    #
    # Analysis
    #

    status: str

    level: str

    confidence: float

    risk_score: int

    #
    # AI
    #

    model: str

    processing_time: float

    #
    # Statistics
    #

    categories: list[str] = field(default_factory=list)

    indicators: list[str] = field(default_factory=list)

    #
    # Full Explanation
    #

    explanation: Explanation | None = None
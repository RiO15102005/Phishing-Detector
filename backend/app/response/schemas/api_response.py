from __future__ import annotations

from dataclasses import dataclass, field

from app.explain.schemas import Explanation


@dataclass(slots=True)
class APIResponse:

    #
    # Website
    #

    url: str

    #
    # Analysis
    #

    status: str

    confidence: float

    risk_score: int

    level: str

    #
    # AI
    #

    model: str

    analysis_type: str

    #
    # Categories
    #

    categories: list[str] = field(default_factory=list)

    indicators: list[str] = field(default_factory=list)

    #
    # Explanation
    #

    explanation: Explanation | None = None

    #
    # Metadata
    #

    processing_time: float = 0.0

    timestamp: str = ""
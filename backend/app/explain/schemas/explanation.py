"""
Explanation Schema

Đầu ra cuối cùng của Explanation Engine.

Author: Anti Scam Detector
"""

from __future__ import annotations

from dataclasses import dataclass
from dataclasses import field

from app.explain.schemas.explanation_section import ExplanationSection


@dataclass(slots=True)
class Explanation:

    #
    # Summary
    #

    summary: str

    #
    # Supporting Evidence
    #

    supporting: ExplanationSection = field(

        default_factory=lambda:

        ExplanationSection(

            "Supporting Evidence"

        )

    )

    #
    # Missing Evidence
    #

    missing: ExplanationSection = field(

        default_factory=lambda:

        ExplanationSection(

            "Missing Evidence"

        )

    )

    #
    # Limitations
    #

    limitations: ExplanationSection = field(

        default_factory=lambda:

        ExplanationSection(

            "Limitations"

        )

    )

    #
    # Recommendations
    #

    recommendations: ExplanationSection = field(

        default_factory=lambda:

        ExplanationSection(

            "Recommendations"

        )

    )
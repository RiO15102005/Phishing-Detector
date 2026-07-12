"""
Extension Response Schema

Response tối ưu cho Chrome Extension.

Author: Anti Scam Detector
"""

from __future__ import annotations

from dataclasses import dataclass
from dataclasses import field


@dataclass(slots=True)
class ExtensionResponse:

    #
    # Website
    #

    url: str

    #
    # Result
    #

    status: str

    level: str

    confidence: float

    #
    # Summary
    #

    summary: str

    #
    # UI
    #

    color: str

    icon: str

    #
    # Evidence
    #

    supporting: list[str] = field(
        default_factory=list
    )

    #
    # Recommendation
    #

    recommendations: list[str] = field(
        default_factory=list
    )
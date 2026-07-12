"""
Explanation Item Schema

Một mục giải thích.

Author: Anti Scam Detector
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(slots=True)
class ExplanationItem:

    #
    # Detector
    #

    detector: str

    #
    # Title
    #

    title: str

    #
    # Description
    #

    description: str

    #
    # Related Evidence Type
    #

    evidence_type: str = ""

    #
    # Importance
    #
    # low
    # medium
    # high
    #

    importance: str = "medium"
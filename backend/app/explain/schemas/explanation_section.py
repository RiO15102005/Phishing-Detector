"""
Explanation Section Schema

Một nhóm các Explanation Item.

Author: Anti Scam Detector
"""

from __future__ import annotations

from dataclasses import dataclass
from dataclasses import field

from app.explain.schemas.explanation_item import ExplanationItem


@dataclass(slots=True)
class ExplanationSection:

    #
    # Section Name
    #

    name: str

    #
    # Items
    #

    items: list[ExplanationItem] = field(
        default_factory=list
    )

    def add(
        self,
        item: ExplanationItem
    ) -> None:

        self.items.append(item)

    @property
    def empty(self) -> bool:

        return len(self.items) == 0
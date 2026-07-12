"""
Evaluation Test Case Schema

Định nghĩa một website dùng để đánh giá hệ thống.

Author: Anti Scam Detector
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(slots=True)
class TestCase:
    """
    Một mẫu đánh giá.
    """

    #
    # ID
    #

    id: str

    #
    # Display Name
    #

    name: str

    #
    # Website URL
    #

    url: str

    #
    # Expected Result
    #
    # safe
    # suspicious
    # malicious
    #

    expected: str

    #
    # Website Category
    #

    category: str

    #
    # Dataset Group
    #
    # safe
    # malicious
    # borderline
    # suspicious
    #

    dataset: str

    #
    # Optional Tags
    #

    tags: list[str] = field(default_factory=list)

    #
    # Description
    #

    description: str = ""

    #
    # Notes
    #

    notes: str = ""

    #
    # Ignore
    #
    # Cho phép tạm bỏ qua testcase
    #

    enabled: bool = True
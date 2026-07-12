"""
Explanation Validator

Kiểm tra Explanation có được hỗ trợ
bởi Evidence hay không.

Author: Anti Scam Detector
"""

from __future__ import annotations

from app.explain.schemas import Explanation
from app.schemas.evidence import Evidence


class ExplanationValidator:

    """
    Explanation Validator
    """

    def validate(

        self,

        explanation: Explanation,

        evidences: list[Evidence]

    ) -> Explanation:

        #
        # Supporting
        #

        explanation.supporting.items = [

            item

            for item in explanation.supporting.items

            if self._supported(

                item,

                evidences

            )

        ]

        #
        # Missing
        #

        explanation.missing.items = [

            item

            for item in explanation.missing.items

            if self._supported(

                item,

                evidences

            )

        ]

        return explanation

    #
    # Check Support
    #

    def _supported(

        self,

        item,

        evidences

    ) -> bool:

        for evidence in evidences:

            if (

                item.detector

                and

                item.detector

                !=

                evidence.detector

            ):

                continue

            if (

                item.title.lower()

                ==

                evidence.name.lower()

            ):

                return True

        return False
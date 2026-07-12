"""
Explanation Builder

Chuyển Evidence + LLM Result
thành Explanation.

Author: Anti Scam Detector
"""

from __future__ import annotations

from app.explain.schemas import (

    Explanation,

    ExplanationItem

)

from app.schemas.evidence import Evidence


class ExplanationBuilder:

    """
    Explanation Builder
    """

    def build(

        self,

        summary: str,

        evidences: list[Evidence],

        limitations: list[str] | None = None,

        recommendations: list[str] | None = None

    ) -> Explanation:

        explanation = Explanation(

            summary=summary

        )

        #
        # Supporting
        #

        for evidence in evidences:

            explanation.supporting.add(

                self._from_evidence(

                    evidence

                )

            )

        #
        # Limitations
        #

        if limitations:

            for item in limitations:

                explanation.limitations.add(

                    ExplanationItem(

                        detector="",

                        title=item,

                        description=item,

                        importance="medium"

                    )

                )

        #
        # Recommendation
        #

        if recommendations:

            for item in recommendations:

                explanation.recommendations.add(

                    ExplanationItem(

                        detector="",

                        title=item,

                        description=item,

                        importance="high"

                    )

                )

        return explanation

    #
    # Evidence -> Item
    #

    def _from_evidence(

        self,

        evidence: Evidence

    ) -> ExplanationItem:

        return ExplanationItem(

            detector=evidence.detector,

            title=evidence.name,

            description=evidence.context

            or evidence.value,

            evidence_type=evidence.type,

            importance="medium"

        )
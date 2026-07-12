"""
Extension Formatter

Convert APIResponse
to ExtensionResponse.

Author: Anti Scam Detector
"""

from __future__ import annotations

from app.response.schemas import (

    APIResponse,

    ExtensionResponse

)


class ExtensionFormatter:

    """
    Extension Formatter
    """

    def format(

        self,

        response: APIResponse

    ) -> ExtensionResponse:

        explanation = response.explanation

        return ExtensionResponse(

            url=response.url,

            status=response.status,

            level=response.level,

            confidence=response.confidence,

            summary=explanation.summary,

            color=self._color(

                response.status

            ),

            icon=self._icon(

                response.status

            ),

            supporting=[

                item.title

                for item in explanation.supporting.items

            ],

            recommendations=[

                item.title

                for item

                in explanation.recommendations.items

            ]

        )

    #
    # UI Color
    #

    def _color(

        self,

        status: str

    ) -> str:

        colors = {

            "safe": "#22C55E",

            "suspicious": "#F59E0B",

            "malicious": "#EF4444"

        }

        return colors.get(

            status,

            "#6B7280"

        )

    #
    # Icon
    #

    def _icon(

        self,

        status: str

    ) -> str:

        icons = {

            "safe": "shield-check",

            "suspicious": "triangle-alert",

            "malicious": "shield-x"

        }

        return icons.get(

            status,

            "circle-help"

        )
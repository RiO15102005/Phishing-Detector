"""
Explanation Formatter

Chuyển Explanation sang nhiều định dạng.

Author: Anti Scam Detector
"""

from __future__ import annotations

from dataclasses import asdict

from app.explain.schemas import Explanation


class ExplanationFormatter:

    """
    Explanation Formatter
    """

    #
    # JSON
    #

    def to_json(

        self,

        explanation: Explanation

    ) -> dict:

        return asdict(

            explanation

        )

    #
    # Markdown
    #

    def to_markdown(

        self,

        explanation: Explanation

    ) -> str:

        lines = [

            "# Analysis",

            "",

            explanation.summary,

            ""

        ]

        lines.extend(

            self._section(

                explanation.supporting

            )

        )

        lines.extend(

            self._section(

                explanation.missing

            )

        )

        lines.extend(

            self._section(

                explanation.limitations

            )

        )

        lines.extend(

            self._section(

                explanation.recommendations

            )

        )

        return "\n".join(

            lines

        )

    #
    # HTML
    #

    def to_html(

        self,

        explanation: Explanation

    ) -> str:

        html = [

            "<h2>Analysis</h2>",

            f"<p>{explanation.summary}</p>"

        ]

        html.extend(

            self._html_section(

                explanation.supporting

            )

        )

        html.extend(

            self._html_section(

                explanation.missing

            )

        )

        html.extend(

            self._html_section(

                explanation.limitations

            )

        )

        html.extend(

            self._html_section(

                explanation.recommendations

            )

        )

        return "\n".join(

            html

        )

    #
    # Helper
    #

    def _section(

        self,

        section

    ):

        lines = [

            "",

            f"## {section.name}",

            ""

        ]

        for item in section.items:

            lines.append(

                f"- {item.title}"

            )

            if item.description:

                lines.append(

                    f"  - {item.description}"

                )

        return lines

    #
    # HTML Section
    #

    def _html_section(

        self,

        section

    ):

        html = [

            f"<h3>{section.name}</h3>",

            "<ul>"

        ]

        for item in section.items:

            html.append(

                "<li>"

                f"<b>{item.title}</b><br>"

                f"{item.description}"

                "</li>"

            )

        html.append(

            "</ul>"

        )

        return html
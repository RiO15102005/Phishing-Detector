"""
HTML Detector

Phân tích cấu trúc HTML.

Không đưa ra kết luận.

Không chấm điểm.
"""

from __future__ import annotations

from bs4 import BeautifulSoup


class HTMLDetector:
    """
    HTML Detector

    Trích xuất một số đặc trưng HTML phục vụ LLM.
    """

    def detect(
        self,
        html: str
    ) -> dict:

        if not html:

            return {

                "iframe_count": 0,

                "script_count": 0,

                "hidden_elements": 0

            }

        soup = BeautifulSoup(

            html,

            "lxml"

        )

        #
        # iframe
        #

        iframe_count = len(

            soup.find_all("iframe")

        )

        #
        # script
        #

        script_count = len(

            soup.find_all("script")

        )

        #
        # hidden element
        #

        hidden_count = 0

        #
        # hidden attribute
        #

        hidden_count += len(

            soup.find_all(

                attrs={

                    "hidden": True

                }

            )

        )

        #
        # style="display:none"
        #

        for tag in soup.find_all(True):

            style = tag.get(

                "style",

                ""

            ).lower()

            if (

                "display:none" in style

                or

                "visibility:hidden" in style

            ):

                hidden_count += 1

        return {

            "iframe_count": iframe_count,

            "script_count": script_count,

            "hidden_elements": hidden_count

        }
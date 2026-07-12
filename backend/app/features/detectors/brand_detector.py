from __future__ import annotations

from app.features.constants import BRANDS


class BrandDetector:

    def detect(
        self,
        text: str,
        domain: str
    ) -> dict:

        lower = text.lower()

        result = {

            "detected_brand": None,

            "brand_impersonation": False

        }

        for brand, aliases in BRANDS.items():

            for alias in aliases:

                if alias in lower:

                    result["detected_brand"] = brand

                    if brand not in domain.lower():

                        result["brand_impersonation"] = True

                    return result

        return result
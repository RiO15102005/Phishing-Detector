"""
Dataset Loader

Load Evaluation Dataset.

Author: Anti Scam Detector
"""

from __future__ import annotations

import json

from pathlib import Path

from app.evaluation.schemas import TestCase


class DatasetLoader:

    """
    Dataset Loader
    """

    def __init__(

        self,

        dataset_root: str

    ):

        self.dataset_root = Path(

            dataset_root

        )

    #
    # Load All
    #

    def load(

        self

    ) -> list[TestCase]:

        cases: list[TestCase] = []

        for file in self.dataset_root.rglob(

            "*.json"

        ):

            case = self._load_file(

                file

            )

            if case is None:

                continue

            if not case.enabled:

                continue

            cases.append(

                case

            )

        return sorted(

            cases,

            key=lambda x: x.id

        )

    #
    # Load One File
    #

    def _load_file(

        self,

        path: Path

    ) -> TestCase | None:

        with path.open(

            "r",

            encoding="utf-8"

        ) as f:

            data = json.load(

                f

            )

        return TestCase(

            **data

        )
from dataclasses import asdict

from app.response.schemas import APIResponse


class APIFormatter:

    def format(

        self,

        response: APIResponse

    ) -> dict:

        return asdict(response)
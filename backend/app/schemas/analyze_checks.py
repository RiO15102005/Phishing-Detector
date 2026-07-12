from pydantic import BaseModel

from app.schemas.collector_response import CollectorResponse
from app.schemas.check_result import CheckResult


class AnalyzeChecks(BaseModel):

    collector: CollectorResponse

    url_checker: CheckResult

    email_checker: CheckResult

    phone_checker: CheckResult

    ip_checker: CheckResult

    osint_checker: CheckResult
from pydantic import BaseModel
from typing import List, Optional


class JobSearchRequest(BaseModel):
    keyword: str
    location: str = ""
    exclude: List[str] = []
    modality: str = ""  # "remoto", "hibrido", "presencial"
    time_filter: str = ""  # "1h", "2h", "6h", "12h", "24h"


class Job(BaseModel):
    title: str
    company: str
    location: str
    description: str
    link: str
    posted_date: Optional[str] = None


class JobSearchResponse(BaseModel):
    results: List[Job]
    total: int
    no_results: bool = False
    message: Optional[str] = None

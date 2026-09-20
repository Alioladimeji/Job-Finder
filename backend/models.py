from pydantic import BaseModel, field_validator
from typing import List, Optional, Union


class JobSearchRequest(BaseModel):
    keyword: str
    location: str = ""
    exclude: List[str] = []
    modality: str = ""  # Deprecated: use modalities instead
    modalities: List[str] = []  # ["remoto", "hibrido", "presencial"]
    time_filter: str = ""  # "1h", "2h", "6h", "12h", "24h"

    @field_validator('modalities', mode='before')
    @classmethod
    def ensure_modalities_list(cls, v):
        """Ensure modalities is always a list"""
        if v is None:
            return []
        if isinstance(v, str):
            return [v] if v else []
        return v


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

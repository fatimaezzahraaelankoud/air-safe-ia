# backend/app/schemas/sensor_schema.py
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class SensorData(BaseModel):
    temperature: float
    humidity: float
    pm25: float
    co: float
    ier: Optional[float] = None
    ier_level: Optional[str] = None
    zone: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
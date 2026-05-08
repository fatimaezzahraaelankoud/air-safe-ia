from pydantic import BaseModel
from datetime import datetime

class Prediction(BaseModel):
    user_id: str
    probability: float
    ier: float
    risk_level: str
    date: datetime = datetime.utcnow()
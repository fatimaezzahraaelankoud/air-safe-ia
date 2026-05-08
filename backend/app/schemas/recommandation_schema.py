from pydantic import BaseModel

class Recommendation(BaseModel):
    user_id: str
    message: str

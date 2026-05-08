# backend/app/schemas/symptome.py
from pydantic import BaseModel
from datetime import datetime


class SymptomeCreate(BaseModel):
    user_id: str = ""          # ← default vide, sera rempli depuis le token JWT
    toux: bool = False         # ← 'cough' en français (backend)
    cough: bool = False        # ← 'cough' envoyé par le frontend React
    respiration_difficile: bool = False   # 'breathing' frontend
    breathing: bool = False    # alias frontend
    headache: bool = False     # ← CORRIGÉ (était 'headacke')
    fatigue: bool = False
    date: datetime = datetime.utcnow()
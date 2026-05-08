from fastapi import APIRouter, Depends
from app.schemas.symptome import SymptomeCreate
from app.services.health_service import process_health_data
from app.core.security import get_current_user

router = APIRouter(prefix="/health", tags=["Health"])


@router.post("/submit")
async def submit_symptomes(
    symptome: SymptomeCreate,
    user=Depends(get_current_user)
):
    symptome.user_id = user["user_id"]
    return await process_health_data(symptome)
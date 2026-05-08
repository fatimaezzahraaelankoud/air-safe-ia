from fastapi import APIRouter, HTTPException
from app.schemas.user_schema import UserCreate, UserLogin
from app.services.auth_service import register_user, login_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
async def register(user: UserCreate):
    result = await register_user(user)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.post("/login")
async def login(user: UserLogin):
    result = await login_user(user)
    if "error" in result:
        raise HTTPException(status_code=401, detail=result["error"])
    return result
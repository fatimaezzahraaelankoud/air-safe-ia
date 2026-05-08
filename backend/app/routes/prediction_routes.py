# backend/app/routes/prediction_routes.py
from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.schemas.sensor_schema import SensorData
from app.services.ai_bridge import run_full_pipeline
from app.db.mongodb import prediction_collection, sensor_collection

router = APIRouter(prefix="/predict", tags=["Prediction"])


@router.post("/")
async def predict(data: SensorData, user=Depends(get_current_user)):
    """Lance le pipeline AI sur une mesure IoT et sauvegarde la prédiction."""
    user_id = user.get("user_id", "anonymous")
    
    result = run_full_pipeline(
        pm25=data.pm25,
        co=data.co,
        humidity=data.humidity,
        temperature=data.temperature,
        user_id=user_id,
    )

    # Sauvegarder la prédiction
    prediction_doc = {
        "user_id": user_id,
        "probability": result["prediction"]["probability"],
        "ier": result["ier"]["score"],
        "risk_level": result["prediction"]["alert_level"],
        "zone": result["zone"]["zone"],
    }
    await prediction_collection.insert_one(prediction_doc)
    
    return result
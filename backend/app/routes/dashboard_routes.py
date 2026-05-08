# backend/app/routes/dashboard_routes.py
from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.db.mongodb import sensor_collection, prediction_collection
from app.services.ai_bridge import run_full_pipeline

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/{user_id}")
async def get_dashboard(user_id: str, user=Depends(get_current_user)):
    """Retourne les dernières données capteurs + IER + zone + prédiction pour le frontend."""
    
    # Récupérer la dernière mesure capteur
    last_sensor = await sensor_collection.find_one(
        sort=[("timestamp", -1)]
    )
    
    if not last_sensor:
        return {"error": "Aucune donnée capteur disponible"}

    # Récupérer le dernier résultat de prédiction
    last_prediction = await prediction_collection.find_one(
        {"user_id": user_id},
        sort=[("_id", -1)]
    )

    # Lancer le pipeline AI complet
    result = run_full_pipeline(
        pm25=last_sensor.get("pm25", 0),
        co=last_sensor.get("co", 0),
        humidity=last_sensor.get("humidity", 0),
        temperature=last_sensor.get("temperature", 0),
        user_id=user_id,
    )
    
    result["timestamp"] = str(last_sensor.get("timestamp", ""))
    return result


@router.get("/{user_id}/history")
async def get_history(user_id: str, limit: int = 7, user=Depends(get_current_user)):
    """Retourne l'historique des prédictions pour l'écran Profile."""
    predictions = []
    async for p in prediction_collection.find(
        {"user_id": user_id},
        sort=[("_id", -1)],
        limit=limit
    ):
        p["_id"] = str(p["_id"])
        predictions.append(p)
    return predictions
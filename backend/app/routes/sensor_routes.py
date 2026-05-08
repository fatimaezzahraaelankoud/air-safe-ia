# backend/app/routes/sensor_routes.py
from fastapi import APIRouter, Depends
from app.schemas.sensor_schema import SensorData
from app.services.sensor_service import create_sensor_data, get_all_sensors
from app.services.simulation_service import simulate_sensor
from app.services.ai_bridge import run_full_pipeline
from app.core.security import get_current_user

router = APIRouter(prefix="/sensor", tags=["Sensor Data"])


@router.post("/")
async def add_sensor(data: SensorData):
    """Reçoit des données réelles depuis un capteur IoT (ESP32/Arduino via HTTP)."""
    return await create_sensor_data(data)


@router.get("/")
async def get_sensors():
    return await get_all_sensors()


@router.get("/simulate")
async def simulate(user=Depends(get_current_user)):
    """Génère et sauvegarde une mesure simulée."""
    data = simulate_sensor()
    sensor = SensorData(**data)
    return await create_sensor_data(sensor)


@router.get("/live")
async def live_data(user=Depends(get_current_user)):
    """
    Endpoint principal pour le frontend.
    Génère des données simulées + lance le pipeline AI complet.
    Appelé toutes les 10 secondes par le Dashboard React.
    """
    raw = simulate_sensor()

    # Sauvegarder en base
    sensor = SensorData(**raw)
    await create_sensor_data(sensor)

    # Pipeline AI complet : IER → Zone K-Means → Prédiction RF
    result = run_full_pipeline(
        pm25=raw["pm25"],
        co=raw["co"],
        humidity=raw["humidity"],
        temperature=raw["temperature"],
        user_id=user.get("user_id", "anonymous"),
    )
    return result



from app.db.mongodb import sensor_collection
from app.services.ier_service import calculate_ier
from app.schemas.sensor_schema import SensorData

async def create_sensor_data(data: SensorData):
    data.ier = calculate_ier(data)
    result = await sensor_collection.insert_one(data.dict())
    return str(result.inserted_id)


async def get_all_sensors():
    sensors = []
    async for s in sensor_collection.find():
        s["_id"] = str(s["_id"])
        sensors.append(s)
    return sensors
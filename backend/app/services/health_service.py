from app.db.mongodb import (
    symptome_collection,
    sensor_collection,
    prediction_collection,
    recommendation_collection
)

from app.services.prediction_service import predict_risk
from app.services.recommendation_service import generate_recommendation


async def process_health_data(symptome):


    await symptome_collection.insert_one(symptome.dict())

    last_sensor = await sensor_collection.find_one(sort=[("timestamp", -1)])

    if not last_sensor:
        return {"error": "No sensor data"}

    ier = last_sensor.get("ier", 0)


    probability, level = predict_risk(symptome, ier)

  
    message = generate_recommendation(level)

    prediction = {
        "user_id": symptome.user_id,
        "probability": probability,
        "ier": ier,
        "risk_level": level
    }

    await prediction_collection.insert_one(prediction)

    await recommendation_collection.insert_one({
        "user_id": symptome.user_id,
        "message": message
    })

    return {
        "prediction": prediction,
        "recommendation": message
    }
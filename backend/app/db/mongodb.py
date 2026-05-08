from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = AsyncIOMotorClient(settings.MONGO_URI)
db = client["airsafe_db"]

# collections
sensor_collection = db["sensors"]
user_collection = db["users"]
prediction_collection = db["predictions"]
symptome_collection = db["symptomes"]
recommendation_collection = db["recommendations"]



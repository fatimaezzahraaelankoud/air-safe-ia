# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import sensor_routes, auth_routes, health_routes
from app.routes import prediction_routes, dashboard_routes

app = FastAPI(title="AirSafe AI API", version="1.0.0")

# ── CORS ────────────────────────────────────────────────────────────────
# Permet au frontend (localhost:5173 en dev, Vercel en prod) d'appeler l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://airsafe-ai.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ───────────────────────────────────────────────────────────────
app.include_router(auth_routes.router)
app.include_router(sensor_routes.router)
app.include_router(health_routes.router)
app.include_router(prediction_routes.router)
app.include_router(dashboard_routes.router)


@app.get("/")
async def root():
    return {"message": "AirSafe AI API is running 🌬️"}
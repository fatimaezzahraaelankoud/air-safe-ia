# backend/app/services/ai_bridge.py
import sys
import os

# Ajouter le dossier ai/ au Python path
AI_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'ai'))
if AI_DIR not in sys.path:
    sys.path.insert(0, AI_DIR)

from ier.calculator import compute_ier_single
from clustering.predict_zone import predict_zone
from prediction.predict import predict_crisis


def run_full_pipeline(
    pm25: float,
    co: float,
    humidity: float,
    temperature: float,
    user_id: str = "anonymous",
    pathologie: str = "general",
    age: int = 35,
    is_smoker: bool = False,
    symptom_yesterday: bool = False,
    history: list = None,
) -> dict:
    """
    Pipeline complet : Capteurs IoT → IER → Zone → Prédiction de crise
    Retourne un dict standardisé pour le frontend.
    """
    import datetime

    hour = datetime.datetime.now().hour
    month = datetime.datetime.now().month

    # 1. Calcul IER
    ier_result = compute_ier_single(
        pm25=pm25,
        co=co,
        humidity=humidity,
        temperature=temperature,
        pathologie=pathologie,
    )

    # 2. Zone K-Means
    try:
        zone_result = predict_zone(
            pm25=pm25,
            co=co,
            humidity=humidity,
            temperature=temperature,
            ier_score=ier_result["score"],
        )
    except FileNotFoundError:
        # Fallback si le modèle K-Means n'est pas encore entraîné
        score = ier_result["score"]
        if score < 35:
            zone = "A"
        elif score < 60:
            zone = "B"
        elif score < 80:
            zone = "C"
        else:
            zone = "D"
        zone_result = {"zone": zone, "label": zone, "recommendation": "", "color": "#9CA3AF", "risk_score": 1}

    # 3. Prédiction de crise
    try:
        crisis_result = predict_crisis(
            user_id=user_id,
            pm25=pm25,
            co=co,
            humidity=humidity,
            temperature=temperature,
            ier_score=ier_result["score"],
            zone=zone_result["zone"],
            hour=hour,
            month=month,
            history=history or [],
            age=age,
            pathologie=pathologie,
            is_smoker=is_smoker,
            symptom_yesterday=symptom_yesterday,
        )
        prediction = {
            "probability": round(crisis_result.proba_crisis * 100, 1),
            "alert_level": crisis_result.alert_level,
            "alert_color": crisis_result.alert_color,
            "should_notify": crisis_result.should_notify,
            "message": crisis_result.message,
            "model_used": crisis_result.model_used,
        }
    except Exception as e:
        # Fallback heuristique si le modèle RF n'existe pas
        ier_score = ier_result["score"]
        if ier_score >= 76:
            prob = 88.0
            level = "CRITIQUE"
        elif ier_score >= 51:
            prob = 55.0
            level = "ELEVE"
        elif ier_score >= 26:
            prob = 22.0
            level = "MODERE"
        else:
            prob = 6.0
            level = "FAIBLE"
        prediction = {
            "probability": prob,
            "alert_level": level,
            "alert_color": "#f39c12",
            "should_notify": prob >= 40,
            "message": f"Risque {level.lower()} ({prob}%) — données capteurs en cours d'analyse.",
            "model_used": "heuristic_fallback",
        }

    return {
        "ier": {
            "score": ier_result["score"],
            "level": ier_result["level"],
            "color": ier_result["color"],
            "action": ier_result["action"],
        },
        "zone": {
            "zone": zone_result["zone"],
            "label": zone_result.get("label", zone_result["zone"]),
            "recommendation": zone_result.get("recommendation", ""),
            "color": zone_result.get("color", "#9CA3AF"),
        },
        "prediction": prediction,
        "sensors": {
            "pm25": pm25,
            "co": co,
            "humidity": humidity,
            "temperature": temperature,
        },
    }
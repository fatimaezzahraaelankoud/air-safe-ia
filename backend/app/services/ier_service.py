# backend/app/services/ier_service.py
import sys
import os

AI_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'ai'))
if AI_DIR not in sys.path:
    sys.path.insert(0, AI_DIR)

try:
    from ier.calculator import compute_ier_single as _compute_ier_ai
    _USE_AI = True
except ImportError:
    _USE_AI = False


def calculate_ier(data) -> float:
    """
    Calcule le score IER.
    Utilise le module AI si disponible, sinon fallback basique.
    """
    if _USE_AI:
        result = _compute_ier_ai(
            pm25=data.pm25,
            co=data.co,
            humidity=data.humidity,
            temperature=data.temperature,
            pathologie="general",
        )
        return result["score"]
    else:
        # Fallback basique (ancienne formule)
        def normalize(value, min_val, max_val):
            return ((value - min_val) / (max_val - min_val)) * 100

        weights = {"pm25": 0.30, "co": 0.25, "humidity": 0.25, "temperature": 0.20}
        normalized = {
            "pm25": normalize(data.pm25, 0, 100),
            "co": normalize(data.co, 0, 50),
            "humidity": normalize(data.humidity, 0, 100),
            "temperature": normalize(data.temperature, -10, 50),
        }
        return round(sum(weights[k] * normalized[k] for k in weights), 2)
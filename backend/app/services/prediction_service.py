# backend/app/services/prediction_service.py
# Ce service délègue maintenant à ai_bridge.py
# Gardé pour compatibilité avec health_service.py

def predict_risk(symptomes, ier: float):
    """
    Calcul de risque basé sur les symptômes + IER.
    Utilisé par le health_service quand l'utilisateur soumet son survey.
    """
    score = 0.0

    if getattr(symptomes, 'toux', False):
        score += 20
    if getattr(symptomes, 'respiration_difficile', False):
        score += 40
    if getattr(symptomes, 'fatigue', False):
        score += 10
    if getattr(symptomes, 'headache', False):  # ← corrigé (était headacke)
        score += 15
    if getattr(symptomes, 'cough', False):     # ← ajouté (frontend envoie 'cough')
        score += 20

    score += ier * 0.5
    probability = min(score, 100)

    if probability < 30:
        level = "LOW"
    elif probability < 60:
        level = "MEDIUM"
    elif probability < 80:
        level = "HIGH"
    else:
        level = "CRITICAL"

    return probability, level
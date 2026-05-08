
def generate_recommendation(level):
    if level == "LOW":
        return "Air sain, aucune précaution nécessaire"
    elif level == "MEDIUM":
        return "Aérer la pièce et surveiller les symptômes"
    elif level == "HIGH":
        return "Limiter les sorties et porter un masque"
    else:
        return " Risque élevé ! Consulter un médecin et éviter toute exposition"
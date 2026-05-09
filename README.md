#  AirSafe AI — Surveillance Qualité de l'Air & Santé Respiratoire

> Projet IoT — Surveillance en temps réel de la qualité de l'air avec prédiction de crise respiratoire par intelligence artificielle.

---


---

## Présentation

**AirSafe AI** est une application IoT qui surveille la qualité de l'air en temps réel et prédit les risques de crises respiratoires pour les personnes souffrant de pathologies comme la bronchite chronique ou l'asthme.

### Fonctionnalités principales

-  **Dashboard temps réel** — IER, PM2.5, CO, température, humidité mis à jour toutes les 10 secondes
-  **Prédiction IA** — Random Forest + K-Means pour prédire le risque de crise sur les 6 prochaines heures
-  **Localisation GPS** — Affichage de la ville réelle de l'utilisateur
-  **Carte interactive** — Zones de qualité de l'air avec position GPS en temps réel
-  **Bilan quotidien** — Saisie des symptômes + analyse combinée IA
- **Profil utilisateur** — Historique IER des 7 derniers jours
-  **Authentification** — Inscription / connexion sécurisée JWT

---

##  Architecture

```
┌─────────────────┐     HTTP/10s      ┌─────────────────┐
│  Circuit Wokwi  │ ────────────────► │                 │
│  (ESP32 simulé) │                   │  Backend FastAPI │
└─────────────────┘                   │  Python 3.11    │
                                      │                 │
┌─────────────────┐     REST API      │  ┌───────────┐  │
│  Frontend React │ ◄───────────────► │  │  Modules  │  │
│  TypeScript     │                   │  │    AI     │  │
│  Vite           │                   │  │  IER      │  │
└─────────────────┘                   │  │  K-Means  │  │
                                      │  │  RF Model │  │
                                      │  └───────────┘  │
                                      │                 │
                                      │  ┌───────────┐  │
                                      │  │  MongoDB  │  │
                                      │  └───────────┘  │
                                      └─────────────────┘
```

---

##  Stack technique

| Couche | Technologie |
|--------|-------------|
| **Frontend** | React 19 + TypeScript + Vite |
| **Backend** | FastAPI + Python 3.11 + Motor (async MongoDB) |
| **Base de données** | MongoDB (Atlas cloud ou local) |
| **IA / ML** | Scikit-learn (Random Forest, K-Means) + NumPy + Pandas |
| **Authentification** | JWT (python-jose + bcrypt) |
| **Simulation IoT** | Wokwi ESP32 (circuit virtuel) |
| **Géolocalisation** | Navigator.geolocation + Nominatim (OpenStreetMap) |

---

##  Simulation Wokwi

Le circuit IoT est simulé avec **Wokwi** — un simulateur Arduino/ESP32 en ligne. Il simule les capteurs suivants :

| Capteur | Mesure | Pin |
|---------|--------|-----|
| **DHT22** | Température + Humidité | D4 |
| **MQ-7** | CO (0–1000 ppm) | A34 |
| **MQ-135** | CO₂ (400–5000 ppm) | A35 |
| **PMS5003** | PM2.5 (0–300 µg/m³) | A32 |
| **LCD I2C** | Affichage IER + Zone | SDA=21, SCL=22 |
| **LEDs** | Zone A/B/C/D | D26/27/14/12 |
| **Buzzer** | Alerte Zone D | D13 |

### 🔗 Lien Wokwi

**👉 [Ouvrir la simulation AirSafe](https://wokwi.com/projects/461409250104123393)**


```

---

## 🚀 Installation

### Prérequis

- Python 3.11+
- Node.js 20+
- MongoDB (local ou [Atlas gratuit](https://www.mongodb.com/atlas))


### 1. Cloner le projet

```bash
git clone https://github.com/fatimaezzahraaelankoud/air-safe-ia.git
cd airsafe-fullstack
```

### 2. Backend

```bash
cd backend

# Créer l'environnement virtuel
python -m venv venv
source venv/bin/activate        # Linux/Mac
# OU : venv\Scripts\activate    # Windows

# Installer les dépendances
pip install -r requirements.txt

# Installer les dépendances IA
pip install numpy pandas scikit-learn joblib

# Créer le fichier .env
cp .env.example .env
# Éditer .env avec votre MONGO_URI
```


### 3. Frontend

```bash
cd frontend
npm install

# Créer le fichier .env
echo "VITE_API_URL=http://localhost:8000" > .env
```

---

##  Démarrage

### Mode développement local

**Terminal 1 — Backend :**
```bash
cd backend
source venv/bin/activate
# Windows : venv\Scripts\activate

set PYTHONPATH=..    # Windows
# OU : export PYTHONPATH=..   # Linux/Mac

uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Frontend :**
```bash
cd frontend
npm run dev
```

**Accès :**
-  Frontend : http://localhost:5173
-  API docs (Swagger) : http://localhost:8000/docs
-  Health check : http://localhost:8000

### Avec Docker Compose

```bash
# À la racine du projet
docker-compose up --build
```

---

## 📁 Structure du projet

```
airsafe-fullstack/
│
├── ai/                              # Modules Python IA
│   ├── ier/
│   │   └── calculator.py            # Calcul IER (Index Exposition Respiratoire)
│   ├── clustering/
│   │   └── predict_zone.py          # K-Means → Zone A/B/C/D
│   └── prediction/
│       ├── predict.py               # Random Forest → probabilité de crise
│       ├── train.py                 # Entraînement du modèle
│       └── retrain.py               # Ré-entraînement avec nouvelles données
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py            # Variables d'environnement
│   │   │   └── security.py          # JWT + bcrypt
│   │   ├── db/
│   │   │   └── mongodb.py           # Connexion MongoDB
│   │   ├── routes/
│   │   │   ├── auth_routes.py       # POST /auth/login, /auth/register
│   │   │   ├── sensor_routes.py     # GET /sensor/live, POST /sensor/iot
│   │   │   ├── health_routes.py     # POST /health/submit
│   │   │   ├── prediction_routes.py # POST /predict/
│   │   │   ├── dashboard_routes.py  # GET /dashboard/{user_id}
│   │   │   └── user_routes.py       # GET /user/me
│   │   ├── schemas/                 # Modèles Pydantic
│   │   ├── services/
│   │   │   ├── ai_bridge.py         # Pont Backend ↔ Modules IA
│   │   │   ├── simulation_service.py# Simulation capteurs réaliste
│   │   │   ├── auth_service.py      # Logique inscription/connexion
│   │   │   ├── health_service.py    # Traitement symptômes
│   │   │   └── recommendation_service.py
│   │   └── main.py                  # Point d'entrée FastAPI
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── airsafe.ts           # Client API TypeScript
│   │   ├── components/
│   │   │   ├── IERGauge.tsx         # Jauge circulaire IER
│   │   │   ├── BottomNav.tsx        # Navigation bas de page
│   │   │   ├── Shared.tsx           # Composants réutilisables
│   │   │   └── Icons.tsx            # Icônes SVG
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx      # Connexion + Inscription
│   │   │   ├── Dashboard.tsx        # Tableau de bord temps réel
│   │   │   ├── MapScreen.tsx        # Carte GPS + zones
│   │   │   ├── Survey.tsx           # Bilan quotidien + IA
│   │   │   └── Profile.tsx          # Profil + historique
│   │   ├── styles/
│   │   │   └── tokens.ts            # Couleurs + thème
│   │   ├── types.ts                 # Types TypeScript
│   │   └── App.tsx                  # Routage principal
│   ├── .env
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 📡 API Backend

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/register` | Créer un compte `{ name, email, password }` |
| POST | `/auth/login` | Connexion `{ email, password }` → JWT |

### Capteurs & IA

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/sensor/live` | Données simulées + pipeline IA complet |
| POST | `/sensor/iot` | Recevoir données du vrai capteur ESP32 |
| GET | `/sensor/simulate` | Générer une mesure simulée |
| POST | `/predict/` | Lancer le pipeline IA manuellement |

### Dashboard & Profil

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/dashboard/{user_id}` | Données complètes dashboard |
| GET | `/dashboard/{user_id}/history` | Historique 7 jours |
| GET | `/user/me` | Profil utilisateur connecté |
| POST | `/health/submit` | Soumettre les symptômes |

>  Tous les endpoints sauf `/auth/*` nécessitent le header `Authorization: Bearer <token>`

---

##  Modèles IA

### 1. IER (Index d'Exposition Respiratoire)

Formule basée sur les poids des capteurs :

```
IER = 0.30 × PM2.5_normalisé
    + 0.25 × CO_normalisé
    + 0.25 × Humidité_normalisée
    + 0.20 × Température_normalisée
```

| Score IER | Zone | Niveau |
|-----------|------|--------|
| 0 – 34    | A    | Saine |
| 35 – 59   | B    | Modérée |
| 60 – 79   | C    | Risquée |
| ≥ 80      | D    | Critique |

### 2. K-Means Clustering

Classifie chaque mesure en 4 zones géographiques de qualité d'air en utilisant les 5 features : PM2.5, CO, humidité, température, score IER.

### 3. Random Forest (Prédiction de crise)

Prédit la **probabilité de crise respiratoire** dans les 6 prochaines heures à partir de :
- Données capteurs actuelles
- Score IER
- Zone K-Means
- Heure + mois
- Historique de symptômes

---

##  Équipe

| Membre | Rôle | GitHub |
|--------|------|--------|
| **Imane El Arrach** | IA & Modèles ML | [@imane-el-arrach](https://github.com/imane-el-arrach) |
| **zineb El arbaoui** |IA & Modèles ML |  [@zineb-elarbaoui](https://github.com/zineb-elarbaoui) |
| **Zineb El Amrani** | Frontend React | [@elamrani-zineb](https://github.com/elamrani-zineb) |
| **Fatimaezzahra El Ankoud** | Backend FastAPI | [@fatimaezzahraaelankoud](https://github.com/fatimaezzahraaelankoud) |
---


Projet académique — Tous droits réservés © 2026

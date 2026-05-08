import random

# backend/app/services/simulation_service.py
# Simulation réaliste basée sur la logique du code Arduino Wokwi
# (DHT22 + MQ-7 CO + MQ-135 CO2 + PMS5003 PM2.5)

import math
import random
import time

_start_time = time.time()


def simulate_sensor() -> dict:
    """
    Génère des valeurs capteurs progressives et réalistes,
    identiques à ce que produirait le vrai circuit Arduino Wokwi.

    Formules basées sur le code sketch.ino :
      co   = (analogRead(MQ7_PIN)   / 1023.0) * 1000.0   → 0–1000 ppm
      pm25 = (analogRead(PM25_PIN)  / 1023.0) * 300.0    → 0–300 µg/m³
      temp = DHT22 readTemperature()                      → 15–35 °C
      hum  = DHT22 readHumidity()                         → 30–80 %
    """
    # Temps écoulé depuis le démarrage (en secondes)
    t = time.time() - _start_time

    # ── PM2.5 (µg/m³) — varie entre 5 et 120 ────────────────────
    pm25 = 45 + 35 * math.sin(t / 60) + 15 * math.sin(t / 23) + random.uniform(-3, 3)
    pm25 = round(max(5.0, min(300.0, pm25)), 1)

    # ── CO (ppm) — varie entre 0.3 et 8 ─────────────────────────
    # Le Arduino produit 0–1000 ppm, mais les valeurs réelles indoor
    # sont généralement 0.1–10 ppm
    co_raw = 300 + 200 * math.sin(t / 90) + random.uniform(-20, 20)
    co = round((co_raw / 1023.0) * 10.0, 2)   # normalisé 0–10 ppm
    co = max(0.1, min(10.0, co))

    # ── Température (°C) — varie entre 18 et 32 ──────────────────
    temp = 25 + 6 * math.sin(t / 120) + random.uniform(-0.5, 0.5)
    temp = round(max(15.0, min(40.0, temp)), 1)

    # ── Humidité (%) — varie entre 35 et 75 ─────────────────────
    hum = 55 + 18 * math.sin(t / 80) + random.uniform(-2, 2)
    hum = round(max(10.0, min(100.0, hum)), 1)

    return {
        "pm25":        pm25,
        "co":          co,
        "temperature": temp,
        "humidity":    hum,
    }


def compute_ier_arduino(pm25: float, co: float, humidity: float, temperature: float) -> float:
    """
    Calcul IER selon la formule exacte du code Arduino :
      pm_n = (pm25 / 300.0) * 100
      co_n = (co   / 10.0)  * 100   ← adapté (Arduino utilise /1000 pour ppm brut)
      hu_n = (hum  / 100.0) * 100
      te_n = (temp / 50.0)  * 100
      IER  = 0.30*pm_n + 0.25*co_n + 0.25*hu_n + 0.20*te_n
    """
    pm_n = (pm25 / 300.0) * 100
    co_n = (co   / 10.0)  * 100
    hu_n = (humidity / 100.0) * 100
    te_n = (temperature / 50.0) * 100
    ier = 0.30 * pm_n + 0.25 * co_n + 0.25 * hu_n + 0.20 * te_n
    return round(min(max(ier, 0.0), 100.0), 2)
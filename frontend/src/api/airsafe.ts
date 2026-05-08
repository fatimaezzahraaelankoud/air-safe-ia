// frontend/src/api/airsafe.ts

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

// ── Token & user storage ──────────────────────────────────────
let _token: string | null = null;

export function setToken(token: string) {
  _token = token;
  localStorage.setItem('airsafe_token', token);
}

export function getToken(): string | null {
  return _token ?? localStorage.getItem('airsafe_token');
}

export function clearToken() {
  _token = null;
  localStorage.removeItem('airsafe_token');
  localStorage.removeItem('airsafe_user_id');
  localStorage.removeItem('airsafe_user_name');
}

export function getUserName(): string {
  return localStorage.getItem('airsafe_user_name') ?? '';
}

export function getUserId(): string {
  return localStorage.getItem('airsafe_user_id') ?? 'default';
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ── Auth ──────────────────────────────────────────────────────
export async function apiLogin(
  email: string,
  password: string
): Promise<{ token: string; name: string; user_id: string }> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? err.error ?? 'Identifiants incorrects');
  }
  const data = await res.json();

  if (data.user_id) localStorage.setItem('airsafe_user_id', data.user_id);
  if (data.name)    localStorage.setItem('airsafe_user_name', data.name);

  return {
    token:   data.access_token,
    name:    data.name    ?? '',
    user_id: data.user_id ?? '',
  };
}

export async function apiRegister(name: string, email: string, password: string) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Erreur lors de l'inscription");
  return res.json();
}

// ── Données temps réel — polling toutes les 10s ───────────────
export async function getLiveData() {
  const res = await fetch(`${BASE}/sensor/live`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Erreur données live');
  return res.json();
}

// ── Dashboard historique ──────────────────────────────────────
export async function getDashboard(userId: string) {
  const res = await fetch(`${BASE}/dashboard/${userId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Erreur dashboard');
  return res.json();
}

export async function getHistory(userId: string, limit = 7) {
  const res = await fetch(`${BASE}/dashboard/${userId}/history?limit=${limit}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Erreur historique');
  return res.json();
}

// ── Survey / Symptômes ────────────────────────────────────────
export async function submitSurvey(payload: {
  cough:     boolean;
  breathing: boolean;
  headache:  boolean;
  fatigue:   boolean;
}) {
  const res = await fetch(`${BASE}/health/submit`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      toux:                  payload.cough,
      cough:                 payload.cough,
      respiration_difficile: payload.breathing,
      breathing:             payload.breathing,
      headache:              payload.headache,
      fatigue:               payload.fatigue,
    }),
  });
  if (!res.ok) throw new Error('Erreur soumission survey');
  return res.json();
}

// ── Prédiction IA ─────────────────────────────────────────────
export async function getPrediction(sensorData?: {
  pm25: number; co: number; humidity: number; temperature: number;
}) {
  const data = sensorData ?? { pm25: 45.0, co: 2.5, humidity: 65.0, temperature: 25.0 };
  const res = await fetch(`${BASE}/predict/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erreur prédiction');
  return res.json();
}

// ── Simulation IoT ────────────────────────────────────────────
export async function simulateSensor() {
  const res = await fetch(`${BASE}/sensor/simulate`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Erreur simulation');
  return res.json();
}
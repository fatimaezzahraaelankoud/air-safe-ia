// ─────────────────────────────────────────────
//  AirSafe AI — Tableau de bord
// ─────────────────────────────────────────────
import React, { useEffect, useRef, useState } from 'react';
import { getLiveData, getUserName } from '../api/airsafe';
import { COLORS } from '../styles/tokens';
import { IERGauge } from '../components/IERGauge';
import { Badge, Card, CardTitle, MiniBar, RiskBar, PageHeader } from '../components/Shared';
import {
  IconBell, IconLocation,
  IconPM25, IconCO, IconTemp, IconHumidity,
} from '../components/Icons';
import type { SensorReading, ForecastDay } from '../types';

// Ajouter après les imports
async function getCity(lat: number, lng: number): Promise<string> {
  try {
    const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=fr`);
    const data = await res.json();
    const a    = data.address;
    return a.city || a.town || a.village || a.suburb || 'Votre position';
  } catch { return 'Votre position'; }
}

// ── Prévisions statiques (données historiques pas encore dispo) ─
const FORECAST: ForecastDay[] = [
  { day: 'Lun', score: 61, color: 'amber' },
  { day: 'Mar', score: 34, color: 'green' },
  { day: 'Mer', score: 29, color: 'green' },
  { day: 'Jeu', score: 48, color: 'blue'  },
  { day: 'Ven', score: 81, color: 'red'   },
];

// ── Helpers ──────────────────────────────────
function sensorPercent(id: SensorReading['id'], value: number): number {
  const maxes: Record<SensorReading['id'], number> = {
    pm25: 150, co: 10, temp: 50, humidity: 100,
  };
  return Math.min(Math.round((value / maxes[id]) * 100), 100);
}

function sensorColor(id: SensorReading['id'], value: number): SensorReading['color'] {
  if (id === 'pm25')     return value < 35 ? 'green' : value < 75 ? 'amber' : 'red';
  if (id === 'co')       return value < 1  ? 'green' : value < 4  ? 'amber' : 'red';
  if (id === 'humidity') return (value < 40 || value > 80) ? 'amber' : 'green';
  if (id === 'temp')     return (value < 10 || value > 35) ? 'red' : (value < 18 || value > 28) ? 'amber' : 'blue';
  return 'blue';
}

// ── Icônes capteurs ───────────────────────────
const SensorIconMap: Record<SensorReading['id'], {
  icon: React.FC<{ size?: number; stroke?: string }>;
  bg: string; iconColor: string;
}> = {
  pm25:     { icon: IconPM25,     bg: '#FEF3C7', iconColor: COLORS.amber },
  co:       { icon: IconCO,       bg: '#FEE2E2', iconColor: COLORS.red   },
  temp:     { icon: IconTemp,     bg: '#DBEAFE', iconColor: COLORS.blue  },
  humidity: { icon: IconHumidity, bg: '#DCFCE7', iconColor: COLORS.green },
};

const SensorCard: React.FC<{ sensor: SensorReading }> = ({ sensor }) => {
  const meta = SensorIconMap[sensor.id];
  const IconComp = meta.icon;
  const color = COLORS[sensor.color];
  return (
    <div style={{
      background: COLORS.card, border: `0.5px solid ${COLORS.border}`,
      borderRadius: 12, padding: '9px 10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7, background: meta.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconComp size={14} stroke={meta.iconColor} />
        </div>
        <span style={{ fontSize: 9, color: COLORS.muted, fontWeight: 500 }}>
          {sensor.name}
        </span>
      </div>
      <div style={{ fontSize: 17, fontWeight: 600, color, lineHeight: 1 }}>
        {sensor.value}{sensor.id === 'temp' ? '°' : ''}
      </div>
      <div style={{ fontSize: 8, color: COLORS.muted, marginTop: 1 }}>{sensor.unit}</div>
      <MiniBar percent={sensor.percent} color={color} />
    </div>
  );
};

const ForecastDot: React.FC<{ day: ForecastDay }> = ({ day }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
    <span style={{ fontSize: 8, color: COLORS.muted, fontWeight: 500 }}>{day.day}</span>
    <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[day.color] }} />
    <span style={{ fontSize: 10, fontWeight: 600, color: COLORS.text }}>{day.score}</span>
  </div>
);

// ── Composant principal ───────────────────────
export const Dashboard: React.FC = () => {
  const [ierScore,    setIerScore]    = useState<number | null>(null);
  const [riskPct,     setRiskPct]     = useState<number | null>(null);
  const [riskMsg,     setRiskMsg]     = useState<string>('');
  const [sensors,     setSensors]     = useState<SensorReading[]>([]);
  const [loading,     setLoading]     = useState<boolean>(true);
  const [lastUpdate,  setLastUpdate]  = useState<string>('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const userName = getUserName();

  const fetchLive = () => {
    getLiveData()
      .then((data) => {
        if (data?.ier?.score !== undefined)             setIerScore(Math.round(data.ier.score));
        if (data?.prediction?.probability !== undefined) setRiskPct(Math.round(data.prediction.probability));
        if (data?.prediction?.message)                  setRiskMsg(data.prediction.message);

        if (data?.sensors) {
          const s = data.sensors;
          setSensors([
            { id: 'pm25',     name: 'PM2.5',      value: Math.round(s.pm25 * 10) / 10,        unit: 'µg/m³',    color: sensorColor('pm25',     s.pm25),        percent: sensorPercent('pm25',     s.pm25)        },
            { id: 'co',       name: 'CO',          value: Math.round(s.co * 100) / 100,        unit: 'ppm',      color: sensorColor('co',       s.co),          percent: sensorPercent('co',       s.co)          },
            { id: 'temp',     name: 'Température', value: Math.round(s.temperature * 10) / 10, unit: '°Celsius', color: sensorColor('temp',     s.temperature), percent: sensorPercent('temp',     s.temperature) },
            { id: 'humidity', name: 'Humidité',    value: Math.round(s.humidity),              unit: 'Relative', color: sensorColor('humidity', s.humidity),    percent: sensorPercent('humidity', s.humidity)    },
          ]);
        }

        setLastUpdate(new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit', minute: '2-digit', second: '2-digit',
        }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  // Après const userName = getUserName();
const [city, setCity] = useState('Localisation...');

useEffect(() => {
  if (!navigator.geolocation) { setCity('Lyon, France'); return; }
  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      const c = await getCity(coords.latitude, coords.longitude);
      setCity(c);
    },
    () => setCity('Lyon, France'),
    { enableHighAccuracy: true, timeout: 10000 }
  );
}, []);

  useEffect(() => {
    fetchLive();
    intervalRef.current = setInterval(fetchLive, 10000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Couleurs dynamiques
  const riskColor = (riskPct ?? 0) >= 70 ? COLORS.red : (riskPct ?? 0) >= 45 ? COLORS.amber : COLORS.green;
  const riskLabel = (riskPct ?? 0) >= 70 ? 'Élevé'    : (riskPct ?? 0) >= 45 ? 'Modéré'    : 'Faible';
  const riskBadge: 'red' | 'amber' | 'green' = (riskPct ?? 0) >= 70 ? 'red' : (riskPct ?? 0) >= 45 ? 'amber' : 'green';

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <>
      {/* En-tête */}
      <PageHeader
        greeting={`Bonjour, ${userName || 'Utilisateur'}`}
        title={<><IconLocation size={9} /> {city}</>}
        date={`${today} · Rapport qualité air`}
        action={<IconBell size={18} stroke={COLORS.muted} />}
      />

      {/* Indicateur temps réel */}
      {lastUpdate && (
        <div style={{ textAlign: 'center', fontSize: 8, color: COLORS.muted, marginBottom: 4 }}>
          Mis à jour à {lastUpdate}
        </div>
      )}

      {/* Jauge IER */}
      {loading || ierScore === null ? (
        <div style={{
          margin: '0 12px 8px', padding: '20px', textAlign: 'center',
          fontSize: 10, color: COLORS.muted,
          background: COLORS.card, border: `0.5px solid ${COLORS.border}`, borderRadius: 12,
        }}>
          Chargement des données capteurs…
        </div>
      ) : (
        <IERGauge score={ierScore} />
      )}

      {/* Grille capteurs */}
      {sensors.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, margin: '0 12px 8px' }}>
          {sensors.map(s => <SensorCard key={s.id} sensor={s} />)}
        </div>
      )}

      {/* Prédiction IA */}
      <Card>
        <CardTitle>Prédiction IA · Prochaines 6h</CardTitle>
        {riskPct === null ? (
          <div style={{ fontSize: 9, color: COLORS.muted }}>Chargement…</div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 600, color: riskColor }}>{riskPct}%</div>
                <div style={{ fontSize: 9, color: COLORS.muted, marginTop: 1 }}>
                  Risque d'apparition de symptômes
                </div>
              </div>
              <Badge color={riskBadge}>{riskLabel}</Badge>
            </div>
            <RiskBar percent={riskPct} color={riskColor} />
            <div style={{ fontSize: 9, color: COLORS.muted, lineHeight: 1.5 }}>
              {riskMsg || "Analyse en cours basée sur vos données capteurs en temps réel."}
            </div>
          </>
        )}
      </Card>

      {/* Prévisions 5 jours */}
      <Card>
        <CardTitle>Prévisions IER — 5 jours</CardTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0 4px' }}>
          {FORECAST.map(f => <ForecastDot key={f.day} day={f} />)}
        </div>
      </Card>
    </>
  );
};
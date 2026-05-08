// ─────────────────────────────────────────────
//  AirSafe AI — Carte en temps réel avec GPS
// ─────────────────────────────────────────────
import React, { useEffect, useRef, useState } from 'react';
import { COLORS } from '../styles/tokens';
import { Card, CardTitle, PageHeader } from '../components/Shared';
import { IconAlert } from '../components/Icons';


interface UserPos { lat: number; lng: number; city: string; }
interface LiveSensors { pm25: number; co: number; temperature: number; humidity: number; }

// Bounding box Lyon
const LAT_MIN = 45.70, LAT_MAX = 45.81;
const LNG_MIN = 4.78,  LNG_MAX = 4.91;
const SVG_W = 276, SVG_H = 200;

function gpsToSvg(lat: number, lng: number) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * SVG_W;
  const y = SVG_H - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * SVG_H;
  return { x: Math.max(5, Math.min(SVG_W - 5, x)), y: Math.max(5, Math.min(SVG_H - 5, y)) };
}

const AIR_ZONES = [
  { id: 'A', color: COLORS.green, label: 'Saine',   lat: 45.77, lng: 4.82, r: 28 },
  { id: 'B', color: COLORS.blue,  label: 'Modérée', lat: 45.76, lng: 4.88, r: 25 },
  { id: 'C', color: COLORS.amber, label: 'Risquée', lat: 45.72, lng: 4.82, r: 22 },
  { id: 'D', color: COLORS.red,   label: 'Critique',lat: 45.73, lng: 4.87, r: 26 },
];

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=fr`);
    const data = await res.json();
    const a = data.address;
    return a.city || a.town || a.village || a.suburb || 'Votre position';
  } catch { return 'Votre position'; }
}

function ierToColor(s: number) { return s < 35 ? COLORS.green : s < 60 ? COLORS.blue : s < 80 ? COLORS.amber : COLORS.red; }
function ierToLabel(s: number) { return s < 35 ? 'Saine' : s < 60 ? 'Modérée' : s < 80 ? 'Risquée' : 'Critique'; }

const LiveMap: React.FC<{ userPos: UserPos | null; ierScore: number }> = ({ userPos, ierScore }) => {
  const userSvg = userPos ? gpsToSvg(userPos.lat, userPos.lng) : null;
  const zoneColor = ierToColor(ierScore);
  return (
    <div style={{ margin: '0 12px 8px', borderRadius: 12, overflow: 'hidden', border: `0.5px solid ${COLORS.border}` }}>
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
        <rect width={SVG_W} height={SVG_H} fill="#E8EDF2"/>
        <path d="M90 0 Q95 50 88 100 Q82 150 90 200" stroke="#B8D4EA" strokeWidth="14" fill="none"/>
        <path d="M60 0 Q65 40 62 80 Q60 120 58 200" stroke="#C2DAF0" strokeWidth="8" fill="none"/>
        <ellipse cx="200" cy="140" rx="30" ry="18" fill="#D4E8C2" opacity=".7"/>
        <rect x="30" y="120" width="20" height="14" rx="4" fill="#D4E8C2" opacity=".6"/>
        <g fill="#C8D0DA" opacity=".9">
          {[[110,10,22,14],[136,10,14,14],[176,10,14,18],[216,10,12,16],[110,32,14,18],[176,32,22,14],[110,60,16,14],[176,58,18,16],[198,60,22,14],[14,30,20,14],[38,30,16,18],[100,88,16,14],[176,88,16,12],[196,88,20,16],[14,92,20,14],[100,116,18,14],[176,116,22,14],[14,140,18,16],[100,146,16,14],[176,148,18,14],[14,180,20,16],[100,176,22,18],[176,176,20,18]].map(([x,y,w,h],i)=>(
            <rect key={i} x={x} y={y} width={w} height={h} rx="2"/>
          ))}
        </g>
        <g stroke="#fff" strokeWidth="1.5" opacity=".85">
          {[26,54,82,110,138,166].map(y=><line key={`h${y}`} x1="0" y1={y} x2={SVG_W} y2={y}/>)}
          {[58,100,144,176,218].map(x=><line key={`v${x}`} x1={x} y1="0" x2={x} y2={SVG_H}/>)}
        </g>
        <g stroke="#fff" strokeWidth="2.5" opacity=".7">
          <line x1="0" y1="82" x2={SVG_W} y2="82"/>
          <line x1="144" y1="0" x2="144" y2={SVG_H}/>
        </g>
        {AIR_ZONES.map(z => {
          const p = gpsToSvg(z.lat, z.lng);
          return (
            <g key={z.id}>
              <circle cx={p.x} cy={p.y} r={z.r} fill={z.color} opacity=".15"/>
              <circle cx={p.x} cy={p.y} r={z.r} stroke={z.color} strokeWidth="1" opacity=".45" fill="none"/>
              <text x={p.x} y={p.y-2} textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="9" fontWeight="600" fill={z.color} opacity=".9">{z.id}</text>
              <text x={p.x} y={p.y+9} textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="6.5" fill={z.color} opacity=".7">{z.label}</text>
            </g>
          );
        })}
        {userSvg ? (
          <g>
            <circle cx={userSvg.x} cy={userSvg.y} r="12" fill={zoneColor} opacity=".15">
              <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values=".2;.05;.2" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx={userSvg.x} cy={userSvg.y} r="5" fill={zoneColor} opacity=".3"/>
            <circle cx={userSvg.x} cy={userSvg.y} r="3.5" fill={zoneColor}/>
            <circle cx={userSvg.x} cy={userSvg.y} r="2" fill="#fff"/>
            <text x={userSvg.x} y={userSvg.y-10} textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="7" fontWeight="600" fill={zoneColor}>Vous</text>
          </g>
        ) : (
          <g>
            <circle cx="138" cy="100" r="6" fill={COLORS.blue} opacity=".2"/>
            <circle cx="138" cy="100" r="3.5" fill={COLORS.blue}/>
            <circle cx="138" cy="100" r="2" fill="#fff"/>
            <text x="138" y="91" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="7" fontWeight="600" fill={COLORS.blue}>Vous</text>
          </g>
        )}
      </svg>
    </div>
  );
};

export const MapScreen: React.FC = () => {
  const [userPos,    setUserPos]    = useState<UserPos | null>(null);
  const [locError,   setLocError]   = useState('');
  const [locLoading, setLocLoading] = useState(true);
  const [ierScore,   setIerScore]   = useState(45);
  const [lastUpdate, setLastUpdate] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) { setLocError('Géolocalisation non supportée'); setLocLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const city = await reverseGeocode(lat, lng);
        setUserPos({ lat, lng, city });
        setLocLoading(false);
      },
      (err) => {
        setLocError(err.code === 1 ? 'Accès refusé' : 'Position indisponible');
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

 

 
  const zoneColor = ierToColor(ierScore);
  const zoneLabel = ierToLabel(ierScore);
  const cityDisplay = locLoading ? 'Localisation…' : locError ? 'Lyon, France' : (userPos?.city ?? 'Lyon, France');

  return (
    <>
      <PageHeader greeting="Carte Qualité de l'Air" title={cityDisplay}
        date={lastUpdate ? `En direct · ${lastUpdate}` : 'En direct'}/>

      <LiveMap userPos={userPos} ierScore={ierScore}/>

      {locLoading ? (
        <div style={{ margin: '0 12px 6px', fontSize: 9, color: COLORS.muted, textAlign: 'center' }}>📍 Obtention de votre position GPS…</div>
      ) : locError ? (
        <div style={{ margin: '0 12px 6px', fontSize: 9, color: COLORS.amber, textAlign: 'center' }}>⚠️ {locError} — Position par défaut</div>
      ) : userPos ? (
        <div style={{ margin: '0 12px 6px', fontSize: 9, color: COLORS.muted, textAlign: 'center' }}>
           {userPos.city} ({userPos.lat.toFixed(4)}, {userPos.lng.toFixed(4)})
        </div>
      ) : null}

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <CardTitle>Qualité de l'air — Votre zone</CardTitle>
            <div style={{ fontSize: 22, fontWeight: 700, color: zoneColor }}>{Math.round(ierScore)}<span style={{ fontSize: 11, color: COLORS.muted }}>/100</span></div>
            <div style={{ fontSize: 11, fontWeight: 600, color: zoneColor, marginTop: 2 }}>{zoneLabel}</div>
          </div>
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" stroke="#E5E7EB" strokeWidth="5" fill="none" strokeDasharray={`${138.2*0.75}`} strokeLinecap="round" transform="rotate(135 28 28)"/>
            <circle cx="28" cy="28" r="22" stroke={zoneColor} strokeWidth="5" fill="none"
              strokeDasharray={`${138.2*0.75*(ierScore/100)} ${138.2}`} strokeLinecap="round"
              transform="rotate(135 28 28)" style={{ transition: 'stroke-dasharray 0.5s ease' }}/>
            <text x="28" y="32" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11" fontWeight="700" fill={zoneColor}>{Math.round(ierScore)}</text>
          </svg>
        </div>
      </Card>

      

      <Card>
        <CardTitle>Légende des zones</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {[{z:'A',color:COLORS.green,label:'Saine',range:'IER < 35'},{z:'B',color:COLORS.blue,label:'Modérée',range:'35–59'},{z:'C',color:COLORS.amber,label:'Risquée',range:'60–79'},{z:'D',color:COLORS.red,label:'Critique',range:'≥ 80'}].map(item => (
            <div key={item.z} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }}/>
              <span style={{ fontSize: 9, color: COLORS.muted }}><strong style={{ color: COLORS.text }}>{item.z}</strong> {item.label} · {item.range}</span>
            </div>
          ))}
        </div>
      </Card>

      {ierScore >= 80 && (
        <div style={{ background: '#FEF2F2', border: '0.5px solid #FCA5A5', borderRadius: 12, margin: '0 12px 8px', padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0, marginTop: 1 }}><IconAlert size={18}/></div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.red, marginBottom: 2 }}>Zone Critique détectée</div>
            <div style={{ fontSize: 9, color: '#B91C1C', lineHeight: 1.5 }}>L'indice IER dépasse 80. Évitez toute activité extérieure et gardez votre inhalateur accessible.</div>
          </div>
        </div>
      )}
    </>
  );
};
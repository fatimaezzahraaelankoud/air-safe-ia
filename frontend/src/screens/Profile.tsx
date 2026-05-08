/// ─────────────────────────────────────────────
//  AirSafe AI — Profil
// ─────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { COLORS, ZONE_META } from '../styles/tokens';
import { Badge, Card, CardTitle, PageHeader, ProfileRow } from '../components/Shared';
import { getHistory, getUserName, getUserId } from '../api/airsafe';
import type { HistoryEntry } from '../types';

function toZoneLevel(z: string): HistoryEntry['zone'] {
  return (['A','B','C','D'].includes(z) ? z : 'B') as HistoryEntry['zone'];
}

const Avatar: React.FC<{ initials: string }> = ({ initials }) => (
  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #DAE9F8 0%, #C3D9F4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: COLORS.blue, flexShrink: 0, boxShadow: '0 2px 8px rgba(55,138,221,.18)' }}>
    {initials}
  </div>
);

const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="#E24B4A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 7.5H2.5M5.5 5l-3 2.5 3 2.5"/><path d="M7 2.5h4a1 1 0 011 1v8a1 1 0 01-1 1H7"/>
  </svg>
);

const HistoryRow: React.FC<{ entry: HistoryEntry; isLast: boolean }> = ({ entry, isLast }) => {
  const zone  = ZONE_META[entry.zone];
  const color = COLORS[zone.color];
  const cell: React.CSSProperties = { padding: '7px 0', borderBottom: isLast ? 'none' : `0.5px solid ${COLORS.border}` };
  return (
    <tr>
      <td style={{ ...cell, fontSize: 9, color: COLORS.text }}>{entry.date}</td>
      <td style={{ ...cell, fontSize: 11, fontWeight: 700, color }}>{entry.score}</td>
      <td style={{ ...cell, textAlign: 'center' }}><Badge color={zone.color}>{zone.label}</Badge></td>
    </tr>
  );
};

export interface ProfileProps { onLogout?: () => void; }

export const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const [history,        setHistory]        = useState<HistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [hovered,        setHovered]        = useState(false);

  const userName = getUserName();
  const userId   = getUserId();
  const initials = userName ? userName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) : 'U';

  useEffect(() => {
    getHistory(userId, 7)
      .then((data: any[]) => {
        if (!data || data.length === 0) return;
        const mapped: HistoryEntry[] = data.map((p: any, i: number) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
          const score = Math.round(p.ier ?? p.probability ?? 0);
          const zone  = toZoneLevel(p.zone ?? (score < 35 ? 'A' : score < 60 ? 'B' : score < 80 ? 'C' : 'D'));
          return { date: dateStr, score, zone };
        });
        setHistory(mapped);
      })
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, [userId]);

  return (
    <>
      <PageHeader greeting="Mon Profil" title="Tableau de bord personnel" />

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <Avatar initials={initials} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 2 }}>{userName || 'Utilisateur'}</div>
            <div style={{ fontSize: 9, color: COLORS.muted, marginBottom: 5 }}>AirSafe AI · Surveillance respiratoire</div>
            <Badge color="blue">Compte actif</Badge>
          </div>
        </div>
        <CardTitle>Informations du compte</CardTitle>
        <ProfileRow label="Nom" value={userName || '—'} />
        <ProfileRow label="Identifiant" value={<span style={{ fontSize: 8, color: COLORS.muted, fontFamily: 'monospace' }}>{userId.slice(0, 16)}...</span>} />
      </Card>

      <Card>
        <CardTitle>Seuils d'alerte personnalisés</CardTitle>
        <ProfileRow label="Seuil d'alerte IER"  value={<span style={{ color: COLORS.amber, fontWeight: 600 }}>≥ 55</span>} />
        <ProfileRow label="Seuil PM2.5"          value={<span style={{ color: COLORS.amber, fontWeight: 600 }}>25 µg/m³</span>} />
        <ProfileRow label="Seuil CO"             value="1.5 ppm" />
        <div style={{ marginTop: 8, padding: '8px 10px', background: '#EFF6FF', borderRadius: 8, fontSize: 9, color: COLORS.blue, lineHeight: 1.5 }}>
           Ces seuils définissent quand vous recevez une alerte, selon votre profil respiratoire.
        </div>
      </Card>

      <Card>
        <CardTitle>Historique IER — 7 derniers jours</CardTitle>
        {loadingHistory ? (
          <div style={{ fontSize: 9, color: COLORS.muted, textAlign: 'center', padding: '12px 0' }}>Chargement...</div>
        ) : history.length === 0 ? (
          <div style={{ fontSize: 9, color: COLORS.muted, textAlign: 'center', padding: '12px 0' }}>
            Aucun historique disponible.<br/>
            <span style={{ fontSize: 8 }}>Les données apparaîtront après vos premières mesures.</span>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {(['Date', 'Score IER', 'Niveau'] as const).map((h, i) => (
                  <th key={h} style={{ fontSize: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: COLORS.muted, padding: '4px 0', textAlign: i === 2 ? 'center' : 'left', borderBottom: `0.5px solid ${COLORS.border}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((entry, i) => <HistoryRow key={i} entry={entry} isLast={i === history.length - 1} />)}
            </tbody>
          </table>
        )}
      </Card>

      <div style={{ margin: '0 12px 8px' }}>
        <button onClick={onLogout} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
          style={{ width: '100%', height: 46, background: hovered ? '#FEF2F2' : 'transparent', border: '1.5px solid #E24B4A', borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#E24B4A', fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background .15s' }}>
          <LogoutIcon /> Se déconnecter
        </button>
      </div>
    </>
  );
};
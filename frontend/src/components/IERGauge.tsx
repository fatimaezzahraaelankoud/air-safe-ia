// ─────────────────────────────────────────────
//  AirSafe AI — Jauge IER Radiale
// ─────────────────────────────────────────────
import React from 'react';
import { COLORS, scoreToColor, scoreToZone, ZONE_META } from '../styles/tokens';
import { Badge, ZoneDot } from './Shared';

interface IERGaugeProps {
  score: number;
}

const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC = CIRCUMFERENCE * 0.75;

export const IERGauge: React.FC<IERGaugeProps> = ({ score }) => {
  const zone     = scoreToZone(score);
  const color    = scoreToColor(score);
  const zoneMeta = ZONE_META[zone];
  const fill     = ARC * (score / 100);
  const gap      = CIRCUMFERENCE - fill;

  const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{
      background: COLORS.card,
      border: `0.5px solid ${COLORS.border}`,
      borderRadius: 12,
      margin: '0 12px 8px',
      padding: '12px',
    }}>
      <div style={{
        fontSize: 9, fontWeight: 500,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        color: COLORS.muted, marginBottom: 10,
      }}>
        Index d'Exposition Respiratoire
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Jauge */}
        <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
          <svg viewBox="0 0 90 90" fill="none" style={{ width: '100%', height: '100%' }}>
            <circle
              cx="45" cy="45" r={RADIUS}
              stroke={COLORS.border} strokeWidth="7" fill="none"
              strokeDasharray={`${ARC} ${CIRCUMFERENCE}`}
              strokeLinecap="round"
              transform="rotate(135 45 45)"
            />
            <circle
              cx="45" cy="45" r={RADIUS}
              stroke={color} strokeWidth="7" fill="none"
              strokeDasharray={`${fill} ${gap}`}
              strokeLinecap="round"
              transform="rotate(135 45 45)"
              style={{ transition: 'stroke-dasharray 0.4s ease, stroke 0.3s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 22, fontWeight: 600, color, lineHeight: 1 }}>
              {score}
            </span>
            <span style={{ fontSize: 8, color: COLORS.muted, marginTop: 2 }}>/ 100</span>
          </div>
        </div>

        {/* Infos */}
        <div style={{ flex: 1 }}>
          <Badge color={zoneMeta.color} style={{ marginBottom: 5 }}>
            <ZoneDot color={zoneMeta.color} />
            Zone {zone} — {zoneMeta.label}
          </Badge>
          <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 3, lineHeight: 1.4 }}>
            {zone === 'A' && 'Qualité de l\'air excellente. Aucune restriction nécessaire.'}
            {zone === 'B' && 'Qualité de l\'air acceptable. Les personnes sensibles doivent rester prudentes.'}
            {zone === 'C' && 'Qualité de l\'air dégradée. Limitez votre exposition extérieure.'}
            {zone === 'D' && 'Qualité de l\'air critique. Évitez toute activité extérieure non essentielle.'}
          </div>
          <div style={{ marginTop: 6, fontSize: 9, color: COLORS.muted }}>
            Mis à jour à {now}
          </div>
        </div>
      </div>
    </div>
  );
};
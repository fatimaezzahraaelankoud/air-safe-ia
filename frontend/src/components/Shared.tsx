// ─────────────────────────────────────────────
//  AirSafe AI — Shared UI Components
// ─────────────────────────────────────────────
import React from 'react';
import { COLORS} from '../styles/tokens';
import type { ZoneColor } from '../types';

// ── Badge ──────────────────────────────────────
interface BadgeProps {
  color: ZoneColor;
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export const Badge: React.FC<BadgeProps> = ({ color, children, style }) => (
  <span className={`badge badge-${color}`} style={style}>
    {children}
  </span>
);

// ── Zone Dot ───────────────────────────────────
interface ZoneDotProps { color: ZoneColor; size?: number }
export const ZoneDot: React.FC<ZoneDotProps> = ({ color, size = 6 }) => (
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
    <circle cx={size / 2} cy={size / 2} r={size / 2} fill={COLORS[color]} />
  </svg>
);

// ── Card ───────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  noPadding?: boolean;
}
export const Card: React.FC<CardProps> = ({ children, style, innerStyle, noPadding }) => (
  <div style={{
    background: COLORS.card,
    border: `0.5px solid ${COLORS.border}`,
    borderRadius: 12,
    margin: '0 12px 8px',
    ...style,
  }}>
    {noPadding ? children : (
      <div style={{ padding: '10px 12px', ...innerStyle }}>
        {children}
      </div>
    )}
  </div>
);

// ── Card Title ─────────────────────────────────
export const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    fontSize: 9,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: COLORS.muted,
    marginBottom: 8,
  }}>
    {children}
  </div>
);

// ── Page Header ────────────────────────────────
interface PageHeaderProps {
  greeting: string;
  title: React.ReactNode;
  date?: string;
  action?: React.ReactNode;
}
export const PageHeader: React.FC<PageHeaderProps> = ({ greeting, title, date, action }) => (
  <div className="page-header">
    <div className="greeting">{greeting}</div>
    <div className="location-row">
      <h1>{title}</h1>
      {action}
    </div>
    {date && <div className="date">{date}</div>}
  </div>
);

// ── Mini Progress Bar ──────────────────────────
interface MiniBarProps { percent: number; color: string }
export const MiniBar: React.FC<MiniBarProps> = ({ percent, color }) => (
  <div className="mini-bar-track">
    <div className="mini-bar-fill" style={{ width: `${percent}%`, background: color }} />
  </div>
);

// ── Risk Bar ───────────────────────────────────
interface RiskBarProps { percent: number; color: string }
export const RiskBar: React.FC<RiskBarProps> = ({ percent, color }) => (
  <div style={{ height: 5, background: COLORS.border, borderRadius: 3, marginBottom: 6 }}>
    <div style={{ width: `${percent}%`, height: '100%', borderRadius: 3, background: color }} />
  </div>
);

// ── Profile Row ────────────────────────────────
interface ProfileRowProps {
  label: string;
  value: React.ReactNode;
}
export const ProfileRow: React.FC<ProfileRowProps> = ({ label, value }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '7px 0',
    borderBottom: `0.5px solid ${COLORS.border}`,
  }}>
    <span style={{ fontSize: 9, color: COLORS.muted }}>{label}</span>
    <span style={{ fontSize: 10, fontWeight: 500, color: COLORS.text, textAlign: 'right' }}>
      {value}
    </span>
  </div>
);

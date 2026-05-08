import type { CSSProperties } from 'react';
import type { ZoneColor, ZoneLevel, IERZone } from '../types';

export const COLORS = {
  green:  '#639922',
  blue:   '#378ADD',
  amber:  '#BA7517',
  red:    '#E24B4A',
  text:   '#111827',
  muted:  '#9CA3AF',
  card:   '#ffffff',
  page:   '#F5F7FA',
  border: '#E5E7EB',
} as const;

export const BADGE_STYLES: Record<ZoneColor, CSSProperties> = {
  green: { background: '#EBF3DA', color: COLORS.green },
  blue:  { background: '#DAE9F8', color: COLORS.blue  },
  amber: { background: '#F5E9D6', color: COLORS.amber },
  red:   { background: '#FAE0E0', color: COLORS.red   },
};

export const ZONE_META: Record<ZoneLevel, IERZone> = {
  A: { level: 'A', color: 'green', label: 'Saine',    min: 0,  max: 34  },
  B: { level: 'B', color: 'blue',  label: 'Modérée',  min: 35, max: 59  },
  C: { level: 'C', color: 'amber', label: 'Risquée',  min: 60, max: 79  },
  D: { level: 'D', color: 'red',   label: 'Critique', min: 80, max: 100 },
};

export function scoreToZone(score: number): ZoneLevel {
  if (score < 35) return 'A';
  if (score < 60) return 'B';
  if (score < 80) return 'C';
  return 'D';
}

export function scoreToColor(score: number): string {
  return COLORS[ZONE_META[scoreToZone(score)].color];
}

export const FONT = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

export const CARD_STYLE: CSSProperties = {
  background: COLORS.card,
  border: `0.5px solid ${COLORS.border}`,
  borderRadius: 12,
  margin: '0 12px 8px',
};

export const CARD_INNER: CSSProperties = {
  padding: '10px 12px',
};

export const CARD_TITLE: CSSProperties = {
  fontSize: 9,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: COLORS.muted,
  marginBottom: 8,
};
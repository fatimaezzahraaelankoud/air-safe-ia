// ─────────────────────────────────────────────
//  AirSafe AI — Navigation Bas de Page
// ─────────────────────────────────────────────
import React from 'react';
import { COLORS } from '../styles/tokens';
import {
  NavDashboard, NavMap, NavSurvey, NavProfile,
} from './Icons';
import type { TabId } from '../types';

interface NavItemConfig {
  id: TabId;
  label: string;
  Icon: React.FC<{ stroke?: string }>;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 0, label: 'Tableau',  Icon: NavDashboard },
  { id: 1, label: 'Carte',    Icon: NavMap       },
  { id: 2, label: 'Bilan',    Icon: NavSurvey    },
  { id: 3, label: 'Profil',   Icon: NavProfile   },
];

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => (
  <nav style={{
    background: COLORS.card,
    borderTop: `0.5px solid ${COLORS.border}`,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '8px 0 10px',
    flexShrink: 0,
  }}>
    {NAV_ITEMS.map(({ id, label, Icon }) => {
      const isActive = activeTab === id;
      const stroke   = isActive ? COLORS.blue : COLORS.muted;
      return (
        <div
          key={id}
          onClick={() => onTabChange(id)}
          style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3,
            cursor: 'pointer', padding: '2px 12px',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <Icon stroke={stroke} />
          <span style={{
            fontSize: 9, fontWeight: 500,
            color: stroke,
            transition: 'color 0.15s',
          }}>
            {label}
          </span>
        </div>
      );
    })}
  </nav>
);
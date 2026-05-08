// ─────────────────────────────────────────────
//  AirSafe AI — Phone Frame + Status Bar
// ─────────────────────────────────────────────
import React from 'react';
import { COLORS } from '../styles/tokens';
import { IconSignal, IconWifi, IconBattery } from './Icons';

// ── Status Bar ────────────────────────────────
export const StatusBar: React.FC = () => (
  <div style={{
    background: COLORS.page,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 16px 4px',
    fontSize: 10,
    fontWeight: 500,
    color: COLORS.text,
    flexShrink: 0,
  }}>
    <span style={{ fontWeight: 600, fontSize: 11 }}>9:41</span>
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      <IconSignal size={12} />
      <IconWifi size={13} />
      <IconBattery size={20} />
    </div>
  </div>
);

// ── Phone Frame ───────────────────────────────
interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => (
  <div style={{
    width: 300,
    borderRadius: 32,
    background: COLORS.page,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #C1C7D0',
    boxShadow: '0 0 0 6px #1C1C1E, 0 24px 64px rgba(0,0,0,.35)',
    minHeight: 620,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  }}>
    {children}
  </div>
);

// ── Screen Slot (scrollable content area) ─────
interface ScreenSlotProps {
  children: React.ReactNode;
}

export const ScreenSlot: React.FC<ScreenSlotProps> = ({ children }) => (
  <div style={{
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingBottom: 8,
    // Hide scrollbar cross-browser
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  } as React.CSSProperties}>
    {children}
  </div>
);

// ─────────────────────────────────────────────
//  AirSafe AI — SVG Icon Components
// ─────────────────────────────────────────────
import React from 'react';

interface IconProps {
  size?: number;
  stroke?: string;
  fill?: string;
}

export const IconSignal: React.FC<IconProps> = ({ size = 12 }) => (
  <svg width={size} height={size * 0.83} viewBox="0 0 12 10" fill="none">
    <rect x="0" y="3" width="2" height="7" rx=".5" fill="#111827"/>
    <rect x="2.5" y="2" width="2" height="8" rx=".5" fill="#111827"/>
    <rect x="5" y="1" width="2" height="9" rx=".5" fill="#111827"/>
    <rect x="7.5" y="0" width="2" height="10" rx=".5" fill="#111827" opacity=".3"/>
  </svg>
);

export const IconWifi: React.FC<IconProps> = ({ size = 13 }) => (
  <svg width={size} height={size * 0.77} viewBox="0 0 13 10" fill="none">
    <path d="M6.5 2.5C8.5 2.5 10.2 3.4 11.3 4.8L12.5 3.4C11 1.7 8.9.6 6.5.6S2 1.7.5 3.4L1.7 4.8C2.8 3.4 4.5 2.5 6.5 2.5Z" fill="#111827"/>
    <path d="M6.5 5.2C7.8 5.2 8.9 5.8 9.7 6.7L10.9 5.3C9.7 4.1 8.2 3.3 6.5 3.3S3.3 4.1 2.1 5.3L3.3 6.7C4.1 5.8 5.2 5.2 6.5 5.2Z" fill="#111827"/>
    <circle cx="6.5" cy="8.5" r="1.3" fill="#111827"/>
  </svg>
);

export const IconBattery: React.FC<IconProps> = ({ size = 20 }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 20 10" fill="none">
    <rect x=".5" y=".5" width="16" height="9" rx="2" stroke="#111827" strokeOpacity=".35"/>
    <rect x="1.5" y="1.5" width="13" height="7" rx="1.5" fill="#111827"/>
    <path d="M17.5 3.5v3a1.5 1.5 0 000-3z" fill="#111827" opacity=".4"/>
  </svg>
);

export const IconBell: React.FC<IconProps> = ({ size = 18, stroke = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none"
    stroke={stroke} strokeWidth="1.2" strokeLinecap="round">
    <path d="M9 1.5A5.5 5.5 0 013.5 7c0 4.5-1.5 6-1.5 6h14s-1.5-1.5-1.5-6A5.5 5.5 0 019 1.5z"/>
    <path d="M10.73 15.5a2 2 0 01-3.46 0"/>
  </svg>
);

export const IconLocation: React.FC<IconProps> = ({ size = 9, fill = '#9CA3AF' }) => (
  <svg width={size} height={size * 1.22} viewBox="0 0 9 11" fill="none">
    <path d="M4.5 0C2.57 0 1 1.57 1 3.5c0 2.63 3.5 7 3.5 7s3.5-4.37 3.5-7C8 1.57 6.43 0 4.5 0zm0 4.75a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z"
      fill={fill}/>
  </svg>
);

export const IconPM25: React.FC<IconProps> = ({ size = 14, stroke = '#BA7517' }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <circle cx="5" cy="7" r="2.5" stroke={stroke} strokeWidth="1.1"/>
    <circle cx="10" cy="5" r="1.8" stroke={stroke} strokeWidth="1.1"/>
    <circle cx="9" cy="9.5" r="1.2" stroke={stroke} strokeWidth="1.1"/>
  </svg>
);

export const IconCO: React.FC<IconProps> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <text x="1" y="10" fontFamily="Inter,sans-serif" fontSize="7" fontWeight="600" fill="#E24B4A">CO</text>
    <circle cx="10.5" cy="4" r="1.5" stroke="#E24B4A" strokeWidth="1"/>
  </svg>
);

export const IconTemp: React.FC<IconProps> = ({ size = 14, stroke = '#378ADD' }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M7 8.5V3a1.5 1.5 0 00-3 0v5.5a2.5 2.5 0 103 0z"
      stroke={stroke} strokeWidth="1.1" strokeLinecap="round"/>
    <circle cx="5.5" cy="10" r="1" fill={stroke}/>
  </svg>
);

export const IconHumidity: React.FC<IconProps> = ({ size = 14, stroke = '#639922' }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5L4 7a3 3 0 106 0L7 1.5z"
      stroke={stroke} strokeWidth="1.1" strokeLinejoin="round"/>
  </svg>
);

export const IconFatigue: React.FC<IconProps> = ({ size = 22, stroke = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none"
    stroke={stroke} strokeWidth="1.3" strokeLinecap="round">
    <path d="M11 2v5M11 15v5M4.22 4.22l3.54 3.54M14.24 14.24l3.54 3.54M2 11h5M15 11h5M4.22 17.78l3.54-3.54M14.24 7.76l3.54-3.54"/>
  </svg>
);

export const IconCough: React.FC<IconProps> = ({ size = 22, stroke = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none"
    stroke={stroke} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12c0-3.3 2.7-6 6-6h2a4 4 0 010 8H5"/>
    <path d="M5 12H3M5 14l-2 2M5 10l-2-2"/>
  </svg>
);

export const IconBreathing: React.FC<IconProps> = ({ size = 22, stroke = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none"
    stroke={stroke} strokeWidth="1.3" strokeLinecap="round">
    <path d="M3 11h4l2-4 2 8 2-6 2 3 2-1h2"/>
  </svg>
);

export const IconHeadache: React.FC<IconProps> = ({ size = 22, stroke = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none"
    stroke={stroke} strokeWidth="1.3" strokeLinecap="round">
    <circle cx="11" cy="9" r="5"/>
    <path d="M9 14v3a2 2 0 004 0v-3"/>
    <path d="M11 6V4M8.5 7.5L7 6M13.5 7.5L15 6"/>
  </svg>
);

export const IconSport: React.FC<IconProps> = ({ size = 22, stroke = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none"
    stroke={stroke} strokeWidth="1.3" strokeLinecap="round">
    <circle cx="11" cy="5" r="2"/>
    <path d="M11 7v5l-3 4M11 12l3 4M8 10l-3 1M14 10l3 1"/>
  </svg>
);

export const IconWalk: React.FC<IconProps> = ({ size = 22, stroke = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none"
    stroke={stroke} strokeWidth="1.3" strokeLinecap="round">
    <circle cx="11" cy="4" r="2"/>
    <path d="M9 7l-2 4 2 1M13 7l2 4-2 1M11 8v5M9 20l2-4 2 4"/>
  </svg>
);

export const IconRest: React.FC<IconProps> = ({ size = 22, stroke = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none"
    stroke={stroke} strokeWidth="1.3" strokeLinecap="round">
    <path d="M3 11h16M3 15h8M3 7h5"/>
    <path d="M17 7a2 2 0 110 4 2 2 0 010-4z"/>
  </svg>
);

export const IconAlert: React.FC<IconProps> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path d="M9 1L1 16h16L9 1z" stroke="#E24B4A" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M9 7v4" stroke="#E24B4A" strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="9" cy="13" r=".8" fill="#E24B4A"/>
  </svg>
);

export const IconSend: React.FC<IconProps> = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 13 13" fill="none"
    stroke="#fff" strokeWidth="1.4" strokeLinecap="round">
    <path d="M6.5 1v11M1 6.5L6.5 12 12 6.5"/>
  </svg>
);

export const IconInfo: React.FC<IconProps> = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
    <circle cx="5" cy="5" r="4.5" stroke="#378ADD" strokeWidth="1"/>
    <path d="M5 3v3M5 7.5v.5" stroke="#378ADD" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

// Nav Icons
export const NavDashboard: React.FC<IconProps> = ({ stroke = '#9CA3AF' }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
    stroke={stroke} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="11" width="5" height="7" rx="1"/>
    <rect x="7.5" y="6" width="5" height="12" rx="1"/>
    <rect x="13" y="2" width="5" height="16" rx="1"/>
  </svg>
);

export const NavMap: React.FC<IconProps> = ({ stroke = '#9CA3AF' }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
    stroke={stroke} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 5l6-3 6 3 6-3v13l-6 3-6-3-6 3V5z"/>
    <line x1="7" y1="2" x2="7" y2="15"/>
    <line x1="13" y1="5" x2="13" y2="18"/>
  </svg>
);

export const NavSurvey: React.FC<IconProps> = ({ stroke = '#9CA3AF' }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
    stroke={stroke} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3H6a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1z"/>
    <line x1="8" y1="7" x2="12" y2="7"/>
    <line x1="8" y1="10" x2="12" y2="10"/>
    <line x1="8" y1="13" x2="10" y2="13"/>
  </svg>
);

export const NavProfile: React.FC<IconProps> = ({ stroke = '#9CA3AF' }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
    stroke={stroke} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="7" r="3.5"/>
    <path d="M3 18c0-3.87 3.13-7 7-7s7 3.13 7 7"/>
  </svg>
);

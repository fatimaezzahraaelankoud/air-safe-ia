// ─────────────────────────────────────────────
//  AirSafe AI — Type Definitions
// ─────────────────────────────────────────────

export type ZoneLevel = 'A' | 'B' | 'C' | 'D';
export type ZoneColor = 'green' | 'blue' | 'amber' | 'red';

export interface IERZone {
  level: ZoneLevel;
  color: ZoneColor;
  label: string;
  min: number;
  max: number;
}

export interface SensorReading {
  id: 'pm25' | 'co' | 'temp' | 'humidity';
  name: string;
  value: number;
  unit: string;
  color: ZoneColor;
  percent: number; // 0–100 for mini bar
}

export interface ForecastDay {
  day: string;
  score: number;
  color: ZoneColor;
}

export interface SymptomItem {
  id: 'fatigue' | 'cough' | 'breathing' | 'headache';
  label: string;
}

export type ActivityType = 'sport' | 'walk' | 'rest';

export interface HistoryEntry {
  date: string;
  score: number;
  zone: ZoneLevel;
}

export interface MedicalProfile {
  initials: string;
  name: string;
  institution: string;
  pathology: string;
  age: number;
  ierThreshold: number;
  pm25Threshold: number;
  coThreshold: number;
  weights: {
    alpha: number; // PM2.5
    beta: number;  // CO
    gamma: number; // Temp
    delta: number; // Humidity
  };
  sensitivity: number; // multiplier
}

export type TabId = 0 | 1 | 2 | 3;

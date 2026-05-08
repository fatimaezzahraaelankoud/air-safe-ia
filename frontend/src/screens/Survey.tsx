// ─────────────────────────────────────────────
//  AirSafe AI — Bilan Quotidien
// ─────────────────────────────────────────────
import React, { useState } from 'react';
import { COLORS } from '../styles/tokens';
import { Card, CardTitle, PageHeader } from '../components/Shared';
import {
  IconFatigue, IconCough, IconBreathing, IconHeadache,
  IconSport, IconWalk, IconRest, IconInfo, IconSend,
} from '../components/Icons';
import type { SymptomItem, ActivityType } from '../types';
import { submitSurvey, getLiveData } from '../api/airsafe';

const SYMPTOMS: SymptomItem[] = [
  { id: 'fatigue',   label: 'Fatigue'            },
  { id: 'cough',     label: 'Toux'               },
  { id: 'breathing', label: 'Difficultés respi.' },
  { id: 'headache',  label: 'Maux de tête'       },
];

const SYMPTOM_ICONS: Record<SymptomItem['id'], React.FC<{ size?: number; stroke?: string }>> = {
  fatigue: IconFatigue, cough: IconCough, breathing: IconBreathing, headache: IconHeadache,
};

const ACTIVITIES: { id: ActivityType; label: string }[] = [
  { id: 'sport', label: 'Sport' },
  { id: 'walk',  label: 'Marche' },
  { id: 'rest',  label: 'Repos' },
];

const ACTIVITY_ICONS: Record<ActivityType, React.FC<{ size?: number; stroke?: string }>> = {
  sport: IconSport, walk: IconWalk, rest: IconRest,
};

function riskColor(level: string) {
  if (level === 'CRITICAL' || level === 'HIGH') return COLORS.red;
  if (level === 'MEDIUM') return COLORS.amber;
  return COLORS.green;
}
function riskLabel(level: string) {
  if (level === 'CRITICAL') return 'Critique';
  if (level === 'HIGH')     return 'Élevé';
  if (level === 'MEDIUM')   return 'Modéré';
  return 'Faible';
}

export const Survey: React.FC = () => {
  const [activeSymptoms, setActiveSymptoms] = useState<Set<SymptomItem['id']>>(new Set());
  const [intensity, setIntensity] = useState(5);
  const [activity,  setActivity]  = useState<ActivityType>('walk');
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiResult,  setAiResult]  = useState<{
    probability: number; level: string; message: string;
    recommendation: string; ierScore: number;
  } | null>(null);

  const toggleSymptom = (id: SymptomItem['id']) => {
    setActiveSymptoms(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitted(true);
    setAiResult(null);

    try {
      const [healthRes, liveRes] = await Promise.allSettled([
        submitSurvey({
          cough:     activeSymptoms.has('cough'),
          breathing: activeSymptoms.has('breathing'),
          headache:  activeSymptoms.has('headache'),
          fatigue:   activeSymptoms.has('fatigue'),
        }),
        getLiveData(),
      ]);

      let probability = 0, level = 'LOW', message = '', recommendation = '', ierScore = 0;

      if (healthRes.status === 'fulfilled') {
        const h = healthRes.value;
        probability    = h?.prediction?.probability ?? 0;
        level          = h?.prediction?.risk_level  ?? 'LOW';
        recommendation = h?.recommendation          ?? '';
        ierScore       = h?.prediction?.ier         ?? 0;
      }

      if (liveRes.status === 'fulfilled') {
        const l = liveRes.value;
        if (l?.ier?.score !== undefined)             ierScore = l.ier.score;
        if (l?.prediction?.probability !== undefined && probability === 0) probability = l.prediction.probability;
        if (l?.prediction?.message && !message)      message = l.prediction.message;
      }

      if (!message && recommendation) message = recommendation;
      setAiResult({ probability, level, message, recommendation, ierScore });
    } catch {
      setAiResult({ probability: 0, level: 'LOW', message: 'Analyse indisponible.', recommendation: '', ierScore: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        greeting="Comment vous sentez-vous ?"
        title="Bilan Quotidien des Symptômes"
        date={new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) + ' · Bilan du matin'}
      />

      <Card style={{ marginBottom: 4 }}>
        <CardTitle>Symptômes présents</CardTitle>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, margin: '0 12px 8px' }}>
        {SYMPTOMS.map(s => {
          const isActive = activeSymptoms.has(s.id);
          const IconComp = SYMPTOM_ICONS[s.id];
          return (
            <button key={s.id} onClick={() => toggleSymptom(s.id)} style={{
              background: isActive ? '#EFF6FF' : COLORS.card,
              border: `0.5px solid ${isActive ? COLORS.blue : COLORS.border}`,
              borderRadius: 12, padding: '10px 8px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <IconComp size={22} stroke={isActive ? COLORS.blue : COLORS.muted} />
              <span style={{ fontSize: 9, fontWeight: 500, color: isActive ? COLORS.blue : COLORS.muted }}>{s.label}</span>
            </button>
          );
        })}
      </div>

      <Card>
        <CardTitle>Intensité des symptômes</CardTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 500, color: COLORS.text }}>Quelle est la sévérité ?</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.blue }}>{intensity}</span>
        </div>
        <input type="range" className="intensity-slider" min={0} max={10} value={intensity}
          onChange={e => setIntensity(Number(e.target.value))} style={{ width: '100%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          {['0 – Aucun', '5 – Modéré', '10 – Sévère'].map(t => (
            <span key={t} style={{ fontSize: 8, color: COLORS.muted }}>{t}</span>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom: 4 }}>
        <CardTitle>Niveau d'activité aujourd'hui</CardTitle>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, margin: '0 12px 8px' }}>
        {ACTIVITIES.map(a => {
          const isActive = activity === a.id;
          const IconComp = ACTIVITY_ICONS[a.id];
          return (
            <button key={a.id} onClick={() => setActivity(a.id)} style={{
              background: isActive ? '#F0F7E4' : COLORS.card,
              border: `0.5px solid ${isActive ? COLORS.green : COLORS.border}`,
              borderRadius: 12, padding: '9px 4px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <IconComp size={22} stroke={isActive ? COLORS.green : COLORS.muted} />
              <span style={{ fontSize: 9, fontWeight: 500, color: isActive ? COLORS.green : COLORS.muted }}>{a.label}</span>
            </button>
          );
        })}
      </div>

      <button className="submit-btn" onClick={handleSubmit} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
        <IconSend size={13} />
        {loading ? 'Analyse IA en cours...' : "Analyser avec l'IA"}
      </button>

      {submitted && loading && (
        <div style={{ margin: '0 12px 8px', background: COLORS.card, border: `0.5px solid ${COLORS.border}`, borderRadius: 12, padding: '16px', textAlign: 'center', fontSize: 9, color: COLORS.muted }}>
          🤖 Le modèle IA analyse vos données...
        </div>
      )}

      {submitted && aiResult && !loading && (
        <div style={{ margin: '0 12px 8px', background: COLORS.card, border: `0.5px solid ${COLORS.border}`, borderRadius: 12, padding: '10px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 500, color: COLORS.blue, display: 'flex', alignItems: 'center', gap: 4 }}>
              <IconInfo size={10} /> Analyse AirSafe IA
            </div>
            <div style={{ fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: `${riskColor(aiResult.level)}15`, color: riskColor(aiResult.level), border: `0.5px solid ${riskColor(aiResult.level)}40` }}>
              {riskLabel(aiResult.level)}
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 9, color: COLORS.muted }}>Probabilité de crise</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: riskColor(aiResult.level) }}>{Math.round(aiResult.probability)}%</span>
            </div>
            <div style={{ height: 4, background: '#E5E7EB', borderRadius: 2 }}>
              <div style={{ height: '100%', borderRadius: 2, width: `${Math.min(aiResult.probability, 100)}%`, background: riskColor(aiResult.level), transition: 'width 0.5s ease' }} />
            </div>
          </div>

          {aiResult.ierScore > 0 && (
            <div style={{ marginBottom: 8, padding: '6px 8px', background: COLORS.page, borderRadius: 8 }}>
              <span style={{ fontSize: 9, color: COLORS.muted }}>IER actuel : </span>
              <span style={{ fontSize: 10, fontWeight: 600, color: COLORS.text }}>{Math.round(aiResult.ierScore)}/100</span>
            </div>
          )}

          <div style={{ fontSize: 9, color: COLORS.muted, lineHeight: 1.6 }}>
            {aiResult.recommendation || aiResult.message || 'Analyse effectuée.'}
          </div>

          {intensity >= 7 && (
            <div style={{ marginTop: 8, padding: '6px 8px', background: '#FEF2F2', borderRadius: 8, fontSize: 9, color: '#B91C1C', lineHeight: 1.5 }}>
               Intensité élevée ({intensity}/10) — Consultez un médecin si les symptômes persistent.
            </div>
          )}
        </div>
      )}
    </>
  );
};
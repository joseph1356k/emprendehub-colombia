import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronLeft, ChevronRight, Edit, Sparkles } from 'lucide-react';
import { Badge, Button, Card, PageHeader } from '../components/ui';
import { useApp } from '../context/AppContext';
import { DIAGNOSTIC_QUESTIONS } from '../data/diagnostic';
import { spanishText } from '../utils/spanishText';

function ScoreBar({ label, value }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 38px', gap: '12px', alignItems: 'center' }}>
      <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>{label}</span>
      <div className="progress-bg" style={{ height: '8px' }}>
        <div className="progress-fill" style={{ width: `${Math.min(100, Number(value || 0) * 10)}%` }} />
      </div>
      <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{value}/10</span>
    </div>
  );
}

function PlanPreview({ plan, onEdit, onApprove, saving, primaryLabel = 'Aprobar plan' }) {
  const scores = plan?.scores || {};
  const snapshot = plan?.snapshot || {};
  const tasks = plan?.recommendedTasks || [];

  return (
    <div className="page-shell animate-fade-in">
      <PageHeader
        kicker="Plan recomendado por SOE"
        title="Radiografía accionable del negocio"
        subtitle="SOE propone un plan de 30 días. Puedes aprobarlo para reemplazar tareas pendientes y conservar lo que ya completaste."
        actionSecondary={
          <Button variant="secondary" onClick={onEdit}>
            <Edit size={16} /> Ajustar respuestas
          </Button>
        }
        action={
          <Button onClick={onApprove} disabled={saving}>
            {saving ? 'Guardando...' : primaryLabel}
          </Button>
        }
      />

      <div className="section-grid-2" style={{ marginBottom: '22px' }}>
        <Card>
          <Badge tone="mint">Diagnóstico base</Badge>
          <h2 className="page-title" style={{ fontSize: '30px', marginTop: '14px' }}>
            {snapshot.monthlyPriority || 'Prioridad del mes'}
          </h2>
          <p className="page-subtitle" style={{ marginTop: '10px' }}>
            {snapshot.agentRecommendation || 'SOE recomienda concentrar la ejecución antes de abrir nuevos frentes.'}
          </p>
          <div style={{ display: 'grid', gap: '10px', marginTop: '18px' }}>
            <p><strong>Etapa:</strong> {spanishText(snapshot.stage || 'Idea')}</p>
            <p><strong>Bloqueo:</strong> {snapshot.mainBlocker || 'Falta claridad estratégica'}</p>
            <p><strong>Riesgo:</strong> {snapshot.currentRisk || 'Dispersión de prioridades.'}</p>
          </div>
        </Card>

        <Card>
          <p className="page-kicker" style={{ marginBottom: '16px' }}>Estado por áreas</p>
          <div style={{ display: 'grid', gap: '14px' }}>
            {Object.entries(scores).map(([label, value]) => (
              <ScoreBar key={label} label={label} value={value} />
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div>
            <p className="page-kicker">Plan de acción propuesto</p>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginTop: '6px' }}>{tasks.length} tareas recomendadas</h2>
          </div>
          <Badge tone="info">{plan?.model?.includes('fallback') ? 'Plan local' : 'IA + criterio SOE'}</Badge>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          {tasks.map((task, index) => (
            <div
              key={`${task.title}-${index}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '34px minmax(0, 1fr) auto',
                gap: '14px',
                padding: '16px',
                borderRadius: '18px',
                border: '1px solid var(--border)',
                background: index < 3 ? 'var(--primary-light)' : '#fff',
              }}
            >
              <span className="display-font" style={{ color: 'var(--primary)', fontSize: '26px', lineHeight: 1 }}>{index + 1}</span>
              <div>
                <p style={{ fontWeight: 800 }}>{task.title}</p>
                <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>{task.rationale}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
                  Resultado: {task.expectedOutcome}
                </p>
              </div>
              <div style={{ display: 'grid', justifyItems: 'end', gap: '8px' }}>
                <Badge tone={task.priority === 'Alta' ? 'warning' : 'neutral'}>{task.priority}</Badge>
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{task.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function Diagnostic() {
  const { diagnosticAnswers, diagnosticCompleted, latestDiagnosticRun, requestDiagnosticPlan, saveDiagnostic } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(diagnosticAnswers || {});
  const [plan, setPlan] = useState(latestDiagnosticRun || null);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState(diagnosticCompleted && latestDiagnosticRun ? 'summary' : 'questions');

  const current = DIAGNOSTIC_QUESTIONS[step];
  const progress = Math.round(((step + 1) / DIAGNOSTIC_QUESTIONS.length) * 100);
  const answeredCount = useMemo(
    () => DIAGNOSTIC_QUESTIONS.filter((question) => answers[question.id]).length,
    [answers]
  );
  const answeredAll = answeredCount === DIAGNOSTIC_QUESTIONS.length;

  const selectOption = (value) => {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: value }));
  };

  const generatePlan = async () => {
    setSaving(true);
    const generated = await requestDiagnosticPlan(answers);
    setPlan(generated);
    setMode('plan');
    setSaving(false);
  };

  const approvePlan = async () => {
    setSaving(true);
    const result = await saveDiagnostic(answers, plan);
    setSaving(false);
    if (!result?.error) navigate('/dashboard');
  };

  if (mode === 'plan' && plan) {
    return (
      <PlanPreview
        plan={plan}
        saving={saving}
        onEdit={() => setMode('questions')}
        onApprove={approvePlan}
      />
    );
  }

  if (mode === 'summary' && plan) {
    return (
      <PlanPreview
        plan={plan}
        saving={saving}
        onEdit={() => {
          setMode('questions');
          setStep(0);
        }}
        onApprove={() => navigate('/ruta')}
        primaryLabel="Ver plan de acción"
      />
    );
  }

  return (
    <div className="page-shell animate-fade-in">
      <PageHeader
        kicker="Diagnóstico"
        title="Radiografía profunda del negocio"
        subtitle="Responde con honestidad. SOE usará esto para recomendar prioridades, tareas y criterios de avance reales."
      />

      <Card style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
          <div style={{ flex: 1 }}>
            <div className="progress-bg">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <Badge tone="info">{answeredCount} / {DIAGNOSTIC_QUESTIONS.length}</Badge>
        </div>

        <p className="page-kicker" style={{ marginBottom: '10px' }}>Pregunta {step + 1}</p>
        <h2 className="display-font" style={{ fontSize: '32px', fontWeight: 600, lineHeight: 1.2, marginBottom: '8px' }}>
          {current.label}
        </h2>
        <p className="page-subtitle" style={{ marginBottom: '22px' }}>{current.helper}</p>

        <div style={{ display: 'grid', gap: '10px' }}>
          {current.options.map((option) => {
            const selected = answers[current.id] === option.value;
            return (
              <button
                key={option.value}
                onClick={() => selectOption(option.value)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '24px 1fr',
                  gap: '12px',
                  alignItems: 'start',
                  padding: '16px',
                  borderRadius: '18px',
                  border: `1px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                  background: selected ? 'var(--primary-light)' : '#fff',
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${selected ? 'var(--primary)' : 'var(--border-strong)'}`,
                    background: selected ? 'var(--primary)' : '#fff',
                    color: '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '3px',
                  }}
                >
                  {selected ? <CheckCircle2 size={14} /> : null}
                </span>
                <span>
                  <span style={{ display: 'block', fontWeight: 800 }}>{option.label}</span>
                  <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '14px', marginTop: '3px' }}>{option.desc}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '26px', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0 || saving}>
            <ChevronLeft size={16} /> Anterior
          </Button>
          {step < DIAGNOSTIC_QUESTIONS.length - 1 ? (
            <Button onClick={() => setStep((value) => value + 1)} disabled={!answers[current.id] || saving}>
              Siguiente <ChevronRight size={16} />
            </Button>
          ) : (
            <Button onClick={generatePlan} disabled={!answeredAll || saving}>
              {saving ? 'Generando plan...' : <><Sparkles size={16} /> Generar plan recomendado</>}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

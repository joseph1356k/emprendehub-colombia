import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { Badge, Button, Card, PageHeader } from '../components/ui';
import { useApp } from '../context/AppContext';

const QUESTIONS = [
  {
    id: 'etapa',
    label: 'En que etapa se encuentra tu negocio?',
    options: [
      { value: 'idea', label: 'Tengo una idea', desc: 'Estoy explorando y definiendo el concepto.' },
      { value: 'validando', label: 'Estoy validando', desc: 'Tengo prototipo o primeras conversaciones con clientes.' },
      { value: 'vendiendo', label: 'Ya genero ingresos', desc: 'Tengo clientes que pagan con cierta recurrencia.' },
      { value: 'creciendo', label: 'Estoy creciendo', desc: 'Tengo equipo y necesito ordenar operaciones.' },
      { value: 'escalando', label: 'Estoy escalando', desc: 'Busco nuevos mercados, capital o estructura directiva.' },
    ],
  },
  {
    id: 'formalizacion',
    label: 'Que tan formalizado esta tu negocio?',
    options: [
      { value: 'ninguna', label: 'Sin formalizacion', desc: 'Aun no tengo RUT ni matricula mercantil.' },
      { value: 'en-proceso', label: 'En proceso', desc: 'Estoy iniciando tramites.' },
      { value: 'parcial', label: 'Parcialmente formal', desc: 'Algunos requisitos ya estan listos.' },
      { value: 'completa', label: 'Completamente formal', desc: 'RUT, camara y documentos principales al dia.' },
    ],
  },
  {
    id: 'necesidad',
    label: 'Cual es la decision mas importante ahora?',
    options: [
      { value: 'capital', label: 'Capital o caja', desc: 'Necesito financiar crecimiento o estabilizar flujo.' },
      { value: 'validacion', label: 'Producto y validacion', desc: 'Debo confirmar si la oferta funciona.' },
      { value: 'clientes', label: 'Clientes y ventas', desc: 'Necesito mejorar adquisicion y conversion.' },
      { value: 'equipo', label: 'Equipo y roles', desc: 'Debo decidir que contratar o tercerizar.' },
      { value: 'direccion', label: 'Direccion y criterio externo', desc: 'Necesito claridad para decidir con menos ruido.' },
    ],
  },
  {
    id: 'equipo',
    label: 'Como esta armado tu equipo?',
    options: [
      { value: 'solo', label: 'Solo por ahora', desc: 'Soy fundador individual.' },
      { value: 'cofounders', label: 'Equipo fundador pequeno', desc: 'Tengo 1 o 2 socios activos.' },
      { value: 'pequeno', label: 'Equipo operativo pequeno', desc: 'Trabajamos entre 3 y 5 personas.' },
      { value: 'mediano', label: 'Equipo establecido', desc: 'Mas de 5 personas sostienen la operacion.' },
    ],
  },
  {
    id: 'ingresos',
    label: 'Cuanto genera actualmente?',
    options: [
      { value: 'cero', label: 'Aun no genera ingresos', desc: 'Estoy antes de ventas recurrentes.' },
      { value: 'bajo', label: 'Hasta $5M COP/mes', desc: 'Primeras ventas.' },
      { value: 'medio', label: '$5M - $20M COP/mes', desc: 'Traccion inicial.' },
      { value: 'alto', label: 'Mas de $20M COP/mes', desc: 'Traccion comprobada.' },
    ],
  },
  {
    id: 'recursos',
    label: 'Que recurso destrabaria mas avance?',
    options: [
      { value: 'herramientas', label: 'Herramientas y plantillas', desc: 'Necesito bajar ideas a ejecucion.' },
      { value: 'red', label: 'Red y alianzas', desc: 'Necesito abrir conversaciones correctas.' },
      { value: 'financiacion', label: 'Financiacion', desc: 'Necesito oportunidades de capital o credito.' },
      { value: 'formacion', label: 'Aprendizaje practico', desc: 'Necesito fortalecer habilidades concretas.' },
    ],
  },
];

export default function Diagnostic() {
  const { diagnosticAnswers, diagnosticCompleted, saveDiagnostic } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(diagnosticAnswers || {});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(diagnosticCompleted);

  const current = QUESTIONS[step];
  const progress = Math.round(((step + 1) / QUESTIONS.length) * 100);
  const answeredAll = QUESTIONS.every((question) => answers[question.id]);

  const selectOption = (value) => {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await saveDiagnostic(answers);
    setSaving(false);
    setDone(true);
  };

  if (done) {
    const stageMap = { idea: 'Idea', validando: 'Validacion', vendiendo: 'Traccion', creciendo: 'Crecimiento', escalando: 'Escalamiento' };
    const stage = stageMap[answers.etapa] || 'Idea';
    return (
      <div className="page-shell animate-fade-in">
        <Card style={{ padding: '42px', textAlign: 'center' }}>
          <Badge tone="mint">Diagnostico completado</Badge>
          <h1 className="page-title" style={{ marginTop: '14px' }}>Tu etapa base es {stage}</h1>
          <p className="page-subtitle" style={{ margin: '14px auto 28px' }}>
            Soe actualizo el contexto para priorizar tareas, oportunidades y seguimiento del mes.
          </p>
          <div className="section-grid-2" style={{ marginBottom: '28px', textAlign: 'left' }}>
            {QUESTIONS.map((question) => (
              <div key={question.id} style={{ padding: '16px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--bg-panel)' }}>
                <p className="page-kicker">{question.label}</p>
                <p style={{ fontWeight: 800, marginTop: '6px' }}>
                  {question.options.find((option) => option.value === answers[question.id])?.label || 'Sin respuesta'}
                </p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="secondary" onClick={() => { setDone(false); setStep(0); }}>
              <Edit size={16} /> Actualizar respuestas
            </Button>
            <Button onClick={() => navigate('/ruta')}>Ver plan de accion</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-shell animate-fade-in">
      <PageHeader
        kicker="Diagnostico"
        title="Radiografia del negocio"
        subtitle="Seis preguntas para que Soe entienda etapa, bloqueos y prioridades actuales."
      />

      <Card style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
          <div style={{ flex: 1 }}>
            <div className="progress-bg">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <Badge tone="info">{step + 1} / {QUESTIONS.length}</Badge>
        </div>

        <h2 className="display-font" style={{ fontSize: '32px', fontWeight: 600, lineHeight: 1.2, marginBottom: '22px' }}>
          {current.label}
        </h2>

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
          <Button variant="secondary" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>
            <ChevronLeft size={16} /> Anterior
          </Button>
          {step < QUESTIONS.length - 1 ? (
            <Button onClick={() => setStep((value) => value + 1)} disabled={!answers[current.id]}>
              Siguiente <ChevronRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={!answeredAll || saving}>
              {saving ? 'Guardando...' : 'Finalizar diagnostico'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

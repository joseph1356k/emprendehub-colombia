import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, CalendarClock, Check, Circle, FileText, SquareCheckBig, Target, TrendingUp } from 'lucide-react';
import { Badge, Button, Card, EmptyState, PageHeader, StatCard } from '../components/ui';
import { useApp } from '../context/AppContext';
import { MOCK_OPPORTUNITIES } from '../data/mockData';

const BUSINESS_AREAS = [
  { label: 'Ventas', sections: ['Mercadeo'], fallback: 3 },
  { label: 'Finanzas', sections: ['Financiero'], fallback: 5 },
  { label: 'Operaciones', sections: ['Formalizacion'], fallback: 7 },
  { label: 'Marketing', sections: ['Mercadeo'], fallback: 2 },
  { label: 'Producto', sections: ['Producto / Servicio'], fallback: 8 },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos dias';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function BusinessBar({ label, value }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 44px', gap: '12px', alignItems: 'center' }}>
      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
      <div className="progress-bg" style={{ height: '8px' }}>
        <div className="progress-fill" style={{ width: `${Math.min(100, value * 10)}%` }} />
      </div>
      <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 700 }}>{value}/10</span>
    </div>
  );
}

export default function Dashboard() {
  const {
    profile,
    diagnosticCompleted,
    tasks,
    progressPercent,
    completedTasks,
    totalTasks,
    todayPlan,
    nextAction,
    updateTask,
    continueToNextAction,
  } = useApp();
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState(null);

  const name = profile?.full_name?.split(' ')[0] || 'Carlos';
  const pendingTasks = tasks.filter((task) => task.status !== 'completado');
  const weeklyTasks = todayPlan.topTasks.length > 0 ? todayPlan.topTasks : pendingTasks.slice(0, 4);

  const health = useMemo(() => {
    return BUSINESS_AREAS.map((area) => {
      const relevant = tasks.filter((task) => area.sections.includes(task.section));
      if (!relevant.length) return { ...area, value: area.fallback };
      const done = relevant.filter((task) => task.status === 'completado').length;
      const value = Math.max(1, Math.round((done / relevant.length) * 10));
      return { ...area, value };
    });
  }, [tasks]);

  const compatibleOpps = MOCK_OPPORTUNITIES.filter((opp) => {
    const stage = profile?.stage || 'Idea';
    return opp.status === 'Abierta' && opp.stages?.includes(stage);
  }).slice(0, 3);

  const toggleTask = async (task) => {
    setUpdatingId(task.id);
    await updateTask(task.id, task.status === 'completado' ? 'pendiente' : 'completado');
    setUpdatingId(null);
  };

  return (
    <div className="page-shell animate-fade-in">
      <PageHeader
        kicker="Inicio"
        title={`${getGreeting()}, ${name}`}
        subtitle={
          diagnosticCompleted
            ? `Tienes ${pendingTasks.length} tareas pendientes esta semana. Tu proximo comite esta a 11 dias.`
            : 'Completa el diagnostico para que Soe priorice tu plan de accion.'
        }
        action={<Button onClick={() => continueToNextAction(navigate)}>Continuar prioridad</Button>}
      />

      {!diagnosticCompleted ? (
        <Card style={{ marginBottom: '18px', borderColor: 'var(--status-warning)', background: '#fffaf0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontWeight: 800, color: '#8a6730' }}>Diagnostico pendiente</p>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Activa recomendaciones y prioridades segun tu etapa real.</p>
            </div>
            <Button variant="secondary" onClick={() => navigate('/diagnostico')}>Completar diagnostico</Button>
          </div>
        </Card>
      ) : null}

      <div className="section-grid-3" style={{ marginBottom: '24px' }}>
        <StatCard
          value={`${progressPercent}%`}
          label="Progreso del mes"
          helper="+12% vs mes anterior"
          icon={<TrendingUp size={22} />}
          onClick={() => navigate('/seguimiento')}
        />
        <StatCard
          value={Math.max(totalTasks - completedTasks, 0)}
          label="Tareas pendientes"
          helper="Vencen esta semana"
          icon={<SquareCheckBig size={22} />}
          onClick={() => navigate('/ruta')}
        />
        <StatCard
          value="11d"
          label="Proximo comite"
          helper="Direccion mensual"
          icon={<CalendarClock size={22} />}
          onClick={() => navigate('/mi-agente')}
        />
      </div>

      <Card style={{ marginBottom: '24px', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '18px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '22px' }}>
          <div>
            <p className="page-kicker">Que hago hoy</p>
            <h2 className="page-title" style={{ fontSize: '34px', marginTop: '8px' }}>Tres acciones para mover el negocio</h2>
            <p className="page-subtitle" style={{ marginTop: '8px' }}>
              Soe prioriza por bloqueo, fecha, etapa y velocidad de avance.
            </p>
          </div>
          <Button onClick={() => continueToNextAction(navigate)}>
            {nextAction.label} <ArrowRight size={16} />
          </Button>
        </div>

        <div className="section-grid-2" style={{ alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: '10px' }}>
            {todayPlan.topTasks.length === 0 ? (
              <EmptyState title="No hay tareas pendientes" description="Tu siguiente ciclo se activara cuando agregues nuevas prioridades." />
            ) : (
              todayPlan.topTasks.map((task, index) => (
                <button
                  key={task.id}
                  onClick={() => navigate('/ruta', { state: { focusTaskId: task.id, source: 'today-plan' } })}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '34px 1fr auto',
                    gap: '12px',
                    alignItems: 'center',
                    padding: '14px',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    background: index === 0 ? 'var(--primary-light)' : '#fff',
                    textAlign: 'left',
                  }}
                >
                  <span className="display-font" style={{ color: 'var(--primary)', fontSize: '24px', lineHeight: 1 }}>
                    {index + 1}
                  </span>
                  <span>
                    <span style={{ display: 'block', fontWeight: 800 }}>{task.title}</span>
                    <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px' }}>
                      {task.scoreBreakdown?.length ? task.scoreBreakdown.join(' / ') : `${task.priority} prioridad`}
                    </span>
                  </span>
                  <Badge tone={task.status === 'bloqueado' ? 'warning' : task.documentStatus === 'Pendiente' ? 'info' : 'neutral'}>
                    {task.status === 'bloqueado' ? 'Bloqueo' : task.documentStatus === 'Pendiente' ? 'Documento' : 'Accion'}
                  </Badge>
                </button>
              ))
            )}
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ padding: '15px', borderRadius: '16px', border: '1px solid var(--border)', background: todayPlan.blocker ? '#fffaf0' : 'var(--bg-panel)' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                <AlertTriangle size={16} /> Bloqueo principal
              </p>
              <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
                {todayPlan.blocker ? todayPlan.blocker.title : 'No hay bloqueos activos hoy.'}
              </p>
            </div>
            <div style={{ padding: '15px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--bg-panel)' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                <Target size={16} /> Oportunidad recomendada
              </p>
              <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
                {todayPlan.recommendedOpportunity?.title || 'Sin recomendacion activa por ahora.'}
              </p>
            </div>
            <div style={{ padding: '15px', borderRadius: '16px', border: '1px solid var(--border)', background: todayPlan.missingDocument ? 'var(--mint-soft)' : 'var(--bg-panel)' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                <FileText size={16} /> Documento faltante
              </p>
              <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
                {todayPlan.missingDocument
                  ? `${todayPlan.missingDocument.documentRequirement?.docType} para ${todayPlan.missingDocument.title}`
                  : 'No hay documentos obligatorios pendientes.'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="section-grid-2" style={{ marginBottom: '20px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'center', marginBottom: '18px' }}>
            <h2 className="page-kicker">Tareas de esta semana</h2>
            <Button variant="ghost" onClick={() => navigate('/ruta')} style={{ minHeight: '34px', padding: '7px 10px' }}>
              Ver plan
            </Button>
          </div>
          {weeklyTasks.length === 0 ? (
            <EmptyState title="Sin tareas pendientes" description="Tu plan queda listo para el siguiente ciclo." />
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {weeklyTasks.map((task) => {
                const done = task.status === 'completado';
                return (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task)}
                    disabled={updatingId === task.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '24px 1fr',
                      gap: '12px',
                      alignItems: 'start',
                      padding: '0 0 13px',
                      borderBottom: '1px solid var(--border)',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        marginTop: '3px',
                        borderRadius: '5px',
                        border: `2px solid ${done ? 'var(--primary)' : 'var(--border-strong)'}`,
                        background: done ? 'var(--primary)' : '#fff',
                        color: '#fff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {done ? <Check size={13} /> : null}
                    </span>
                    <span>
                      <span style={{ display: 'block', fontWeight: 800, color: done ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>{task.title}</span>
                      <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {done ? 'Completada' : task.priority === 'Alta' ? 'Alta prioridad' : 'Vence pronto'}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="page-kicker" style={{ marginBottom: '22px' }}>Estado del negocio</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {health.map((area) => <BusinessBar key={area.label} label={area.label} value={area.value} />)}
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <h2 className="page-kicker">Oportunidades del ecosistema</h2>
          <Button variant="secondary" onClick={() => navigate('/oportunidades')}>Ver oportunidades</Button>
        </div>
        <div style={{ display: 'grid', gap: '0' }}>
          {(compatibleOpps.length ? compatibleOpps : MOCK_OPPORTUNITIES.slice(0, 3)).map((opp) => {
            const applies = opp.stages?.includes(profile?.stage || 'Idea');
            return (
              <button
                key={opp.id}
                onClick={() => navigate('/oportunidades')}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '14px 1fr auto',
                  gap: '14px',
                  alignItems: 'center',
                  padding: '14px 0',
                  borderBottom: '1px solid var(--border)',
                  textAlign: 'left',
                }}
              >
                <Circle size={9} fill="var(--primary)" style={{ color: 'var(--primary)' }} />
                <span>
                  <span style={{ fontWeight: 800 }}>{opp.title}</span>
                  <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {opp.organization} · {opp.deadline === 'Permanente' ? 'Permanente' : `Cierra ${opp.deadline}`}
                  </span>
                </span>
                {applies ? <Badge tone="mint">Aplica para ti</Badge> : <Badge>Revisar</Badge>}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

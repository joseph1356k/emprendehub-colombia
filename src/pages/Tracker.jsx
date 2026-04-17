import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle2, Target, TrendingUp } from 'lucide-react';
import { Badge, Button, Card, EmptyState, PageHeader, StatCard } from '../components/ui';
import { useApp } from '../context/AppContext';

const BADGES = [
  { id: 'first-task', label: 'Primer paso', desc: 'Primera tarea completada', check: ({ completedTasks }) => completedTasks >= 1 },
  { id: 'diagnostic', label: 'Contexto claro', desc: 'Diagnostico completado', check: ({ diagnosticCompleted }) => diagnosticCompleted },
  { id: 'five-tasks', label: 'Ejecutor', desc: 'Cinco tareas completadas', check: ({ completedTasks }) => completedTasks >= 5 },
  { id: 'first-course', label: 'Aprendizaje activo', desc: 'Primer curso iniciado', check: ({ courseProgress }) => Object.values(courseProgress).some((p) => p > 0) },
  { id: 'first-course-done', label: 'Ciclo cerrado', desc: 'Primer curso completado', check: ({ completedCourses }) => completedCourses >= 1 },
  { id: 'saved-opp', label: 'Radar activo', desc: 'Primera oportunidad guardada', check: ({ savedOpportunities }) => savedOpportunities.length >= 1 },
  { id: 'ten-tasks', label: 'Ritmo alto', desc: 'Diez tareas completadas', check: ({ completedTasks }) => completedTasks >= 10 },
  { id: 'biz-profile', label: 'Negocio visible', desc: 'Perfil del negocio creado', check: ({ businessProfile }) => !!businessProfile },
];

const HEALTH_METRICS = [
  { label: 'Formalizacion', tasks: ['Registrar RUT en DIAN', 'Crear empresa (SAS o Persona Natural)', 'Registro en Camara de Comercio'] },
  { label: 'Producto', tasks: ['Definir propuesta de valor', 'Construir o definir MVP', 'Realizar 10 entrevistas de usuario'] },
  { label: 'Mercadeo', tasks: ['Definir buyer persona', 'Crear perfiles en redes sociales', 'Definir canales de adquisicion'] },
  { label: 'Financiero', tasks: ['Definir modelo de ingresos', 'Armar proyecciones financieras basicas'] },
];

export default function Tracker() {
  const {
    diagnosticCompleted,
    tasks,
    completedTasks,
    progressPercent,
    completedCourses,
    savedOpportunities,
    courseProgress,
    businessProfile,
    activityEvents,
    points,
    level,
    levelNum,
    nextLevelPoints,
    levelProgress,
  } = useApp();
  const navigate = useNavigate();

  const earnedBadges = BADGES.filter((badge) =>
    badge.check({ completedTasks, diagnosticCompleted, courseProgress, completedCourses, savedOpportunities, businessProfile })
  );

  const healthScores = HEALTH_METRICS.map((metric) => {
    const relevant = tasks.filter((task) => metric.tasks.includes(task.title));
    const done = relevant.filter((task) => task.status === 'completado').length;
    const pct = relevant.length > 0 ? Math.round((done / relevant.length) * 100) : 0;
    return { ...metric, pct, done, total: relevant.length };
  });

  const overallHealth = healthScores.length > 0 ? Math.round(healthScores.reduce((acc, score) => acc + score.pct, 0) / healthScores.length) : 0;

  return (
    <div className="page-shell animate-fade-in">
      <PageHeader
        kicker="Progreso"
        title="Seguimiento"
        subtitle="Tu avance del mes, puntos, logros y actividad reciente dentro de Soe."
      />

      <div className="section-grid-3" style={{ marginBottom: '22px' }}>
        <StatCard value={points} label={`Nivel ${levelNum}: ${level}`} helper={`${levelProgress}% hacia el siguiente nivel`} />
        <StatCard value={`${progressPercent}%`} label="Plan de accion" helper={`${completedTasks} tareas completadas`} icon={<TrendingUp size={22} />} onClick={() => navigate('/ruta')} />
        <StatCard value={overallHealth} label="Estado del negocio" helper="Promedio de areas clave" tone={overallHealth >= 70 ? 'success' : 'warning'} />
      </div>

      <Card style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', marginBottom: '10px' }}>
          <p style={{ fontWeight: 800 }}>Progreso al siguiente nivel</p>
          <p style={{ color: 'var(--primary)', fontWeight: 800 }}>{levelProgress}%</p>
        </div>
        <div className="progress-bg">
          <div className="progress-fill" style={{ width: `${levelProgress}%` }} />
        </div>
        <p style={{ marginTop: '10px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          {nextLevelPoints - points > 0 ? `Faltan ${nextLevelPoints - points} puntos para el siguiente nivel.` : 'Nivel maximo alcanzado.'}
        </p>
      </Card>

      <div className="section-grid-2" style={{ marginBottom: '22px' }}>
        <Card>
          <h2 className="page-kicker" style={{ marginBottom: '18px' }}>Areas del negocio</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {healthScores.map((score) => (
              <div key={score.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 800 }}>{score.label}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 700 }}>{score.done}/{score.total}</span>
                </div>
                <div className="progress-bg">
                  <div className="progress-fill" style={{ width: `${score.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="page-kicker" style={{ marginBottom: '18px' }}>Logros ({earnedBadges.length}/{BADGES.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
            {BADGES.map((badge) => {
              const earned = earnedBadges.some((item) => item.id === badge.id);
              return (
                <div key={badge.id} style={{ padding: '14px', borderRadius: '16px', border: '1px solid var(--border)', background: earned ? 'var(--mint-soft)' : 'var(--bg-panel)', opacity: earned ? 1 : 0.62 }}>
                  <Badge tone={earned ? 'mint' : 'neutral'}>{earned ? 'Activo' : 'Pendiente'}</Badge>
                  <p style={{ fontWeight: 800, marginTop: '10px' }}>{badge.label}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{badge.desc}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="section-grid-3" style={{ marginBottom: '22px' }}>
        <StatCard value={completedTasks} label="Tareas" helper="Acciones cerradas" icon={<CheckCircle2 size={22} />} onClick={() => navigate('/ruta')} />
        <StatCard value={completedCourses} label="Biblioteca" helper="Cursos completados" icon={<BookOpen size={22} />} onClick={() => navigate('/cursos')} />
        <StatCard value={savedOpportunities.length} label="Oportunidades" helper="Guardadas" icon={<Target size={22} />} onClick={() => navigate('/oportunidades')} />
      </div>

      <Card>
        <h2 className="page-kicker" style={{ marginBottom: '16px' }}>Actividad reciente</h2>
        {activityEvents.length === 0 ? (
          <EmptyState
            title="Aun no hay actividad"
            description="Completa el diagnostico o una tarea para construir tu historial."
            action={<Button onClick={() => navigate('/diagnostico')}>Hacer diagnostico</Button>}
          />
        ) : (
          <div style={{ display: 'grid', gap: 0 }}>
            {activityEvents.slice(0, 15).map((event, index) => (
              <div key={event.id} style={{ padding: '14px 0', borderBottom: index < activityEvents.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <p style={{ fontWeight: 800 }}>{event.description}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '3px' }}>
                  {new Date(event.created_at || event.timestamp).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

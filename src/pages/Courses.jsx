import React, { useMemo, useState } from 'react';
import { CheckCircle2, Play, RotateCcw, X } from 'lucide-react';
import { Badge, Button, Card, EmptyState, PageHeader, StatCard } from '../components/ui';
import { useApp } from '../context/AppContext';
import { MOCK_COURSES } from '../data/mockData';

const TABS = [
  ['todos', 'Todo'],
  ['recomendados', 'Para mi etapa'],
  ['progreso', 'En curso'],
  ['completados', 'Completados'],
];

export default function Courses() {
  const { courseProgress, updateCourseProgress, completedCourses, profile } = useApp();
  const [activeTab, setActiveTab] = useState('todos');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [starting, setStarting] = useState(null);

  const userStage = profile?.stage;

  const coursesWithProgress = useMemo(
    () =>
      MOCK_COURSES.map((course) => {
        const progress = courseProgress[course.id] || 0;
        return {
          ...course,
          progress,
          isCompleted: progress >= 100,
          isStarted: progress > 0,
        };
      }),
    [courseProgress]
  );

  const filtered = coursesWithProgress.filter((course) => {
    if (activeTab === 'progreso') return course.isStarted && !course.isCompleted;
    if (activeTab === 'completados') return course.isCompleted;
    if (activeTab === 'recomendados') return course.stages && userStage && course.stages.includes(userStage);
    return true;
  });

  const totalStarted = coursesWithProgress.filter((course) => course.isStarted).length;

  const handleStart = async (course) => {
    setStarting(course.id);
    const next = course.isCompleted ? 0 : Math.min(100, (courseProgress[course.id] || 0) + 25);
    await updateCourseProgress(course.id, next);
    setStarting(null);
    setSelectedCourse(null);
  };

  return (
    <div className="page-shell animate-fade-in">
      <PageHeader
        kicker="Biblioteca"
        title="Criterio para decidir mejor"
        subtitle="Piezas cortas para fortalecer las decisiones del plan, no una escuela paralela."
      />

      <div className="section-grid-3" style={{ marginBottom: '22px' }}>
        <StatCard value={completedCourses} label="Completados" helper="Ciclos cerrados" />
        <StatCard value={totalStarted} label="En curso" helper="Material activo" />
        <StatCard value={MOCK_COURSES.length} label="Biblioteca" helper="Recursos disponibles" />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
        {TABS.map(([value, label]) => (
          <button
            key={value}
            className={`topbar-tab ${activeTab === value ? 'active' : ''}`}
            onClick={() => setActiveTab(value)}
            style={{ border: '1px solid var(--border)', background: activeTab === value ? 'var(--primary-light)' : '#fff' }}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState title="Sin recursos en esta vista" description="Cambia el filtro o vuelve cuando tu plan tenga nuevas prioridades." />
        </Card>
      ) : (
        <div className="section-grid-3">
          {filtered.map((course, index) => (
            <Card key={course.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px' }}>
                <span className="display-font" style={{ color: '#dedbee', fontSize: '42px', lineHeight: 1 }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                {course.isCompleted ? <Badge tone="mint">Completado</Badge> : <Badge tone="info">{course.level}</Badge>}
              </div>

              <div>
                <Badge tone="neutral">{course.category}</Badge>
                <h2 style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.25, marginTop: '12px' }}>{course.title}</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '10px' }}>{course.description}</p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 700 }}>{course.duration}</span>
                  <span style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: 800 }}>{course.progress}%</span>
                </div>
                <div className="progress-bg" style={{ height: '7px' }}>
                  <div className="progress-fill" style={{ width: `${course.progress}%` }} />
                </div>
              </div>

              <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', marginTop: 'auto' }}>{course.instructor}</p>

              <Button onClick={() => setSelectedCourse(course)} disabled={starting === course.id}>
                {starting === course.id ? (
                  'Actualizando...'
                ) : course.isCompleted ? (
                  <>
                    <RotateCcw size={15} /> Revisar
                  </>
                ) : course.isStarted ? (
                  <>
                    <Play size={15} /> Continuar
                  </>
                ) : (
                  <>
                    <Play size={15} /> Iniciar
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>
      )}

      {selectedCourse ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 240,
            display: 'grid',
            placeItems: 'center',
            padding: '20px',
            background: 'rgba(55, 47, 100, 0.24)',
          }}
          onClick={() => setSelectedCourse(null)}
        >
          <Card style={{ width: '100%', maxWidth: '560px', padding: '28px' }} onClick={(event) => event.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
              <div>
                <Badge tone={selectedCourse.isCompleted ? 'mint' : 'info'}>{selectedCourse.category}</Badge>
                <h2 className="page-title" style={{ fontSize: '32px', marginTop: '12px' }}>{selectedCourse.title}</h2>
              </div>
              <button className="btn-ghost" onClick={() => setSelectedCourse(null)} aria-label="Cerrar recurso">
                <X size={18} />
              </button>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '20px' }}>{selectedCourse.description}</p>
            <div className="section-grid-2" style={{ marginBottom: '22px' }}>
              {[
                ['Duracion', selectedCourse.duration],
                ['Lecciones', `${selectedCourse.lessons}`],
                ['Nivel', selectedCourse.level],
                ['Progreso', `${selectedCourse.progress}%`],
              ].map(([label, value]) => (
                <div key={label} style={{ padding: '14px', borderRadius: '16px', background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
                  <p className="page-kicker">{label}</p>
                  <p style={{ fontWeight: 800, marginTop: '5px' }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Button variant="secondary" onClick={() => setSelectedCourse(null)}>Cerrar</Button>
              <Button onClick={() => handleStart(selectedCourse)} disabled={starting === selectedCourse.id}>
                {selectedCourse.isCompleted ? (
                  <>
                    <CheckCircle2 size={15} /> Reiniciar progreso
                  </>
                ) : (
                  <>
                    <Play size={15} /> Avanzar 25%
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

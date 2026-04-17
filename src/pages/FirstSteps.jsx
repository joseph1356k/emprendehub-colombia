import React, { useMemo, useState } from 'react';
import { Check, ExternalLink } from 'lucide-react';
import { Badge, Button, Card, EmptyState, PageHeader } from '../components/ui';
import { useApp } from '../context/AppContext';
import { spanishText } from '../utils/spanishText';

const FIRST_STEPS_SECTIONS = ['Formalización', 'Formalizacion', 'Producto / Servicio', 'Financiero', 'Mercadeo'];

const STEP_INFO = {
  'Registrar RUT en DIAN': { url: 'https://www.dian.gov.co/', tip: 'Trámite base para ordenar obligaciones y facturacion.' },
  'Crear empresa (SAS o Persona Natural)': { url: 'https://www.ccb.org.co/', tip: 'Define figura jurídica según riesgo, socios y operación.' },
  'Registro en Cámara de Comercio': { url: 'https://www.ccb.org.co/', tip: 'Da identidad legal al negocio y habilita procesos comerciales.' },
  'Abrir cuenta bancaria empresarial': { tip: 'Separa finanzas personales y operativas desde el primer ciclo.' },
  'Definir propuesta de valor': { tip: 'Resume cliente, problema, resultado y diferencia concreta.' },
  'Construir o definir MVP': { tip: 'Valida la hipótesis central con el menor esfuerzo posible.' },
  'Realizar 10 entrevistas de usuario': { tip: 'Usa preguntas abiertas y documenta comportamientos reales.' },
  'Iterar producto con feedback recibido': { tip: 'Cada ajuste debe responder a una señal del mercado.' },
  'Definir modelo de ingresos': { tip: 'Aterriza como entra dinero, recurrencia, margen y cobro.' },
  'Armar proyecciones financieras básicas': { tip: 'Proyecta ingresos, costos y caja para tomar decisiones.' },
  'Calcular punto de equilibrio': { tip: 'Identifica el volumen mínimo para no operar a ciegas.' },
  'Definir buyer persona': { tip: 'Define quién compra, quién decide y qué objeciones aparecen.' },
  'Crear perfiles en redes sociales': { tip: 'Elige pocos canales y mide conversaciones, no solo alcance.' },
  'Definir canales de adquisición': { tip: 'Prueba canales con criterio de costo, velocidad y conversión.' },
  'Diseñar identidad de marca básica': { tip: 'Asegura consistencia mínima para vender con claridad.' },
};

export default function FirstSteps() {
  const { tasks, updateTask, progressPercent, completedTasks, totalTasks } = useApp();
  const [updatingId, setUpdatingId] = useState(null);

  const sectionTasks = useMemo(() => {
    return FIRST_STEPS_SECTIONS.reduce((acc, section) => {
      acc[section] = tasks.filter((task) => task.section === section);
      return acc;
    }, {});
  }, [tasks]);

  const handleCheck = async (task) => {
    setUpdatingId(task.id);
    await updateTask(task.id, task.status === 'completado' ? 'pendiente' : 'completado');
    setUpdatingId(null);
  };

  const visibleSections = FIRST_STEPS_SECTIONS.filter((section) => sectionTasks[section]?.length);

  return (
    <div className="page-shell animate-fade-in">
      <PageHeader
        kicker="Base operativa"
        title="Primeros pasos"
        subtitle="Acciónes fundacionales que conviene conservar porque destraban la estructura mínima del negocio."
      />

      <Card style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', marginBottom: '10px' }}>
          <p style={{ fontWeight: 800 }}>Avance de base</p>
          <p style={{ color: 'var(--primary)', fontWeight: 800 }}>{completedTasks}/{totalTasks} tareas</p>
        </div>
        <div className="progress-bg">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </Card>

      {visibleSections.length === 0 ? (
        <Card>
          <EmptyState title="Sin tareas base" description="El plan principal tomará prioridad cuando exista diagnóstico." />
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: '18px' }}>
          {visibleSections.map((section) => {
            const items = sectionTasks[section];
            const completed = items.filter((task) => task.status === 'completado').length;
            const pct = Math.round((completed / items.length) * 100);

            return (
              <Card key={section}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <p className="page-kicker">{spanishText(section)}</p>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '5px' }}>{completed}/{items.length} cerradas</h2>
                  </div>
                  <Badge tone={pct === 100 ? 'mint' : 'info'}>{pct}%</Badge>
                </div>

                {items.map((task, index) => {
                  const done = task.status === 'completado';
                  const displayTitle = spanishText(task.title);
                  const info = STEP_INFO[task.title] || STEP_INFO[displayTitle] || {};
                  return (
                    <div
                      key={task.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '28px minmax(0, 1fr) auto',
                        gap: '12px',
                        padding: '15px 0',
                        borderBottom: index < items.length - 1 ? '1px solid var(--border)' : 'none',
                        alignItems: 'start',
                      }}
                    >
                      <button
                        onClick={() => handleCheck(task)}
                        disabled={updatingId === task.id}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '5px',
                          border: `2px solid ${done ? 'var(--primary)' : 'var(--border-strong)'}`,
                          background: done ? 'var(--primary)' : '#fff',
                          color: '#fff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '3px',
                        }}
                      >
                        {done ? <Check size={13} /> : null}
                      </button>
                      <div>
                        <p style={{ fontWeight: 800, color: done ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>{displayTitle}</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '3px' }}>{info.tip || 'Acción recomendada para ordenar el negocio.'}</p>
                        {info.url ? (
                          <a
                            href={info.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--primary)', fontSize: '13px', fontWeight: 800, marginTop: '8px' }}
                          >
                            Ver recurso <ExternalLink size={12} />
                          </a>
                        ) : null}
                      </div>
                      <Badge tone={task.priority === 'Alta' ? 'warning' : 'neutral'}>{task.priority}</Badge>
                    </div>
                  );
                })}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

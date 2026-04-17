import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Check, FileText, Lock, Upload, Wand2, X } from 'lucide-react';
import { Badge, Button, Card, EmptyState, PageHeader } from '../components/ui';
import { useApp } from '../context/AppContext';
import { spanishText } from '../utils/spanishText';

const STATUS_TONE = {
  completado: 'success',
  'en progreso': 'info',
  pendiente: 'neutral',
  bloqueado: 'warning',
};

const STATUS_LABEL = {
  completado: 'Completada',
  'en progreso': 'En progreso',
  pendiente: 'Pendiente',
  bloqueado: 'Bloqueada',
};

function TaskDetailModal({ task, onClose }) {
  const { updateTask, getTaskDocumentStatus, uploadTaskDocument, generateTaskTemplate } = useApp();
  const [working, setWorking] = useState(false);

  if (!task) return null;

  const docState = getTaskDocumentStatus(task);
  const nextStatus =
    task.status === 'completado'
      ? 'pendiente'
      : task.status === 'pendiente' || task.status === 'bloqueado'
      ? 'en progreso'
      : 'completado';
  const unblockText =
    docState.required && docState.status !== 'Subido'
      ? `Para desbloquearla, registra el ${docState.requirement.docType} o genera una plantilla para empezar.`
      : 'Para desbloquearla, cambia el estado a en progreso y define la siguiente acción concreta.';

  const run = async (fn) => {
    setWorking(true);
    await fn();
    setWorking(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 260,
        display: 'grid',
        placeItems: 'center',
        padding: '20px',
        background: 'rgba(55, 47, 100, 0.24)',
      }}
      onClick={onClose}
    >
      <Card style={{ width: '100%', maxWidth: '640px', padding: '26px' }} onClick={(event) => event.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '18px' }}>
          <div>
            <Badge tone={STATUS_TONE[task.status] || 'neutral'}>{STATUS_LABEL[task.status] || task.status}</Badge>
            <h2 className="page-title" style={{ fontSize: '30px', marginTop: '12px' }}>{spanishText(task.title)}</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>{spanishText(task.section)} · Prioridad {task.priority}</p>
          </div>
          <button className="btn-ghost" onClick={onClose} aria-label="Cerrar detalle">
            <X size={18} />
          </button>
        </div>

        {task.status === 'bloqueado' ? (
          <div style={{ display: 'flex', gap: '10px', padding: '14px', borderRadius: '16px', border: '1px solid #efd8a7', background: '#fffaf0', marginBottom: '16px' }}>
            <Lock size={18} style={{ color: '#8a6730', flexShrink: 0 }} />
            <div>
              <p style={{ color: '#8a6730', fontSize: '14px', fontWeight: 800 }}>Esta tarea está bloqueada.</p>
              <p style={{ color: '#8a6730', fontSize: '14px', marginTop: '4px' }}>{unblockText}</p>
            </div>
          </div>
        ) : null}

        <Card style={{ padding: '16px', background: 'var(--bg-panel)', marginBottom: '16px', boxShadow: 'none' }}>
          <p className="page-kicker" style={{ marginBottom: '10px' }}>Documento asociado</p>
          {docState.required ? (
            <>
              <p style={{ fontWeight: 800 }}>{docState.requirement.docType}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '4px 0 14px' }}>Estado: {docState.status}</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Button onClick={() => run(() => uploadTaskDocument(task, {
                  name: `${docState.requirement.docType} - ${new Date().toISOString().slice(0, 10)}`,
                  fileType: 'PDF',
                  sizeBytes: 210000,
                }))} disabled={working}>
                  <Upload size={15} /> Subir documento
                </Button>
                <Button variant="secondary" onClick={() => run(() => generateTaskTemplate(task))} disabled={working}>
                  <Wand2 size={15} /> Generar plantilla
                </Button>
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Esta tarea no exige documento obligatorio.</p>
          )}
        </Card>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={onClose}>Cerrar</Button>
          <Button onClick={() => run(() => updateTask(task.id, nextStatus))} disabled={working}>
            <FileText size={15} /> Cambiar a {STATUS_LABEL[nextStatus].toLowerCase()}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function TaskItem({ task, onToggle, onOpen, busy }) {
  const done = task.status === 'completado';
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '28px minmax(0, 1fr) auto',
        gap: '12px',
        alignItems: 'center',
        padding: '16px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <button
        onClick={() => onToggle(task)}
        disabled={busy}
        aria-label={done ? 'Marcar pendiente' : 'Marcar completada'}
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
        }}
      >
        {done ? <Check size={14} /> : null}
      </button>
      <button onClick={() => onOpen(task)} style={{ textAlign: 'left', minWidth: 0 }}>
        <p style={{ fontWeight: 800, color: done ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>{spanishText(task.title)}</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{spanishText(task.section)} · Prioridad {task.priority}</p>
      </button>
      <Badge tone={STATUS_TONE[task.status] || 'neutral'}>{STATUS_LABEL[task.status] || task.status}</Badge>
    </div>
  );
}

export default function Roadmap() {
  const { tasks, progressPercent, completedTasks, totalTasks, profile, updateTask } = useApp();
  const location = useLocation();
  const [selectedTaskId, setSelectedTaskId] = useState(() => location.state?.focusTaskId || null);
  const [busyId, setBusyId] = useState(null);

  const grouped = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.section]) acc[task.section] = [];
      acc[task.section].push(task);
      return acc;
    }, {});
  }, [tasks]);

  const selectedTask = useMemo(
    () => tasks.find((item) => item.id === selectedTaskId) || null,
    [selectedTaskId, tasks]
  );

  const toggleTask = async (task) => {
    setBusyId(task.id);
    await updateTask(task.id, task.status === 'completado' ? 'pendiente' : 'completado');
    setBusyId(null);
  };

  return (
    <div className="page-shell animate-fade-in">
      <PageHeader
        kicker="Plan de acción"
        title="Mis tareas"
        subtitle={`Etapa actual: ${profile?.stage || 'Idea'}. Semana del ciclo activo con prioridades, documentos y estados.`}
      />

      <Card style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', marginBottom: '10px' }}>
          <p style={{ fontWeight: 800 }}>Progreso del plan</p>
          <p style={{ color: 'var(--primary)', fontWeight: 800 }}>{completedTasks}/{totalTasks} tareas</p>
        </div>
        <div className="progress-bg">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </Card>

      {tasks.length === 0 ? (
        <Card>
          <EmptyState title="Aún no hay tareas" description="Cuando completes el diagnóstico, SOE generará tu plan de acción." />
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: '18px' }}>
          {Object.entries(grouped).map(([section, sectionTasks]) => {
            const done = sectionTasks.filter((task) => task.status === 'completado').length;
            return (
              <Card key={section} style={{ padding: '22px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'center', marginBottom: '4px' }}>
                  <div>
                    <p className="page-kicker">{spanishText(section)}</p>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '5px' }}>{done}/{sectionTasks.length} completadas</h2>
                  </div>
                  <Badge tone={done === sectionTasks.length ? 'success' : 'info'}>{Math.round((done / sectionTasks.length) * 100)}%</Badge>
                </div>
                {sectionTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onOpen={(item) => setSelectedTaskId(item.id)}
                    busy={busyId === task.id}
                  />
                ))}
              </Card>
            );
          })}
        </div>
      )}

      <TaskDetailModal task={selectedTask} onClose={() => setSelectedTaskId(null)} />
    </div>
  );
}

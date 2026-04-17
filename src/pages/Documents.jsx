import React, { useMemo, useState } from 'react';
import { FolderOpen, Upload, Wand2, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TASK_DOCUMENT_RULES } from '../data/mockData';
import PageHeader from '../components/PageHeader';

export default function Documents() {
  const { tasks, documents, uploadTaskDocument, generateTaskTemplate } = useApp();
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [working, setWorking] = useState(false);

  const requiredTasks = useMemo(() => tasks.filter((task) => TASK_DOCUMENT_RULES[task.title]), [tasks]);

  const selectedTask = requiredTasks.find((task) => task.id === selectedTaskId) || requiredTasks[0];

  const createUpload = async () => {
    if (!selectedTask) return;
    setWorking(true);
    const rule = TASK_DOCUMENT_RULES[selectedTask.title];
    await uploadTaskDocument(selectedTask, {
      name: `${rule.docType} - ${new Date().toISOString().slice(0, 10)}`,
      fileType: 'PDF',
      sizeBytes: 180000,
    });
    setWorking(false);
  };

  const createTemplate = async () => {
    if (!selectedTask) return;
    setWorking(true);
    await generateTaskTemplate(selectedTask);
    setWorking(false);
  };

  return (
    <div className="page-shell animate-fade-in">
      <PageHeader
        kicker="Archivo"
        title="Documentos"
        subtitle="Documentos conectados con tareas clave del plan de accion."
        action={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select className="form-input" value={selectedTaskId} onChange={(event) => setSelectedTaskId(event.target.value)} style={{ minWidth: '280px' }}>
              {requiredTasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
            <button className="btn btn-secondary" onClick={createTemplate} disabled={!selectedTask || working} style={{ gap: '6px' }}>
              <Wand2 size={14} /> Generar plantilla
            </button>
            <button className="btn btn-primary" onClick={createUpload} disabled={!selectedTask || working} style={{ gap: '6px' }}>
              <Upload size={14} /> Subir documento
            </button>
          </div>
        }
      />

      <div className="card" style={{ padding: '16px', marginBottom: '16px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#065f46' }}>
          Subir documento actualiza automaticamente: estado de tarea, progreso general y timeline.
        </p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {documents.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <FolderOpen size={36} style={{ marginBottom: '10px' }} />
            <p style={{ fontWeight: 700 }}>Aun no hay documentos registrados</p>
            <p style={{ fontSize: '13px' }}>Usa "Subir documento" o "Generar plantilla" para comenzar.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Documento', 'Categoria', 'Estado', 'Tipo', 'Relacionado'].map((header) => (
                  <th key={header} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => {
                const relatedTask = tasks.find((task) => doc.storage_path?.includes(task.id));
                const isDone = doc.status === 'Listo';
                return (
                  <tr key={doc.id} style={{ borderBottom: index < documents.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={14} style={{ color: '#334155' }} />
                        </div>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 700 }}>{doc.name}</p>
                          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{new Date(doc.created_at).toLocaleDateString('es-CO')}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{doc.category}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge ${isDone ? 'badge-success' : 'badge-warning'}`}>
                        {isDone ? <CheckCircle2 size={12} /> : null} {doc.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{doc.file_type || 'N/A'}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>{relatedTask ? relatedTask.title : 'General'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

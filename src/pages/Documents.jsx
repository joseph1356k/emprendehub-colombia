import React, { useMemo, useState } from 'react';
import { CheckCircle2, FileText, FolderOpen, Upload, Wand2 } from 'lucide-react';
import { Badge, Button, Card, EmptyState, PageHeader } from '../components/ui';
import { useApp } from '../context/AppContext';
import { TASK_DOCUMENT_RULES } from '../data/mockData';
import { spanishText } from '../utils/spanishText';

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
        subtitle="Plantillas y archivos conectados con el plan de acción. Cada documento debe destrabar una tarea concreta."
        action={
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              className="form-input"
              value={selectedTaskId}
              onChange={(event) => setSelectedTaskId(event.target.value)}
              style={{ width: 'min(360px, 100%)' }}
              disabled={requiredTasks.length === 0}
            >
              {requiredTasks.length === 0 ? <option>Sin tareas documentales</option> : null}
              {requiredTasks.map((task) => (
                <option key={task.id} value={task.id}>{spanishText(task.title)}</option>
              ))}
            </select>
            <Button variant="secondary" onClick={createTemplate} disabled={!selectedTask || working}>
              <Wand2 size={15} /> Generar plantilla
            </Button>
            <Button onClick={createUpload} disabled={!selectedTask || working}>
              <Upload size={15} /> Subir documento
            </Button>
          </div>
        }
      />

      <Card style={{ marginBottom: '18px', background: 'var(--mint-soft)', borderColor: 'var(--mint)' }}>
        <p style={{ color: 'var(--status-success)', fontWeight: 800 }}>
          Subir un documento actualiza la tarea asociada, el progreso del plan y la actividad reciente.
        </p>
      </Card>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {documents.length === 0 ? (
          <EmptyState
            icon={<FolderOpen size={34} />}
            title="Aún no hay documentos registrados"
            description="Genera una plantilla o sube el primer archivo asociado al plan."
          />
        ) : (
          <div className="table-shell">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border)' }}>
                  {['Documento', 'Categoría', 'Estado', 'Tipo', 'Relacionado'].map((header) => (
                    <th key={header} style={{ padding: '16px 18px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
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
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText size={16} />
                          </span>
                          <span>
                            <span style={{ display: 'block', fontWeight: 800 }}>{doc.name}</span>
                            <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px' }}>
                              {new Date(doc.created_at).toLocaleDateString('es-CO')}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 18px', color: 'var(--text-secondary)' }}>{doc.category}</td>
                      <td style={{ padding: '16px 18px' }}>
                        <Badge tone={isDone ? 'mint' : 'warning'}>{isDone ? <CheckCircle2 size={12} /> : null} {doc.status}</Badge>
                      </td>
                      <td style={{ padding: '16px 18px', color: 'var(--text-secondary)' }}>{doc.file_type || 'N/A'}</td>
                      <td style={{ padding: '16px 18px', color: 'var(--text-secondary)' }}>{relatedTask ? spanishText(relatedTask.title) : 'General'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

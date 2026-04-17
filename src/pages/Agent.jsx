import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, Send, SquareCheckBig, XCircle } from 'lucide-react';
import { Badge, Button, Card } from '../components/ui';
import { useApp } from '../context/AppContext';
import { spanishText } from '../utils/spanishText';

const QUICK_REPLIES = [
  '¿Qué debería hacer hoy?',
  'Ayúdame a destrabar ventas',
  'Qué tarea puedo cerrar en una hora',
  'Qué documento me falta',
];

function Bubble({ role, children, time }) {
  const isUser = role === 'user';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        gap: '12px',
        alignItems: 'flex-end',
      }}
    >
      {!isUser ? <div className="avatar" style={{ background: 'var(--primary)', color: '#fff' }}>S</div> : null}
      <div style={{ maxWidth: '72%' }}>
        <div
          style={{
            padding: '18px 20px',
            borderRadius: '18px',
            border: isUser ? '1px solid var(--primary)' : '1px solid var(--border-strong)',
            background: isUser ? 'var(--primary)' : '#fff',
            color: isUser ? '#fff' : 'var(--text-primary)',
            boxShadow: isUser ? 'none' : 'var(--shadow-sm)',
            lineHeight: 1.7,
            fontWeight: isUser ? 700 : 500,
            whiteSpace: 'pre-wrap',
          }}
        >
          {children}
        </div>
        {time ? <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '7px' }}>{time}</p> : null}
      </div>
      {isUser ? <div className="avatar">CG</div> : null}
    </div>
  );
}

function ActionCard({ action, onApply, onIgnore, applied }) {
  return (
    <div
      style={{
        padding: '14px',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        background: '#fff',
        display: 'grid',
        gap: '10px',
      }}
    >
      <div>
        <Badge tone="info">Acción sugerida</Badge>
        <p style={{ fontWeight: 800, marginTop: '8px' }}>{action.label}</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>{action.description}</p>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button onClick={() => onApply(action)} disabled={applied} style={{ minHeight: '36px', padding: '8px 12px' }}>
          <CheckCircle2 size={15} /> {applied ? 'Aplicada' : 'Aplicar'}
        </Button>
        <Button variant="secondary" onClick={() => onIgnore(action)} disabled={applied} style={{ minHeight: '36px', padding: '8px 12px' }}>
          <XCircle size={15} /> Ignorar
        </Button>
      </div>
    </div>
  );
}

export default function Agent() {
  const {
    profile,
    todayPlan,
    progressPercent,
    continueToNextAction,
    agentMessages,
    askAgent,
    applyAgentAction,
  } = useApp();
  const navigate = useNavigate();
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [appliedActions, setAppliedActions] = useState([]);

  const firstName = profile?.full_name?.split(' ')[0] || 'Carlos';
  const urgentTask = spanishText(todayPlan.topTasks[0]?.title) || 'definir la siguiente prioridad';
  const recommendedOpportunity = todayPlan.recommendedOpportunity;

  const initialMessage = useMemo(
    () => ({
      id: 'initial',
      role: 'assistant',
      content: `Hola ${firstName}. Tengo tu diagnóstico, tareas y avance del mes como contexto.\n\nLa prioridad más útil ahora parece ser: ${urgentTask}. Si quieres, puedo ayudarte a convertirla en el siguiente paso concreto o proponerte una acción para aprobar.`,
      actions: [
        {
          id: 'initial-route',
          type: 'open_route',
          label: 'Abrir prioridad',
          description: 'Ir al plan de acción y trabajar sobre la tarea más importante.',
          payload: { route: '/ruta', taskId: todayPlan.topTasks[0]?.id || null },
        },
      ],
      created_at: new Date().toISOString(),
    }),
    [firstName, todayPlan.topTasks, urgentTask]
  );

  const visibleMessages = agentMessages.length ? agentMessages : [initialMessage];

  const respond = async (text) => {
    const clean = text.trim();
    if (!clean || sending) return;
    setSending(true);
    setDraft('');
    await askAgent(clean);
    setSending(false);
  };

  const applyAction = async (action) => {
    await applyAgentAction(action, navigate);
    setAppliedActions((current) => [...current, action.id]);
  };

  const ignoreAction = (action) => {
    setAppliedActions((current) => [...current, action.id]);
  };

  return (
    <div className="page-shell-wide animate-fade-in">
      <div className="agent-grid">
        <section style={{ minWidth: 0 }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '22px 26px', borderBottom: '1px solid var(--border)', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="avatar" style={{ width: '52px', height: '52px', background: 'var(--primary)', color: '#fff' }}>S</div>
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 800 }}>SOE - tu agente</h1>
                  <p style={{ color: 'var(--status-success)', fontSize: '14px', fontWeight: 700 }}>Conectado a tu contexto</p>
                </div>
              </div>
            </div>

            <div style={{ minHeight: '470px', padding: '28px', display: 'grid', gap: '22px', alignContent: 'start', background: 'var(--bg-panel)' }}>
              {visibleMessages.map((message) => (
                <div key={message.id || `${message.role}-${message.created_at}`} style={{ display: 'grid', gap: '12px' }}>
                  <Bubble role={message.role} time={message.created_at ? new Date(message.created_at).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' }) : null}>
                    {message.content}
                  </Bubble>
                  {message.role === 'assistant' && message.actions?.length ? (
                    <div style={{ marginLeft: '64px', display: 'grid', gap: '10px', maxWidth: '640px' }}>
                      {message.actions.map((action) => (
                        <ActionCard
                          key={action.id}
                          action={action}
                          applied={appliedActions.includes(action.id)}
                          onApply={applyAction}
                          onIgnore={ignoreAction}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              {sending ? (
                <Bubble role="assistant">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Loader2 size={16} style={{ animation: 'spin 820ms linear infinite' }} /> SOE está revisando tu contexto...
                  </span>
                </Bubble>
              ) : null}
            </div>

            <div style={{ padding: '16px 20px 20px', borderTop: '1px solid var(--border)', background: '#fff' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {QUICK_REPLIES.map((reply) => (
                  <button key={reply} className="btn-secondary btn-pill" style={{ minHeight: '34px', padding: '7px 12px', fontSize: '12px' }} onClick={() => respond(reply)}>
                    {reply}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  respond(draft);
                }}
                style={{ display: 'flex', gap: '10px' }}
              >
                <input
                  className="form-input"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Escríbele a SOE..."
                  aria-label="Mensaje para SOE"
                />
                <Button type="submit" aria-label="Enviar mensaje" disabled={sending} style={{ width: '52px', padding: 0 }}>
                  {sending ? <Loader2 size={17} style={{ animation: 'spin 820ms linear infinite' }} /> : <Send size={17} />}
                </Button>
              </form>
            </div>
          </Card>
        </section>

        <aside style={{ display: 'grid', gap: '14px', alignContent: 'start' }}>
          <p className="page-kicker">Contexto activo</p>
          <Card>
            <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '12px' }}>Plan del mes</h2>
            <div className="progress-bg" style={{ marginBottom: '8px' }}>
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <p style={{ color: 'var(--primary)', fontWeight: 800 }}>{progressPercent}% completado</p>
          </Card>
          <Card>
            <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '12px' }}>Tareas esta semana</h2>
            <div style={{ display: 'grid', gap: '9px' }}>
              {todayPlan.topTasks.map((task) => (
                <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', color: 'var(--text-secondary)' }}>
                  <span>{spanishText(task.title)}</span>
                  <span style={{ color: task.priority === 'Alta' ? 'var(--status-error)' : 'var(--status-warning)' }}>●</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '10px' }}>Oportunidad activa</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>
              {recommendedOpportunity?.title || 'Sin oportunidad priorizada por ahora'}
            </p>
            {recommendedOpportunity ? <Badge tone="mint">Aplica para ti</Badge> : null}
          </Card>
          <Card>
            <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px' }}>Próximo comité</h2>
            <p className="display-font" style={{ fontSize: '30px', color: 'var(--primary)' }}>11d</p>
            <p style={{ color: 'var(--text-secondary)' }}>Dirección mensual</p>
          </Card>
          <Button variant="secondary" onClick={() => continueToNextAction(navigate)}>
            <SquareCheckBig size={16} /> Continuar prioridad
          </Button>
        </aside>
      </div>
    </div>
  );
}

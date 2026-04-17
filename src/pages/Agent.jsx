import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, SquareCheckBig } from 'lucide-react';
import { Badge, Button, Card } from '../components/ui';
import { useApp } from '../context/AppContext';

const QUICK_REPLIES = [
  'Ver mis tareas pendientes',
  'No se a quien contactar',
  'Como escribo el mensaje',
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
      <div style={{ maxWidth: '68%' }}>
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

export default function Agent() {
  const { profile, todayPlan, progressPercent, continueToNextAction } = useApp();
  const navigate = useNavigate();
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([]);

  const firstName = profile?.full_name?.split(' ')[0] || 'Carlos';
  const pendingCount = todayPlan.topTasks.length;
  const urgentTask = todayPlan.topTasks[0]?.title || 'definir la siguiente prioridad';
  const recommendedOpportunity = todayPlan.recommendedOpportunity;

  const initialMessage = useMemo(
    () => (
      <>
        Hola {firstName}, buenos dias. Tienes <strong>{pendingCount || 'varias'} tareas pendientes</strong> esta semana.
        La mas urgente es <strong>{urgentTask}</strong>.
        <br /><br />
        Arrancamos con eso o hay algo mas urgente hoy?
      </>
    ),
    [firstName, pendingCount, urgentTask]
  );

  const respond = (text) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: 'user', text: clean },
      {
        id: Date.now() + 1,
        role: 'assistant',
        text:
          clean === 'Ver mis tareas pendientes'
            ? 'Abro tu plan de accion para que revises prioridades, fechas y bloqueos.'
            : 'Perfecto. Antes de darte una estrategia, necesito precisar el contexto: quienes son las personas o clientes que quieres mover esta semana?',
      },
    ]);
    setDraft('');
    if (clean === 'Ver mis tareas pendientes') navigate('/ruta');
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
                  <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Soe - tu agente</h1>
                  <p style={{ color: 'var(--status-success)', fontSize: '14px', fontWeight: 700 }}>En linea ahora</p>
                </div>
              </div>
            </div>

            <div style={{ minHeight: '470px', padding: '28px', display: 'grid', gap: '22px', alignContent: 'start', background: 'var(--bg-panel)' }}>
              <Bubble role="assistant" time="9:02 am">{initialMessage}</Bubble>
              <Button variant="secondary" onClick={() => navigate('/ruta')} style={{ justifySelf: 'start', gap: '8px' }}>
                <SquareCheckBig size={16} /> Ver mis tareas pendientes
              </Button>
              {messages.map((message) => (
                <Bubble key={message.id} role={message.role}>
                  {message.text}
                </Bubble>
              ))}
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
                  placeholder="Escribele a Soe..."
                  aria-label="Mensaje para Soe"
                />
                <Button type="submit" aria-label="Enviar mensaje" style={{ width: '52px', padding: 0 }}>
                  <Send size={17} />
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
                  <span>{task.title}</span>
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
            <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px' }}>Proximo comite</h2>
            <p className="display-font" style={{ fontSize: '30px', color: 'var(--primary)' }}>11d</p>
            <p style={{ color: 'var(--text-secondary)' }}>Direccion mensual</p>
          </Card>
          <Button variant="secondary" onClick={() => continueToNextAction(navigate)}>
            Continuar prioridad
          </Button>
        </aside>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import { Bell, BellOff, CheckCheck, Filter, VolumeX, Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';

const FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: 'important', label: 'Importantes' },
  { id: 'opportunity', label: 'Oportunidades' },
  { id: 'task', label: 'Tareas' },
];

const groupByFilter = (notification) => {
  if (notification.type === 'diagnostic_reminder') return 'important';
  if (notification.type === 'opportunity_match' || notification.type === 'opportunity_deadline') return 'opportunity';
  if (notification.type === 'blocker_task' || notification.type === 'missing_document') return 'task';
  return 'all';
};

export default function Notifications() {
  const {
    notifications,
    mutedNotificationTypes,
    markNotificationRead,
    markAllNotificationsRead,
    muteNotificationType,
    unmuteNotificationType,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return notifications;
    if (activeFilter === 'important') {
      return notifications.filter((item) => groupByFilter(item) === 'important');
    }
    if (activeFilter === 'opportunity') {
      return notifications.filter((item) => groupByFilter(item) === 'opportunity');
    }
    return notifications.filter((item) => groupByFilter(item) === 'task');
  }, [activeFilter, notifications]);

  const groupedMuted = [
    { type: 'opportunity_match', label: 'Nuevas oportunidades' },
    { type: 'opportunity_deadline', label: 'Cierres de convocatorias guardadas' },
    { type: 'blocker_task', label: 'Tareas bloqueadas' },
    { type: 'missing_document', label: 'Documentos faltantes' },
    { type: 'diagnostic_reminder', label: 'Recordatorio de diagnostico' },
  ];

  return (
    <div className="page-shell animate-fade-in">
      <PageHeader
        kicker="Alertas"
        title="Centro de notificaciones"
        subtitle="Solo alertas utiles: maximo 3 notificaciones al dia, agrupadas por tipo."
        action={
          <button className="btn btn-secondary" onClick={markAllNotificationsRead} style={{ gap: '8px' }}>
            <CheckCheck size={15} /> Marcar todo leido
          </button>
        }
      />

      <div className="card" style={{ padding: '16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
          <Filter size={15} style={{ color: 'var(--text-tertiary)' }} />
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              style={{
                padding: '7px 12px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                border: `1px solid ${activeFilter === filter.id ? 'var(--primary)' : 'var(--border)'}`,
                backgroundColor: activeFilter === filter.id ? 'var(--primary-light)' : 'white',
                color: activeFilter === filter.id ? 'var(--primary-dark)' : 'var(--text-secondary)',
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {groupedMuted.map((item) => {
            const muted = mutedNotificationTypes.includes(item.type);
            return (
              <button
                key={item.type}
                onClick={() => (muted ? unmuteNotificationType(item.type) : muteNotificationType(item.type))}
                className="btn btn-secondary"
                style={{ justifyContent: 'space-between', fontSize: '12px', padding: '8px 10px' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {muted ? <VolumeX size={13} /> : <Volume2 size={13} />} {item.label}
                </span>
                <span className={`badge ${muted ? 'badge-warning' : 'badge-success'}`}>{muted ? 'Silenciado' : 'Activo'}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-tertiary)' }}>
            <BellOff size={32} style={{ marginBottom: '10px' }} />
            <p style={{ fontWeight: 700 }}>No hay notificaciones en este filtro</p>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>Las nuevas alertas utiles apareceran aqui.</p>
          </div>
        ) : (
          filtered.map((item, index) => (
            <button
              key={item.id}
              onClick={() => !item.read && markNotificationRead(item.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                border: 'none',
                borderBottom: index < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                padding: '14px 18px',
                backgroundColor: item.read ? 'white' : '#f0fdf4',
                cursor: item.read ? 'default' : 'pointer',
                transition: 'var(--transition)',
              }}
              title={item.read ? 'Leida' : 'Marcar como leida'}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: item.read ? '#f1f5f9' : '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bell size={14} style={{ color: item.read ? '#64748b' : '#047857' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: item.read ? 600 : 800 }}>{item.title}</p>
                  {item.message ? <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>{item.message}</p> : null}
                  <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '5px' }}>
                    {new Date(item.created_at).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!item.read ? <span className="badge badge-success">Nueva</span> : null}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}


import React from 'react';

export function Card({ children, className = '', as: Component = 'div', ...props }) {
  return React.createElement(Component, { className: `card ${className}`.trim(), ...props }, children);
}

export function Button({ children, variant = 'primary', pill = true, className = '', ...props }) {
  const variantClass =
    variant === 'secondary' ? 'btn-secondary' : variant === 'ghost' ? 'btn-ghost' : 'btn-primary';
  return (
    <button className={`${variantClass} ${pill ? 'btn-pill' : ''} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export const Input = React.forwardRef(function Input({ className = '', ...props }, ref) {
  return <input ref={ref} className={`form-input ${className}`.trim()} {...props} />;
});

export const Textarea = React.forwardRef(function Textarea({ className = '', ...props }, ref) {
  return <textarea ref={ref} className={`form-input ${className}`.trim()} {...props} />;
});

export function Label({ children, className = '', ...props }) {
  return (
    <label className={`form-label ${className}`.trim()} {...props}>
      {children}
    </label>
  );
}

export function HelperText({ children, className = '', ...props }) {
  return (
    <p className={`form-helper ${className}`.trim()} {...props}>
      {children}
    </p>
  );
}

export function Badge({ children, tone = 'neutral', className = '', ...props }) {
  const toneClass =
    tone === 'success' || tone === 'mint'
      ? 'badge-success'
      : tone === 'warning'
      ? 'badge-warning'
      : tone === 'error'
      ? 'badge-error'
      : tone === 'info'
      ? 'badge-info'
      : 'badge-neutral';
  return (
    <span className={`badge ${toneClass} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}

export function PageHeader({ kicker, title, subtitle, action, actionSecondary, className = '' }) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '18px',
        marginBottom: '26px',
        flexWrap: 'wrap',
      }}
    >
      <div>
        {kicker ? <p className="page-kicker" style={{ marginBottom: '8px' }}>{kicker}</p> : null}
        <h1 className="page-title">{title}</h1>
        {subtitle ? <p className="page-subtitle" style={{ marginTop: '8px' }}>{subtitle}</p> : null}
      </div>
      {(action || actionSecondary) ? (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {actionSecondary || null}
          {action || null}
        </div>
      ) : null}
    </div>
  );
}

export function StatCard({ value, label, helper, tone = 'primary', icon, onClick }) {
  const color = tone === 'success' ? 'var(--status-success)' : tone === 'warning' ? '#8a6730' : 'var(--primary)';
  const Component = onClick ? 'button' : 'div';
  return (
    <Card
      as={Component}
      onClick={onClick}
      style={{
        width: '100%',
        minHeight: '116px',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <p className="display-font" style={{ fontSize: '38px', lineHeight: 1, color, fontWeight: 600 }}>{value}</p>
        {icon ? <span style={{ color }}>{icon}</span> : null}
      </div>
      <div>
        <p style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>{label}</p>
        {helper ? <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{helper}</p> : null}
      </div>
    </Card>
  );
}

export function TabsPills({ items }) {
  return (
    <div className="topbar-tabs" role="tablist" aria-label="Navegacion principal">
      {items.map((item) => item)}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 22px', color: 'var(--text-secondary)' }}>
      {icon ? <div style={{ marginBottom: '12px', color: 'var(--primary)' }}>{icon}</div> : null}
      <p style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{title}</p>
      {description ? <p style={{ fontSize: '14px', marginTop: '6px' }}>{description}</p> : null}
      {action ? <div style={{ marginTop: '16px' }}>{action}</div> : null}
    </div>
  );
}

export function SkeletonLoading({ rows = 3 }) {
  return (
    <div style={{ display: 'grid', gap: '12px' }} aria-label="Cargando">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="skeleton" style={{ height: index === 0 ? 44 : 72 }} />
      ))}
    </div>
  );
}

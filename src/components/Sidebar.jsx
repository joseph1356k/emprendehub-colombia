import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  MessageCircle,
  Search,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { spanishText } from '../utils/spanishText';

const GROUPS = [
  {
    title: 'Mi negocio',
    items: [
      { to: '/dashboard', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
      { to: '/ruta', icon: <ClipboardCheck size={17} />, label: 'Tareas' },
      { to: '/seguimiento', icon: <BarChart3 size={17} />, label: 'Progreso' },
    ],
  },
  {
    title: 'SOE',
    items: [
      { to: '/mi-agente', icon: <MessageCircle size={17} />, label: 'Mi agente' },
      { to: '/diagnostico', icon: <FileText size={17} />, label: 'Diagnóstico' },
      { to: '/oportunidades', icon: <Search size={17} />, label: 'Oportunidades' },
    ],
  },
  {
    title: 'Herramientas',
    items: [
      { to: '/cursos', icon: <BookOpen size={17} />, label: 'Biblioteca' },
      { to: '/documentos', icon: <FileText size={17} />, label: 'Documentos' },
      { to: '/empresas-servicios', icon: <BriefcaseBusiness size={17} />, label: 'Red experta' },
      { to: '/mi-negocio', icon: <Building2 size={17} />, label: 'Perfil del negocio' },
      { to: '/notificaciones', icon: <Bell size={17} />, label: 'Alertas' },
      { to: '/mi-perfil', icon: <User size={17} />, label: 'Mi perfil' },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const { profile, progressPercent, points, level } = useApp();
  const navigate = useNavigate();

  const displayName = profile?.full_name || 'Mi cuenta';
  const stage = profile?.stage || 'Idea';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <button
          className="brand-mark"
          onClick={() => navigate('/dashboard')}
          aria-label="Ir al dashboard"
          style={{ textAlign: 'left' }}
        >
          <span className="brand-name">SOE</span>
          <span className="brand-caption">sistema operativo emprendedor</span>
        </button>
        <button className="btn-ghost mobile-menu-button" onClick={onClose} aria-label="Cerrar menú">
          <X size={18} />
        </button>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', paddingBottom: '18px' }}>
        {GROUPS.map((group) => (
          <div className="sidebar-section" key={group.title}>
            <p className="sidebar-section-title">{group.title}</p>
            <div style={{ display: 'grid', gap: '2px' }}>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="card" style={{ padding: '16px', borderColor: 'var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div className="avatar" style={{ flexShrink: 0 }}>{initial}</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '14px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {displayName}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{spanishText(stage)} · {level}</p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 800 }}>Plan del mes</span>
            <span style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 800 }}>{progressPercent}%</span>
          </div>
          <div className="progress-bg" style={{ height: '6px' }}>
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <p style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-tertiary)' }}>{points} puntos acumulados</p>
        </div>
      </div>
    </aside>
  );
}

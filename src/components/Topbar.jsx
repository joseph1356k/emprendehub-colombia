import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TABS = [
  { to: '/dashboard', label: 'Inicio', active: ['/dashboard'] },
  { to: '/mi-agente', label: 'Mi agente', active: ['/mi-agente'] },
  { to: '/ruta', label: 'Plan de accion', active: ['/ruta', '/primeros-pasos'] },
];

export default function Topbar({ toggleSidebar, onLogout }) {
  const { profile, points, level, unreadNotifications } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = profile?.full_name || 'Mi cuenta';
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    const handler = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="topbar">
      <button className="btn-ghost mobile-menu-button" onClick={toggleSidebar} aria-label="Abrir menu">
        <Menu size={20} />
      </button>

      <nav className="topbar-tabs" aria-label="Navegacion principal">
        {TABS.map((tab) => {
          const active = tab.active.some((path) => location.pathname === path);
          return (
            <Link key={tab.to} to={tab.to} className={`topbar-tab ${active ? 'active' : ''}`}>
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
        <button
          className="btn-ghost"
          onClick={() => navigate('/notificaciones')}
          aria-label="Ver alertas"
          style={{ position: 'relative', width: '42px', height: '42px', padding: 0 }}
        >
          <Bell size={18} />
          {unreadNotifications > 0 ? (
            <span
              aria-label={`${unreadNotifications} alertas sin leer`}
              style={{
                position: 'absolute',
                top: '3px',
                right: '3px',
                minWidth: '18px',
                height: '18px',
                padding: '0 5px',
                borderRadius: '999px',
                background: 'var(--status-error)',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {unreadNotifications > 99 ? '99+' : unreadNotifications}
            </span>
          ) : null}
        </button>

        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            className="btn-secondary"
            onClick={() => setShowMenu((value) => !value)}
            style={{ padding: '5px 10px 5px 5px', gap: '10px', borderRadius: '999px' }}
            aria-expanded={showMenu}
          >
            <span className="avatar" style={{ width: '34px', height: '34px' }}>{initial}</span>
            <span style={{ textAlign: 'left', display: 'none' }} className="desktop-account-label">
              <span style={{ display: 'block', fontSize: '13px', fontWeight: 800 }}>{displayName}</span>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)' }}>{points} pts</span>
            </span>
            <ChevronDown size={14} />
          </button>

          {showMenu ? (
            <div
              className="card"
              style={{
                position: 'absolute',
                right: 0,
                top: '52px',
                width: '236px',
                padding: '10px',
                zIndex: 100,
              }}
            >
              <div style={{ padding: '10px 10px 14px', borderBottom: '1px solid var(--border)', marginBottom: '6px' }}>
                <p style={{ fontWeight: 800 }}>{displayName}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{profile?.stage || 'Idea'} - {level}</p>
              </div>
              <button
                className="sidebar-link"
                onClick={() => {
                  navigate('/mi-perfil');
                  setShowMenu(false);
                }}
              >
                <User size={16} /> Mi perfil
              </button>
              <button
                className="sidebar-link"
                onClick={() => {
                  setShowMenu(false);
                  onLogout?.();
                }}
                style={{ color: 'var(--status-error)' }}
              >
                <LogOut size={16} /> Cerrar sesion
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

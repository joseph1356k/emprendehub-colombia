import React, { useState } from 'react';
import { Bell, Bookmark, Lock, Save, User } from 'lucide-react';
import { Badge, Button, Card, EmptyState, Input, Label, PageHeader } from '../components/ui';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

const SECTIONS = [
  { id: 'info', label: 'Datos', icon: <User size={16} /> },
  { id: 'notifications', label: 'Alertas', icon: <Bell size={16} /> },
  { id: 'password', label: 'Seguridad', icon: <Lock size={16} /> },
  { id: 'saved', label: 'Guardados', icon: <Bookmark size={16} /> },
];

export default function Profile() {
  const { profile, updateProfile, savedOpportunities, savedProviders, session, showToast } = useApp();
  const [activeSection, setActiveSection] = useState('info');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({ oportunidades: true, cursos: true, tareas: false, reporte: true });
  const [pwForm, setPwForm] = useState({ current: '', nueva: '', confirmar: '' });
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    city: profile?.city || '',
    phone: profile?.phone || '',
    sector: profile?.sector || '',
  });

  const displayName = profile?.full_name || 'Mi cuenta';
  const initial = displayName.charAt(0).toUpperCase();

  const handleSave = async () => {
    setSaving(true);
    await updateProfile(form);
    setSaving(false);
    setEditing(false);
  };

  const handlePasswordUpdate = async () => {
    if (!session?.user?.email) {
      showToast('No hay una sesion activa para actualizar seguridad.', 'error');
      return;
    }
    if (!pwForm.current || !pwForm.nueva || !pwForm.confirmar) {
      showToast('Completa los tres campos de seguridad.', 'error');
      return;
    }
    if (pwForm.nueva.length < 6) {
      showToast('La nueva contrasena debe tener minimo 6 caracteres.', 'error');
      return;
    }
    if (pwForm.nueva !== pwForm.confirmar) {
      showToast('La confirmacion no coincide.', 'error');
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session.user.email,
      password: pwForm.current,
    });
    if (signInError) {
      showToast('La contrasena actual no coincide.', 'error');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: pwForm.nueva });
    if (error) {
      showToast(error.message || 'No se pudo actualizar la contrasena.', 'error');
      return;
    }

    setPwForm({ current: '', nueva: '', confirmar: '' });
    showToast('Contrasena actualizada');
  };

  const renderInfo = () => (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '22px' }}>
        <div>
          <p className="page-kicker">Datos personales</p>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginTop: '5px' }}>Contexto de cuenta</h2>
        </div>
        <Button onClick={editing ? handleSave : () => setEditing(true)} disabled={saving}>
          <Save size={16} /> {saving ? 'Guardando...' : editing ? 'Guardar' : 'Editar'}
        </Button>
      </div>
      <div className="section-grid-2">
        {[
          ['Nombre completo', 'full_name', 'Tu nombre'],
          ['Ciudad', 'city', 'Ciudad base'],
          ['Telefono', 'phone', '+57 300 000 0000'],
          ['Sector', 'sector', 'Tecnologia, servicios, comercio...'],
        ].map(([label, key, placeholder]) => (
          <div key={key}>
            <Label>{label}</Label>
            {editing ? (
              <Input value={form[key]} placeholder={placeholder} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} />
            ) : (
              <p style={{ minHeight: '46px', padding: '12px 0', borderBottom: '1px solid var(--border)', color: form[key] ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: 700 }}>
                {form[key] || placeholder}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );

  const renderNotifications = () => (
    <Card>
      <p className="page-kicker">Alertas</p>
      <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '5px 0 18px' }}>Preferencias de seguimiento</h2>
      {[
        { key: 'oportunidades', label: 'Oportunidades compatibles', desc: 'Convocatorias y opciones segun etapa.' },
        { key: 'cursos', label: 'Biblioteca y recursos', desc: 'Contenido que complementa el plan.' },
        { key: 'tareas', label: 'Tareas criticas', desc: 'Avisos sobre bloqueos y vencimientos.' },
        { key: 'reporte', label: 'Resumen de ciclo', desc: 'Lectura de avance para revisar prioridades.' },
      ].map((item, index, array) => (
        <button
          key={item.key}
          onClick={() => setNotifications((current) => ({ ...current, [item.key]: !current[item.key] }))}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '18px',
            textAlign: 'left',
            padding: '16px 0',
            borderBottom: index < array.length - 1 ? '1px solid var(--border)' : 'none',
          }}
        >
          <span>
            <span style={{ display: 'block', fontWeight: 800 }}>{item.label}</span>
            <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginTop: '3px' }}>{item.desc}</span>
          </span>
          <Badge tone={notifications[item.key] ? 'mint' : 'neutral'}>{notifications[item.key] ? 'Activo' : 'Pausado'}</Badge>
        </button>
      ))}
    </Card>
  );

  const renderPassword = () => (
    <Card>
      <p className="page-kicker">Seguridad</p>
      <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '5px 0 18px' }}>Cambiar contrasena</h2>
      <div style={{ maxWidth: '440px', display: 'grid', gap: '14px' }}>
        {[
          ['Contrasena actual', 'current'],
          ['Nueva contrasena', 'nueva'],
          ['Confirmar contrasena', 'confirmar'],
        ].map(([label, key]) => (
          <div key={key}>
            <Label>{label}</Label>
            <Input type="password" value={pwForm[key]} placeholder="••••••••" onChange={(event) => setPwForm((current) => ({ ...current, [key]: event.target.value }))} />
          </div>
        ))}
        <Button type="button" onClick={handlePasswordUpdate} style={{ justifySelf: 'start' }}>
          Actualizar contrasena
        </Button>
      </div>
    </Card>
  );

  const renderSaved = () => (
    <Card>
      <p className="page-kicker">Guardados</p>
      <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '5px 0 18px' }}>Radar personal</h2>
      {savedOpportunities.length === 0 && savedProviders.length === 0 ? (
        <EmptyState title="Sin elementos guardados" description="Guarda oportunidades o perfiles expertos para tenerlos a mano." />
      ) : (
        <div className="section-grid-2">
          <div style={{ padding: '18px', borderRadius: '18px', border: '1px solid var(--border)', background: 'var(--bg-panel)' }}>
            <p className="page-kicker">Oportunidades</p>
            <p className="display-font" style={{ fontSize: '36px', color: 'var(--primary)' }}>{savedOpportunities.length}</p>
          </div>
          <div style={{ padding: '18px', borderRadius: '18px', border: '1px solid var(--border)', background: 'var(--bg-panel)' }}>
            <p className="page-kicker">Red experta</p>
            <p className="display-font" style={{ fontSize: '36px', color: 'var(--primary)' }}>{savedProviders.length}</p>
          </div>
        </div>
      )}
    </Card>
  );

  return (
    <div className="page-shell animate-fade-in">
      <PageHeader
        kicker="Cuenta"
        title="Mi perfil"
        subtitle={`${profile?.stage || 'Idea'} · ${profile?.sector || 'Sector sin definir'}`}
      />

      <div className="profile-grid">
        <Card style={{ alignSelf: 'start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <div className="avatar" style={{ width: '52px', height: '52px' }}>{initial}</div>
            <div>
              <p style={{ fontWeight: 800 }}>{displayName}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Cuenta Soe</p>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '4px' }}>
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`sidebar-link ${activeSection === section.id ? 'active' : ''}`}
              >
                {section.icon} {section.label}
              </button>
            ))}
          </div>
        </Card>

        {activeSection === 'info' && renderInfo()}
        {activeSection === 'notifications' && renderNotifications()}
        {activeSection === 'password' && renderPassword()}
        {activeSection === 'saved' && renderSaved()}
      </div>
    </div>
  );
}

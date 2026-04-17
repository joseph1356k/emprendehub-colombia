import React, { useState } from 'react';
import { Eye, EyeOff, Save } from 'lucide-react';
import { Badge, Button, Card, Input, Label, PageHeader, Textarea } from '../components/ui';
import { useApp } from '../context/AppContext';

const LOOKING_OPTIONS = [
  { id: 'capital', label: 'Capital' },
  { id: 'clientes', label: 'Clientes' },
  { id: 'aliados', label: 'Aliados' },
  { id: 'proveedores', label: 'Proveedores' },
  { id: 'direccion', label: 'Direccion' },
];

export default function MyBusiness() {
  const { businessProfile, saveBusinessProfile, profile } = useApp();
  const [editing, setEditing] = useState(!businessProfile);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: businessProfile?.name || '',
    description: businessProfile?.description || '',
    category: businessProfile?.category || '',
    stage: businessProfile?.stage || profile?.stage || 'Idea',
    city: businessProfile?.city || profile?.city || '',
    website: businessProfile?.website || '',
    instagram: businessProfile?.instagram || '',
    linkedin: businessProfile?.linkedin || '',
    contact_email: businessProfile?.contact_email || '',
    problem_solved: businessProfile?.problem_solved || '',
    services: businessProfile?.services || '',
    looking_for: businessProfile?.looking_for || [],
    is_public: businessProfile?.is_public !== false,
  });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const toggleLooking = (id) =>
    update('looking_for', form.looking_for.includes(id) ? form.looking_for.filter((item) => item !== id) : [...form.looking_for, id]);

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert('El nombre del negocio es requerido.');
      return;
    }
    setSaving(true);
    await saveBusinessProfile(form);
    setSaving(false);
    setEditing(false);
  };

  const field = (label, key, placeholder) => (
    <div>
      <Label>{label}</Label>
      {editing ? (
        <Input value={form[key]} placeholder={placeholder} onChange={(event) => update(key, event.target.value)} />
      ) : (
        <p style={{ minHeight: '46px', padding: '12px 0', borderBottom: '1px solid var(--border)', color: form[key] ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: 700 }}>
          {form[key] || placeholder}
        </p>
      )}
    </div>
  );

  return (
    <div className="page-shell animate-fade-in">
      <PageHeader
        kicker="Mi negocio"
        title="Perfil del negocio"
        subtitle="Contexto vivo para que Soe entienda oferta, etapa, foco y necesidades del ciclo."
        action={
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-secondary btn-pill"
              onClick={() => editing && update('is_public', !form.is_public)}
              type="button"
            >
              {form.is_public ? <Eye size={16} /> : <EyeOff size={16} />}
              {form.is_public ? 'Visible' : 'Privado'}
            </button>
            <Button onClick={editing ? handleSave : () => setEditing(true)} disabled={saving}>
              <Save size={16} /> {saving ? 'Guardando...' : editing ? 'Guardar perfil' : 'Editar perfil'}
            </Button>
          </div>
        }
      />

      <div className="business-grid">
        <Card>
          <div className="section-grid-2" style={{ marginBottom: '18px' }}>
            {field('Nombre del negocio', 'name', 'Nombre del negocio')}
            {field('Categoria', 'category', 'Sector o categoria')}
            {field('Ciudad', 'city', 'Ciudad base')}
            {field('Sitio web', 'website', 'www.tunegocio.co')}
            {field('Instagram', 'instagram', '@usuario')}
            {field('LinkedIn', 'linkedin', 'linkedin.com/company/...')}
            {field('Email de contacto', 'contact_email', 'hola@negocio.co')}
          </div>

          {[
            ['Descripcion del negocio', 'description', 'Que vendes, a quien y con que resultado.'],
            ['Problema que resuelve', 'problem_solved', 'Describe el dolor o trabajo que ayudas a resolver.'],
            ['Productos y servicios', 'services', 'Lista corta de ofertas principales.'],
          ].map(([label, key, placeholder]) => (
            <div key={key} style={{ marginBottom: '18px' }}>
              <Label>{label}</Label>
              {editing ? (
                <Textarea rows={3} value={form[key]} placeholder={placeholder} onChange={(event) => update(key, event.target.value)} />
              ) : (
                <p style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', color: form[key] ? 'var(--text-secondary)' : 'var(--text-tertiary)', lineHeight: 1.7 }}>
                  {form[key] || placeholder}
                </p>
              )}
            </div>
          ))}

          <div>
            <Label>Que buscas ahora</Label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {LOOKING_OPTIONS.map((option) => {
                const selected = form.looking_for.includes(option.id);
                return (
                  <button
                    key={option.id}
                    className={`topbar-tab ${selected ? 'active' : ''}`}
                    onClick={() => editing && toggleLooking(option.id)}
                    type="button"
                    style={{ border: '1px solid var(--border)', background: selected ? 'var(--primary-light)' : '#fff' }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        <aside style={{ display: 'grid', gap: '16px', alignContent: 'start' }}>
          <Card>
            <Badge tone={form.is_public ? 'mint' : 'neutral'}>{form.is_public ? 'Visible en la red' : 'Solo para ti'}</Badge>
            <h2 className="display-font" style={{ fontSize: '30px', lineHeight: 1.1, marginTop: '18px' }}>
              {form.name || 'Nombre del negocio'}
            </h2>
            <p style={{ color: 'var(--primary)', fontWeight: 800, marginTop: '8px' }}>{form.stage} · {form.category || 'Categoria'}</p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '16px' }}>
              {form.description || 'Una descripcion clara ayuda a Soe a priorizar oportunidades y acciones.'}
            </p>
            {form.looking_for.length > 0 ? (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
                {form.looking_for.map((id) => {
                  const option = LOOKING_OPTIONS.find((item) => item.id === id);
                  return option ? <Badge key={id} tone="info">{option.label}</Badge> : null;
                })}
              </div>
            ) : null}
          </Card>

          <Card style={{ background: 'var(--mint-soft)', borderColor: 'var(--mint)' }}>
            <p style={{ color: 'var(--status-success)', fontWeight: 800 }}>Por que se conserva</p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '8px' }}>
              Este perfil alimenta diagnostico, oportunidades y recomendaciones. Aporta valor directo al sistema Soe.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import { Bookmark, BookmarkCheck, Mail, MapPin, Search, Star, X } from 'lucide-react';
import { Badge, Button, Card, EmptyState, Input, PageHeader } from '../components/ui';
import { useApp } from '../context/AppContext';
import { CATEGORIES, MOCK_PROVIDERS } from '../data/mockData';

export default function Providers() {
  const { savedProviders, toggleSaveProvider } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [profileId, setProfileId] = useState(null);

  const filtered = useMemo(
    () =>
      MOCK_PROVIDERS.filter((provider) => {
        const query = search.toLowerCase();
        const matchSearch = !query || provider.name.toLowerCase().includes(query) || provider.description.toLowerCase().includes(query);
        const matchCategory = category === 'Todos' || provider.category === category;
        return matchSearch && matchCategory;
      }),
    [category, search]
  );

  const providerDetail = MOCK_PROVIDERS.find((provider) => provider.id === profileId);

  return (
    <div className="page-shell animate-fade-in">
      <PageHeader
        kicker="Red experta"
        title="Empresas y servicios"
        subtitle="Opciones conservadas por valor operativo: legal, finanzas, tecnologia, marca y direccion externa."
      />

      <Card style={{ marginBottom: '18px', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <Input placeholder="Buscar por servicio o perfil..." value={search} onChange={(event) => setSearch(event.target.value)} style={{ paddingLeft: '42px' }} />
          </div>
          {CATEGORIES.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`topbar-tab ${category === item ? 'active' : ''}`}
              style={{ border: '1px solid var(--border)', background: category === item ? 'var(--primary-light)' : '#fff' }}
            >
              {item}
            </button>
          ))}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState title="Sin resultados" description="Ajusta la busqueda o cambia la categoria." />
        </Card>
      ) : (
        <div className="section-grid-3">
          {filtered.map((provider) => {
            const saved = savedProviders.includes(provider.id);
            return (
              <Card key={provider.id} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'flex-start' }}>
                  <div>
                    <Badge tone="info">{provider.category}</Badge>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '12px' }}>{provider.name}</h2>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'var(--text-secondary)', fontSize: '13px', marginTop: '5px' }}>
                      <MapPin size={13} /> {provider.city}
                    </p>
                  </div>
                  <button
                    className="btn-secondary btn-pill"
                    onClick={() => toggleSaveProvider(provider.id)}
                    aria-label={saved ? 'Quitar de guardados' : 'Guardar perfil'}
                    style={{ width: '42px', padding: 0 }}
                  >
                    {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  </button>
                </div>

                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{provider.description}</p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {provider.services.slice(0, 3).map((service) => (
                    <Badge key={service} tone="neutral">{service}</Badge>
                  ))}
                </div>

                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', marginTop: 'auto' }}>
                  <Star size={13} style={{ color: 'var(--status-warning)', fill: 'var(--status-warning)' }} /> {provider.rating}
                </p>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button variant="secondary" onClick={() => setProfileId(provider.id)} style={{ flex: 1 }}>Ver perfil</Button>
                  <a href={`mailto:${provider.email}`} className="btn-primary btn-pill" style={{ flex: 1 }}>
                    <Mail size={14} /> Contactar
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {providerDetail ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 240,
            display: 'grid',
            placeItems: 'center',
            padding: '20px',
            background: 'rgba(55, 47, 100, 0.24)',
          }}
          onClick={() => setProfileId(null)}
        >
          <Card style={{ width: '100%', maxWidth: '600px', padding: '28px' }} onClick={(event) => event.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
              <div>
                <Badge tone="info">{providerDetail.category}</Badge>
                <h2 className="page-title" style={{ fontSize: '32px', marginTop: '12px' }}>{providerDetail.name}</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>{providerDetail.city} · Calificacion {providerDetail.rating}</p>
              </div>
              <button className="btn-ghost" onClick={() => setProfileId(null)} aria-label="Cerrar perfil">
                <X size={18} />
              </button>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '20px' }}>{providerDetail.description}</p>
            <div style={{ display: 'grid', gap: '10px', marginBottom: '22px' }}>
              {providerDetail.services.map((service) => (
                <div key={service} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontWeight: 700 }}>
                  {service}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Button variant="secondary" onClick={() => toggleSaveProvider(providerDetail.id)}>
                {savedProviders.includes(providerDetail.id) ? 'Quitar de guardados' : 'Guardar'}
              </Button>
              <a href={`mailto:${providerDetail.email}`} className="btn-primary btn-pill">
                <Mail size={14} /> Contactar
              </a>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

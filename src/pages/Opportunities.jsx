import React, { useMemo, useState } from 'react';
import { Bookmark, BookmarkCheck, ExternalLink, Search, X } from 'lucide-react';
import { Badge, Button, Card, EmptyState, Input, PageHeader } from '../components/ui';
import { useApp } from '../context/AppContext';
import { MOCK_OPPORTUNITIES, STAGES } from '../data/mockData';

export default function Opportunities() {
  const { savedOpportunities, toggleSaveOpportunity, profile, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('Todos');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [tab, setTab] = useState('todas');
  const [detailId, setDetailId] = useState(null);

  const userStage = profile?.stage || 'Idea';
  const detail = MOCK_OPPORTUNITIES.find((item) => item.id === detailId);

  const filtered = useMemo(() => {
    return MOCK_OPPORTUNITIES.filter((opp) => {
      const query = search.toLowerCase();
      const matchSearch = !query || opp.title.toLowerCase().includes(query) || opp.organization.toLowerCase().includes(query);
      const matchStage = stageFilter === 'Todos' || opp.stages?.includes(stageFilter);
      const matchType = typeFilter === 'Todos' || opp.type === typeFilter;
      const matchTab = tab === 'todas' || savedOpportunities.includes(opp.id);
      return matchSearch && matchStage && matchType && matchTab;
    });
  }, [savedOpportunities, search, stageFilter, tab, typeFilter]);

  const openOpportunity = (opp) => {
    if (opp.link) window.open(opp.link, '_blank', 'noopener,noreferrer');
    else showToast('Esta oportunidad no tiene enlace disponible', 'error');
  };

  return (
    <div className="page-shell animate-fade-in">
      <PageHeader
        kicker="Soe"
        title="Oportunidades"
        subtitle="Seleccionadas para tu negocio este mes, con foco en etapa, cierre y utilidad real."
      />

      <Card style={{ marginBottom: '18px', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <Input placeholder="Buscar por nombre u organizacion..." value={search} onChange={(event) => setSearch(event.target.value)} style={{ paddingLeft: '42px' }} />
          </div>
          <select className="form-input" value={stageFilter} onChange={(event) => setStageFilter(event.target.value)} style={{ width: 'auto', minWidth: '160px' }}>
            <option value="Todos">Todas las etapas</option>
            {STAGES.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
          </select>
          <select className="form-input" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} style={{ width: 'auto', minWidth: '160px' }}>
            <option value="Todos">Todos los tipos</option>
            {['Financiacion', 'Aceleracion', 'Credito', 'Beca', 'Red experta'].map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          {(search || stageFilter !== 'Todos' || typeFilter !== 'Todos') ? (
            <Button variant="secondary" onClick={() => { setSearch(''); setStageFilter('Todos'); setTypeFilter('Todos'); }}>
              <X size={15} /> Limpiar
            </Button>
          ) : null}
        </div>
      </Card>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
        {[
          ['todas', 'Activas ahora'],
          ['guardadas', `Guardadas (${savedOpportunities.length})`],
        ].map(([value, label]) => (
          <button
            key={value}
            className={`topbar-tab ${tab === value ? 'active' : ''}`}
            onClick={() => setTab(value)}
            style={{ border: '1px solid var(--border)', background: tab === value ? 'var(--primary-light)' : '#fff' }}
          >
            {label}
          </button>
        ))}
      </div>

      <Card style={{ padding: '22px 26px' }}>
        <p className="page-kicker" style={{ marginBottom: '14px' }}>Activas ahora</p>
        {filtered.length === 0 ? (
          <EmptyState title="Sin resultados" description="Ajusta los filtros o revisa de nuevo en el proximo ciclo." />
        ) : (
          <div style={{ display: 'grid', gap: 0 }}>
            {filtered.map((opp) => {
              const saved = savedOpportunities.includes(opp.id);
              const applies = opp.stages?.includes(userStage);
              return (
                <div
                  key={opp.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '12px minmax(0, 1fr) auto',
                    gap: '14px',
                    alignItems: 'center',
                    padding: '18px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: applies ? 'var(--mint)' : 'var(--primary)' }} />
                  <button onClick={() => setDetailId(opp.id)} style={{ textAlign: 'left', minWidth: 0 }}>
                    <p style={{ fontWeight: 800, marginBottom: '4px' }}>
                      {opp.title}
                      {applies ? <Badge tone="mint" style={{ marginLeft: '10px' }}>Aplica para ti</Badge> : null}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                      {opp.deadline === 'Permanente' ? 'Abierta' : `Cierra ${opp.deadline}`} · {opp.organization} · {opp.amount}
                    </p>
                  </button>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      className="btn-secondary btn-pill"
                      onClick={() => toggleSaveOpportunity(opp.id)}
                      aria-label={saved ? 'Quitar de guardados' : 'Guardar oportunidad'}
                      style={{ width: '42px', padding: 0 }}
                    >
                      {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                    <Button variant="secondary" onClick={() => openOpportunity(opp)}>
                      Aplicar <ExternalLink size={14} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {detail ? (
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
          onClick={() => setDetailId(null)}
        >
          <Card style={{ width: '100%', maxWidth: '620px', padding: '28px' }} onClick={(event) => event.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
              <div>
                <Badge tone={detail.stages?.includes(userStage) ? 'mint' : 'neutral'}>
                  {detail.stages?.includes(userStage) ? 'Aplica para ti' : detail.type}
                </Badge>
                <h2 className="page-title" style={{ fontSize: '32px', marginTop: '12px' }}>{detail.title}</h2>
              </div>
              <button className="btn-ghost" onClick={() => setDetailId(null)} aria-label="Cerrar detalle"><X size={18} /></button>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>{detail.description}</p>
            <div className="section-grid-2" style={{ marginBottom: '22px' }}>
              {[
                ['Organizacion', detail.organization],
                ['Tipo', detail.type],
                ['Monto', detail.amount],
                ['Cierre', detail.deadline],
              ].map(([label, value]) => (
                <div key={label} style={{ padding: '14px', borderRadius: '16px', background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
                  <p className="page-kicker">{label}</p>
                  <p style={{ fontWeight: 800, marginTop: '5px' }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Button variant="secondary" onClick={() => toggleSaveOpportunity(detail.id)}>
                {savedOpportunities.includes(detail.id) ? 'Quitar de guardados' : 'Guardar'}
              </Button>
              <Button onClick={() => openOpportunity(detail)}>
                Aplicar ahora <ExternalLink size={15} />
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

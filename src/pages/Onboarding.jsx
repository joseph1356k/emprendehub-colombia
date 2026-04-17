import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button, Card } from '../components/ui';

const STEPS = [
  'Radiografía inicial del negocio',
  'Plan de acción mensual',
  'Seguimiento diario con tu agente',
];

export default function Onboarding({ session, onComplete }) {
  const name = session?.user?.user_metadata?.full_name?.split(' ')[0] || 'Emprendedor';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--bg-main)',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '720px' }}>
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <p className="brand-name">SOE</p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>sistema operativo emprendedor</p>
        </div>

        <Card className="animate-rise" style={{ padding: '44px', textAlign: 'center' }}>
          <p className="page-kicker">Bienvenido, {name}</p>
          <h1 className="page-title" style={{ marginTop: '10px' }}>Primero ordenamos el negocio</h1>
          <p className="page-subtitle" style={{ margin: '16px auto 30px' }}>
            El diagnóstico le da contexto a SOE para priorizar tareas, detectar bloqueos y preparar tu primer plan de dirección.
          </p>

          <div className="section-grid-3" style={{ marginBottom: '30px' }}>
            {STEPS.map((step) => (
              <div key={step} style={{ padding: '18px', borderRadius: '18px', border: '1px solid var(--border)', background: 'var(--bg-panel)' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--primary)', marginBottom: '10px' }} />
                <p style={{ fontWeight: 800, fontSize: '14px' }}>{step}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Button onClick={() => onComplete('/diagnostico')} style={{ minWidth: '220px' }}>
              Hacer diagnóstico <ArrowRight size={17} />
            </Button>
            <Button variant="secondary" onClick={() => onComplete('/dashboard')} style={{ minWidth: '180px' }}>
              Ir al dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

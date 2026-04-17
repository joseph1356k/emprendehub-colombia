import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, Check, CircleDot, Sparkles } from 'lucide-react';
import { Badge, Card } from '../components/ui';

const HOW_IT_WORKS = [
  {
    number: '01',
    title: 'Radiografía del negocio',
    body: 'La IA analiza tu empresa, detecta fricciones y ordena prioridades por impacto.',
  },
  {
    number: '02',
    title: 'Sesión de dirección',
    body: 'Aterrizamos diagnóstico, decisiones abiertas y foco del mes con criterio externo.',
  },
  {
    number: '03',
    title: 'Acompañamiento diario',
    body: 'Tu agente SOE organiza tareas, hace seguimiento y mantiene el plan vivo.',
  },
  {
    number: '04',
    title: 'Comité de crecimiento',
    body: 'Cada mes revisas avances, bloqueos y decisiones clave con dirección humana.',
  },
];

const PERSONAS = [
  'Ya vendes, pero cada semana cambia la prioridad.',
  'Tienes equipo pequeño y necesitas ordenar ejecución.',
  'Quieres criterio externo sin contratar una gerencia completa.',
];

const PROBLEMS = ['Claridad', 'Foco', 'Estructura', 'Seguimiento', 'Criterio externo'];
const DECISIONS = ['Precio', 'Canal', 'Contratar o tercerizar', 'Prioridades', 'Producto'];

const INCLUDED = [
  'Diagnóstico inicial con IA y contexto del negocio.',
  'Plan de acción mensual con prioridades visibles.',
  'Agente diario para seguimiento y tareas.',
  'Comité mensual de crecimiento con dirección humana.',
  'Oportunidades seleccionadas según etapa y foco.',
];

const COMPARISON = [
  ['Solo', 'Mucho ruido, poca estructura', 'Depende de tu energía semanal'],
  ['Consultor tradicional', 'Entrega recomendaciones', 'No vive contigo el día a día'],
  ['Empleado', 'Ejecuta una función', 'No reemplaza criterio de dirección'],
  ['SOE', 'Dirección mensual + IA diaria', 'Ordena decisiones y ejecución'],
];

const FAQ = [
  ['¿SOE ejecuta por mi?', 'No. SOE ordena, prioriza y acompaña la ejecución para que el equipo avance con foco.'],
  ['¿Es para ideas muy tempranas?', 'Funciona mejor cuando ya existe una oferta, clientes o ventas iniciales.'],
  ['¿Puedo usar solo el agente?', 'El valor esta en combinar IA diaria con dirección humana mensual.'],
  ['¿Hay permanencia?', 'La suscripción es mensual. El objetivo es que cada ciclo deje decisiones claras.'],
];

function LandingHeader() {
  return (
    <header
      style={{
        minHeight: '96px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        padding: '0 7vw',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(248, 247, 251, 0.82)',
        backdropFilter: 'blur(18px)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <Link to="/" className="brand-mark">
        <span className="brand-name">SOE</span>
        <span className="brand-caption">sistema operativo emprendedor</span>
      </Link>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <a className="btn-ghost btn-pill" href="#como-funciona">Cómo funciona</a>
        <a className="btn-ghost btn-pill" href="#suscripcion">Suscripción</a>
        <Link className="btn-secondary btn-pill" to="/login">Iniciar sesión</Link>
        <Link className="btn-primary btn-pill" to="/aplicar">Aplicar</Link>
      </nav>
    </header>
  );
}

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      <LandingHeader />

      <main>
        <section
          className="animate-rise"
          style={{
            minHeight: 'calc(100svh - 96px)',
            display: 'grid',
            placeItems: 'center',
            padding: '64px 7vw 72px',
            borderBottom: '1px solid var(--border)',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '1120px' }}>
            <Badge tone="mint" style={{ marginBottom: '28px' }}>
              <CircleDot size={12} fill="currentColor" /> Humano + IA para negocios en movimiento
            </Badge>
            <h1
              className="display-font landing-hero-title"
              style={{
                lineHeight: 1.02,
                fontWeight: 600,
                marginBottom: '28px',
              }}
            >
              No emprendas <em style={{ color: 'var(--border-strong)', fontStyle: 'italic' }}>solo</em> nunca más
            </h1>
            <p style={{ maxWidth: '820px', margin: '0 auto 34px', color: 'var(--text-secondary)', fontSize: '24px', lineHeight: 1.65 }}>
              IA diaria para ordenar y ejecutar + dirección estratégica mensual para decidir mejor.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link className="btn-primary btn-pill" style={{ minWidth: '160px' }} to="/aplicar">Aplicar</Link>
              <a className="btn-secondary btn-pill" style={{ minWidth: '190px' }} href="#como-funciona">
                Ver cómo funciona
              </a>
            </div>
            <a
              href="#como-funciona"
              aria-label="Ir a cómo funciona"
              className="btn-secondary btn-pill"
              style={{ width: '54px', height: '54px', padding: 0, marginTop: '44px' }}
            >
              <ArrowDown size={20} />
            </a>
          </div>
        </section>

        <section id="como-funciona" style={{ padding: '76px 7vw', borderBottom: '1px solid var(--border)' }}>
          <div className="page-shell-wide">
            <p className="page-kicker">Cómo funciona</p>
            <div style={{ maxWidth: '620px', marginBottom: '48px' }}>
              <h2 className="page-title">Un sistema que crece contigo</h2>
              <p className="page-subtitle" style={{ marginTop: '18px' }}>
                Desde el diagnóstico hasta el acompañamiento diario, todo en un solo lugar.
              </p>
            </div>
            <div className="section-grid-4">
              {HOW_IT_WORKS.map((item) => (
                <Card key={item.number} style={{ minHeight: '254px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <span className="display-font" style={{ color: '#dedbee', fontSize: '40px', fontWeight: 600 }}>{item.number}</span>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '10px' }}>{item.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{item.body}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '76px 7vw', borderBottom: '1px solid var(--border)' }}>
          <div className="page-shell-wide section-grid-2" style={{ alignItems: 'center', gap: '42px' }}>
            <div>
              <p className="page-kicker">Para quién es</p>
              <h2 className="page-title" style={{ marginTop: '10px' }}>Para negocios que ya se mueven, pero necesitan dirección</h2>
              <div style={{ display: 'grid', gap: '14px', marginTop: '30px' }}>
                {PERSONAS.map((item) => (
                  <div key={item} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span className="badge badge-success" style={{ width: '28px', height: '28px', justifyContent: 'center', padding: 0 }}>
                      <Check size={14} />
                    </span>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                minHeight: '420px',
                borderRadius: '24px',
                border: '1px solid var(--border-strong)',
                overflow: 'hidden',
                background: '#fff',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80"
                alt="Mesa de dirección revisando prioridades de negocio"
                style={{ width: '100%', height: '100%', minHeight: '420px', objectFit: 'cover', display: 'block', filter: 'saturate(0.72) contrast(0.95)' }}
              />
            </div>
          </div>
        </section>

        <section style={{ padding: '76px 7vw', borderBottom: '1px solid var(--border)' }}>
          <div className="page-shell-wide section-grid-2" style={{ gap: '28px' }}>
            <Card>
              <p className="page-kicker">Problemas que resolvemos</p>
              <h2 className="page-title" style={{ fontSize: '34px', margin: '12px 0 28px' }}>Menos ruido. Más criterio.</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {PROBLEMS.map((item) => <Badge key={item} tone="info">{item}</Badge>)}
              </div>
            </Card>
            <Card>
              <p className="page-kicker">Decisiones que destraba</p>
              <h2 className="page-title" style={{ fontSize: '34px', margin: '12px 0 28px' }}>Lo que no puede quedar flotando.</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {DECISIONS.map((item) => <Badge key={item} tone="neutral">{item}</Badge>)}
              </div>
            </Card>
          </div>
        </section>

        <section id="suscripcion" style={{ padding: '76px 7vw', borderBottom: '1px solid var(--border)' }}>
          <div className="page-shell-wide">
            <div className="landing-split">
              <div>
                <p className="page-kicker">Suscripción mensual</p>
                <h2 className="page-title" style={{ marginTop: '10px' }}>Una junta directiva cercana para decidir y avanzar</h2>
                <p className="page-subtitle" style={{ marginTop: '18px' }}>
                  SOE combina dirección humana mensual con IA diaria para que tu negocio no dependa de improvisar cada semana.
                </p>
              </div>
              <Card>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {INCLUDED.map((item) => (
                    <div key={item} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <Check size={18} style={{ color: 'var(--status-success)', marginTop: '3px', flexShrink: 0 }} />
                      <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>{item}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section style={{ padding: '76px 7vw', borderBottom: '1px solid var(--border)' }}>
          <div className="page-shell-wide">
            <p className="page-kicker">Comparación</p>
            <h2 className="page-title" style={{ marginTop: '10px', marginBottom: '28px' }}>Por qué SOE no se parece a otras opciones</h2>
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <div className="table-shell">
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '720px' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border)' }}>
                      {['Opción', 'Qué aporta', 'Límite habitual'].map((header) => (
                        <th key={header} style={{ padding: '18px 22px', textAlign: 'left', fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map((row) => (
                      <tr key={row[0]} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '20px 22px', fontWeight: 800 }}>{row[0]}</td>
                        <td style={{ padding: '20px 22px', color: 'var(--text-secondary)' }}>{row[1]}</td>
                        <td style={{ padding: '20px 22px', color: row[0] === 'SOE' ? 'var(--status-success)' : 'var(--text-secondary)', fontWeight: row[0] === 'SOE' ? 800 : 500 }}>{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </section>

        <section style={{ padding: '76px 7vw', borderBottom: '1px solid var(--border)' }}>
          <div className="page-shell-wide">
            <p className="page-kicker">Preguntas frecuentes</p>
            <h2 className="page-title" style={{ marginTop: '10px', marginBottom: '28px' }}>Antes de aplicar</h2>
            <div className="section-grid-2">
              {FAQ.map(([question, answer]) => (
                <Card key={question}>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '10px' }}>{question}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '88px 7vw', textAlign: 'center' }}>
          <Sparkles size={28} style={{ color: 'var(--primary)', marginBottom: '18px' }} />
          <h2 className="display-font" style={{ fontSize: '54px', lineHeight: 1.1, fontWeight: 600, maxWidth: '760px', margin: '0 auto 20px' }}>
            Construye con dirección, no con ruido.
          </h2>
          <p style={{ maxWidth: '660px', margin: '0 auto 28px', color: 'var(--text-secondary)', fontSize: '18px' }}>
            Solicita acceso para revisar si SOE encaja con la etapa actual de tu negocio.
          </p>
          <Link className="btn-primary btn-pill" to="/aplicar">Solicitar acceso</Link>
        </section>
      </main>

      <footer style={{ padding: '28px 7vw', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap' }}>
        <p className="brand-name" style={{ fontSize: '24px' }}>SOE</p>
        <p style={{ color: 'var(--text-secondary)' }}>Dirección estratégica para emprendedores y pequeños negocios.</p>
      </footer>
    </div>
  );
}

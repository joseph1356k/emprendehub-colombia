import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, Lock, Mail, User } from 'lucide-react';
import { signIn, signUp } from '../lib/supabase';
import { Button, Card, Input, Label } from '../components/ui';

export default function Auth({ onLogin, initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(initialMode !== 'signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    setIsLogin(initialMode !== 'signup');
    setError('');
  }, [initialMode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error: signInError } = await signIn(form.email, form.password);
        if (signInError) throw signInError;
        onLogin(data.session);
      } else {
        const { data, error: signUpError } = await signUp(form.email, form.password, form.name);
        if (signUpError) throw signUpError;
        if (data.session) {
          onLogin(data.session);
        } else {
          setError('Revisa tu correo para confirmar tu cuenta antes de ingresar.');
        }
      }
    } catch (err) {
      const message = err.message || 'Ocurrió un error. Intenta de nuevo.';
      if (message.includes('Invalid login credentials')) {
        setError('Correo o contraseña incorrectos.');
      } else if (message.includes('User already registered')) {
        setError('Este correo ya tiene una cuenta. Ingresa con tus datos.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

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
      <Card className="animate-rise" style={{ width: '100%', maxWidth: '448px', padding: '42px 36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Link to="/" className="brand-name" style={{ display: 'inline-block', marginBottom: '6px' }}>
            SOE
          </Link>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Sistema operativo emprendedor</p>
        </div>

        {error ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '14px',
              border: '1px solid #efc6ce',
              background: '#fff7f8',
              marginBottom: '18px',
              color: 'var(--status-error)',
              fontSize: '13px',
            }}
          >
            <AlertCircle size={16} style={{ marginTop: '1px', flexShrink: 0 }} />
            <p>{error}</p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          {!isLogin ? (
            <div>
              <Label htmlFor="name">Nombre completo</Label>
              <div style={{ position: 'relative' }}>
                <User size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  style={{ paddingLeft: '42px' }}
                  required={!isLogin}
                />
              </div>
            </div>
          ) : null}

          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <div style={{ position: 'relative' }}>
              <Mail size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                style={{ paddingLeft: '42px' }}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <div style={{ position: 'relative' }}>
              <Lock size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={(event) => update('password', event.target.value)}
                style={{ paddingLeft: '42px' }}
                required
                minLength={6}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} style={{ width: '100%', minHeight: '48px', marginTop: '6px' }}>
            {loading ? 'Procesando...' : isLogin ? 'Entrar a SOE' : 'Solicitar acceso'}
            {!loading ? <ArrowRight size={17} /> : null}
          </Button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <button
            className="btn-ghost btn-pill"
            onClick={() => {
              setIsLogin((value) => !value);
              setError('');
            }}
          >
            {isLogin ? '¿No tienes cuenta? Solicita acceso' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
          <div style={{ marginTop: '8px' }}>
            <Link className="btn-ghost btn-pill" to="/">
              Volver al inicio
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

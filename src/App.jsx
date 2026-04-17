import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from './lib/supabase';
import { AppProvider, useApp } from './context/AppContext';
import PageLayout from './components/PageLayout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Diagnostic from './pages/Diagnostic';
import Roadmap from './pages/Roadmap';
import FirstSteps from './pages/FirstSteps';
import Opportunities from './pages/Opportunities';
import Courses from './pages/Courses';
import Documents from './pages/Documents';
import Tracker from './pages/Tracker';
import Providers from './pages/Providers';
import MyBusiness from './pages/MyBusiness';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Agent from './pages/Agent';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';

function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  const isError = toast.type === 'error';
  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '24px',
        zIndex: 9999,
        maxWidth: '360px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '14px 18px',
        borderRadius: '18px',
        border: `1px solid ${isError ? '#efc6ce' : 'var(--mint)'}`,
        background: '#fff',
        color: isError ? 'var(--status-error)' : 'var(--status-success)',
        boxShadow: 'var(--shadow-md)',
        fontWeight: 800,
        animation: 'fadeIn 220ms ease both',
      }}
    >
      {isError ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{toast.message}</span>
    </div>
  );
}

function AppLayout({ onLogout, initialPath }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PageLayout
      sidebarOpen={sidebarOpen}
      onCloseSidebar={() => setSidebarOpen(false)}
      onToggleSidebar={() => setSidebarOpen((value) => !value)}
      onLogout={onLogout}
    >
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mi-agente" element={<Agent />} />
        <Route path="/diagnostico" element={<Diagnostic />} />
        <Route path="/ruta" element={<Roadmap />} />
        <Route path="/primeros-pasos" element={<FirstSteps />} />
        <Route path="/oportunidades" element={<Opportunities />} />
        <Route path="/cursos" element={<Courses />} />
        <Route path="/documentos" element={<Documents />} />
        <Route path="/seguimiento" element={<Tracker />} />
        <Route path="/notificaciones" element={<Notifications />} />
        <Route path="/empresas-servicios" element={<Providers />} />
        <Route path="/mi-negocio" element={<MyBusiness />} />
        <Route path="/mi-perfil" element={<Profile />} />
        <Route path="/" element={<Navigate to={initialPath} replace />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/aplicar" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toast />
    </PageLayout>
  );
}

function ProtectedApp({ session, initialPath, onLogout, onOnboardingComplete }) {
  if (!session) return null;

  const onboardingDone = localStorage.getItem(`onboarding_done_${session.user.id}`);
  if (!onboardingDone) {
    return (
      <Onboarding
        session={session}
        onComplete={onOnboardingComplete}
        onSkip={() => onOnboardingComplete('/dashboard')}
      />
    );
  }

  return (
    <AppProvider session={session}>
      <AppLayout onLogout={onLogout} initialPath={initialPath} />
    </AppProvider>
  );
}

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--bg-main)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p className="brand-name" style={{ marginBottom: '14px' }}>Soe</p>
        <div
          aria-label="Cargando"
          style={{
            width: '36px',
            height: '36px',
            margin: '0 auto',
            border: '3px solid var(--primary-light)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 820ms linear infinite',
          }}
        />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialPath, setInitialPath] = useState('/dashboard');
  const [, forceOnboardingRefresh] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) setInitialPath('/dashboard');
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleOnboardingComplete = (path = '/dashboard') => {
    if (session) localStorage.setItem(`onboarding_done_${session.user.id}`, 'true');
    setInitialPath(path);
    forceOnboardingRefresh((value) => value + 1);
  };

  if (loading) return <LoadingScreen />;

  return (
    <Router>
      {session ? (
        <ProtectedApp
          session={session}
          initialPath={initialPath}
          onLogout={handleLogout}
          onOnboardingComplete={handleOnboardingComplete}
        />
      ) : (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth onLogin={setSession} initialMode="login" />} />
          <Route path="/aplicar" element={<Auth onLogin={setSession} initialMode="signup" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </Router>
  );
}

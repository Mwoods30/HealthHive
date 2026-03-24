import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import useAuth from '../../auth/useAuth';
import { getDefaultRouteForRole } from '../../auth/roleRoutes';
import './auth.css';

export default function SignUpPage() {
  const nav = useNavigate();
  const { role } = useAuth();

  if (role) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return (
    <main className="app-stage auth-stage">
      <div className="container auth-shell">
        <header className="auth-header">
          <a className="auth-brand" href="/" aria-label="HealthHive home">
            <img className="auth-brandmark" src="/healthhive-wordmark.svg" alt="HealthHive" />
          </a>
          <Button kind="ghost" className="auth-back" onClick={() => nav('/login')}>
            Sign in
          </Button>
        </header>

        <section className="auth-layout">
          <div className="auth-copy">
            <p className="auth-eyebrow">Project note</p>
            <h1 className="auth-title">Account creation is not part of this frontend build.</h1>
            <p className="auth-description">
              Registration is not part of this frontend shell. Use the role-based access on the sign-in screen to open patient, provider, or admin layouts.
            </p>
          </div>

          <Card className="auth-card signup-pending-card">
            <div className="auth-card-logo">
              <img src="/healthhive-wordmark.svg" alt="HealthHive" />
            </div>
            <p className="auth-card-eyebrow">Next step</p>
            <h2 className="auth-card-title">Open a workspace</h2>
            <p className="auth-card-copy">
              This app now renders as a frontend-only shell with empty fields. Choose a role on the sign-in screen to continue.
            </p>
            <Button className="auth-submit" onClick={() => nav('/login')}>
              Go to sign in
            </Button>
          </Card>
        </section>
      </div>
    </main>
  );
}

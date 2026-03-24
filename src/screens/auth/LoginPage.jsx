import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import useAuth from '../../auth/useAuth';
import { getDefaultRouteForRole, ROLE_OPTIONS } from '../../auth/roleRoutes';
import './auth.css';

export default function LoginPage() {
  const nav = useNavigate();
  const { role, login } = useAuth();

  if (role) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  const handleRoleOpen = (selectedRole) => {
    const success = login(selectedRole);
    if (success) {
      nav(getDefaultRouteForRole(selectedRole), { replace: true });
    }
  };

  return (
    <main className="app-stage auth-stage">
      <div className="container auth-shell">
        <header className="auth-header">
          <a className="auth-brand" href="/" aria-label="HealthHive home">
            <img className="auth-brandmark" src="/healthhive-wordmark.svg" alt="HealthHive" />
          </a>
          <Button kind="ghost" className="auth-back" onClick={() => nav('/')}>
            Back
          </Button>
        </header>

        <section className="auth-layout">
          <div className="auth-copy">
            <p className="auth-eyebrow">Frontend shell</p>
            <h1 className="auth-title">Choose a workspace.</h1>
            <p className="auth-description">
              Sign-in inputs have been removed. Use one of the role buttons below to open the blank frontend views.
            </p>
          </div>

          <Card className="auth-card">
            <div className="auth-card-logo">
              <img src="/healthhive-wordmark.svg" alt="HealthHive" />
            </div>
            <p className="auth-card-eyebrow">Workspace access</p>
            <h2 className="auth-card-title">Open a role view</h2>
            <div className="auth-form">
              {ROLE_OPTIONS.map((item) => (
                <Button key={item.role} className="auth-submit" onClick={() => handleRoleOpen(item.role)}>
                  {item.label}
                </Button>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}

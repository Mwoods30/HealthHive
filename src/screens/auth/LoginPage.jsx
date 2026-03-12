import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import useAuth from '../../auth/useAuth';
import useDemoData from '../../data/useDemoData';
import { getDefaultRouteForRole, ROLE_OPTIONS, ROLE_PATIENT } from '../../auth/roleRoutes';
import './auth.css';

export default function LoginPage() {
  const nav = useNavigate();
  const { role, login } = useAuth();
  const { recordRoleLogin } = useDemoData();
  const [selectedRole, setSelectedRole] = useState(ROLE_PATIENT);

  if (role) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const success = login(selectedRole);
    if (success) {
      recordRoleLogin(selectedRole);
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
            <p className="auth-eyebrow">Sign in</p>
            <h1 className="auth-title">Choose the workspace that matches your role.</h1>
            <p className="auth-description">
              HealthHive keeps patient check-ins, provider review, and admin operations inside one calm interface.
            </p>

            <div className="auth-highlights" aria-hidden="true">
              <div className="auth-highlight">
                <span className="auth-highlight__value">01</span>
                <span className="auth-highlight__label">Patient tracking</span>
              </div>
              <div className="auth-highlight">
                <span className="auth-highlight__value">02</span>
                <span className="auth-highlight__label">Provider review</span>
              </div>
              <div className="auth-highlight">
                <span className="auth-highlight__value">03</span>
                <span className="auth-highlight__label">Admin control</span>
              </div>
            </div>
          </div>

          <Card className="auth-card">
            <p className="auth-card-eyebrow">Account access</p>
            <h2 className="auth-card-title">Select your role</h2>
            <p className="auth-card-copy">You will be routed to the correct dashboard after sign-in.</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="role-choice-list" role="radiogroup" aria-label="Login role">
                {ROLE_OPTIONS.map((item) => {
                  const isActive = selectedRole === item.role;
                  return (
                    <label key={item.role} className={`role-choice ${isActive ? 'role-choice--active' : ''}`}>
                      <input
                        className="role-choice-input"
                        type="radio"
                        name="role"
                        value={item.role}
                        checked={isActive}
                        onChange={() => setSelectedRole(item.role)}
                      />
                      <span className="role-choice-title">{item.label}</span>
                      <span className="role-choice-copy">{item.description}</span>
                    </label>
                  );
                })}
              </div>

              <Button type="submit" className="auth-submit">
                Continue
              </Button>
            </form>
          </Card>
        </section>
      </div>
    </main>
  );
}

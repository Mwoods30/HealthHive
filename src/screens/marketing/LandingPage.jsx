import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import useAuth from '../../auth/useAuth';
import { getDefaultRouteForRole } from '../../auth/roleRoutes';
import './marketing.css';

export default function LandingPage() {
  const nav = useNavigate();
  const { role, logout } = useAuth();
  const ctaLabel = role ? 'Dashboard' : 'Sign in';
  const ctaTarget = role ? getDefaultRouteForRole(role) : '/login';
  const heroImage =
    'https://thumbs.wbm.im/pw/medium/e38f3a563a4a84d3221a1c3c81a40e2c.jpg';
  const navItems = [
    ['Resources', '#resources'],
    ['Dashboard', '#dashboard'],
    ['How-to', '#how-to'],
    ['Contact Us', '#contact'],
  ];

  return (
    <main className="app-stage landing-stage">
      <div className="container landing-shell">
        <header className="landing-header">
          <a className="landing-brand" href="/" aria-label="HealthHive home">
            <img className="landing-brandmark" src="/healthhive-wordmark.svg" alt="HealthHive" />
          </a>

          <nav className="landing-nav" aria-label="Primary">
            {navItems.map(([label, href]) => (
              <a key={label} className="landing-nav__link" href={href}>
                {label}
              </a>
            ))}
          </nav>

          <div className="landing-actions">
            <Button className="landing-signin" onClick={() => nav(ctaTarget)}>
              <span>{ctaLabel}</span>
              {!role ? <span aria-hidden="true"></span> : null}
            </Button>
            {role ? (
              <button
                className="landing-logout"
                type="button"
                onClick={() => {
                  logout();
                  nav('/');
                }}
              >
                Log out
              </button>
            ) : null}
          </div>
        </header>

        <section className="landing-hero">
          <h1 className="landing-display">HealthHive</h1>
          <p className="landing-intro">
            Shared health tracking for patients, providers, and admins in one calm workspace.
          </p>

          <div className="landing-showcase" aria-hidden="true">
            <div className="landing-showcase__base" />
            <div className="landing-showcase__device">
              <img className="landing-showcase__image" src={heroImage} alt="" />
            </div>
          </div>
        </section>

        <section className="landing-detail-grid">
<break>
          <article className="landing-detail-card" id="resources">
            <p className="landing-detail-kicker">Resources</p>
            <p className="landing-detail-label">Practical guidance in one place</p>
            <p className="landing-detail-copy">
              Curated care guidance and updates without burying the page in clutter.
            </p>
          </article>
</break>
          <article className="landing-detail-card" id="dashboard">
            <p className="landing-detail-kicker">Dashboard</p>
            <p className="landing-detail-label">A focused home for every role</p>
            <p className="landing-detail-copy">
              A role-aware home screen for patients, providers, and administrators.
            </p>
          </article>
          <article className="landing-detail-card" id="how-to">
            <p className="landing-detail-kicker">How-to</p>
            <p className="landing-detail-label">Simple flows that stay clear</p>
            <p className="landing-detail-copy">
              Simple flows for logging symptoms, reviewing trends, and coordinating care.
            </p>
          </article>
          <article className="landing-detail-card" id="contact">
            <p className="landing-detail-kicker">Contact Us</p>
            <p className="landing-detail-label">Reach the HealthHive team</p>
            <p className="landing-detail-copy">
              Reach the team, sign in, and keep the experience moving from one place.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}

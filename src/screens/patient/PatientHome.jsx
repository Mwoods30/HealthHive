import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import './patient.css';

export default function PatientHome() {
  const nav = useNavigate();
  const { logout } = useAuth();

  return (
    <main className="app-stage">
      <div className="container">
        <header className="site-header">
          <div className="brand-lockup">
            <img className="brand-icon" src="/healthhive-icon.svg" alt="" aria-hidden="true" />
            <img className="brand-wordmark" src="/healthhive-wordmark.svg" alt="HealthHive" />
          </div>
          <ChipGroup className="top-nav">
            <Chip active>Home</Chip>
            <Chip onClick={() => nav('/patient/submit')}>Submit</Chip>
            <Chip onClick={() => nav('/patient/results')}>Results</Chip>
            <Chip onClick={() => nav('/patient/history')}>History</Chip>
            <Chip
              onClick={() => {
                logout();
                nav('/');
              }}
            >
              Logout
            </Chip>
          </ChipGroup>
        </header>

        <section className="hero-block">
          <p className="eyebrow">Daily Wellness Dashboard</p>
          <h1 className="hero-title">Health Advice at your Finger Tips</h1>
          <p className="muted hero-copy">
            Browse everything in one place, from symptom notes to trend snapshots and support resources.
          </p>
          <div className="hero-actions">
            <Button onClick={() => nav('/patient/submit')}>Submit symptoms</Button>
            <Button kind="secondary" onClick={() => nav('/patient/history')}>
              Open history
            </Button>
          </div>
          <div className="hero-visual" aria-hidden="true" />
        </section>

        <section className="section">
          <p className="section-label">See the Big Picture</p>
          <div className="visual-strip">
            <div className="visual visual--mountain" aria-hidden="true" />
            <div className="visual visual--sand" aria-hidden="true" />
          </div>
        </section>

        <section className="home-grid">
          <Card className="feature-card">
            <p className="h2">Why Choose HealthHive?</p>
            <ul className="feature-list">
              <li>One timeline for symptoms, medications, and outcomes.</li>
              <li>Fast, shareable summaries for provider appointments.</li>
              <li>Personalized weekly check-ins so progress stays visible.</li>
            </ul>
          </Card>
          <Card className="feature-card feature-card--sand">
            <p className="h2">Focus Areas</p>
            <p className="muted">Build healthy routines in small, trackable steps.</p>
            <ChipGroup style={{ marginTop: 10 }}>
              <Chip active>Sleep</Chip>
              <Chip>Stress</Chip>
              <Chip>Nutrition</Chip>
              <Chip>Hydration</Chip>
            </ChipGroup>
          </Card>
        </section>

        <section className="split-callout">
          <div className="callout-media" aria-hidden="true" />
          <div>
            <p className="h2">Map Your Success</p>
            <p className="muted" style={{ marginTop: 8 }}>
              Track your plan, review patterns, and adjust with confidence.
            </p>
            <div className="stats-row">
              <div className="stat-pill">
                <p className="stat-value">01</p>
                <p className="stat-label">Track symptoms</p>
              </div>
              <div className="stat-pill">
                <p className="stat-value">02</p>
                <p className="stat-label">Review trends</p>
              </div>
              <div className="stat-pill">
                <p className="stat-value">03</p>
                <p className="stat-label">Share updates</p>
              </div>
            </div>
          </div>
        </section>

        <Card className="contact-card">
          <p className="h2">Connect with us</p>
          <p className="muted" style={{ marginTop: 6 }}>
            Receive practical tips and product updates.
          </p>
          <form className="connect-form" onSubmit={(event) => event.preventDefault()}>
            <Input placeholder="Enter your email address" type="email" />
            <Button>Subscribe</Button>
          </form>
        </Card>

      </div>
    </main>
  );
}

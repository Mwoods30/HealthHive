import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import useDashboardAnimations from '../../hooks/useDashboardAnimations';
import './patient.css';

export default function PatientHome() {
  useDashboardAnimations();
  const nav = useNavigate();
  const { logout } = useAuth();
  const summaryCards = [
    { label: 'Profile', value: '—', detail: 'No stored profile data.' },
    { label: 'Submissions', value: '—', detail: 'No stored submission data.' },
    { label: 'Appointments', value: '—', detail: 'No stored appointment data.' },
    { label: 'Billing', value: '—', detail: 'No stored billing data.' },
  ];

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
            <Chip onClick={() => nav('/patient/appointments')}>Appointments</Chip>
            <Chip onClick={() => nav('/patient/medications')}>Medications</Chip>
            <Chip onClick={() => nav('/patient/billing')}>Billing</Chip>
            <Chip onClick={() => nav('/patient/settings')}>Settings</Chip>
            <Chip onClick={() => { logout(); nav('/'); }}>Logout</Chip>
          </ChipGroup>
        </header>

        <section className="patient-overview">
          <div className="patient-overview__main">
            <p className="eyebrow">Patient workspace</p>
            <h1 className="hero-title">This frontend is intentionally blank.</h1>
            <p className="muted patient-overview__copy">
              Seeded records, dashboard charts, and interactive patient inputs have been removed.
            </p>
          </div>

          <div className="patient-overview__panel">
            <p className="patient-panel__eyebrow">Status</p>
            <div className="patient-panel__score">
              <div>
                <p className="patient-panel__value patient-panel__value--small">0</p>
                <p className="patient-panel__label">Active items</p>
              </div>
              <p className="patient-panel__trend">Blank view</p>
            </div>
          </div>
        </section>

        <section className="patient-stat-grid" aria-label="Patient summary">
          {summaryCards.map((card) => (
            <Card key={card.label} className="patient-summary-card">
              <p className="patient-summary-card__label">{card.label}</p>
              <p className="patient-summary-card__value patient-summary-card__value--compact">{card.value}</p>
              <p className="patient-summary-card__detail">{card.detail}</p>
            </Card>
          ))}
        </section>

        <section className="patient-dashboard-grid">
          <div className="patient-column patient-column--main">
            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Workspace</p>
                  <h2 className="h2">Overview</h2>
                </div>
              </div>
              <p className="muted">No charts, recent activity, or provider updates are displayed in this stripped-down frontend view.</p>
            </Card>
          </div>

          <div className="patient-column patient-column--aside">
            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Records</p>
                  <h2 className="h2">Current state</h2>
                </div>
              </div>
              <div className="patient-detail-list">
                <div className="patient-detail-list__row">
                  <span>Medications</span>
                  <strong>—</strong>
                </div>
                <div className="patient-detail-list__row">
                  <span>Submissions</span>
                  <strong>—</strong>
                </div>
                <div className="patient-detail-list__row">
                  <span>Appointments</span>
                  <strong>—</strong>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

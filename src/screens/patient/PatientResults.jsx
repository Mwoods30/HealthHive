import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import useDashboardAnimations from '../../hooks/useDashboardAnimations';
import './patient.css';

export default function PatientResults() {
  useDashboardAnimations();
  const nav = useNavigate();
  const { logout } = useAuth();

  const metrics = [
    { label: 'Results', value: '—', detail: 'No saved result summaries.' },
    { label: 'Labs', value: '—', detail: 'No lab markers available.' },
    { label: 'Submissions', value: '—', detail: 'No data to interpret.' },
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
            <Chip onClick={() => nav('/patient')}>Home</Chip>
            <Chip onClick={() => nav('/patient/submit')}>Submit</Chip>
            <Chip active>Results</Chip>
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
            <p className="eyebrow">Results</p>
            <h1 className="hero-title">No result content is currently shown.</h1>
            <p className="muted patient-overview__copy">
              Insight cards, generated care plans, and lab trend summaries have been removed.
            </p>
          </div>
        </section>

        <section className="patient-stat-grid" aria-label="Result metrics">
          {metrics.map((metric) => (
            <Card key={metric.label} className="patient-summary-card">
              <p className="patient-summary-card__label">{metric.label}</p>
              <p className="patient-summary-card__value patient-summary-card__value--compact">{metric.value}</p>
              <p className="patient-summary-card__detail">{metric.detail}</p>
            </Card>
          ))}
        </section>

        <section className="patient-dashboard-grid">
          <div className="patient-column patient-column--main">
            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Interpretation</p>
                  <h2 className="h2">Blank view</h2>
                </div>
              </div>
              <p className="muted">There are no active clinical insights or recommendation blocks in this version of the UI.</p>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

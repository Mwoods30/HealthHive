import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import useDashboardAnimations from '../../hooks/useDashboardAnimations';
import '../patient/patient.css';
import './provider.css';

export default function ProviderDashboard() {
  useDashboardAnimations();
  const nav = useNavigate();
  const { logout } = useAuth();

  const metrics = [
    { label: 'Queue items', value: '—', detail: 'No triage actions are active.' },
    { label: 'Appointments', value: '—', detail: 'No scheduling controls are shown.' },
    { label: 'Provider', value: '—', detail: 'No profile details are prefilled.' },
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
            <Chip active>Dashboard</Chip>
            <Chip onClick={() => nav('/provider/patients')}>Patients</Chip>
            <Chip onClick={() => nav('/provider/settings')}>Settings</Chip>
            <Chip onClick={() => { logout(); nav('/'); }}>Logout</Chip>
          </ChipGroup>
        </header>

        <section className="patient-overview">
          <div className="patient-overview__main">
            <p className="eyebrow">Provider workspace</p>
            <h1 className="hero-title">This provider dashboard is intentionally blank.</h1>
            <p className="muted patient-overview__copy">
              Queue filters, follow-up scheduling, note entry, and patient editing have been removed.
            </p>
          </div>
        </section>

        <section className="patient-stat-grid" aria-label="Provider summary">
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
                  <p className="patient-section-kicker">Queue</p>
                  <h2 className="h2">Review area</h2>
                </div>
              </div>
              <div className="filter-bar">
                <div className="filter-bar__input">
                  <Input defaultValue="" />
                </div>
              </div>
              <p className="muted">No review queue data is loaded.</p>
            </Card>
          </div>

          <div className="patient-column patient-column--aside">
            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Schedule</p>
                  <h2 className="h2">Visits</h2>
                </div>
              </div>
              <div className="inline-form-grid">
                <label className="inline-form-field">
                  <span className="field-label">Patient</span>
                  <Input defaultValue="" />
                </label>
                <label className="inline-form-field">
                  <span className="field-label">Date</span>
                  <Input type="date" defaultValue="" />
                </label>
                <label className="inline-form-field">
                  <span className="field-label">Time</span>
                  <Input type="time" defaultValue="" />
                </label>
                <label className="inline-form-field">
                  <span className="field-label">Visit title</span>
                  <Input defaultValue="" />
                </label>
              </div>
              <div className="actions-row">
                <Button type="button">Schedule</Button>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

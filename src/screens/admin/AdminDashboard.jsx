import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import useDashboardAnimations from '../../hooks/useDashboardAnimations';
import '../patient/patient.css';
import './admin.css';

export default function AdminDashboard() {
  useDashboardAnimations();
  const nav = useNavigate();
  const { logout } = useAuth();
 
  const metrics = [
    { label: 'Patients', value: '—', detail: 'No seeded patient records are shown.' },
    { label: 'Approvals', value: '—', detail: 'No approval workflow controls are active.' },
    { label: 'Support issues', value: '—', detail: 'No issue form is displayed.' },
    { label: 'Audit events', value: '—', detail: 'Audit filtering has been removed.' },
  ];

  return (
    <main className="app-stage admin-stage">
      <div className="container">
        <header className="site-header">
          <div className="brand-lockup">
            <img className="brand-icon" src="/healthhive-icon.svg" alt="" aria-hidden="true" />
            <img className="brand-wordmark" src="/healthhive-wordmark.svg" alt="HealthHive" />
          </div>
          <ChipGroup className="top-nav">
            <Chip active>Site Admin</Chip>
            <Chip onClick={() => { logout(); nav('/'); }}>Logout</Chip>
          </ChipGroup>
        </header>

        <section className="patient-overview">
          <div className="patient-overview__main">
            <p className="eyebrow">Administration</p>
            <h1 className="hero-title">The admin frontend is now a blank shell.</h1>
            <p className="muted patient-overview__copy">
              Approval tools, support issue inputs, and audit search controls have been removed.
            </p>
          </div>
        </section>

        <section className="patient-stat-grid" aria-label="Admin summary">
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
                  <p className="patient-section-kicker">Workflows</p>
                  <h2 className="h2">Operations</h2>
                </div>
              </div>
              <div className="inline-form-grid">
                <label className="inline-form-field inline-form-field--wide">
                  <span className="field-label">Issue title</span>
                  <Input defaultValue="" />
                </label>
                <label className="inline-form-field inline-form-field--wide">
                  <span className="field-label">Issue note</span>
                  <Input defaultValue="" />
                </label>
              </div>
              <div className="filter-bar" style={{ marginTop: 16 }}>
                <div className="filter-bar__input">
                  <Input defaultValue="" />
                </div>
              </div>
              <div className="actions-row">
                <Button type="button">Save</Button>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

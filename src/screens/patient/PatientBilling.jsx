import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import useDashboardAnimations from '../../hooks/useDashboardAnimations';
import './patient.css';

export default function PatientBilling() {
  useDashboardAnimations();
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
            <Chip onClick={() => nav('/patient')}>Home</Chip>
            <Chip onClick={() => nav('/patient/submit')}>Submit</Chip>
            <Chip onClick={() => nav('/patient/results')}>Results</Chip>
            <Chip onClick={() => nav('/patient/history')}>History</Chip>
            <Chip onClick={() => nav('/patient/appointments')}>Appointments</Chip>
            <Chip onClick={() => nav('/patient/medications')}>Medications</Chip>
            <Chip active>Billing</Chip>
            <Chip onClick={() => nav('/patient/settings')}>Settings</Chip>
            <Chip onClick={() => { logout(); nav('/'); }}>Logout</Chip>
          </ChipGroup>
        </header>

        <section className="patient-overview">
          <div className="patient-overview__main">
            <p className="eyebrow">Billing</p>
            <h1 className="hero-title">No payment workflow is active.</h1>
            <p className="muted patient-overview__copy">
              Payment inputs, support requests, and billing actions have been removed from this frontend.
            </p>
          </div>
          <div className="patient-overview__panel">
            <p className="patient-panel__eyebrow">Outstanding</p>
            <div className="patient-panel__score">
              <div>
                <p className="patient-panel__value patient-panel__value--small">—</p>
                <p className="patient-panel__label">Balance</p>
              </div>
              <p className="patient-panel__trend">No payment data</p>
            </div>
          </div>
        </section>

        <Card className="patient-dashboard-card">
          <div className="patient-detail-list">
            <div className="patient-detail-list__row">
              <span>Invoice</span>
              <strong>—</strong>
            </div>
            <div className="patient-detail-list__row">
              <span>Due date</span>
              <strong>—</strong>
            </div>
            <div className="patient-detail-list__row">
              <span>Amount</span>
              <strong>—</strong>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

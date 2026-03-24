import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import useDashboardAnimations from '../../hooks/useDashboardAnimations';
import './patient.css';

export default function PatientAppointments() {
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
            <Chip active>Appointments</Chip>
            <Chip onClick={() => nav('/patient/medications')}>Medications</Chip>
            <Chip onClick={() => nav('/patient/billing')}>Billing</Chip>
            <Chip onClick={() => nav('/patient/settings')}>Settings</Chip>
            <Chip onClick={() => { logout(); nav('/'); }}>Logout</Chip>
          </ChipGroup>
        </header>

        <section className="patient-overview">
          <div className="patient-overview__main">
            <p className="eyebrow">Appointments</p>
            <h1 className="hero-title">This schedule view is blank.</h1>
            <p className="muted patient-overview__copy">
              Appointment cards and cancel controls have been removed from the patient frontend.
            </p>
          </div>
          <div className="patient-overview__panel">
            <p className="patient-panel__eyebrow">Count</p>
            <div className="patient-panel__score">
              <div>
                <p className="patient-panel__value patient-panel__value--small">—</p>
                <p className="patient-panel__label">Appointments</p>
              </div>
              <p className="patient-panel__trend">No schedule detail</p>
            </div>
          </div>
        </section>

        <Card className="patient-dashboard-card">
          <div className="patient-detail-list">
            <div className="patient-detail-list__row">
              <span>Date</span>
              <strong>—</strong>
            </div>
            <div className="patient-detail-list__row">
              <span>Time</span>
              <strong>—</strong>
            </div>
            <div className="patient-detail-list__row">
              <span>Provider</span>
              <strong>—</strong>
            </div>
            <div className="patient-detail-list__row">
              <span>Location</span>
              <strong>—</strong>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

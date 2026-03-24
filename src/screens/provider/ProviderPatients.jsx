import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import useDashboardAnimations from '../../hooks/useDashboardAnimations';
import '../patient/patient.css';
import './provider.css';

export default function ProviderPatients() {
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
            <Chip onClick={() => nav('/provider')}>Dashboard</Chip>
            <Chip active>Patients</Chip>
            <Chip onClick={() => nav('/provider/settings')}>Settings</Chip>
            <Chip onClick={() => { logout(); nav('/'); }}>Logout</Chip>
          </ChipGroup>
        </header>

        <section className="patient-overview">
          <div className="patient-overview__main">
            <p className="eyebrow">Patients</p>
            <h1 className="hero-title">Patient management has been cleared out.</h1>
            <p className="muted patient-overview__copy">
              Search, side panels, and add-data tools have been removed from this screen.
            </p>
          </div>
          <div className="patient-overview__panel">
            <p className="patient-panel__eyebrow">Count</p>
            <div className="patient-panel__score">
              <div>
                <p className="patient-panel__value patient-panel__value--small">—</p>
                <p className="patient-panel__label">Patient records</p>
              </div>
            </div>
          </div>
        </section>

        <Card className="patient-dashboard-card">
          <div className="patient-section-head">
            <div>
              <p className="patient-section-kicker">Roster</p>
              <h2 className="h2">Empty patient list</h2>
            </div>
          </div>
          <div className="filter-bar" style={{ marginBottom: 16 }}>
            <div className="filter-bar__input">
              <Input defaultValue="" />
            </div>
          </div>
          <div className="patients-grid">
            <article className="patient-card">
              <div className="patient-card__row">
                <div className="patient-card__avatar" aria-hidden="true">--</div>
                <div className="patient-card__body">
                  <h3 className="patient-card__name">Empty patient card</h3>
                  <p className="patient-card__email">No record loaded</p>
                </div>
              </div>
            </article>
          </div>
        </Card>
      </div>
    </main>
  );
}

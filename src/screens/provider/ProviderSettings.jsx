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

export default function ProviderSettings() {
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
            <Chip active>Settings</Chip>
            <Chip onClick={() => { logout(); nav('/'); }}>Logout</Chip>
          </ChipGroup>
        </header>

        <section className="patient-overview">
          <div className="patient-overview__main">
            <p className="eyebrow">Settings</p>
            <h1 className="hero-title">Provider fields are empty.</h1>
            <p className="muted patient-overview__copy">
              The provider layout remains, but no data is stored or prefilled.
            </p>
          </div>
        </section>

        <Card className="patient-dashboard-card">
          <div className="patient-section-head">
            <div>
              <p className="patient-section-kicker">Profile</p>
              <h2 className="h2">Empty credential fields</h2>
            </div>
          </div>
          <form className="patient-form-grid">
            <div className="patient-form-field patient-form-field--wide">
              <label className="field-label">Full name</label>
              <Input defaultValue="" />
            </div>
            <div className="patient-form-field patient-form-field--wide">
              <label className="field-label">Specialty</label>
              <Input defaultValue="" />
            </div>
            <div className="patient-form-field">
              <label className="field-label">License number</label>
              <Input defaultValue="" />
            </div>
            <div className="patient-form-field">
              <label className="field-label">License state</label>
              <Input defaultValue="" />
            </div>
            <div className="patient-form-field">
              <label className="field-label">NPI number</label>
              <Input defaultValue="" />
            </div>
            <div className="patient-form-field">
              <label className="field-label">DEA number</label>
              <Input defaultValue="" />
            </div>
            <div className="patient-form-field patient-form-field--wide">
              <label className="field-label">Board certification</label>
              <Input defaultValue="" />
            </div>
            <div className="actions-row">
              <Button type="button">Save</Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}

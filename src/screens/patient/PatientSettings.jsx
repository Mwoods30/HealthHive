import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import useDashboardAnimations from '../../hooks/useDashboardAnimations';
import './patient.css';

export default function PatientSettings() {
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
            <Chip onClick={() => nav('/patient/billing')}>Billing</Chip>
            <Chip active>Settings</Chip>
            <Chip onClick={() => { logout(); nav('/'); }}>Logout</Chip>
          </ChipGroup>
        </header>

        <section className="patient-overview">
          <div className="patient-overview__main">
            <p className="eyebrow">Settings</p>
            <h1 className="hero-title">Profile fields are empty.</h1>
            <p className="muted patient-overview__copy">
              The layout stays in place, but no data is prefilled and nothing is stored.
            </p>
          </div>
        </section>

        <Card className="patient-dashboard-card">
          <div className="patient-section-head">
            <div>
              <p className="patient-section-kicker">Profile</p>
              <h2 className="h2">Empty account fields</h2>
            </div>
          </div>
          <form className="patient-form-grid">
            <div className="patient-form-field patient-form-field--wide">
              <label className="field-label">Full name</label>
              <Input defaultValue="" />
            </div>
            <div className="patient-form-field">
              <label className="field-label">Phone</label>
              <Input defaultValue="" />
            </div>
            <div className="patient-form-field">
              <label className="field-label">Date of birth</label>
              <Input type="date" defaultValue="" />
            </div>
            <div className="patient-form-field">
              <label className="field-label">Sex</label>
              <select className="signup-select" defaultValue="">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="patient-form-field patient-form-field--wide">
              <label className="field-label">Insurance</label>
              <Input defaultValue="" />
            </div>
            <div className="patient-form-field">
              <label className="field-label">Member ID</label>
              <Input defaultValue="" />
            </div>
            <div className="patient-form-field">
              <label className="field-label">Coverage</label>
              <Input defaultValue="" />
            </div>
            <div className="patient-form-field patient-form-field--wide">
              <label className="field-label">Pharmacy</label>
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

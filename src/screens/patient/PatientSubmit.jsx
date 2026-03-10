import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import './patient.css';

export default function PatientSubmit() {
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
            <Chip active>Submit</Chip>
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

        <div className="screen-head">
          <h1 className="h1">Submit Symptoms</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            Add a quick daily check-in for your care timeline.
          </p>
        </div>

        <Card>
          <form className="screen-stack" onSubmit={(event) => event.preventDefault()}>
            <div className="field">
              <label className="field-label">Symptoms</label>
              <Input placeholder="Headache, sore throat, fatigue..." />
            </div>

            <div className="field">
              <label className="field-label">Duration</label>
              <Input placeholder="Example: 2 days" />
            </div>

            <div className="field">
              <label className="field-label">Notes</label>
              <Input placeholder="Any triggers or changes?" />
            </div>

            <div className="actions-row">
              <Button>Submit entry</Button>
              <Button kind="secondary" type="button" onClick={() => nav('/patient')}>
                Back home
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import './patient.css';

export default function PatientHistory() {
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
            <Chip active>History</Chip>
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
          <h1 className="h1">History</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            Review your most recent submissions and check-ins.
          </p>
        </div>

        <Card>
          <div className="item-list">
            <article className="item">
              <p className="item-title">March 10, 2026</p>
              <p className="meta">Fatigue reduced, energy improved by afternoon.</p>
            </article>
            <article className="item">
              <p className="item-title">March 08, 2026</p>
              <p className="meta">Mild headache after lunch, resolved in evening.</p>
            </article>
            <article className="item">
              <p className="item-title">March 06, 2026</p>
              <p className="meta">Quality sleep and no major symptoms.</p>
            </article>
          </div>

          <div className="actions-row">
            <Button kind="secondary">Export summary</Button>
            <Button kind="ghost" onClick={() => nav('/patient')}>
              Return home
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}

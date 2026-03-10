import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import './patient.css';

export default function PatientResults() {
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
            <Chip active>Results</Chip>
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
          <h1 className="h1">Results</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            Your latest wellness insights and trend snapshots.
          </p>
        </div>

        <Card>
          <div className="item-list">
            <article className="item">
              <p className="item-title">Daily Review: Improving</p>
              <p className="meta">Updated March 10, 2026 • Low concern</p>
            </article>
            <article className="item">
              <p className="item-title">Hydration Consistency</p>
              <p className="meta">Updated March 09, 2026 • 6 day streak</p>
            </article>
            <article className="item">
              <p className="item-title">Sleep Pattern</p>
              <p className="meta">Updated March 08, 2026 • 7.2h average</p>
            </article>
          </div>

          <div className="actions-row">
            <Button kind="secondary">View details</Button>
            <Button kind="ghost" onClick={() => nav('/patient')}>
              Return home
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import '../patient/patient.css';

export default function ProviderDashboard() {
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
            <Chip active>Provider</Chip>
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
          <h1 className="h1">Provider Dashboard</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            Monitor patient trends and prioritize follow-ups.
          </p>
        </div>

        <Card>
          <div className="item-list">
            <article className="item">
              <p className="item-title">4 Patients Need Review</p>
              <p className="meta">High symptom variance in last 48 hours.</p>
            </article>
            <article className="item">
              <p className="item-title">8 Weekly Reports Ready</p>
              <p className="meta">Summaries generated for telehealth queue.</p>
            </article>
          </div>

          <div className="actions-row">
            <Button>Open patient list</Button>
          </div>
        </Card>
      </div>
    </main>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import '../patient/patient.css';

export default function AdminDashboard() {
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
            <Chip active>Site Admin</Chip>
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
          <h1 className="h1">Site Admin Dashboard</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            Configure platform settings and review operational health.
          </p>
        </div>

        <Card>
          <div className="item-list">
            <article className="item">
              <p className="item-title">System Status</p>
              <p className="meta">All services healthy • Last check March 10, 2026</p>
            </article>
            <article className="item">
              <p className="item-title">Account Activity</p>
              <p className="meta">3 new provider invites pending approval.</p>
            </article>
          </div>

          <div className="actions-row">
            <Button>Open settings</Button>
          </div>
        </Card>
      </div>
    </main>
  );
}

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import useDemoData from '../../data/useDemoData';
import '../patient/patient.css';

export default function AdminDashboard() {
  const nav = useNavigate();
  const { logout } = useAuth();
  const {
    submissions,
    pendingApprovals,
    openSupportIssues,
    auditFeed,
    approveProvider,
    resolveSupportIssue,
  } = useDemoData();
  const [adminNotice, setAdminNotice] = useState('');

  const patientCount = useMemo(() => new Set(submissions.map((item) => item.patientName)).size, [submissions]);
  const providerCount = pendingApprovals.length + 1;
  const adminCount = 1;
  const totalAccounts = patientCount + providerCount + adminCount || 1;

  const adminMetrics = [
    { label: 'Platform uptime', value: '99.98%', detail: 'No critical incidents this week' },
    {
      label: 'Pending provider approvals',
      value: String(pendingApprovals.length),
      detail: 'Approval actions here update the shared demo operations state.',
    },
    {
      label: 'Tracked patient records',
      value: String(patientCount),
      detail: 'Derived from unique patient names across the stored submissions.',
    },
    {
      label: 'Open support issues',
      value: String(openSupportIssues.length),
      detail: 'Support queue actions are persisted in the admin demo workflow.',
    },
  ];

  const systemHealth = [
    { label: 'API services', value: openSupportIssues.length > 4 ? 'Watch' : 'Healthy' },
    { label: 'Database latency', value: `${40 + openSupportIssues.length} ms` },
    { label: 'Claim sync jobs', value: openSupportIssues.length ? 'Needs review' : 'On schedule' },
    { label: 'Audit ingestion', value: auditFeed.length ? 'Healthy' : 'Idle' },
  ];

  const accountActivity = [
    {
      title: 'Provider onboarding',
      note: `${pendingApprovals.length} provider approvals are still waiting on admin action.`,
    },
    {
      title: 'Patient record growth',
      note: `${patientCount} patient records are represented in the current demo submission set.`,
    },
    {
      title: 'Billing support backlog',
      note: `${openSupportIssues.length} support issues remain open for billing or access follow-up.`,
    },
  ];

  const roleMix = [
    {
      label: 'Patients',
      count: String(patientCount),
      value: Math.round((patientCount / totalAccounts) * 100),
    },
    {
      label: 'Providers',
      count: String(providerCount),
      value: Math.round((providerCount / totalAccounts) * 100),
    },
    {
      label: 'Admins',
      count: String(adminCount),
      value: Math.round((adminCount / totalAccounts) * 100),
    },
  ];

  const adminTasks = [
    {
      title: 'Review provider approvals',
      note: `${pendingApprovals.length} pending requests are blocking onboarding completion.`,
      state: pendingApprovals.length ? 'Priority' : 'Clear',
    },
    {
      title: 'Resolve support backlog',
      note: `${openSupportIssues.length} support tickets currently need operational follow-up.`,
      state: openSupportIssues.length ? 'Open' : 'Stable',
    },
    {
      title: 'Inspect recent audits',
      note: `${Math.min(auditFeed.length, 5)} recent high-value audit events are visible below.`,
      state: 'Monitor',
    },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleApprove = (approvalId, name) => {
    approveProvider(approvalId);
    setAdminNotice(`${name} was approved and moved out of the onboarding queue.`);
  };

  const handleResolveIssue = (issueId, title) => {
    resolveSupportIssue(issueId);
    setAdminNotice(`${title} was marked resolved in the admin support queue.`);
  };

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
            <Chip onClick={() => scrollToSection('admin-users')}>Users</Chip>
            <Chip onClick={() => scrollToSection('admin-audit')}>Audit</Chip>
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

        <section className="patient-overview">
          <div className="patient-overview__main">
            <p className="eyebrow">Platform operations</p>
            <h1 className="hero-title">Track system health, user activity, and approval workflows.</h1>
            <p className="muted patient-overview__copy">
              The admin view now controls onboarding approvals, support issue resolution, and the audit feed shown throughout the demo platform.
            </p>
            <p className="prototype-banner">
              Demo mode: approvals and support actions persist locally so platform operations feel connected to the rest of the app.
            </p>
            {adminNotice ? <p className="dashboard-notice">{adminNotice}</p> : null}
            <div className="patient-overview__actions">
              <Button onClick={() => scrollToSection('admin-users')}>Review approvals</Button>
              <Button kind="secondary" onClick={() => scrollToSection('admin-support')}>
                Open support queue
              </Button>
            </div>
          </div>

          <div className="patient-overview__panel">
            <p className="patient-panel__eyebrow">System snapshot</p>
            <div className="patient-panel__score">
              <div>
                <p className="patient-panel__value patient-panel__value--small">
                  {openSupportIssues.length > 4 ? 'Watch' : 'Healthy'}
                </p>
                <p className="patient-panel__label">Core platform services operating normally</p>
              </div>
              <p className="patient-panel__trend">Last sync 8 min ago</p>
            </div>
            <div className="patient-panel__list">
              <div className="patient-panel__item">
                <span>Pending approvals</span>
                <strong>{pendingApprovals.length}</strong>
              </div>
              <div className="patient-panel__item">
                <span>Open support tickets</span>
                <strong>{openSupportIssues.length}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="patient-stat-grid" aria-label="Admin metrics">
          {adminMetrics.map((metric) => (
            <Card key={metric.label} className="patient-summary-card">
              <p className="patient-summary-card__label">{metric.label}</p>
              <p className="patient-summary-card__value patient-summary-card__value--compact">{metric.value}</p>
              <p className="patient-summary-card__detail">{metric.detail}</p>
            </Card>
          ))}
        </section>

        <section className="patient-dashboard-grid">
          <div className="patient-column patient-column--main">
            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">System health</p>
                  <h2 className="h2">Operational services</h2>
                </div>
              </div>
              <div className="patient-detail-list">
                {systemHealth.map((item) => (
                  <div key={item.label} className="patient-detail-list__row">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Account activity</p>
                  <h2 className="h2">Recent platform signals</h2>
                </div>
              </div>
              <div className="operations-list">
                {accountActivity.map((item) => (
                  <article key={item.title} className="operations-list__item">
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.note}</p>
                    </div>
                    <div className="operations-list__meta">
                      <span className="patient-tag patient-tag--soft">Open</span>
                    </div>
                  </article>
                ))}
              </div>
            </Card>

            <div className="ops-dual-grid">
              <Card className="patient-dashboard-card" id="admin-users">
                <div className="patient-section-head">
                  <div>
                    <p className="patient-section-kicker">User distribution</p>
                    <h2 className="h2">Current role mix</h2>
                  </div>
                </div>
                <div className="status-meter-list">
                  {roleMix.map((item) => (
                    <div key={item.label} className="status-meter">
                      <div className="status-meter__row">
                        <span>{item.label}</span>
                        <strong>{item.count}</strong>
                      </div>
                      <div className="status-meter__bar">
                        <span style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="patient-dashboard-card">
                <div className="patient-section-head">
                  <div>
                    <p className="patient-section-kicker">Approvals</p>
                    <h2 className="h2">Provider onboarding queue</h2>
                  </div>
                </div>
                <div className="review-board">
                  {pendingApprovals.map((item) => (
                    <article key={item.id} className="review-board__row">
                      <div className="review-board__meta">
                        <div>
                          <h3>{item.name}</h3>
                          <p>{item.role} • {item.org}</p>
                        </div>
                        <p className="meta">{item.state}</p>
                      </div>
                      <div className="review-board__actions">
                        <span className="patient-tag patient-tag--soft">{item.status}</span>
                        <Button type="button" onClick={() => handleApprove(item.id, item.name)}>
                          Approve
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <div className="patient-column patient-column--aside">
            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Actions</p>
                  <h2 className="h2">Admin workflow</h2>
                </div>
              </div>
              <div className="dashboard-list">
                <div className="dashboard-list__row">
                  <span className="dashboard-list__bullet" aria-hidden="true" />
                  <p>Approve provider invites and verify credentials.</p>
                </div>
                <div className="dashboard-list__row">
                  <span className="dashboard-list__bullet" aria-hidden="true" />
                  <p>Review billing support issues tied to recent claim activity.</p>
                </div>
                <div className="dashboard-list__row">
                  <span className="dashboard-list__bullet" aria-hidden="true" />
                  <p>Monitor audit logs for permission changes and high-risk actions.</p>
                </div>
              </div>
            </Card>

            <Card className="patient-dashboard-card" id="admin-support">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Support queue</p>
                  <h2 className="h2">Open operational issues</h2>
                </div>
              </div>
              <div className="review-board">
                {openSupportIssues.map((item) => (
                  <article key={item.id} className="review-board__row">
                    <div className="review-board__meta">
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.note}</p>
                      </div>
                    </div>
                    <div className="review-board__actions">
                      <span className="patient-tag patient-tag--soft">{item.status}</span>
                      <Button type="button" onClick={() => handleResolveIssue(item.id, item.title)}>
                        Resolve
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </Card>

            <Card className="patient-dashboard-card" id="admin-audit">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Audit feed</p>
                  <h2 className="h2">Recent high-value events</h2>
                </div>
              </div>
              <div className="feed-list">
                {auditFeed.slice(0, 5).map((item) => (
                  <article key={item.id} className="feed-list__item">
                    <div className="feed-list__top">
                      <strong>{item.event}</strong>
                      <span>{item.time}</span>
                    </div>
                    <p>{item.actor}</p>
                    <p className="meta" style={{ marginTop: 4 }}>{item.detail}</p>
                  </article>
                ))}
              </div>
            </Card>

            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Admin queue</p>
                  <h2 className="h2">Operational priorities</h2>
                </div>
              </div>
              <div className="operations-list">
                {adminTasks.map((task) => (
                  <article key={task.title} className="operations-list__item">
                    <div>
                      <h3>{task.title}</h3>
                      <p>{task.note}</p>
                    </div>
                    <div className="operations-list__meta">
                      <span className="patient-tag patient-tag--soft">{task.state}</span>
                    </div>
                  </article>
                ))}
              </div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

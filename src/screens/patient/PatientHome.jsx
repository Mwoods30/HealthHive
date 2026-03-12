import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import useDemoData from '../../data/useDemoData';
import './patient.css';

const fallbackTrendData = [
  { day: 'Mon', score: 72 },
  { day: 'Tue', score: 76 },
  { day: 'Wed', score: 74 },
  { day: 'Thu', score: 81 },
  { day: 'Fri', score: 84 },
  { day: 'Sat', score: 82 },
  { day: 'Sun', score: 86 },
];

const vitals = [
  { label: 'Blood pressure', value: '118/76', trend: 'Stable' },
  { label: 'Resting heart rate', value: '68 bpm', trend: 'Down 3 bpm' },
  { label: 'Sleep average', value: '7.6 hrs', trend: 'Above goal' },
  { label: 'Weight trend', value: '154 lb', trend: 'Flat 30 days' },
];

const medications = [
  { name: 'Metformin', dosage: '500 mg', schedule: '2x daily', refill: 'Refill in 8 days' },
  { name: 'Vitamin D3', dosage: '2000 IU', schedule: 'Daily', refill: 'On hand' },
  { name: 'Lisinopril', dosage: '10 mg', schedule: 'Morning', refill: 'Refill requested' },
];

const labs = [
  { label: 'A1C', value: '5.6%', status: 'In range' },
  { label: 'LDL', value: '94 mg/dL', status: 'Improving' },
  { label: 'Vitamin D', value: '31 ng/mL', status: 'Low-normal' },
];

const severityRank = {
  low: 1,
  moderate: 2,
  high: 3,
};

function buildChartPoints(data) {
  const chartWidth = 516;
  const spacing = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;

  return data
    .map((point, index) => {
      const x = 44 + index * spacing;
      const y = 184 - (point.score / 100) * 112;
      return `${x},${y}`;
    })
    .join(' ');
}

function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function calculateScore(submission) {
  const base = 92 - (severityRank[submission.severity] || 1) * 10;
  const sleep = Number(submission.sleep);
  const hydration = Number(submission.hydration);
  const sleepAdjustment = Number.isFinite(sleep) ? Math.min(8, Math.round((sleep - 6) * 4)) : 0;
  const hydrationAdjustment = Number.isFinite(hydration) ? Math.min(6, hydration - 5) : 0;
  return Math.max(48, Math.min(92, base + sleepAdjustment + hydrationAdjustment));
}

function statusLabel(status) {
  return status.replace('_', ' ');
}

export default function PatientHome() {
  const nav = useNavigate();
  const { logout } = useAuth();
  const {
    patientProfile,
    patientSubmissions,
    patientAppointments,
    patientBillingItems,
    outstandingBalance,
    buildSubmissionSummary,
    formatDisplayDate,
    payBillingItem,
  } = useDemoData();
  const [dashboardNotice, setDashboardNotice] = useState('');
  const [showStatements, setShowStatements] = useState(false);

  const reviewedCount = patientSubmissions.filter((item) =>
    ['reviewed', 'resolved'].includes(item.status)
  ).length;
  const chartData = useMemo(() => {
    const entries = patientSubmissions
      .slice(0, 7)
      .reverse()
      .map((submission) => ({
        day: new Date(submission.submittedAt).toLocaleDateString('en-US', { weekday: 'short' }),
        score: calculateScore(submission),
      }));

    return entries.length ? entries : fallbackTrendData;
  }, [patientSubmissions]);
  const chartPoints = buildChartPoints(chartData);
  const chartArea = `44,184 ${chartPoints} ${44 + 516},184`;
  const nextAppointment = patientAppointments[0];
  const unresolvedBills = patientBillingItems.filter((item) => item.status !== 'paid');
  const unpaidBill = patientBillingItems.find((item) => item.status === 'unpaid');

  const summaryCards = [
    {
      label: 'Recent submissions',
      value: String(patientSubmissions.length),
      detail: `${reviewedCount} already reviewed or resolved by the provider workflow.`,
    },
    {
      label: 'Open bills',
      value: formatMoney(outstandingBalance),
      detail: `${unresolvedBills.length} current billing items still need attention.`,
    },
    {
      label: 'Coverage status',
      value: patientProfile.coverageStatus,
      detail: patientProfile.insurancePlan,
    },
    {
      label: 'Next appointment',
      value: nextAppointment ? nextAppointment.dateLabel : 'TBD',
      detail: nextAppointment ? nextAppointment.title : 'No upcoming appointments',
    },
  ];

  const adherenceData = [
    {
      label: 'Submission review rate',
      value: patientSubmissions.length ? Math.round((reviewedCount / patientSubmissions.length) * 100) : 0,
    },
    {
      label: 'Sleep goal completion',
      value: patientSubmissions.length
        ? Math.round(
            (patientSubmissions.filter((item) => Number(item.sleep) >= 7).length / patientSubmissions.length) * 100
          )
        : 0,
    },
    {
      label: 'Hydration goal',
      value: patientSubmissions.length
        ? Math.round(
            (patientSubmissions.filter((item) => Number(item.hydration) >= 7).length / patientSubmissions.length) * 100
          )
        : 0,
    },
    { label: 'Visit readiness', value: nextAppointment ? 88 : 0 },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePayBalance = () => {
    if (!unpaidBill) {
      setDashboardNotice('No unpaid balance is ready for payment right now.');
      return;
    }

    payBillingItem(unpaidBill.id);
    setDashboardNotice(`${unpaidBill.label} was marked paid in the demo billing workflow.`);
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
            <Chip active>Home</Chip>
            <Chip onClick={() => nav('/patient/submit')}>Submit</Chip>
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

        <section className="patient-overview">
          <div className="patient-overview__main">
            <p className="eyebrow">Patient dashboard</p>
            <h1 className="hero-title">Everything important for your care, billing, and next steps.</h1>
            <p className="muted patient-overview__copy">
              Review health trends, check previous submissions, confirm appointments, and stay on top
              of insurance and billing from one dashboard.
            </p>
            <p className="prototype-banner">
              Prototype mode: dashboard metrics and records are now shared demo data and update across the app.
            </p>
            {dashboardNotice ? <p className="dashboard-notice">{dashboardNotice}</p> : null}
            <div className="patient-overview__actions">
              <Button onClick={() => nav('/patient/submit')}>Submit symptoms</Button>
              <Button kind="secondary" onClick={() => nav('/patient/history')}>
                Review history
              </Button>
              <Button kind="ghost" onClick={() => nav('/patient/results')}>
                Open results
              </Button>
            </div>
            <ChipGroup className="patient-overview__chips">
              <Chip active>{patientProfile.coverageStatus} coverage</Chip>
              <Chip onClick={() => scrollToSection('patient-appointments')}>
                {patientAppointments.length} appointments scheduled
              </Chip>
              <Chip onClick={() => scrollToSection('patient-billing')}>
                {unresolvedBills.length} balances open
              </Chip>
            </ChipGroup>
          </div>

          <div className="patient-overview__panel">
            <p className="patient-panel__eyebrow">Today at a glance</p>
            <div className="patient-panel__score">
              <div>
                <p className="patient-panel__value">{chartData[chartData.length - 1]?.score ?? 0}</p>
                <p className="patient-panel__label">Current health score</p>
              </div>
              <p className="patient-panel__trend">
                {reviewedCount} of {patientSubmissions.length} reviewed
              </p>
            </div>
            <div className="patient-panel__list">
              <div className="patient-panel__item">
                <span>Next visit</span>
                <strong>{nextAppointment ? `${nextAppointment.dateLabel}, ${nextAppointment.time}` : 'TBD'}</strong>
              </div>
              <div className="patient-panel__item">
                <span>Outstanding balance</span>
                <strong>{formatMoney(outstandingBalance)}</strong>
              </div>
              <div className="patient-panel__item">
                <span>Claims status</span>
                <strong>{unresolvedBills.find((item) => item.status === 'in_review') ? '1 in review' : 'Clear'}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="patient-stat-grid" aria-label="Patient summary">
          {summaryCards.map((card) => (
            <Card key={card.label} className="patient-summary-card">
              <p className="patient-summary-card__label">{card.label}</p>
              <p className="patient-summary-card__value">{card.value}</p>
              <p className="patient-summary-card__detail">{card.detail}</p>
            </Card>
          ))}
        </section>

        <section className="patient-dashboard-grid">
          <div className="patient-column patient-column--main">
            <Card className="patient-dashboard-card patient-chart-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Trends</p>
                  <h2 className="h2">Weekly health score</h2>
                </div>
                <p className="muted patient-section-note">
                  Based on the current stored submission severity, sleep, hydration, and review state.
                </p>
              </div>

              <div className="patient-chart-layout">
                <div className="patient-chart-frame">
                  <svg
                    className="patient-line-chart"
                    viewBox="0 0 600 220"
                    role="img"
                    aria-label="Weekly health score chart"
                  >
                    <g className="patient-line-chart__grid">
                      <line x1="44" y1="40" x2="560" y2="40" />
                      <line x1="44" y1="92" x2="560" y2="92" />
                      <line x1="44" y1="144" x2="560" y2="144" />
                      <line x1="44" y1="184" x2="560" y2="184" />
                    </g>
                    <polygon className="patient-line-chart__area" points={chartArea} />
                    <polyline className="patient-line-chart__line" points={chartPoints} />
                    {chartData.map((point, index) => {
                      const spacing = chartData.length > 1 ? 516 / (chartData.length - 1) : 516;
                      const x = 44 + index * spacing;
                      const y = 184 - (point.score / 100) * 112;
                      return <circle key={`${point.day}-${index}`} className="patient-line-chart__dot" cx={x} cy={y} r="5" />;
                    })}
                  </svg>

                  <div className="patient-chart-labels">
                    {chartData.map((point, index) => (
                      <div key={`${point.day}-${index}`} className="patient-chart-label">
                        <span>{point.day}</span>
                        <strong>{point.score}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="patient-adherence-panel">
                  <div className="patient-adherence-panel__head">
                    <h3 className="h3">Care adherence</h3>
                    <p className="muted">Progress updates based on the current shared submission store.</p>
                  </div>

                  <div className="patient-progress-list">
                    {adherenceData.map((item) => (
                      <div key={item.label} className="patient-progress-item">
                        <div className="patient-progress-item__head">
                          <span>{item.label}</span>
                          <strong>{item.value}%</strong>
                        </div>
                        <div className="patient-progress-bar">
                          <span style={{ width: `${item.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Previous submissions</p>
                  <h2 className="h2">Recent symptom check-ins</h2>
                </div>
                <Button kind="ghost" onClick={() => nav('/patient/history')}>
                  Full history
                </Button>
              </div>

              <div className="patient-timeline">
                {patientSubmissions.slice(0, 3).map((item) => (
                  <article key={item.id} className="patient-timeline__item">
                    <div className="patient-timeline__marker" aria-hidden="true" />
                    <div className="patient-timeline__content">
                      <div className="patient-timeline__top">
                        <div>
                          <p className="patient-timeline__date">{formatDisplayDate(item.submittedAt)}</p>
                          <h3 className="patient-timeline__title">{item.title}</h3>
                        </div>
                        <span className="patient-tag">{statusLabel(item.status)}</span>
                      </div>
                      <p className="patient-timeline__summary">{buildSubmissionSummary(item)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </Card>

            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Medical data</p>
                  <h2 className="h2">Medications and recent labs</h2>
                </div>
                <p className="muted patient-section-note">
                  A realistic place for medication management and quick clinical reference.
                </p>
              </div>

              <div className="patient-data-grid">
                <div className="patient-data-block">
                  <h3 className="h3">Current medications</h3>
                  <div className="patient-med-list">
                    {medications.map((med) => (
                      <div key={med.name} className="patient-med-item">
                        <div>
                          <p className="patient-med-item__name">{med.name}</p>
                          <p className="patient-med-item__meta">
                            {med.dosage} • {med.schedule}
                          </p>
                        </div>
                        <span className="patient-tag patient-tag--soft">{med.refill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="patient-data-block">
                  <h3 className="h3">Latest labs</h3>
                  <div className="patient-lab-grid">
                    {labs.map((lab) => (
                      <div key={lab.label} className="patient-lab-card">
                        <p className="patient-lab-card__label">{lab.label}</p>
                        <p className="patient-lab-card__value">{lab.value}</p>
                        <p className="patient-lab-card__status">{lab.status}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="patient-column patient-column--aside">
            <Card className="patient-dashboard-card" id="patient-appointments">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Appointments</p>
                  <h2 className="h2">Upcoming visits</h2>
                </div>
              </div>

              <div className="patient-appointments">
                {patientAppointments.map((appointment) => (
                  <article key={appointment.id} className="patient-appointment-card">
                    <div className="patient-appointment-card__date">
                      <strong>{appointment.dateLabel}</strong>
                      <span>{appointment.time}</span>
                    </div>
                    <div className="patient-appointment-card__body">
                      <h3>{appointment.title}</h3>
                      <p>{appointment.providerName}</p>
                      <p>{appointment.location}</p>
                    </div>
                    <span className="patient-tag">{appointment.status}</span>
                  </article>
                ))}
              </div>
            </Card>

            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Vitals</p>
                  <h2 className="h2">Current health markers</h2>
                </div>
              </div>

              <div className="patient-vitals-grid">
                {vitals.map((vital) => (
                  <div key={vital.label} className="patient-vital-card">
                    <p className="patient-vital-card__label">{vital.label}</p>
                    <p className="patient-vital-card__value">{vital.value}</p>
                    <p className="patient-vital-card__trend">{vital.trend}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Insurance</p>
                  <h2 className="h2">Coverage snapshot</h2>
                </div>
              </div>

              <div className="patient-detail-list">
                <div className="patient-detail-list__row">
                  <span>Plan</span>
                  <strong>{patientProfile.insurancePlan}</strong>
                </div>
                <div className="patient-detail-list__row">
                  <span>Member ID</span>
                  <strong>{patientProfile.memberId}</strong>
                </div>
                <div className="patient-detail-list__row">
                  <span>Coverage</span>
                  <strong>{patientProfile.coverageStatus}</strong>
                </div>
                <div className="patient-detail-list__row">
                  <span>Primary pharmacy</span>
                  <strong>{patientProfile.pharmacy}</strong>
                </div>
              </div>
            </Card>

            <Card className="patient-dashboard-card" id="patient-billing">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Billing</p>
                  <h2 className="h2">Insurance and balances</h2>
                </div>
              </div>

              <div className="patient-billing-summary">
                <p className="patient-billing-summary__label">Outstanding balance</p>
                <p className="patient-billing-summary__value">{formatMoney(outstandingBalance)}</p>
              </div>

              <div className="patient-billing-list">
                {patientBillingItems.map((bill) => (
                  <div key={bill.id} className="patient-billing-item">
                    <div>
                      <p className="patient-billing-item__label">{bill.label}</p>
                      <p className="patient-billing-item__meta">{bill.due}</p>
                    </div>
                    <div className="patient-billing-item__amount">
                      <strong>{bill.amountLabel}</strong>
                      <span>{statusLabel(bill.status)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {showStatements ? (
                <div className="statement-preview">
                  <p>Statement preview</p>
                  <p>Current insurance plan: {patientProfile.insurancePlan}</p>
                  <p>Unpaid items: {unresolvedBills.length}</p>
                </div>
              ) : null}

              <div className="actions-row">
                <Button kind="secondary" type="button" onClick={() => setShowStatements((prev) => !prev)}>
                  {showStatements ? 'Hide statements' : 'View statements'}
                </Button>
                <Button type="button" onClick={handlePayBalance}>
                  Pay balance
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

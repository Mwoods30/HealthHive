import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import useDemoData from '../../data/useDemoData';
import './patient.css';

const severityRank = {
  low: 1,
  moderate: 2,
  high: 3,
};

function average(values) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export default function PatientResults() {
  const nav = useNavigate();
  const { logout } = useAuth();
  const {
    patientSubmissions,
    patientAppointments,
    patientBillingItems,
    outstandingBalance,
    formatDisplayDate,
  } = useDemoData();

  const latestSubmission = patientSubmissions[0];
  const reviewedCount = patientSubmissions.filter((item) =>
    ['reviewed', 'resolved'].includes(item.status)
  ).length;
  const providerNoteCount = patientSubmissions.filter((item) => item.providerNote).length;
  const sleepValues = patientSubmissions
    .map((item) => Number(item.sleep))
    .filter((value) => Number.isFinite(value) && value > 0);
  const hydrationValues = patientSubmissions
    .map((item) => Number(item.hydration))
    .filter((value) => Number.isFinite(value) && value > 0);
  const averageSleep = average(sleepValues);
  const averageHydration = average(hydrationValues);
  const reviewRate = patientSubmissions.length
    ? Math.round((reviewedCount / patientSubmissions.length) * 100)
    : 0;
  const nextAppointment = patientAppointments[0];
  const openBillingItems = patientBillingItems.filter((item) => item.status !== 'paid');

  const recentSeverity = patientSubmissions
    .slice(0, 2)
    .map((item) => severityRank[item.severity] || 1);
  const olderSeverity = patientSubmissions
    .slice(2, 5)
    .map((item) => severityRank[item.severity] || 1);
  const change = average(olderSeverity) - average(recentSeverity);
  const improvementLabel =
    patientSubmissions.length < 3 ? 'Building baseline' : change > 0 ? `+${Math.round(change * 10)}%` : 'Stable';
  const riskLevel =
    latestSubmission?.status === 'flagged' || latestSubmission?.severity === 'high'
      ? 'High'
      : latestSubmission?.severity === 'moderate'
        ? 'Moderate'
        : 'Low';

  const resultsMetrics = [
    {
      label: 'Current risk level',
      value: riskLevel,
      detail: 'Derived from the latest stored submission severity and provider status.',
    },
    {
      label: 'Improvement trend',
      value: improvementLabel,
      detail: 'Compares the latest entries with older submission severity levels.',
    },
    {
      label: 'Average sleep',
      value: averageSleep ? `${averageSleep.toFixed(1)} hrs` : 'N/A',
      detail: 'Based on sleep values entered in patient check-ins.',
    },
    {
      label: 'Provider review rate',
      value: `${reviewRate}%`,
      detail: 'Updates when provider actions change the status of stored submissions.',
    },
  ];

  const insights = [
    {
      title: 'Latest submission status',
      copy: latestSubmission
        ? `The most recent entry is currently marked ${latestSubmission.status} with ${latestSubmission.severity} severity.`
        : 'No submissions are available yet for analysis.',
    },
    {
      title: 'Sleep pattern signal',
      copy:
        averageSleep >= 7
          ? 'Sleep entries are generally above seven hours, which supports a steadier symptom trend.'
          : 'Recent sleep entries are below seven hours on average and may be contributing to symptom variability.',
    },
    {
      title: 'Hydration pattern',
      copy:
        averageHydration >= 7
          ? 'Hydration entries are generally consistent across recent check-ins.'
          : 'Hydration entries are uneven and could be worth watching in the next few updates.',
    },
  ];

  const carePlan = [
    latestSubmission?.providerNote || 'Continue logging symptom severity and duration in each submission.',
    averageSleep >= 7
      ? 'Maintain the current sleep routine and keep recording nightly totals.'
      : 'Aim for more consistent sleep logging to support pattern detection.',
    averageHydration >= 7
      ? 'Hydration tracking looks stable; continue current daily target.'
      : 'Increase hydration consistency and note any symptom change after better intake.',
  ];

  const operationalMarkers = [
    {
      label: 'Next appointment',
      value: nextAppointment ? `${nextAppointment.dateLabel} at ${nextAppointment.time}` : 'Not scheduled',
      note: nextAppointment ? nextAppointment.title : 'No follow-up visit is currently attached.',
    },
    {
      label: 'Provider notes saved',
      value: String(providerNoteCount),
      note: 'Each provider note becomes visible in your history timeline.',
    },
    {
      label: 'Open billing items',
      value: formatMoney(outstandingBalance),
      note: openBillingItems.length ? `${openBillingItems.length} balances still need review.` : 'No open balances right now.',
    },
  ];

  const labTrends = [
    { label: 'A1C', value: '5.6%', note: 'Within target range' },
    { label: 'LDL', value: '94 mg/dL', note: 'Down from 104 mg/dL' },
    { label: 'Vitamin D', value: '31 ng/mL', note: 'Monitor next month' },
  ];

  const handleSnapshotDownload = () => {
    const content = [
      `HealthHive result snapshot`,
      `Generated: ${formatDisplayDate(new Date().toISOString())}`,
      `Current risk level: ${riskLevel}`,
      `Provider review rate: ${reviewRate}%`,
      `Average sleep: ${averageSleep ? `${averageSleep.toFixed(1)} hrs` : 'N/A'}`,
      `Average hydration: ${averageHydration ? `${averageHydration.toFixed(1)} glasses` : 'N/A'}`,
      `Next appointment: ${nextAppointment ? `${nextAppointment.title} on ${nextAppointment.dateLabel} at ${nextAppointment.time}` : 'Not scheduled'}`,
      `Outstanding balance: ${formatMoney(outstandingBalance)}`,
      latestSubmission
        ? `Latest status: ${latestSubmission.status} (${latestSubmission.severity})`
        : 'Latest status: No submissions yet',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'healthhive-results-snapshot.txt';
    link.click();
    window.URL.revokeObjectURL(url);
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

        <section className="patient-overview">
          <div className="patient-overview__main">
            <p className="eyebrow">Clinical insights</p>
            <h1 className="hero-title">Review the latest interpretation of your symptom and wellness data.</h1>
            <p className="muted patient-overview__copy">
              This view turns recent submissions into simple insight cards, clinical markers, and next-step recommendations.
            </p>
            <div className="patient-overview__actions">
              <Button kind="secondary" onClick={() => nav('/patient/history')}>
                Compare history
              </Button>
              <Button kind="ghost" onClick={handleSnapshotDownload}>
                Download snapshot
              </Button>
            </div>
          </div>

          <div className="patient-overview__panel">
            <p className="patient-panel__eyebrow">Latest summary</p>
            <div className="patient-panel__score">
              <div>
                <p className="patient-panel__value patient-panel__value--small">
                  {latestSubmission ? latestSubmission.status : 'No data'}
                </p>
                <p className="patient-panel__label">
                  {latestSubmission
                    ? `Latest submission severity is ${latestSubmission.severity}.`
                    : 'Add a patient check-in to generate a result summary.'}
                </p>
              </div>
              <p className="patient-panel__trend">
                {latestSubmission
                  ? `Updated ${new Date(latestSubmission.submittedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}`
                  : 'Waiting'}
              </p>
            </div>
            <div className="patient-panel__list">
              <div className="patient-panel__item">
                <span>Concern level</span>
                <strong>{riskLevel}</strong>
              </div>
              <div className="patient-panel__item">
                <span>Provider review</span>
                <strong>{reviewedCount} reviewed</strong>
              </div>
              <div className="patient-panel__item">
                <span>Next visit</span>
                <strong>{nextAppointment ? nextAppointment.dateLabel : 'TBD'}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="patient-stat-grid" aria-label="Result metrics">
          {resultsMetrics.map((metric) => (
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
                  <p className="patient-section-kicker">Insights</p>
                  <h2 className="h2">What changed recently</h2>
                </div>
              </div>
              <div className="insight-grid">
                {insights.map((insight) => (
                  <article key={insight.title} className="insight-card">
                    <h3>{insight.title}</h3>
                    <p>{insight.copy}</p>
                  </article>
                ))}
              </div>
            </Card>

            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Care plan</p>
                  <h2 className="h2">Recommended next steps</h2>
                </div>
              </div>
              <div className="dashboard-list">
                {carePlan.map((item) => (
                  <div key={item} className="dashboard-list__row">
                    <span className="dashboard-list__bullet" aria-hidden="true" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="patient-column patient-column--aside">
            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Operational view</p>
                  <h2 className="h2">Current checkpoints</h2>
                </div>
              </div>
              <div className="patient-detail-list">
                {operationalMarkers.map((item) => (
                  <div key={item.label} className="patient-detail-list__row">
                    <div>
                      <span>{item.label}</span>
                      <p className="meta" style={{ marginTop: 4 }}>{item.note}</p>
                    </div>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Lab trends</p>
                  <h2 className="h2">Latest measured markers</h2>
                </div>
              </div>
              <div className="patient-detail-list">
                {labTrends.map((item) => (
                  <div key={item.label} className="patient-detail-list__row">
                    <div>
                      <span>{item.label}</span>
                      <p className="meta" style={{ marginTop: 4 }}>{item.note}</p>
                    </div>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

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

function severityLabel(submissions) {
  if (!submissions.length) {
    return 'N/A';
  }

  const average =
    submissions.reduce((sum, item) => sum + (severityRank[item.severity] || 1), 0) / submissions.length;

  if (average >= 2.5) {
    return 'High';
  }
  if (average >= 1.6) {
    return 'Moderate';
  }
  return 'Low';
}

export default function PatientHistory() {
  const nav = useNavigate();
  const { logout } = useAuth();
  const { patientSubmissions, buildSubmissionSummary, formatDisplayDate } = useDemoData();

  const reviewedEntries = patientSubmissions.filter((item) =>
    ['reviewed', 'resolved'].includes(item.status)
  ).length;

  const historyMetrics = [
    {
      label: 'Entries this month',
      value: String(patientSubmissions.length),
      detail: 'Updated as new check-ins are added through the patient form.',
    },
    {
      label: 'Reviewed entries',
      value: String(reviewedEntries),
      detail: 'Provider-reviewed items update live from the shared demo store.',
    },
    {
      label: 'Average symptom severity',
      value: severityLabel(patientSubmissions),
      detail: 'Derived from the current stored submissions.',
    },
    {
      label: 'Export status',
      value: patientSubmissions.length ? 'Ready' : 'Empty',
      detail: 'Download a text summary of the current submission history.',
    },
  ];

  const handleExport = () => {
    const content = patientSubmissions
      .map((item) => {
        const parts = [
          `Date: ${formatDisplayDate(item.submittedAt)}`,
          `Title: ${item.title}`,
          `Severity: ${item.severity}`,
          `Status: ${item.status}`,
          `Summary: ${buildSubmissionSummary(item)}`,
        ];

        if (item.providerNote) {
          parts.push(`Provider note: ${item.providerNote}`);
        }

        return parts.join('\n');
      })
      .join('\n\n---\n\n');

    const blob = new Blob([content || 'No history available yet.'], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'healthhive-history-summary.txt';
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

        <section className="patient-overview">
          <div className="patient-overview__main">
            <p className="eyebrow">Health record history</p>
            <h1 className="hero-title">Follow how symptoms, notes, and care decisions have changed over time.</h1>
            <p className="muted patient-overview__copy">
              Your past submissions are organized as a timeline so you can spot patterns before appointments or exports.
            </p>
            <div className="patient-overview__actions">
              <Button kind="secondary" onClick={handleExport}>Export summary</Button>
              <Button kind="ghost" onClick={() => nav('/patient')}>
                Return home
              </Button>
            </div>
          </div>

          <div className="patient-overview__panel">
            <p className="patient-panel__eyebrow">Record quality</p>
            <div className="patient-panel__score">
              <div>
                <p className="patient-panel__value patient-panel__value--small">
                  {patientSubmissions.length ? 'Consistent' : 'Waiting'}
                </p>
                <p className="patient-panel__label">
                  {patientSubmissions.length
                    ? 'You have enough history to compare symptom trends across weeks.'
                    : 'Submit your first check-in to build a timeline.'}
                </p>
              </div>
              <p className="patient-panel__trend">{patientSubmissions.length} stored entries</p>
            </div>
          </div>
        </section>

        <section className="patient-stat-grid" aria-label="History metrics">
          {historyMetrics.map((metric) => (
            <Card key={metric.label} className="patient-summary-card">
              <p className="patient-summary-card__label">{metric.label}</p>
              <p className="patient-summary-card__value patient-summary-card__value--compact">{metric.value}</p>
              <p className="patient-summary-card__detail">{metric.detail}</p>
            </Card>
          ))}
        </section>

        <Card className="patient-dashboard-card">
          <div className="patient-section-head">
            <div>
              <p className="patient-section-kicker">Submission timeline</p>
              <h2 className="h2">Recent history</h2>
            </div>
          </div>

          <div className="patient-timeline">
            {patientSubmissions.map((item) => (
              <article key={item.id} className="patient-timeline__item">
                <div className="patient-timeline__marker" aria-hidden="true" />
                <div className="patient-timeline__content">
                  <div className="patient-timeline__top">
                    <div>
                      <p className="patient-timeline__date">{formatDisplayDate(item.submittedAt)}</p>
                      <h3 className="patient-timeline__title">{item.title}</h3>
                    </div>
                    <span className="patient-tag">{item.status}</span>
                  </div>
                  <p className="patient-timeline__summary">{buildSubmissionSummary(item)}</p>
                  {item.providerNote ? (
                    <p className="timeline-note">Provider note: {item.providerNote}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}

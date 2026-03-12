import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import useDemoData from '../../data/useDemoData';
import '../patient/patient.css';

const reviewStatuses = ['new', 'flagged'];

function toStatusLabel(status) {
  return status.replace('_', ' ');
}

function getPriority(submission) {
  if (submission.status === 'flagged' || submission.severity === 'high') {
    return 'High';
  }
  if (submission.status === 'new' || submission.severity === 'moderate') {
    return 'Medium';
  }
  return 'Low';
}

function sortByDateDesc(items) {
  return [...items].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

export default function ProviderDashboard() {
  const nav = useNavigate();
  const { logout } = useAuth();
  const {
    submissions,
    appointments,
    updateSubmissionStatus,
    addProviderNote,
    formatDisplayDate,
  } = useDemoData();
  const [queueFilter, setQueueFilter] = useState('priority');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState('');
  const [noteDraft, setNoteDraft] = useState('');
  const [providerNotice, setProviderNotice] = useState('');

  const providerSubmissions = useMemo(() => sortByDateDesc(submissions), [submissions]);
  const patientsNeedingReview = providerSubmissions.filter((item) => reviewStatuses.includes(item.status));
  const flaggedCases = providerSubmissions.filter(
    (item) => item.status === 'flagged' || item.severity === 'high'
  );
  const todaysAppointments = appointments.filter((item) => item.date === '2026-03-12');
  const reviewedCount = providerSubmissions.filter((item) =>
    ['reviewed', 'resolved'].includes(item.status)
  ).length;

  const filteredQueue = providerSubmissions.filter((item) => {
    if (queueFilter === 'priority') {
      return reviewStatuses.includes(item.status) || item.severity === 'high';
    }
    if (queueFilter === 'new') {
      return item.status === 'new';
    }
    if (queueFilter === 'reviewed') {
      return ['reviewed', 'resolved'].includes(item.status);
    }
    return true;
  });

  const riskCounts = {
    low: providerSubmissions.filter((item) => item.severity === 'low').length,
    moderate: providerSubmissions.filter((item) => item.severity === 'moderate').length,
    high: providerSubmissions.filter((item) => item.severity === 'high').length,
  };
  const totalCases = providerSubmissions.length || 1;
  const riskDistribution = [
    {
      label: 'Low risk',
      count: String(riskCounts.low),
      value: Math.round((riskCounts.low / totalCases) * 100),
    },
    {
      label: 'Moderate watch',
      count: String(riskCounts.moderate),
      value: Math.round((riskCounts.moderate / totalCases) * 100),
    },
    {
      label: 'High priority',
      count: String(riskCounts.high),
      value: Math.round((riskCounts.high / totalCases) * 100),
    },
  ];

  const providerMetrics = [
    {
      label: 'Patients needing review',
      value: String(patientsNeedingReview.length),
      detail: `${flaggedCases.length} high-priority items are currently flagged or severe.`,
    },
    {
      label: 'New submissions',
      value: String(providerSubmissions.filter((item) => item.status === 'new').length),
      detail: 'Updated from the shared demo submissions store.',
    },
    {
      label: "Today's appointments",
      value: String(todaysAppointments.length),
      detail: 'Daily schedule is pulled from the demo appointment timeline.',
    },
    {
      label: 'Reviewed submissions',
      value: String(reviewedCount),
      detail: 'Changes here are reflected back into patient-facing pages.',
    },
  ];

  const clinicalSignals = [
    { label: 'Low-risk', value: `${riskCounts.low} patients` },
    { label: 'Moderate watch', value: `${riskCounts.moderate} patients` },
    { label: 'High priority', value: `${riskCounts.high} patients` },
  ];

  const recentAlerts = providerSubmissions
    .filter((item) => item.severity !== 'low' || item.status === 'flagged')
    .slice(0, 3)
    .map((item) => ({
      patient: item.patientName,
      signal: `${item.title} (${toStatusLabel(item.status)})`,
      detail: item.notes || item.symptoms,
    }));

  const providerTasks = [
    {
      title: 'Review pending queue',
      note: `${patientsNeedingReview.length} submissions are waiting for provider action.`,
      state: patientsNeedingReview.length ? 'Due soon' : 'Clear',
    },
    {
      title: 'Close flagged cases',
      note: `${flaggedCases.length} cases are currently marked high priority.`,
      state: flaggedCases.length ? 'Priority' : 'Stable',
    },
    {
      title: 'Document follow-up notes',
      note: `${providerSubmissions.filter((item) => !item.providerNote).length} records still need provider commentary.`,
      state: 'Open',
    },
  ];

  const panelMetrics = [
    {
      label: 'Avg response time',
      value: patientsNeedingReview.length > 2 ? '2.1h' : '1.4h',
    },
    {
      label: 'Care gaps closed',
      value: String(providerSubmissions.filter((item) => item.status === 'resolved').length),
    },
    {
      label: 'Notes recorded',
      value: String(providerSubmissions.filter((item) => item.providerNote).length),
    },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleQueueAction = (submissionId, status, message) => {
    updateSubmissionStatus(submissionId, status);
    setProviderNotice(message);
  };

  const handleSaveNote = (submissionId) => {
    const didSave = addProviderNote(submissionId, noteDraft);
    if (!didSave) {
      setProviderNotice('Add a note before saving provider guidance.');
      return;
    }

    setProviderNotice('Provider note saved. Patient-facing views now show the updated guidance.');
    setSelectedSubmissionId('');
    setNoteDraft('');
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
            <Chip active>Provider</Chip>
            <Chip onClick={() => scrollToSection('provider-triage')}>Care queue</Chip>
            <Chip onClick={() => scrollToSection('provider-risk')}>Patients</Chip>
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
            <p className="eyebrow">Provider operations</p>
            <h1 className="hero-title">Monitor patient risk, review new submissions, and coordinate follow-up.</h1>
            <p className="muted patient-overview__copy">
              This workspace now uses shared demo records, so provider actions update patient results, history, and review status across the app.
            </p>
            <p className="prototype-banner">
              Demo mode: review statuses, provider notes, and queue counts now persist locally across the provider and patient experience.
            </p>
            {providerNotice ? <p className="dashboard-notice">{providerNotice}</p> : null}
            <div className="patient-overview__actions">
              <Button onClick={() => scrollToSection('provider-triage')}>Open patient list</Button>
              <Button
                kind="secondary"
                onClick={() => {
                  setQueueFilter('priority');
                  scrollToSection('provider-triage');
                }}
              >
                Review flagged cases
              </Button>
            </div>
          </div>

          <div className="patient-overview__panel">
            <p className="patient-panel__eyebrow">Today at a glance</p>
            <div className="patient-panel__score">
              <div>
                <p className="patient-panel__value patient-panel__value--small">{patientsNeedingReview.length}</p>
                <p className="patient-panel__label">Patients need active review</p>
              </div>
              <p className="patient-panel__trend">{flaggedCases.length} escalated</p>
            </div>
            <div className="patient-panel__list">
              <div className="patient-panel__item">
                <span>Average response time</span>
                <strong>{panelMetrics[0].value}</strong>
              </div>
              <div className="patient-panel__item">
                <span>Telehealth notes pending</span>
                <strong>{providerSubmissions.filter((item) => !item.providerNote).length}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="patient-stat-grid" aria-label="Provider metrics">
          {providerMetrics.map((metric) => (
            <Card key={metric.label} className="patient-summary-card">
              <p className="patient-summary-card__label">{metric.label}</p>
              <p className="patient-summary-card__value patient-summary-card__value--compact">{metric.value}</p>
              <p className="patient-summary-card__detail">{metric.detail}</p>
            </Card>
          ))}
        </section>

        <section className="patient-dashboard-grid">
          <div className="patient-column patient-column--main">
            <Card className="patient-dashboard-card" id="provider-triage">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Triage queue</p>
                  <h2 className="h2">Patients requiring review</h2>
                </div>
              </div>

              <div className="queue-filter-row">
                {[
                  ['priority', 'Priority'],
                  ['new', 'New'],
                  ['reviewed', 'Reviewed'],
                  ['all', 'All'],
                ].map(([value, label]) => (
                  <Button
                    key={value}
                    kind={queueFilter === value ? 'primary' : 'secondary'}
                    type="button"
                    onClick={() => setQueueFilter(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>

              <div className="operations-list">
                {filteredQueue.map((item) => {
                  const isSelected = selectedSubmissionId === item.id;
                  const priority = getPriority(item);

                  return (
                    <article key={item.id} className="operations-list__item">
                      <div>
                        <div className="operations-list__header">
                          <h3>{item.patientName}</h3>
                          <span className="patient-tag patient-tag--soft">
                            {toStatusLabel(item.status)}
                          </span>
                        </div>
                        <p>{item.title}</p>
                        <p className="meta" style={{ marginTop: 6 }}>
                          {item.symptoms} • Submitted {formatDisplayDate(item.submittedAt)}
                        </p>
                        {item.providerNote ? (
                          <p className="timeline-note">Provider note: {item.providerNote}</p>
                        ) : null}
                        <div className="operations-list__actions">
                          {item.status !== 'reviewed' ? (
                            <Button
                              kind="secondary"
                              type="button"
                              onClick={() =>
                                handleQueueAction(item.id, 'reviewed', `${item.patientName} was marked reviewed.`)
                              }
                            >
                              Mark reviewed
                            </Button>
                          ) : null}
                          {item.status !== 'flagged' ? (
                            <Button
                              kind="ghost"
                              type="button"
                              onClick={() =>
                                handleQueueAction(item.id, 'flagged', `${item.patientName} was escalated for follow-up.`)
                              }
                            >
                              Flag case
                            </Button>
                          ) : null}
                          {item.status !== 'resolved' ? (
                            <Button
                              kind="ghost"
                              type="button"
                              onClick={() =>
                                handleQueueAction(item.id, 'resolved', `${item.patientName} was marked resolved.`)
                              }
                            >
                              Resolve
                            </Button>
                          ) : null}
                          <Button
                            kind="ghost"
                            type="button"
                            onClick={() => {
                              setSelectedSubmissionId(isSelected ? '' : item.id);
                              setNoteDraft(item.providerNote || '');
                            }}
                          >
                            {isSelected ? 'Close note' : 'Add note'}
                          </Button>
                        </div>
                        {isSelected ? (
                          <div className="inline-note-form">
                            <Input
                              placeholder="Add provider follow-up guidance"
                              value={noteDraft}
                              onChange={(event) => setNoteDraft(event.target.value)}
                            />
                            <div className="actions-row">
                              <Button type="button" onClick={() => handleSaveNote(item.id)}>
                                Save note
                              </Button>
                              <Button
                                kind="secondary"
                                type="button"
                                onClick={() => {
                                  setSelectedSubmissionId('');
                                  setNoteDraft('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <div className="operations-list__meta">
                        <span className={`patient-tag${priority === 'High' ? '' : ' patient-tag--soft'}`}>
                          {priority}
                        </span>
                        <span>{item.duration || 'Monitoring'}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </Card>

            <div className="ops-dual-grid">
              <Card className="patient-dashboard-card" id="provider-risk">
                <div className="patient-section-head">
                  <div>
                    <p className="patient-section-kicker">Risk distribution</p>
                    <h2 className="h2">Current caseload mix</h2>
                  </div>
                </div>
                <div className="status-meter-list">
                  {riskDistribution.map((item) => (
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
                    <p className="patient-section-kicker">Trend signals</p>
                    <h2 className="h2">Recent clinical alerts</h2>
                  </div>
                </div>
                <div className="dashboard-list">
                  {recentAlerts.map((alert) => (
                    <div key={`${alert.patient}-${alert.signal}`} className="dashboard-list__row">
                      <span className="dashboard-list__bullet" aria-hidden="true" />
                      <div>
                        <strong>{alert.patient}</strong>
                        <p>{alert.signal}</p>
                        <p className="meta" style={{ marginTop: 4 }}>{alert.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <div className="patient-column patient-column--aside">
            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Schedule</p>
                  <h2 className="h2">Today&apos;s visits</h2>
                </div>
              </div>
              <div className="dashboard-list">
                {todaysAppointments.map((item) => (
                  <div key={item.id} className="dashboard-list__row dashboard-list__row--split">
                    <div>
                      <strong>{item.time}</strong>
                      <p>{item.patientName}</p>
                    </div>
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Clinical signals</p>
                  <h2 className="h2">Current patient mix</h2>
                </div>
              </div>
              <div className="patient-detail-list">
                {clinicalSignals.map((item) => (
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
                  <p className="patient-section-kicker">Work queue</p>
                  <h2 className="h2">Provider tasks</h2>
                </div>
              </div>
              <div className="operations-list">
                {providerTasks.map((task) => (
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

            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Performance</p>
                  <h2 className="h2">Today&apos;s provider metrics</h2>
                </div>
              </div>
              <div className="mini-stat-grid">
                {panelMetrics.map((metric) => (
                  <div key={metric.label} className="mini-stat-card">
                    <p className="mini-stat-card__label">{metric.label}</p>
                    <p className="mini-stat-card__value">{metric.value}</p>
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

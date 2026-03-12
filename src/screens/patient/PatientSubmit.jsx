import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { Chip, ChipGroup } from '../../components/Chips';
import useAuth from '../../auth/useAuth';
import useDemoData from '../../data/useDemoData';
import './patient.css';

const reminders = [
  'Bring your blood pressure log to your next follow-up.',
  'Upload any outside lab reports before March 14.',
  'Note whether symptoms are worse in the morning or evening.',
];

const emptyForm = {
  symptoms: '',
  duration: '',
  severity: 'Moderate',
  notes: '',
  sleep: '',
  hydration: '',
};

function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export default function PatientSubmit() {
  const nav = useNavigate();
  const { logout } = useAuth();
  const { patientProfile, patientSubmissions, outstandingBalance, addSubmission } = useDemoData();
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');
  const [savedSubmission, setSavedSubmission] = useState(null);

  const lastSubmission = patientSubmissions[0];
  const quickFacts = [
    { label: 'Last submission', value: lastSubmission ? lastSubmission.title : 'No entries yet' },
    { label: 'Assigned provider', value: patientProfile.providerName },
    { label: 'Coverage', value: patientProfile.coverageStatus },
    { label: 'Open balances', value: formatMoney(outstandingBalance) },
  ];

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.symptoms.trim()) {
      setError('Symptoms are required before saving a check-in.');
      return;
    }

    const submission = addSubmission(formData);
    setSavedSubmission(submission);
    setFormData(emptyForm);
    setError('');
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

        <section className="patient-overview">
          <div className="patient-overview__main">
            <p className="eyebrow">Patient intake</p>
            <h1 className="hero-title">Submit a structured symptom update for your care timeline.</h1>
            <p className="muted patient-overview__copy">
              Keep your provider informed with a clear daily or weekly check-in that becomes part of
              your ongoing record.
            </p>
            <div className="patient-overview__actions">
              <Button onClick={handleSubmit}>Save check-in</Button>
              <Button kind="secondary" onClick={() => nav('/patient/history')}>
                View history
              </Button>
            </div>
          </div>

          <div className="patient-overview__panel">
            <p className="patient-panel__eyebrow">Next follow-up</p>
            <div className="patient-panel__score">
              <div>
                <p className="patient-panel__value patient-panel__value--small">Mar 14</p>
                <p className="patient-panel__label">Primary care visit at 9:30 AM</p>
              </div>
              <p className="patient-panel__trend">Telehealth confirmed</p>
            </div>
            <div className="patient-panel__list">
              <div className="patient-panel__item">
                <span>Preferred pharmacy</span>
                <strong>{patientProfile.pharmacy}</strong>
              </div>
              <div className="patient-panel__item">
                <span>Care program</span>
                <strong>{patientProfile.careProgram}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="patient-stat-grid" aria-label="Quick patient context">
          {quickFacts.map((fact) => (
            <Card key={fact.label} className="patient-summary-card">
              <p className="patient-summary-card__label">{fact.label}</p>
              <p className="patient-summary-card__value patient-summary-card__value--compact">{fact.value}</p>
            </Card>
          ))}
        </section>

        <section className="patient-dashboard-grid">
          <div className="patient-column patient-column--main">
            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Submission form</p>
                  <h2 className="h2">Symptom check-in</h2>
                </div>
                <span className="patient-tag">Draft ready</span>
              </div>

              {error ? <p className="form-feedback form-feedback--error">{error}</p> : null}
              {savedSubmission ? (
                <div className="form-feedback form-feedback--success">
                  <span>Saved: {savedSubmission.title}</span>
                  <div className="form-feedback__actions">
                    <Button kind="ghost" type="button" onClick={() => nav('/patient/history')}>
                      Open history
                    </Button>
                    <Button kind="ghost" type="button" onClick={() => setSavedSubmission(null)}>
                      Dismiss
                    </Button>
                  </div>
                </div>
              ) : null}

              <form className="patient-form-grid" onSubmit={handleSubmit}>
                <div className="patient-form-field patient-form-field--wide">
                  <label className="field-label">Symptoms</label>
                  <Input
                    placeholder="Headache, fatigue, dizziness, nausea..."
                    value={formData.symptoms}
                    onChange={handleChange('symptoms')}
                  />
                </div>

                <div className="patient-form-field">
                  <label className="field-label">Duration</label>
                  <Input
                    placeholder="Example: 2 days"
                    value={formData.duration}
                    onChange={handleChange('duration')}
                  />
                </div>

                <div className="patient-form-field">
                  <label className="field-label">Severity</label>
                  <Input
                    placeholder="Mild, moderate, severe"
                    value={formData.severity}
                    onChange={handleChange('severity')}
                  />
                </div>

                <div className="patient-form-field patient-form-field--wide">
                  <label className="field-label">Notes</label>
                  <Input
                    placeholder="Triggers, timing, changes after medication, or other context"
                    value={formData.notes}
                    onChange={handleChange('notes')}
                  />
                </div>

                <div className="patient-form-field">
                  <label className="field-label">Sleep</label>
                  <Input
                    placeholder="Hours slept last night"
                    value={formData.sleep}
                    onChange={handleChange('sleep')}
                  />
                </div>

                <div className="patient-form-field">
                  <label className="field-label">Hydration</label>
                  <Input
                    placeholder="Glasses of water today"
                    value={formData.hydration}
                    onChange={handleChange('hydration')}
                  />
                </div>

                <div className="actions-row patient-form-actions">
                  <Button type="submit">Submit entry</Button>
                  <Button kind="secondary" type="button" onClick={() => nav('/patient')}>
                    Back to dashboard
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          <div className="patient-column patient-column--aside">
            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Guidance</p>
                  <h2 className="h2">What to include</h2>
                </div>
              </div>
              <div className="dashboard-list">
                {reminders.map((item) => (
                  <div key={item} className="dashboard-list__row">
                    <span className="dashboard-list__bullet" aria-hidden="true" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="patient-dashboard-card">
              <div className="patient-section-head">
                <div>
                  <p className="patient-section-kicker">Recent reading</p>
                  <h2 className="h2">Last recorded vitals</h2>
                </div>
              </div>
              <div className="patient-detail-list">
                <div className="patient-detail-list__row">
                  <span>Blood pressure</span>
                  <strong>118/76</strong>
                </div>
                <div className="patient-detail-list__row">
                  <span>Heart rate</span>
                  <strong>68 bpm</strong>
                </div>
                <div className="patient-detail-list__row">
                  <span>Sleep average</span>
                  <strong>7.6 hrs</strong>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

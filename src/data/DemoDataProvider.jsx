import React, { useEffect, useState } from 'react';
import DemoDataContext from './demoDataContext';
const STORAGE_KEY = 'healthhive_demo_data_v1';

const defaultState = {
  patientProfile: {
    name: 'Taylor Brooks',
    providerName: 'Dr. Nora Bell',
    coverageStatus: 'Active',
    insurancePlan: 'BlueCross Silver PPO',
    memberId: 'HH-4920-1881',
    careProgram: 'Metabolic health',
    pharmacy: 'Oak Street Pharmacy',
  },
  submissions: [
    {
      id: 'sub_001',
      patientName: 'Taylor Brooks',
      submittedAt: '2026-03-10T14:30:00Z',
      title: 'Daily symptom check-in',
      symptoms: 'Fatigue, mild headache',
      duration: '1 day',
      severity: 'low',
      notes: 'Hydration helped by the afternoon and the headache resolved before dinner.',
      sleep: '7.6',
      hydration: '8',
      status: 'reviewed',
      providerNote: 'Continue the hydration plan and log any return of headache symptoms.',
    },
    {
      id: 'sub_002',
      patientName: 'Taylor Brooks',
      submittedAt: '2026-03-08T12:20:00Z',
      title: 'Weekend check-in',
      symptoms: 'Mild headache, stress',
      duration: 'Several hours',
      severity: 'moderate',
      notes: 'Stress was elevated after lunch but symptoms resolved later in the evening.',
      sleep: '7.4',
      hydration: '6',
      status: 'reviewed',
      providerNote: 'Watch for stress-related patterns and keep recording sleep consistency.',
    },
    {
      id: 'sub_003',
      patientName: 'Taylor Brooks',
      submittedAt: '2026-03-06T09:10:00Z',
      title: 'Morning update',
      symptoms: 'No major symptoms',
      duration: 'Morning only',
      severity: 'low',
      notes: 'Energy and appetite stayed stable with no notable issues.',
      sleep: '7.9',
      hydration: '7',
      status: 'resolved',
      providerNote: 'No further follow-up needed for this check-in.',
    },
    {
      id: 'sub_004',
      patientName: 'Amelia Ross',
      submittedAt: '2026-03-12T09:50:00Z',
      title: 'Escalating fatigue report',
      symptoms: 'Fatigue, dizziness',
      duration: '2 days',
      severity: 'high',
      notes: 'Energy dropped sharply after poor sleep and dizziness is more noticeable in the morning.',
      sleep: '5.8',
      hydration: '5',
      status: 'flagged',
      providerNote: '',
    },
    {
      id: 'sub_005',
      patientName: 'David Lin',
      submittedAt: '2026-03-12T08:15:00Z',
      title: 'Blood pressure drift',
      symptoms: 'Elevated blood pressure',
      duration: '48 hours',
      severity: 'moderate',
      notes: 'Three home readings were above target and the patient reports mild stress.',
      sleep: '6.7',
      hydration: '6',
      status: 'new',
      providerNote: '',
    },
    {
      id: 'sub_006',
      patientName: 'Maya Patel',
      submittedAt: '2026-03-11T17:05:00Z',
      title: 'Medication refill gap',
      symptoms: 'Medication missed doses',
      duration: '6 days',
      severity: 'moderate',
      notes: 'Refill pickup was delayed and adherence is likely affected.',
      sleep: '7.1',
      hydration: '7',
      status: 'new',
      providerNote: '',
    },
    {
      id: 'sub_007',
      patientName: 'James Cole',
      submittedAt: '2026-03-11T10:40:00Z',
      title: 'Missed routine check-ins',
      symptoms: 'No update received',
      duration: '2 missed weeks',
      severity: 'low',
      notes: 'Patient missed two scheduled check-ins and may need outreach.',
      sleep: '',
      hydration: '',
      status: 'new',
      providerNote: '',
    },
  ],
  appointments: [
    {
      id: 'appt_001',
      patientName: 'Taylor Brooks',
      providerName: 'Dr. Nora Bell',
      date: '2026-03-14',
      dateLabel: 'Mar 14',
      time: '9:30 AM',
      title: 'Primary Care Follow-Up',
      location: 'Telehealth',
      status: 'Confirmed',
    },
    {
      id: 'appt_002',
      patientName: 'Taylor Brooks',
      providerName: 'Northside Diagnostics',
      date: '2026-03-21',
      dateLabel: 'Mar 21',
      time: '1:15 PM',
      title: 'Lab Review',
      location: 'Building B, Suite 210',
      status: 'Check-in ready',
    },
    {
      id: 'appt_003',
      patientName: 'Taylor Brooks',
      providerName: 'Avery Stone, RD',
      date: '2026-04-03',
      dateLabel: 'Apr 03',
      time: '11:00 AM',
      title: 'Nutrition Coaching',
      location: 'Virtual visit',
      status: 'Scheduled',
    },
    {
      id: 'appt_004',
      patientName: 'Amelia Ross',
      providerName: 'Dr. Nora Bell',
      date: '2026-03-12',
      dateLabel: 'Mar 12',
      time: '9:30 AM',
      title: 'Follow-up call',
      location: 'Telehealth',
      status: 'Scheduled',
    },
    {
      id: 'appt_005',
      patientName: 'David Lin',
      providerName: 'Dr. Nora Bell',
      date: '2026-03-12',
      dateLabel: 'Mar 12',
      time: '11:00 AM',
      title: 'Lab review',
      location: 'Video visit',
      status: 'Scheduled',
    },
    {
      id: 'appt_006',
      patientName: 'Maya Patel',
      providerName: 'Dr. Nora Bell',
      date: '2026-03-12',
      dateLabel: 'Mar 12',
      time: '2:15 PM',
      title: 'Medication consult',
      location: 'Clinic room 4',
      status: 'Scheduled',
    },
  ],
  billingItems: [
    {
      id: 'bill_001',
      patientName: 'Taylor Brooks',
      label: 'Primary care copay',
      amount: 35.0,
      amountLabel: '$35.00',
      due: 'Due Mar 18',
      status: 'unpaid',
    },
    {
      id: 'bill_002',
      patientName: 'Taylor Brooks',
      label: 'Lab invoice',
      amount: 147.45,
      amountLabel: '$147.45',
      due: 'Pending insurance',
      status: 'in_review',
    },
    {
      id: 'bill_003',
      patientName: 'Taylor Brooks',
      label: 'Nutrition consult',
      amount: 25.0,
      amountLabel: '$25.00',
      due: 'Paid Mar 04',
      status: 'paid',
    },
  ],
  providerApprovals: [
    {
      id: 'approval_001',
      name: 'Dr. Elaine Porter',
      role: 'Cardiology',
      org: 'Riverbend Clinic',
      state: 'Needs credential check',
      status: 'pending',
    },
    {
      id: 'approval_002',
      name: 'Dr. Jason Kim',
      role: 'Internal Medicine',
      org: 'Northside Health',
      state: 'Pending approval',
      status: 'pending',
    },
    {
      id: 'approval_003',
      name: 'Nadia Brooks',
      role: 'Behavioral Health',
      org: 'WellSpring',
      state: 'Waiting on documents',
      status: 'pending',
    },
  ],
  supportIssues: [
    {
      id: 'support_001',
      title: 'Claim modifier follow-up',
      note: 'Two claims returned by payer with missing modifiers and need follow-up.',
      status: 'open',
    },
    {
      id: 'support_002',
      title: 'Billing statement mismatch',
      note: 'One patient statement does not match the latest insurance adjustment.',
      status: 'open',
    },
    {
      id: 'support_003',
      title: 'Patient portal access question',
      note: 'A billing question is waiting on support handoff before it can be closed.',
      status: 'open',
    },
  ],
  auditFeed: [
    {
      id: 'audit_001',
      event: 'Role updated',
      actor: 'Admin M. Woods',
      detail: 'Provider account granted elevated reporting access.',
      time: '11 min ago',
    },
    {
      id: 'audit_002',
      event: 'Billing queue reopened',
      actor: 'Support Ops',
      detail: 'Two claims returned from payer with missing modifiers.',
      time: '29 min ago',
    },
    {
      id: 'audit_003',
      event: 'Provider invite created',
      actor: 'Clinic Ops',
      detail: 'Riverbend Clinic added one cardiology provider invite.',
      time: '52 min ago',
    },
  ],
};

function loadInitialState() {
  if (typeof window === 'undefined') {
    return defaultState;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return defaultState;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return defaultState;
  }
}

function appendAudit(feed, entry) {
  return [{ id: `audit_${Date.now()}`, ...entry }, ...feed].slice(0, 20);
}

function formatDisplayDate(dateValue) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateValue));
}

function buildSubmissionSummary(submission) {
  const parts = [submission.symptoms];
  if (submission.notes) {
    parts.push(submission.notes);
  }
  return parts.join('. ');
}

export function DemoDataProvider({ children }) {
  const [state, setState] = useState(loadInitialState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addSubmission = (payload) => {
    const submittedAt = new Date().toISOString();
    const primarySymptom = payload.symptoms.split(',')[0]?.trim() || 'Health';
    const submission = {
      id: `sub_${Date.now()}`,
      patientName: state.patientProfile.name,
      submittedAt,
      title: `${primarySymptom} update`,
      symptoms: payload.symptoms,
      duration: payload.duration,
      severity: payload.severity.toLowerCase(),
      notes: payload.notes,
      sleep: payload.sleep,
      hydration: payload.hydration,
      status: 'new',
      providerNote: '',
    };

    setState((prev) => ({
      ...prev,
      submissions: [submission, ...prev.submissions],
      auditFeed: appendAudit(prev.auditFeed, {
        event: 'Patient submission created',
        actor: prev.patientProfile.name,
        detail: `New check-in added with severity ${payload.severity.toLowerCase()}.`,
        time: 'Just now',
      }),
    }));

    return submission;
  };

  const updateSubmissionStatus = (submissionId, status) => {
    setState((prev) => {
      const submission = prev.submissions.find((item) => item.id === submissionId);
      if (!submission) {
        return prev;
      }

      return {
        ...prev,
        submissions: prev.submissions.map((item) =>
          item.id === submissionId ? { ...item, status } : item
        ),
        auditFeed: appendAudit(prev.auditFeed, {
          event: 'Submission status updated',
          actor: 'Dr. Nora Bell',
          detail: `${submission.patientName} submission moved to ${status}.`,
          time: 'Just now',
        }),
      };
    });
  };

  const addProviderNote = (submissionId, note) => {
    const trimmed = note.trim();
    if (!trimmed) {
      return false;
    }

    setState((prev) => {
      const submission = prev.submissions.find((item) => item.id === submissionId);
      if (!submission) {
        return prev;
      }

      return {
        ...prev,
        submissions: prev.submissions.map((item) =>
          item.id === submissionId
            ? {
                ...item,
                providerNote: trimmed,
                status: item.status === 'resolved' ? item.status : 'reviewed',
              }
            : item
        ),
        auditFeed: appendAudit(prev.auditFeed, {
          event: 'Provider note added',
          actor: 'Dr. Nora Bell',
          detail: `A provider note was saved for ${submission.patientName}.`,
          time: 'Just now',
        }),
      };
    });

    return true;
  };

  const approveProvider = (approvalId) => {
    setState((prev) => {
      const approval = prev.providerApprovals.find((item) => item.id === approvalId);
      if (!approval) {
        return prev;
      }

      return {
        ...prev,
        providerApprovals: prev.providerApprovals.map((item) =>
          item.id === approvalId ? { ...item, state: 'Approved', status: 'approved' } : item
        ),
        auditFeed: appendAudit(prev.auditFeed, {
          event: 'Provider approved',
          actor: 'Admin workflow',
          detail: `${approval.name} was approved for onboarding.`,
          time: 'Just now',
        }),
      };
    });
  };

  const resolveSupportIssue = (issueId) => {
    setState((prev) => {
      const issue = prev.supportIssues.find((item) => item.id === issueId);
      if (!issue) {
        return prev;
      }

      return {
        ...prev,
        supportIssues: prev.supportIssues.map((item) =>
          item.id === issueId ? { ...item, status: 'resolved' } : item
        ),
        auditFeed: appendAudit(prev.auditFeed, {
          event: 'Support issue resolved',
          actor: 'Admin workflow',
          detail: `${issue.title} was marked resolved.`,
          time: 'Just now',
        }),
      };
    });
  };

  const payBillingItem = (billingId) => {
    setState((prev) => {
      const bill = prev.billingItems.find((item) => item.id === billingId);
      if (!bill) {
        return prev;
      }

      return {
        ...prev,
        billingItems: prev.billingItems.map((item) =>
          item.id === billingId ? { ...item, status: 'paid', due: 'Paid just now' } : item
        ),
        auditFeed: appendAudit(prev.auditFeed, {
          event: 'Billing payment recorded',
          actor: prev.patientProfile.name,
          detail: `${bill.label} was marked paid.`,
          time: 'Just now',
        }),
      };
    });
  };

  const recordRoleLogin = (selectedRole) => {
    setState((prev) => ({
      ...prev,
      auditFeed: appendAudit(prev.auditFeed, {
        event: 'Demo sign-in',
        actor: `${selectedRole} workspace`,
        detail: `A demo sign-in occurred for the ${selectedRole} role.`,
        time: 'Just now',
      }),
    }));
  };

  const patientName = state.patientProfile.name;
  const patientSubmissions = state.submissions
    .filter((item) => item.patientName === patientName)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  const patientAppointments = state.appointments.filter((item) => item.patientName === patientName);
  const patientBillingItems = state.billingItems.filter((item) => item.patientName === patientName);
  const outstandingBalance = patientBillingItems
    .filter((item) => item.status !== 'paid')
    .reduce((sum, item) => sum + item.amount, 0);
  const pendingApprovals = state.providerApprovals.filter((item) => item.status !== 'approved');
  const openSupportIssues = state.supportIssues.filter((item) => item.status !== 'resolved');

  const value = {
    ...state,
    patientSubmissions,
    patientAppointments,
    patientBillingItems,
    outstandingBalance,
    pendingApprovals,
    openSupportIssues,
    addSubmission,
    updateSubmissionStatus,
    addProviderNote,
    approveProvider,
    resolveSupportIssue,
    payBillingItem,
    recordRoleLogin,
    formatDisplayDate,
    buildSubmissionSummary,
  };

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

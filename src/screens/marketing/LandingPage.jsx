import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import useAuth from '../../auth/useAuth';
import { getDefaultRouteForRole } from '../../auth/roleRoutes';
import useDemoData from '../../data/useDemoData';
import './marketing.css';

export default function LandingPage() {
  const nav = useNavigate();
  const location = useLocation();
  const { role, logout } = useAuth();
  const { submissions, appointments, pendingApprovals, openSupportIssues, auditFeed } = useDemoData();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const ctaLabel = role ? 'Dashboard' : 'Sign in';
  const ctaTarget = role ? getDefaultRouteForRole(role) : '/login';
  const heroImage =
    'https://thumbs.wbm.im/pw/medium/e38f3a563a4a84d3221a1c3c81a40e2c.jpg';
  const uniquePatients = new Set(submissions.map((item) => item.patientName)).size;
  const heroStats = [
    {
      label: 'Tracked submissions',
      value: String(submissions.length),
      detail: 'Live demo records are shared across patient, provider, and admin flows.',
    },
    {
      label: 'Scheduled appointments',
      value: String(appointments.length),
      detail: 'Follow-up visits and reviews are represented in the shared appointment queue.',
    },
    {
      label: 'Pending approvals',
      value: String(pendingApprovals.length),
      detail: 'Admin onboarding and support states are visible from the platform entry point.',
    },
    {
      label: 'Open support items',
      value: String(openSupportIssues.length),
      detail: 'Operational issues and audit activity help the app feel like a real platform.',
    },
  ];
  const roleSurfaces = [
    {
      tag: 'Patient workspace',
      title: 'Health tracking, history, appointments, and billing in one view.',
      copy:
        'The patient workspace combines symptom submission, history, results, appointments, insurance, and balances into one dashboard.',
      metric: `${uniquePatients} demo patient records`,
      actionLabel: role === 'patient' ? 'Open patient dashboard' : 'Preview patient flow',
      actionTarget: role === 'patient' ? '/patient' : '/login',
    },
    {
      tag: 'Provider operations',
      title: 'Review queues, risk signals, schedules, and care follow-up.',
      copy:
        'The provider side focuses on triage, recent alerts, patient mix, daily schedules, and operational follow-through.',
      metric: `${submissions.filter((item) => ['new', 'flagged'].includes(item.status)).length} active reviews`,
      actionLabel: role === 'provider' ? 'Open provider workspace' : 'Preview provider flow',
      actionTarget: role === 'provider' ? '/provider' : '/login',
    },
    {
      tag: 'Admin oversight',
      title: 'System health, approvals, audit visibility, and support operations.',
      copy:
        'The admin experience covers platform health, onboarding approvals, audit activity, and workflow monitoring.',
      metric: `${auditFeed.length} recent audit events`,
      actionLabel: role === 'admin' ? 'Open admin workspace' : 'Preview admin flow',
      actionTarget: role === 'admin' ? '/admin' : '/login',
    },
  ];
  const previewFeed = [
    ['Patient module', `${uniquePatients} tracked patient records`],
    ['Provider module', `${submissions.filter((item) => ['new', 'flagged'].includes(item.status)).length} active reviews`],
    ['Admin module', `${pendingApprovals.length} approvals and ${openSupportIssues.length} support items`],
    ['Platform activity', `${auditFeed.length} recent audit events`],
  ];
  const navItems = [
    ['Modules', '#facts'],
    ['Workflows', '#tips'],
    ['Platform', '#about'],
    ['Resources', '#resources'],
    ['Implementation', '#how-to'],
    ['Support', '#contact'],
  ];
  const sections = [
    {
      id: 'facts',
      kicker: 'Modules',
      title: 'Core product modules',
      copy:
        'HealthHive is organized around the product areas users return to most often.',
      items: [
        'Role-based dashboards for patients, providers, and admins.',
        'Structured submission, review, and history flows.',
        'A shared layout system that keeps the product consistent across roles.',
      ],
    },
    {
      id: 'tips',
      kicker: 'Workflows',
      title: 'Built for repeated daily use',
      copy:
        'The interface is designed to feel like an operational dashboard instead of a collection of disconnected pages.',
      items: [
        'Fast navigation between modules without leaving the core workspace.',
        'Clear metric cards, queues, timelines, and operational panels.',
        'Feature grouping that matches how healthcare workflows actually move.',
      ],
    },
    {
      id: 'about',
      kicker: 'Platform',
      title: 'About HealthHive',
      copy:
        'HealthHive is a role-aware healthcare platform prototype designed as a senior-project foundation.',
      items: [
        'One frontend supports three role-specific operational experiences.',
        'The product structure is ready for real backend integration.',
        'The design direction emphasizes dashboards, not brochure-style pages.',
      ],
    },
    {
      id: 'resources',
      kicker: 'Resources',
      title: 'Resources and support surfaces',
      copy:
        'The platform can centralize the support content and guidance users need while working inside the app.',
      items: [
        'Feature documentation and how-to content.',
        'Care guidance, support links, and onboarding references.',
        'A dedicated place for updates without breaking workflow context.',
      ],
    },
    {
      id: 'how-to',
      kicker: 'Implementation',
      title: 'Simple platform workflows',
      copy:
        'The current app already demonstrates how the main role-based flows can be structured.',
      items: [
        'Patients submit updates and review results or history.',
        'Providers work from review queues and clinical summaries.',
        'Admins monitor operations, approvals, and audit-related activity.',
      ],
    },
    {
      id: 'contact',
      kicker: 'Support',
      title: 'Reach the HealthHive team',
      copy:
        'Questions, feedback, and collaboration requests should be easy to reach from the same platform entry point.',
      items: ['Email: support@healthhive.example.com', 'Phone: (555) 123-4567'],
      isContact: true,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 420);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const target = document.getElementById(location.hash.slice(1));

    if (!target) {
      return;
    }

    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [location.hash]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="app-stage landing-stage" id="top">
      <div className="container landing-shell">
        <header className="landing-header">
          <Link
            className="landing-brand"
            to="/"
            aria-label="HealthHive home"
            onClick={scrollToTop}
          >
            <img className="landing-brandmark" src="/healthhive-wordmark.svg" alt="HealthHive" />
            <span className="sr-only">HealthHive home</span>
          </Link>

          <nav className="landing-nav" aria-label="Primary">
            {navItems.map(([label, href]) => (
              <a key={label} className="landing-nav__link" href={href}>
                {label}
              </a>
            ))}
          </nav>

          <div className="landing-actions">
            <Button className="landing-signin" onClick={() => nav(ctaTarget)}>
              <span>{ctaLabel}</span>
              {!role ? <span aria-hidden="true"></span> : null}
            </Button>
            {role ? (
              <button
                className="landing-logout"
                type="button"
                onClick={() => {
                  logout();
                  nav('/');
                }}
              >
                Log out
              </button>
            ) : null}
          </div>
        </header>

        <section className="landing-hero">
          <div className="landing-hero-layout">
            <div className="landing-hero-copyblock">
              <p className="landing-hero-kicker">Medical operations platform</p>
              <h1 className="landing-display">HealthHive</h1>
              <p className="landing-intro">
                A role-based healthcare dashboard for patient workflows, provider operations, and admin oversight.
              </p>
              <p className="landing-hero-copy">
                The landing page now focuses on what the app does: multi-role dashboards, structured
                workflows, operational visibility, and a shared system for healthcare-related tasks.
              </p>

              <div className="landing-hero-actions">
                <Button className="landing-signin landing-hero-cta" onClick={() => nav(ctaTarget)}>
                  {ctaLabel}
                </Button>
                <a className="landing-hero-link" href="#about">
                  Explore platform
                </a>
              </div>

              <div className="landing-stat-grid">
                {heroStats.map((item) => (
                  <article key={item.label} className="landing-stat-card">
                    <p className="landing-stat-card__label">{item.label}</p>
                    <p className="landing-stat-card__value">{item.value}</p>
                    <p className="landing-stat-card__detail">{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="landing-hero-panel">
              <div className="landing-hero-panel__top">
                <p className="landing-hero-panel__kicker">Workspace preview</p>
                <div>
                  <p className="landing-hero-panel__value">{submissions.length}</p>
                  <p className="landing-hero-panel__label">Connected demo records across shared dashboards</p>
                </div>
                <span className="landing-hero-panel__badge">{uniquePatients} active patient profiles</span>
              </div>

              <div className="landing-hero-panel__chart" aria-hidden="true">
                <span style={{ height: '44%' }} />
                <span style={{ height: '58%' }} />
                <span style={{ height: '54%' }} />
                <span style={{ height: '70%' }} />
                <span style={{ height: '76%' }} />
                <span style={{ height: '80%' }} />
                <span style={{ height: '86%' }} />
              </div>

              <div className="landing-hero-panel__feed">
                {previewFeed.map(([label, value]) => (
                  <div key={label} className="landing-hero-panel__row">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>

              <div className="landing-showcase" aria-hidden="true">
                <div className="landing-showcase__base" />
                <div className="landing-showcase__device">
                  <img className="landing-showcase__image" src={heroImage} alt="" />
                </div>
              </div>
            </div>
          </div>

          <div className="landing-role-grid">
            {roleSurfaces.map((surface) => (
              <article key={surface.tag} className="landing-role-card">
                <p className="landing-role-card__tag">{surface.tag}</p>
                <h2 className="landing-role-card__title">{surface.title}</h2>
                <p className="landing-role-card__copy">{surface.copy}</p>
                <p className="landing-role-card__metric">{surface.metric}</p>
                <Button
                  className="landing-role-card__action"
                  kind="secondary"
                  onClick={() => nav(surface.actionTarget)}
                >
                  {surface.actionLabel}
                </Button>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section-stack" aria-label="Landing page sections">
          {sections.map((section) => (
            <article key={section.id} className="landing-section-card" id={section.id}>
              <p className="landing-section-kicker">{section.kicker}</p>
              <h2 className="landing-section-title">{section.title}</h2>
              <p className="landing-section-copy">{section.copy}</p>
              {section.isContact ? (
                <address className="landing-section-list landing-contact-list">
                  {section.items.map((item) => (
                    <p key={item} className="landing-contact-item">
                      {item}
                    </p>
                  ))}
                </address>
              ) : (
                <ul className="landing-section-list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </section>

        <footer className="landing-footer">
          <div className="landing-footer__brand">
            <img className="landing-footer__mark" src="/healthhive-wordmark.svg" alt="HealthHive" />
            <p className="landing-footer__copy">
              HealthHive keeps patients, providers, and admins connected in one shared care
              workspace.
            </p>
          </div>

          <div className="landing-footer__links" aria-label="Footer links">
            <a href="#about">About</a>
            <a href="#resources">Resources</a>
            <a href="#contact">Contact</a>
          </div>

          <p className="landing-footer__meta">Sample footer for the landing page experience.</p>
        </footer>
      </div>

      <button
        className={`landing-backtotop${showBackToTop ? ' landing-backtotop--visible' : ''}`}
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        Top
      </button>
    </main>
  );
}

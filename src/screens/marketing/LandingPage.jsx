import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import useAuth from '../../auth/useAuth';
import { getDefaultRouteForRole } from '../../auth/roleRoutes';
import './marketing.css';

const releasesUrl = 'https://github.com/Mwoods30/HealthHive/releases';
const latestReleaseUrl = 'https://github.com/Mwoods30/HealthHive/releases/latest/download';

const releaseSections = [
  {
    id: 'mac',
    title: 'Mac',
    meta: 'Apple Silicon and Intel',
    copy: 'Download the Mac app as a .dmg for either Apple Silicon or Intel hardware.',
    actions: [
      { label: 'Apple Silicon .dmg', href: `${latestReleaseUrl}/HealthHive-macos-apple-silicon.dmg` },
      { label: 'Intel .dmg', href: `${latestReleaseUrl}/HealthHive-macos-intel.dmg` },
    ],
  },
  {
    id: 'windows',
    title: 'Windows',
    meta: 'Desktop installer',
    copy: 'Install the Windows app for provider and admin workflows on clinic or office machines.',
    actions: [{ label: 'Windows installer', href: `${latestReleaseUrl}/HealthHive-windows-x64-setup.exe` }],
  },
  {
    id: 'mobile',
    title: 'Mobile',
    meta: 'iOS and Android',
    copy: 'Use the mobile app for patient check-ins, appointment access, reminders, and billing updates. Android builds are downloadable from the latest release; iOS remains a signed-release step.',
    actions: [
      { label: 'iOS release notes', href: releasesUrl },
      { label: 'Android beta', href: `${latestReleaseUrl}/HealthHive-android-arm64-debug.apk` },
    ],
  },
];

const featureItems = [
  'Patient timelines, results, appointments, insurance, and billing in one app.',
  'Provider review queues, notes, and follow-up actions in a native workspace.',
  'Admin approvals, audit views, and support operations in the same product.',
  'A secondary web demo is still available for quick preview or classroom presentation.',
];

export default function LandingPage() {
  const nav = useNavigate();
  const location = useLocation();
  const { role, logout } = useAuth();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const ctaLabel = role ? 'Open web demo' : 'Try web demo';
  const ctaTarget = role ? getDefaultRouteForRole(role) : '/login';
  const heroImage =
    'https://thumbs.wbm.im/pw/medium/e38f3a563a4a84d3221a1c3c81a40e2c.jpg';

  const navItems = [
    ['Downloads', '#downloads'],
    ['Features', '#features'],
    ['Support', '#contact'],
  ];

  const releasePreview = [
    ['Mac', 'Apple Silicon and Intel .dmg'],
    ['Windows', 'Desktop installer'],
    ['Mobile', 'iOS and Android beta'],
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
              <p className="landing-hero-kicker">HealthHive app</p>
              <h1 className="landing-display">Download HealthHive.</h1>
              <p className="landing-intro">
                HealthHive is presented as a native app for Mac, Windows, iPhone, and Android.
              </p>
              <p className="landing-hero-copy">
                The page is now focused on the app itself: where to download it, what it includes,
                and where to get support. The web demo stays available as a secondary option.
              </p>

              <div className="landing-hero-actions">
                <a className="landing-download-cta" href="#downloads">
                  See downloads
                </a>
                <Button kind="secondary" onClick={() => nav(ctaTarget)}>
                  {ctaLabel}
                </Button>
              </div>

              <div className="landing-platform-pills" aria-label="Supported platforms">
                <span className="landing-platform-pill">Mac</span>
                <span className="landing-platform-pill">Windows</span>
                <span className="landing-platform-pill">iOS</span>
                <span className="landing-platform-pill">Android</span>
              </div>
            </div>

            <div className="landing-hero-panel">
              <div className="landing-hero-panel__top">
                <p className="landing-hero-panel__kicker">Release summary</p>
                <div>
                  <p className="landing-hero-panel__value">3</p>
                  <p className="landing-hero-panel__label">Clean download sections for Mac, Windows, and Mobile</p>
                </div>
                <span className="landing-hero-panel__badge">Native app</span>
              </div>

              <div className="landing-hero-panel__feed">
                {releasePreview.map(([label, value]) => (
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
        </section>

        <section className="landing-download-board" id="downloads">
          <div className="landing-download-board__header">
            <div>
              <p className="landing-section-kicker">Downloads</p>
              <h2 className="landing-section-title">Choose your platform</h2>
            </div>
            <p className="landing-download-board__copy">
              Keep the release section simple: Mac, Windows, and Mobile. Desktop and Android buttons now point at the latest GitHub Release asset names used by the native build workflows.
            </p>
          </div>

          <div className="landing-platform-sections">
            {releaseSections.map((section) => (
              <article key={section.id} className="landing-platform-section" id={section.id}>
                <div className="landing-platform-section__head">
                  <div>
                    <p className="landing-platform-section__kicker">{section.title}</p>
                    <h3 className="landing-platform-section__title">{section.meta}</h3>
                  </div>
                </div>
                <p className="landing-platform-section__copy">{section.copy}</p>
                <div className="landing-platform-section__actions">
                  {section.actions.map((action) => (
                    <a
                      key={action.label}
                      className="landing-download-link"
                      href={action.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {action.label}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section-stack">
          <article className="landing-section-card" id="features">
            <p className="landing-section-kicker">Features</p>
            <h2 className="landing-section-title">What the app includes</h2>
            <p className="landing-section-copy">
              HealthHive stays simple on the landing page, but it still points to the main product value.
            </p>
            <ul className="landing-section-list">
              {featureItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="landing-card-actions">
              <Button kind="secondary" onClick={() => nav(ctaTarget)}>
                {ctaLabel}
              </Button>
              <a className="landing-text-link" href="#contact">
                Need release info?
              </a>
            </div>
          </article>

          <article className="landing-section-card" id="contact">
            <p className="landing-section-kicker">Support</p>
            <h2 className="landing-section-title">Release links and contact</h2>
            <p className="landing-section-copy">
              Use GitHub Releases for packaged builds and keep one clear support path for beta access.
            </p>
            <div className="landing-support-links">
              <a className="landing-text-link" href={releasesUrl} target="_blank" rel="noreferrer">
                GitHub Releases
              </a>
              <a className="landing-text-link" href="mailto:support@healthhive.example.com">
                support@healthhive.example.com
              </a>
              <a className="landing-text-link" href="tel:5551234567">
                (555) 123-4567
              </a>
            </div>
          </article>
        </section>

        <footer className="landing-footer">
          <div className="landing-footer__brand">
            <img className="landing-footer__mark" src="/healthhive-wordmark.svg" alt="HealthHive" />
            <p className="landing-footer__copy">
              A simpler landing page for the HealthHive app with clean Mac, Windows, and Mobile download sections.
            </p>
          </div>

          <div className="landing-footer__links" aria-label="Footer links">
            <a href="#downloads">Downloads</a>
            <a href="#features">Features</a>
            <a href="#contact">Support</a>
          </div>

          <p className="landing-footer__meta">Sample app-release landing page.</p>
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

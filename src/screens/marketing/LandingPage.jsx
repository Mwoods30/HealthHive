import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/useAuth';
import { getDefaultRouteForRole } from '../../auth/roleRoutes';
import './marketing.css';

const workspaceCards = [
  {
    title: 'Patient View',
    copy: 'Patient-facing layouts with empty fields and no stored records.',
    route: '/login',
  },
  {
    title: 'Provider View',
    copy: 'Provider layouts with empty workflow fields and no loaded content.',
    route: '/login',
  },
  {
    title: 'Admin View',
    copy: 'Admin layouts with empty operational fields and no loaded data.',
    route: '/login',
  },
];

export default function LandingPage() {
  const nav = useNavigate();
  const { role, logout } = useAuth();
  const ctaTarget = role ? getDefaultRouteForRole(role) : '/login';

  return (
    <div className="lp">
      <header className="lp-nav lp-nav--solid">
        <div className="lp-nav-inner">
          <Link to="/" className="lp-nav-logo" aria-label="HealthHive home">
            <img src="/healthhive-wordmark.svg" alt="HealthHive" />
          </Link>
          <div className="lp-nav-actions">
            {role ? (
              <>
                <button className="lp-ghost-btn" onClick={() => { logout(); nav('/'); }}>Sign out</button>
                <button className="lp-primary-btn" onClick={() => nav(ctaTarget)}>Open workspace</button>
              </>
            ) : (
              <>
                <button className="lp-ghost-btn" onClick={() => nav('/signup')}>About</button>
                <button className="lp-primary-btn" onClick={() => nav('/login')}>Open app</button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="lp-hero lp-hero--ready">
        <div className="lp-hero-bg" aria-hidden="true">
          <div className="lp-hero-mesh" />
          <div className="lp-hero-grid" />
        </div>

        <div className="lp-hero-inner">
          <div className="lp-hero-copy">
            <div className="lp-hero-pill">
              <span className="lp-hero-pill__dot" />
              Basic frontend only
            </div>

            <h1 className="lp-hero-h1">
              HealthHive is now a
              <br />
              blank frontend shell.
            </h1>

            <p className="lp-hero-sub">
              Data storage and seeded content have been removed, while the visual frontend structure stays in place.
            </p>

            <div className="lp-hero-actions">
              <button className="lp-primary-btn lp-primary-btn--hero lp-primary-btn--glow" onClick={() => nav(ctaTarget)}>
                {role ? 'Open workspace' : 'Open app'}
              </button>
              <button className="lp-outline-btn lp-outline-btn--hero" onClick={() => nav('/signup')}>
                Project status
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-section-inner">
          <div className="lp-section-hd">
            <p className="lp-eyebrow">Current state</p>
            <h2 className="lp-h2">What remains in the app</h2>
            <p className="lp-lead">The frontend structure and navigation remain, with empty fields and unfilled containers across each workspace.</p>
          </div>

          <div className="lp-services-grid">
            {workspaceCards.map((card) => (
              <div key={card.title} className="lp-service-card">
                <h3 className="lp-service-card__title">{card.title}</h3>
                <p className="lp-service-card__desc">{card.copy}</p>
                <button className="lp-service-card__cta" onClick={() => nav(card.route)}>
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--tinted">
        <div className="lp-section-inner">
          <div className="lp-section-hd">
            <p className="lp-eyebrow">Removed</p>
            <h2 className="lp-h2">Cleaned out content</h2>
          </div>
          <ul className="lp-check-list">
            <li>No sample patient or provider records</li>
            <li>No persisted data behind the screens</li>
            <li>No fake testimonials, charts, scores, or seeded marketing metrics</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

import { useEffect } from 'react';

const EASE = 'cubic-bezier(.22,1,.36,1)';

/**
 * Scroll-reveal + staggered entrance for all patient / provider pages.
 * Works purely via inline styles — no extra class names needed in JSX.
 */
export default function useDashboardAnimations() {
  useEffect(() => {
    // ── Page-hero entrance ────────────────────────────
    const overview = document.querySelector('.patient-overview');
    if (overview) {
      overview.style.cssText += `opacity:0;transform:translateY(18px);transition:opacity .65s ${EASE} .04s,transform .65s ${EASE} .04s;`;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        overview.style.opacity = '1';
        overview.style.transform = 'translateY(0)';
      }));
    }

    // ── Stagger summary stat cards ────────────────────
    document.querySelectorAll('.patient-summary-card').forEach((el, i) => {
      el.style.cssText += `opacity:0;transform:translateY(16px);transition:opacity .55s ${EASE} ${80 + i * 70}ms,transform .55s ${EASE} ${80 + i * 70}ms;`;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }));
    });

    // ── Form sections stagger ─────────────────────────
    document.querySelectorAll('.patient-form-grid, .inline-form-grid').forEach((el, i) => {
      el.style.cssText += `opacity:0;transform:translateY(14px);transition:opacity .5s ${EASE} ${120 + i * 80}ms,transform .5s ${EASE} ${120 + i * 80}ms;`;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }));
    });

    // ── Scroll-reveal targets ─────────────────────────
    const SCROLL_SELECTORS = [
      '.patient-dashboard-card',
      '.appt-card',
      '.med-card',
      '.billing-card',
      '.review-board__row',
      '.insight-card',
      '.patient-timeline__item',
      '.dashboard-list__row',
      '.patient-detail-list__row',
      '.feed-list__item',
    ].join(', ');

    const scrollEls = Array.from(document.querySelectorAll(SCROLL_SELECTORS));

    // Group siblings for staggered delay
    const parentMap = new Map();
    scrollEls.forEach(el => {
      const key = el.parentElement;
      if (!parentMap.has(key)) parentMap.set(key, []);
      parentMap.get(key).push(el);
    });

    scrollEls.forEach(el => {
      const siblings = parentMap.get(el.parentElement) || [el];
      const idx = siblings.indexOf(el);
      el.style.cssText += `opacity:0;transform:translateY(20px);transition:opacity .6s ${EASE} ${idx * 65}ms,transform .6s ${EASE} ${idx * 65}ms;`;
    });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -32px 0px' });

    scrollEls.forEach(el => obs.observe(el));

    return () => obs.disconnect();
  }, []);
}

import React from 'react';
import './skeleton.css';

export function Skeleton({ width, height, className = '' }) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{ width: width || '100%', height: height || '1em', display: 'block' }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ rows = 3 }) {
  return (
    <div className="skeleton-card" aria-busy="true" aria-label="Loading…">
      <Skeleton height="1rem" width="40%" className="skeleton--mb" />
      <Skeleton height="1.4rem" width="70%" className="skeleton--mb-lg" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height="0.88rem" width={`${75 + (i % 3) * 10}%`} className="skeleton--mb-sm" />
      ))}
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="skeleton-row" aria-hidden="true">
      <Skeleton height="0.88rem" width="30%" />
      <Skeleton height="0.88rem" width="20%" />
    </div>
  );
}

import React from 'react';
import './chips.css';

export function Chip({ active, children, className='', ...props }) {
  return (
    <button
      className={`chip ${active ? 'chip--active' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ChipGroup({ children, className='' }) {
  return <div className={`chip-group ${className}`}>{children}</div>;
}
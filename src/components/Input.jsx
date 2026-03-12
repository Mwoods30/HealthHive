import React from 'react';
import './input.css';

export default function Input({ className = '', ...props }) {
  return <input className={`input ${className}`} {...props} />;
}
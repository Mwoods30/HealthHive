import React from 'react';
import './button.css';

export default function Button({ kind = 'primary', className = '', ...props }) {
  return <button className={`btn btn--${kind} ${className}`} {...props} />;
}
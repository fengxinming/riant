import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ className, style, text }) {
  return (
    <div x-class={[ 'basic-layout-logo', className ]} style={style}>
      <Link to="/" className="basic-layout-logo-text">
        {text || 'LOGO'}
      </Link>
    </div>
  );
}

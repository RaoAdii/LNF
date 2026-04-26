import React from 'react';

export default function PageWrapper({ children, className = '' }) {
  return (
    <div
      style={{ transform: 'translateZ(0)' }}
      className={className.trim()}
    >
      {children}
    </div>
  );
}

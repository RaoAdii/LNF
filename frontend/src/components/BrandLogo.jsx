import React from 'react';
import { Link } from 'react-router-dom';

export default function BrandLogo({
  to = '/',
  className = '',
  iconFill = '#ffffff',
  textColor = '#000000',
  subtitleColor = 'rgba(0, 0, 0, 0.38)',
}) {
  const logo = (
    <svg width="180" height="44" viewBox="0 0 180 44" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="5" width="34" height="34" rx="10" fill={iconFill} />
      <circle cx="14" cy="19" r="5.5" fill="none" stroke="#0f0f12" strokeWidth="2" strokeLinecap="round" />
      <line x1="18.5" y1="23.5" x2="22" y2="27" stroke="#0f0f12" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="13" x2="28" y2="31" stroke="#0f0f12" strokeWidth="1.6" strokeLinecap="round" opacity="0.15" />
      <text x="24" y="30" fontFamily="Arial" fontWeight="900" fontSize="10" fill="#0f0f12">
        F
      </text>
      <text x="44" y="21" fontFamily="'Syne', sans-serif" fontWeight="800" fontSize="18" fill={textColor} letterSpacing="-0.8">
        LNF
      </text>
      <text
        x="44"
        y="36"
        fontFamily="'DM Sans', sans-serif"
        fontWeight="300"
        fontSize="9"
        fill={subtitleColor}
        letterSpacing="2.5"
      >
        LOST &amp; FOUND
      </text>
    </svg>
  );

  if (!to) {
    return <div className={className}>{logo}</div>;
  }

  return (
    <Link to={to} className={className}>
      {logo}
    </Link>
  );
}

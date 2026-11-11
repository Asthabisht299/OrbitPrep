import React from 'react'

export function OrbitMark({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      role="img"
      aria-label="OrbitPrep"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="orbitprep-mark-gradient" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9A8CFF" />
          <stop offset="1" stopColor="#55E6FF" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="12" fill="url(#orbitprep-mark-gradient)" />
      <circle cx="20" cy="20" r="9.2" fill="none" stroke="#081426" strokeWidth="2.2" />
      <path d="M10.8 23.8c3.8-7.5 11.8-11.2 18.7-8.4" fill="none" stroke="#081426" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="29.3" cy="14.7" r="3" fill="#081426" />
      <path d="M20 14.8v10.4M14.8 20h10.4" stroke="#081426" strokeWidth="1.5" strokeLinecap="round" opacity=".72" />
    </svg>
  )
}

export default function OrbitPrepLogo({ className = '' }) {
  return (
    <span className={`orbitprep-logo ${className}`}>
      <OrbitMark className="orbitprep-logo-mark" />
      <span className="orbitprep-wordmark">orbit<span>prep</span></span>
    </span>
  )
}

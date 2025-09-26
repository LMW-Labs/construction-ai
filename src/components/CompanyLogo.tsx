import React from 'react';

const CompanyLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hard hat base */}
    <ellipse cx="100" cy="160" rx="80" ry="20" fill="url(#gradient1)" />
    
    {/* Hard hat main */}
    <path d="M30 160 C30 110, 60 70, 100 70 C140 70, 170 110, 170 160 Z" fill="url(#gradient2)" />
    
    {/* Hard hat rim */}
    <ellipse cx="100" cy="160" rx="75" ry="15" fill="url(#gradient3)" />
    
    {/* Construction crane */}
    <rect x="95" y="40" width="10" height="80" fill="url(#gradient4)" />
    <rect x="60" y="45" width="80" height="8" fill="url(#gradient4)" />
    <rect x="130" y="48" width="6" height="40" fill="url(#gradient4)" />
    
    {/* Crane hook */}
    <circle cx="133" cy="90" r="3" fill="#FFD700" />
    <line x1="133" y1="93" x2="133" y2="110" stroke="#FFD700" strokeWidth="2" />
    
    {/* Building blocks being lifted */}
    <rect x="125" y="110" width="16" height="12" fill="url(#gradient5)" />
    <rect x="127" y="105" width="12" height="8" fill="url(#gradient6)" />
    
    {/* Company initials in hard hat */}
    <text x="100" y="140" textAnchor="middle" className="fill-white font-bold text-2xl">
      CM
    </text>
    
    {/* Gear elements */}
    <circle cx="45" cy="45" r="12" fill="url(#gradient7)" />
    <circle cx="45" cy="45" r="8" fill="none" stroke="white" strokeWidth="2" />
    <circle cx="45" cy="45" r="3" fill="white" />
    
    <circle cx="155" cy="180" r="10" fill="url(#gradient7)" />
    <circle cx="155" cy="180" r="6" fill="none" stroke="white" strokeWidth="1.5" />
    <circle cx="155" cy="180" r="2" fill="white" />

    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#374151" />
        <stop offset="100%" stopColor="#1F2937" />
      </linearGradient>
      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#FBBF24" />
      </linearGradient>
      <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
      <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
      <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#0891B2" />
      </linearGradient>
      <linearGradient id="gradient7" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
  </svg>
);

export default CompanyLogo;
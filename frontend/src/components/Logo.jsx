export default function Logo({ size = 40, className = '' }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      width={size} 
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      {/* Background Circle */}
      <circle cx="50" cy="50" r="45" fill="url(#logoGrad)"/>
      {/* Steering Wheel */}
      <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="6"/>
      <circle cx="50" cy="50" r="8" fill="white"/>
      {/* Spokes */}
      <line x1="50" y1="22" x2="50" y2="42" stroke="white" strokeWidth="5" strokeLinecap="round"/>
      <line x1="50" y1="58" x2="50" y2="78" stroke="white" strokeWidth="5" strokeLinecap="round"/>
      <line x1="22" y1="50" x2="42" y2="50" stroke="white" strokeWidth="5" strokeLinecap="round"/>
      <line x1="58" y1="50" x2="78" y2="50" stroke="white" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  )
}

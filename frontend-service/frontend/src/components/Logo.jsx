const Logo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1a3a5c"/>
        <stop offset="100%" stopColor="#0d7377"/>
      </linearGradient>
    </defs>
    <rect width="44" height="44" rx="10" fill="url(#lg)"/>
    <path d="M8 30 L8 16 Q8 14 10 14 L21 14 L21 32 Q14 30 8 30Z" fill="rgba(255,255,255,0.9)"/>
    <path d="M36 30 L36 16 Q36 14 34 14 L23 14 L23 32 Q30 30 36 30Z" fill="rgba(255,255,255,0.7)"/>
    <line x1="22" y1="14" x2="22" y2="32" stroke="#d4a017" strokeWidth="1.5"/>
    <circle cx="22" cy="10" r="3" fill="#d4a017"/>
    <path d="M22 7 L22.6 8.8 L24.4 8.8 L23 9.9 L23.5 11.7 L22 10.6 L20.5 11.7 L21 9.9 L19.6 8.8 L21.4 8.8Z" fill="#faf8f3" opacity="0.9"/>
  </svg>
);

export default Logo;

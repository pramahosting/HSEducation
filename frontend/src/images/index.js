// ============================================================
// HS Education — Image Library
// Uses inline SVG data URIs — no external dependencies,
// works on any domain including Northflank deployments.
// ============================================================

// Helper: creates a branded SVG image with gradient background
function svg(label, icon, from, to) {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${from}"/>
        <stop offset="100%" style="stop-color:${to}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#g)"/>
    <rect width="800" height="500" fill="rgba(0,0,0,0.18)"/>
    <text x="400" y="220" text-anchor="middle" fill="rgba(255,255,255,0.15)"
      font-family="Georgia,serif" font-size="120">${icon}</text>
    <text x="400" y="310" text-anchor="middle" fill="rgba(255,255,255,0.9)"
      font-family="Georgia,serif" font-size="28" font-style="italic">${label}</text>
  </svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(s);
}

// Small helper for portrait/square images (team, testimonials)
function svgSq(initials, from, to) {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${from}"/>
        <stop offset="100%" style="stop-color:${to}"/>
      </linearGradient>
    </defs>
    <rect width="300" height="300" fill="url(#g)"/>
    <text x="150" y="170" text-anchor="middle" fill="rgba(255,255,255,0.9)"
      font-family="Georgia,serif" font-size="72" font-weight="bold">${initials}</text>
  </svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(s);
}

const NAVY  = '#1a3a5c';
const TEAL  = '#0d7377';
const GOLD  = '#c8900a';
const DARK  = '#0f2440';
const GREEN = '#1a5c3a';
const PURP  = '#3a1a5c';

const IMGS = {
  // ── Hero & General ──────────────────────────────────────
  heroStudents:   svg('Empowering Australian Learners',       '🎓', DARK,  TEAL),
  missionKids:    svg('Students Learning Together',           '📚', NAVY,  TEAL),
  communityGroup: svg('Community & Connection',               '🤝', TEAL,  NAVY),
  aboutFounders:  svg('Our Story',                            '💡', DARK,  '#2c5282'),
  impactBanner:   svg('4,200+ Students Supported',            '⭐', DARK,  TEAL),
  aboutMission:   svg('Changing Lives Through Education',     '🌟', NAVY,  TEAL),
  donateHero:     svg('Make a Difference Today',              '❤️', DARK,  TEAL),

  // ── Programs ────────────────────────────────────────────
  scholarship:    svg('Future Leaders Bursary',               '🎓', NAVY,  '#2c5282'),
  literacy:       svg('Read to Succeed',                      '📖', TEAL,  '#0a5560'),
  indigenous:     svg('Remote Learning Connect',              '🌏', GREEN, '#0a3a20'),
  vocational:     svg('Skills for Life',                      '🔧', '#5c3a1a', '#8b5e2a'),
  infrastructure: svg('Resource Rich Schools',                '🏫', '#1a3a5c', '#2d5a8e'),
  mathsProgram:   svg('Maths Mastery Program',               '🔢', PURP,  '#2a1a4a'),
  regional:       svg('Regional Excellence Award',            '🏆', GOLD,  '#8b6914'),
  twoWay:         svg('Two-Way Learning Initiative',          '🪃', GREEN, TEAL),
  pathways:       svg('Pathways to Employment',               '💼', DARK,  NAVY),

  // ── Testimonials ────────────────────────────────────────
  person1: svgSq('AM', TEAL,  NAVY),
  person2: svgSq('JT', NAVY,  '#2c5282'),
  person3: svgSq('DW', DARK,  TEAL),

  // ── Team ────────────────────────────────────────────────
  team1: svgSq('HS', NAVY,  TEAL),
  team2: svgSq('ST', TEAL,  DARK),
  team3: svgSq('SC', DARK,  '#2c5282'),
  team4: svgSq('DK', NAVY,  '#1a5c3a'),
  team5: svgSq('PS', TEAL,  NAVY),
  team6: svgSq('TN', PURP,  NAVY),
  team7: svgSq('AW', GREEN, TEAL),
  team8: svgSq('MR', GOLD,  '#5c3a00'),
};

export default IMGS;

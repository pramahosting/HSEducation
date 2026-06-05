// ============================================================
// HS Education — Database Layer
// Auto-detects PostgreSQL. Falls back to in-memory store.
// App works fully without a database installed.
// ============================================================

const { Pool } = require('pg');

// ── In-memory fallback store ──────────────────────────────
const memStore = {
  donations: [],
  programs: [
    { id:'p1', name:'Future Leaders Bursary',   category:'Scholarships', description:'Annual scholarships of up to $5,000 for high-achieving Year 11/12 students from low-income households.', location:'NSW & VIC',        goal_amount:180000, raised_amount:129600, status:'active',      image_url:null, created_at: new Date() },
    { id:'p2', name:'Read to Succeed',           category:'Literacy',     description:'Intensive 10-week literacy intervention in 12 primary schools across regional QLD and SA.',              location:'QLD & SA',        goal_amount:95000,  raised_amount:83600,  status:'active',      image_url:null, created_at: new Date() },
    { id:'p3', name:'Remote Learning Connect',   category:'Indigenous',   description:'Providing devices and culturally appropriate learning materials to First Nations students in remote NT and WA.', location:'NT & WA',    goal_amount:240000, raised_amount:132000, status:'active',      image_url:null, created_at: new Date() },
    { id:'p4', name:'Skills for Life',           category:'Vocational',   description:'TAFE Certificate II and III enrolment fees for young people aged 16–25 who have disengaged from schooling.', location:'All States', goal_amount:110000, raised_amount:71500,  status:'active',      image_url:null, created_at: new Date() },
    { id:'p5', name:'Resource Rich Schools Grant',category:'Infrastructure',description:'Equipment grants to under-resourced regional schools — science kits, books, sports gear and maker-space tools.', location:'Regional', goal_amount:85000,  raised_amount:34000,  status:'active',      image_url:null, created_at: new Date() },
    { id:'p6', name:'Maths Mastery Program',     category:'Literacy',     description:'After-school numeracy tutoring for Years 3–8 students performing below national minimum standard.',      location:'VIC & QLD',       goal_amount:60000,  raised_amount:55800,  status:'active',      image_url:null, created_at: new Date() },
    { id:'p7', name:'Regional Excellence Award', category:'Scholarships', description:'Scholarships for gifted regional students supporting university transition including relocation assistance.', location:'QLD, SA, WA', goal_amount:200000, raised_amount:60000,  status:'fundraising', image_url:null, created_at: new Date() },
    { id:'p8', name:'Two-Way Learning Initiative',category:'Indigenous',  description:'Culturally responsive curriculum co-designed with Elders integrating community language with national standards.', location:'NT',     goal_amount:150000, raised_amount:72000,  status:'active',      image_url:null, created_at: new Date() },
    { id:'p9', name:'Pathways to Employment',    category:'Vocational',   description:'Career mentorship connecting Year 10–12 students with industry professionals across healthcare, trades and tech.', location:'NSW, VIC, SA', goal_amount:75000, raised_amount:58500, status:'active', image_url:null, created_at: new Date() },
  ],
  providers: [
    { id:'v1', name:'Stripe Australia',  type:'stripe',  is_active:true,  created_at: new Date() },
    { id:'v2', name:'PayPal Australia',  type:'paypal',  is_active:true,  created_at: new Date() },
    { id:'v3', name:'Manual / Cheque',   type:'manual',  is_active:true,  created_at: new Date() },
  ],
  nextId: 1000,
};

// ── Try PostgreSQL ────────────────────────────────────────
let pool = null;
let usingDB = false;

try {
  pool = new Pool({
    host:                   process.env.DB_HOST     || 'localhost',
    port:                   parseInt(process.env.DB_PORT || '5432'),
    database:               process.env.DB_NAME     || 'hseducation',
    user:                   process.env.DB_USER     || 'hse_user',
    password:               process.env.DB_PASSWORD || 'hse_password',
    max:                    5,
    idleTimeoutMillis:      10000,
    connectionTimeoutMillis:2000,
  });

  pool.query('SELECT NOW()')
    .then(() => {
      usingDB = true;
      console.log('✅ PostgreSQL connected — using database');
    })
    .catch(() => {
      usingDB = false;
      console.log('⚠️  PostgreSQL not available — using in-memory store');
      console.log('   App is fully functional. See README to set up PostgreSQL.');
    });

} catch (e) {
  console.log('⚠️  PostgreSQL not configured — using in-memory store');
}

// ── Unified query interface ───────────────────────────────
// Routes use db.query() and db.mem — automatically routes to
// PostgreSQL when available, in-memory store when not.

const db = {

  // Raw SQL query (PostgreSQL only)
  query: async (sql, params) => {
    if (usingDB && pool) return pool.query(sql, params);
    throw new Error('PostgreSQL not connected');
  },

  // Is database available?
  isConnected: () => usingDB,

  // In-memory store (always available as fallback)
  mem: memStore,

  // Generate a simple unique ID for in-memory records
  newId: () => `mem_${++memStore.nextId}_${Date.now()}`,
};

module.exports = db;

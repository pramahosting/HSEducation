// ============================================================
// HS Education — Unified Server
// Serves React frontend AND API from one Express server
// Single port (3000) — one Northflank service
// ============================================================
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const path    = require('path');
const fs      = require('fs');

const donationsRouter = require('./routes/donations');
const programsRouter  = require('./routes/programs');
const providersRouter = require('./routes/providers');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

// ── API Routes ────────────────────────────────────────────
app.get('/healthz', (req, res) => {
  const db = require('./db');
  res.json({
    status:   'ok',
    service:  'HS Education',
    database: db.isConnected() ? 'postgresql' : 'in-memory',
    port:     PORT,
  });
});

app.use('/api/donations', donationsRouter);
app.use('/api/programs',  programsRouter);
app.use('/api/providers', providersRouter);

// ── Serve React Frontend ──────────────────────────────────
// The React build is copied into /app/public inside the container
const STATIC = path.join(__dirname, 'public');

if (fs.existsSync(STATIC)) {
  // Serve static assets
  app.use(express.static(STATIC));
  // All other routes → React index.html (SPA routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(STATIC, 'index.html'));
  });
  console.log('✅ Serving React frontend from /public');
} else {
  app.get('/', (req, res) => res.json({ message: 'HS Education API running' }));
  console.log('⚠️  No frontend build found — API only mode');
}

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║   HS Education - Running!            ║');
  console.log(`║   Port    : ${PORT}                      ║`);
  console.log('║   Website : /                        ║');
  console.log('║   API     : /api/programs            ║');
  console.log('║   Health  : /healthz                 ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('');
});

module.exports = app;

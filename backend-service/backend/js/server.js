// ============================================================
// HS Education — Backend API Server
// Express + PostgreSQL (with in-memory fallback)
// ============================================================
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');

const donationsRouter = require('./routes/donations');
const programsRouter  = require('./routes/programs');
const providersRouter = require('./routes/providers');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(morgan('tiny'));

// ── Health check ─────────────────────────────────────────
app.get('/healthz', (req, res) => {
  const db = require('./db');
  res.json({
    status:   'ok',
    service:  'HS Education API',
    database: db.isConnected() ? 'postgresql' : 'in-memory',
    port:     PORT,
  });
});

// ── Routes ────────────────────────────────────────────────
app.use('/api/donations', donationsRouter);
app.use('/api/programs',  programsRouter);
app.use('/api/providers', providersRouter);

// ── 404 ──────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║   HS Education API - Running!        ║');
  console.log(`║   Port    : ${PORT}                      ║`);
  console.log('║   Health  : /healthz                 ║');
  console.log('║   Docs    : /api/programs            ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('');
});

module.exports = app;

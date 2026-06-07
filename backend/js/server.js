const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');

const donationsRouter = require('./routes/donations');
const programsRouter  = require('./routes/programs');
const providersRouter = require('./routes/providers');

const app  = express();
const PORT = process.env.PORT || 5000;

// Accept any origin — needed for Northflank public URLs
// Restrict to specific URL by setting FRONTEND_URL env var
const corsOptions = {
  origin: process.env.FRONTEND_URL || true,
  credentials: true,
};

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('tiny'));

app.get('/healthz', (req, res) => {
  const db = require('./db');
  res.json({
    status:   'ok',
    service:  'HS Education API',
    database: db.isConnected() ? 'postgresql' : 'in-memory',
    port:     PORT,
  });
});

app.use('/api/donations', donationsRouter);
app.use('/api/programs',  programsRouter);
app.use('/api/providers', providersRouter);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║   HS Education API - Running!        ║');
  console.log(`║   Port : ${PORT}                         ║`);
  console.log('║   Health: /healthz                   ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('');
});

module.exports = app;

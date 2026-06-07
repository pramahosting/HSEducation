// ============================================================
// HS Education — Donations Routes
// Works with PostgreSQL or in-memory fallback automatically
// POST   /api/donations       — submit a donation
// GET    /api/donations       — list donations
// GET    /api/donations/:id   — single donation
// PATCH  /api/donations/:id/status — update status
// ============================================================
const express = require('express');
const router  = express.Router();
const db      = require('../db');

// POST /api/donations
router.post('/', async (req, res) => {
  const { first_name, last_name, email, phone, amount, frequency, program_id, provider_id } = req.body;
  if (!first_name || !email || !amount) {
    return res.status(400).json({ error: 'first_name, email and amount are required' });
  }
  try {
    if (db.isConnected()) {
      const result = await db.query(
        `INSERT INTO donations (first_name,last_name,email,phone,amount,frequency,program_id,provider_id,status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending') RETURNING *`,
        [first_name, last_name, email, phone||null, parseFloat(amount),
         frequency||'once', program_id||null, provider_id||null]
      );
      return res.status(201).json({ success:true, donation: result.rows[0] });
    }
    // In-memory
    const donation = {
      id: db.newId(), first_name, last_name, email,
      phone: phone||null, amount: parseFloat(amount),
      frequency: frequency||'once',
      program_id: program_id||null,
      provider_id: provider_id||null,
      status: 'completed',
      is_tax_receipt_sent: false,
      created_at: new Date(),
    };
    db.mem.donations.push(donation);
    return res.status(201).json({ success:true, donation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/donations
router.get('/', async (req, res) => {
  try {
    if (db.isConnected()) {
      const result = await db.query(
        `SELECT d.*, p.name AS program_name FROM donations d
         LEFT JOIN programs p ON d.program_id = p.id
         ORDER BY d.created_at DESC LIMIT 200`
      );
      return res.json(result.rows);
    }
    res.json(db.mem.donations.slice().reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/donations/:id
router.get('/:id', async (req, res) => {
  try {
    if (db.isConnected()) {
      const result = await db.query('SELECT * FROM donations WHERE id=$1', [req.params.id]);
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
      return res.json(result.rows[0]);
    }
    const d = db.mem.donations.find(x => x.id === req.params.id);
    if (!d) return res.status(404).json({ error: 'Not found' });
    res.json(d);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/donations/:id/status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending','completed','failed','refunded'];
  if (!allowed.includes(status)) return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` });
  try {
    if (db.isConnected()) {
      const result = await db.query(
        'UPDATE donations SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
        [status, req.params.id]
      );
      return res.json(result.rows[0]);
    }
    const d = db.mem.donations.find(x => x.id === req.params.id);
    if (!d) return res.status(404).json({ error: 'Not found' });
    d.status = status;
    res.json(d);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

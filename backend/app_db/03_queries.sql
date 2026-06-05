-- ============================================================
-- HS Education — Useful Admin Queries
-- File: 03_queries.sql
-- ============================================================

-- Total donations received
SELECT
  COUNT(*)                          AS total_donations,
  SUM(amount)                       AS total_amount,
  AVG(amount)                       AS avg_donation,
  COUNT(*) FILTER (WHERE status='completed') AS successful
FROM donations;

-- Donations by frequency
SELECT frequency, COUNT(*) AS count, SUM(amount) AS total
FROM donations
WHERE status = 'completed'
GROUP BY frequency
ORDER BY total DESC;

-- Top programs by funds raised
SELECT
  p.name,
  p.category,
  p.goal_amount,
  p.raised_amount,
  ROUND((p.raised_amount / NULLIF(p.goal_amount,0)) * 100, 1) AS pct_funded
FROM programs p
ORDER BY p.raised_amount DESC;

-- Monthly donation totals
SELECT
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*)                         AS donations,
  SUM(amount)                      AS total_aud
FROM donations
WHERE status = 'completed'
GROUP BY 1
ORDER BY 1 DESC;

-- Donations by program
SELECT
  p.name AS program,
  p.category,
  COUNT(d.id) AS donation_count,
  SUM(d.amount) AS total_donated
FROM donations d
JOIN programs p ON d.program_id = p.id
WHERE d.status = 'completed'
GROUP BY p.id, p.name, p.category
ORDER BY total_donated DESC;

-- Recent donations (last 30 days)
SELECT
  d.first_name, d.last_name, d.email,
  d.amount, d.frequency, d.status,
  p.name AS program,
  d.created_at
FROM donations d
LEFT JOIN programs p ON d.program_id = p.id
WHERE d.created_at >= NOW() - INTERVAL '30 days'
ORDER BY d.created_at DESC;

-- ============================================================
-- HS Education — Seed Data
-- File: 02_seed.sql
-- Run AFTER 01_schema.sql
-- ============================================================

-- ── Providers ─────────────────────────────────────────────
INSERT INTO providers (name, type, config_public, is_active) VALUES
  ('Stripe Australia',  'stripe',    'pk_test_placeholder_stripe',   true),
  ('PayPal Australia',  'paypal',    'paypal_client_id_placeholder',  true),
  ('eWAY',              'eway',      'eway_api_key_placeholder',       false),
  ('Manual / Cheque',   'manual',    NULL,                             true);

-- ── Programs ──────────────────────────────────────────────
INSERT INTO programs (name, category, description, location, goal_amount, raised_amount, status) VALUES
  (
    'Future Leaders Bursary',
    'Scholarships',
    'Annual scholarships of up to $5,000 for high-achieving Year 11/12 students from low-income households. Covers school fees, uniforms, textbooks and devices.',
    'NSW & VIC',
    180000.00, 129600.00, 'active'
  ),
  (
    'Read to Succeed',
    'Literacy',
    'Intensive 10-week literacy intervention program delivered in 12 primary schools across regional Queensland and South Australia.',
    'QLD & SA',
    95000.00, 83600.00, 'active'
  ),
  (
    'Remote Learning Connect',
    'Indigenous',
    'Providing internet connectivity, learning devices, and culturally appropriate learning materials to First Nations students in remote NT and WA communities.',
    'NT & WA (Remote)',
    240000.00, 132000.00, 'active'
  ),
  (
    'Skills for Life',
    'Vocational',
    'Partnered with TAFE colleges to fund Certificate II and III enrolment fees for young people aged 16–25 who have disengaged from schooling.',
    'All States',
    110000.00, 71500.00, 'active'
  ),
  (
    'Resource Rich Schools Grant',
    'Infrastructure',
    'Equipment and resource grants to under-resourced schools in regional and remote areas — science kits, library books, sports equipment and maker-space tools.',
    'Regional Australia',
    85000.00, 34000.00, 'active'
  ),
  (
    'Maths Mastery Program',
    'Literacy',
    'After-school numeracy tutoring for Years 3–8 students performing below the national minimum standard.',
    'VIC & QLD',
    60000.00, 55800.00, 'active'
  ),
  (
    'Regional Excellence Award',
    'Scholarships',
    'Scholarship program for academically gifted students in regional and remote areas, supporting transition to university including relocation assistance.',
    'QLD, SA, WA',
    200000.00, 60000.00, 'fundraising'
  ),
  (
    'Two-Way Learning Initiative',
    'Indigenous',
    'Culturally responsive curriculum co-designed with Elders integrating community language and knowledge with national curriculum standards.',
    'NT',
    150000.00, 72000.00, 'active'
  ),
  (
    'Pathways to Employment',
    'Vocational',
    'Career mentorship and work-placement connecting Year 10–12 students with industry professionals across healthcare, trades and technology.',
    'NSW, VIC, SA',
    75000.00, 58500.00, 'active'
  );

-- ── Sample donations ──────────────────────────────────────
INSERT INTO donations (first_name, last_name, email, amount, frequency, status)
VALUES
  ('Jane',   'Smith',   'jane.smith@example.com.au',   100.00, 'once',    'completed'),
  ('Robert', 'Johnson', 'r.johnson@example.com.au',    50.00,  'monthly', 'completed'),
  ('Sarah',  'Williams','s.williams@example.com.au',   250.00, 'once',    'completed'),
  ('Michael','Brown',   'm.brown@example.com.au',      500.00, 'annually','completed'),
  ('Emma',   'Davis',   'emma.davis@example.com.au',   25.00,  'monthly', 'completed');

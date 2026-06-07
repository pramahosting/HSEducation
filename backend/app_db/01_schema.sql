-- ============================================================
-- HS Education — PostgreSQL Database Schema
-- File: 01_schema.sql
-- Run: psql -U hse_user -d hseducation -f 01_schema.sql
-- ============================================================

-- ── Extensions ───────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Drop tables (clean re-run) ────────────────────────────
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS programs  CASCADE;
DROP TABLE IF EXISTS providers CASCADE;

-- ─────────────────────────────────────────────────────────
-- TABLE: providers
-- Stores donation payment providers (Stripe, PayPal, etc.)
-- ─────────────────────────────────────────────────────────
CREATE TABLE providers (
  id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           VARCHAR(100) NOT NULL,
  type           VARCHAR(50)  NOT NULL CHECK (type IN ('stripe','paypal','eway','securepay','manual')),
  config_public  TEXT,                          -- public key / client id (safe to log)
  config_secret  TEXT,                          -- secret key (never returned in API GET)
  is_active      BOOLEAN     NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  providers IS 'Payment gateway providers used to process donations';
COMMENT ON COLUMN providers.config_secret IS 'Encrypted secret key — never expose in API responses';

-- ─────────────────────────────────────────────────────────
-- TABLE: programs
-- Educational programs and projects receiving donations
-- ─────────────────────────────────────────────────────────
CREATE TABLE programs (
  id             UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           VARCHAR(200) NOT NULL,
  category       VARCHAR(50)  NOT NULL CHECK (category IN (
                   'Scholarships','Literacy','Indigenous','Vocational','Infrastructure','General'
                 )),
  description    TEXT,
  location       VARCHAR(200),
  goal_amount    NUMERIC(12,2) NOT NULL DEFAULT 0,
  raised_amount  NUMERIC(12,2) NOT NULL DEFAULT 0,
  status         VARCHAR(20)  NOT NULL DEFAULT 'active'
                   CHECK (status IN ('active','completed','paused','fundraising')),
  image_url      TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE programs IS 'Educational programs and projects that donations are allocated to';

-- ─────────────────────────────────────────────────────────
-- TABLE: donations
-- Records every donation made to HS Education
-- ─────────────────────────────────────────────────────────
CREATE TABLE donations (
  id             UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name     VARCHAR(100) NOT NULL,
  last_name      VARCHAR(100),
  email          VARCHAR(255) NOT NULL,
  phone          VARCHAR(30),
  amount         NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  frequency      VARCHAR(20)  NOT NULL DEFAULT 'once'
                   CHECK (frequency IN ('once','monthly','annually')),
  program_id     UUID         REFERENCES programs(id)  ON DELETE SET NULL,
  provider_id    UUID         REFERENCES providers(id) ON DELETE SET NULL,
  transaction_id VARCHAR(200),                 -- ID returned by payment gateway
  status         VARCHAR(20)  NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','completed','failed','refunded')),
  is_tax_receipt_sent BOOLEAN NOT NULL DEFAULT false,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  donations IS 'All donations received by HS Education';
COMMENT ON COLUMN donations.transaction_id IS 'Payment gateway transaction reference for reconciliation';

-- ── Indexes ───────────────────────────────────────────────
CREATE INDEX idx_donations_email      ON donations(email);
CREATE INDEX idx_donations_status     ON donations(status);
CREATE INDEX idx_donations_created    ON donations(created_at DESC);
CREATE INDEX idx_donations_program    ON donations(program_id);
CREATE INDEX idx_programs_category    ON programs(category);
CREATE INDEX idx_programs_status      ON programs(status);

-- ── updated_at auto-trigger ──────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_donations_updated  BEFORE UPDATE ON donations  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_programs_updated   BEFORE UPDATE ON programs   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_providers_updated  BEFORE UPDATE ON providers  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

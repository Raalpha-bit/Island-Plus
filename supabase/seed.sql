-- =============================================
-- ISLAND+ — Seed Data (Demo Creators & Posts)
-- =============================================
-- Run AFTER schema.sql
-- NOTE: These are profiles inserted directly (bypassing auth trigger)
-- In production, creators register via the app.

-- Insert demo creator profiles
-- (In a real migration, use auth.users UUIDs from Supabase Auth)

-- Seed platform stats view (materialized)
-- This is just reference data — real data comes from the tables above.

-- Demo Categories Reference (static, not a table)
-- Lifestyle | Fitness | Fashion | Photography | Music | Travel | Entertainment | Adult (18+)

-- =============================================
-- Platform Config (can be stored as Supabase Edge Config or a simple table)
-- =============================================

CREATE TABLE IF NOT EXISTS platform_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO platform_config (key, value) VALUES
  ('platform_fee_percentage', '20'),
  ('minimum_withdrawal', '50'),
  ('supported_currencies', '["USD", "EUR", "GBP", "CAD"]'),
  ('max_post_media', '10'),
  ('max_story_duration', '24'),
  ('categories', '["Lifestyle","Fitness","Fashion","Photography","Music","Travel","Entertainment","Adult (18+)","Gaming","Food","Art","Education"]')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- RLS for platform_config (public read, admin write)
ALTER TABLE platform_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Platform config is public" ON platform_config FOR SELECT USING (true);

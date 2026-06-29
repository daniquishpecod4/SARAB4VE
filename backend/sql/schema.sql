CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS help_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_name TEXT NOT NULL,
  contact_method TEXT NOT NULL,
  contact_value TEXT NOT NULL,
  need_type TEXT NOT NULL,
  description TEXT NOT NULL,
  latitude NUMERIC(9, 6) NOT NULL,
  longitude NUMERIC(9, 6) NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (need_type IN (
    'equipment',
    'medication',
    'transport',
    'companionship',
    'interpreter',
    'accessible_information',
    'neurodivergent_support',
    'psychosocial_support'
  )),
  CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  CHECK (status IN ('open', 'assigned', 'resolved')),
  CHECK (latitude >= -90 AND latitude <= 90),
  CHECK (longitude >= -180 AND longitude <= 180)
);

CREATE INDEX IF NOT EXISTS help_requests_status_idx
  ON help_requests (status);

CREATE INDEX IF NOT EXISTS help_requests_created_at_idx
  ON help_requests (created_at DESC);

-- Phase 9 — Paiement Stripe : statut intermédiaire + table des paiements.
-- Exécuté au premier démarrage du conteneur (docker-entrypoint-initdb.d),
-- ou via : docker exec -i nova-db psql -U nova -d nova_dev -f backend/db/init/005_payments.sql

ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'pending';

CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'stripe',
  provider_ref text UNIQUE,
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  currency text NOT NULL DEFAULT 'eur',
  status payment_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments (booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_ref ON payments (provider_ref);
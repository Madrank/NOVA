-- Phase 7 — Réservations : prestations, disponibilités concrètes, réservations sans conflit.
-- Exécuté au premier démarrage du conteneur (docker-entrypoint-initdb.d),
-- ou via : docker exec -i nova-db psql -U nova -d nova_dev < backend/db/init/003_booking.sql

CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  summary text NOT NULL,
  description text NOT NULL,
  price_cents integer NOT NULL CHECK (price_cents > 0),
  duration_min integer NOT NULL CHECK (duration_min > 0),
  duo boolean NOT NULL DEFAULT false,
  giftable boolean NOT NULL DEFAULT false,
  rating numeric(2, 1) NOT NULL DEFAULT 0,
  reviews_count integer NOT NULL DEFAULT 0,
  image_from text,
  image_to text,
  professional_id uuid REFERENCES professionals(id) ON DELETE SET NULL,
  establishment_id uuid REFERENCES establishments(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON services (slug);
CREATE INDEX IF NOT EXISTS idx_services_category ON services (category);
CREATE INDEX IF NOT EXISTS idx_services_establishment ON services (establishment_id);
CREATE INDEX IF NOT EXISTS idx_services_professional ON services (professional_id);

CREATE TABLE IF NOT EXISTS availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  is_booked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at),
  UNIQUE (service_id, starts_at)
);

CREATE INDEX IF NOT EXISTS idx_availability_service ON availability (service_id, is_booked, starts_at);
CREATE INDEX IF NOT EXISTS idx_availability_professional ON availability (professional_id);

CREATE TYPE booking_status AS ENUM ('confirmed', 'cancelled', 'completed');

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  availability_id uuid REFERENCES availability(id) ON DELETE SET NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  status booking_status NOT NULL DEFAULT 'confirmed',
  cancel_reason text,
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at),
  -- Invariant clé (ADR-006) : pas de chevauchement chez un même professionnel.
  CONSTRAINT bookings_no_overlap
    EXCLUDE USING gist (professional_id WITH =, tstzrange(starts_at, ends_at, '[)') WITH &&)
    WHERE (status = 'confirmed')
);

CREATE INDEX IF NOT EXISTS idx_bookings_client ON bookings (client_id, status, starts_at);
CREATE INDEX IF NOT EXISTS idx_bookings_professional ON bookings (professional_id, status, starts_at);
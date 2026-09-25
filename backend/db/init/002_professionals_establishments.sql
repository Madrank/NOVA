-- Phase 6 — Établissements et profils professionnels.
-- Exécuté au premier démarrage du conteneur (docker-entrypoint-initdb.d),
-- ou via : docker exec -i nova-db psql -U nova -d nova_dev < backend/db/init/002_professionals_establishments.sql

CREATE TABLE IF NOT EXISTS establishments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text,
  description text NOT NULL,
  street text NOT NULL,
  postal_code text NOT NULL,
  city text NOT NULL,
  phone text,
  email text,
  image text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS professionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  establishment_id uuid REFERENCES establishments(id) ON DELETE SET NULL,
  title text NOT NULL,
  bio text NOT NULL,
  specialties text[] NOT NULL DEFAULT '{}',
  photo text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_establishments_city ON establishments (city);
CREATE INDEX IF NOT EXISTS idx_professionals_establishment ON professionals (establishment_id);
CREATE INDEX IF NOT EXISTS idx_professionals_slug ON professionals (slug);
-- Phase 8 — Calendrier et gestion des disponibilités
-- Index pour les requêtes de gestion du professionnel (ses créneaux, ses rendez-vous).

CREATE INDEX IF NOT EXISTS availability_professional_start_idx
  ON availability (professional_id, starts_at);

CREATE INDEX IF NOT EXISTS bookings_professional_start_idx
  ON bookings (professional_id, starts_at);
-- Photos reelles (locales, licence libre Pexels) pour services, etablissements et praticiens.
-- Appliquer via : docker exec -i nova-db psql -U nova -d nova_dev -f backend/db/init/006_images.sql

ALTER TABLE services ADD COLUMN IF NOT EXISTS image_path text;
ALTER TABLE establishments ADD COLUMN IF NOT EXISTS image_path text;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS image_path text;

-- Services
UPDATE services SET image_path = '/images/massage.jpg' WHERE slug = 'massage-aux-sources';
UPDATE services SET image_path = '/images/massage-rituel.jpg' WHERE slug = 'massage-entre-deux-mondes';
UPDATE services SET image_path = '/images/massage.jpg' WHERE slug = 'soin-des-sportifs';
UPDATE services SET image_path = '/images/bain.jpg' WHERE slug = 'cocoon-bain-sauna';
UPDATE services SET image_path = '/images/duo.jpg' WHERE slug = 'escape-thermale-en-duo';
UPDATE services SET image_path = '/images/hero.jpg' WHERE slug = 'rituel-sacre';
UPDATE services SET image_path = '/images/sauna.jpg' WHERE slug = 'sauna-et-brumes';
UPDATE services SET image_path = '/images/meditation.jpg' WHERE slug = 'meditation-grand-large';
UPDATE services SET image_path = '/images/yoga.jpg' WHERE slug = 'yoga-au-reveil';
UPDATE services SET image_path = '/images/meditation.jpg' WHERE slug = 'yoga-sieste-guidee';
UPDATE services SET image_path = '/images/beaute.jpg' WHERE slug = 'beaute-du-regard';
UPDATE services SET image_path = '/images/beaute.jpg' WHERE slug = 'eclat-immediat';
UPDATE services SET image_path = '/images/soin-visage.jpg' WHERE slug = 'soin-visage-rose-de-minuit';

-- Etablissements (colonne image existante)
UPDATE establishments SET image = '/images/hero.jpg' WHERE slug = 'maison-akira';
UPDATE establishments SET image = '/images/bain.jpg' WHERE slug = 'les-cabanes-de-verre';
UPDATE establishments SET image = '/images/soin-visage.jpg' WHERE slug = 'l-ecrin';
UPDATE establishments SET image = '/images/sauna.jpg' WHERE slug = 'la-source';
UPDATE establishments SET image = '/images/duo.jpg' WHERE slug = 'thermes-du-soleil';
UPDATE establishments SET image = '/images/massage.jpg' WHERE slug = 'havre-azur';

-- Praticiens (colonne photo existante)
UPDATE professionals SET photo = '/images/beaute.jpg' WHERE slug = 'ambre-lefevre';
UPDATE professionals SET photo = '/images/soin-visage.jpg' WHERE slug = 'clara-moreau';
UPDATE professionals SET photo = '/images/massage.jpg' WHERE slug = 'elena-vasquez';
UPDATE professionals SET photo = '/images/sauna.jpg' WHERE slug = 'hugo-marchand';
UPDATE professionals SET photo = '/images/yoga.jpg' WHERE slug = 'nathan-berthier';
UPDATE professionals SET photo = '/images/bain.jpg' WHERE slug = 'nina-rossi';
UPDATE professionals SET photo = '/images/massage-rituel.jpg' WHERE slug = 'praticienne-en-massages';
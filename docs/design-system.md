# Design System — NOVA

> État : **v0 implémenté** dans `frontend/`. Source de vérité : `frontend/src/index.css` (Tailwind v4, tokens `@theme`).

## Direction artistique

Luxe · minimaliste · éditorial · immersif · moderne · élégant.
Photographie forte, grands espaces, grandes typographies, compositions asymétriques, transitions élégantes, animations subtiles.

## Palette (implémentée)

| Token | Valeur | Utilitaire | Usage |
| --- | --- | --- | --- |
| `ivory` | `#F5F1EA` | `bg-ivory` | Fond principal |
| `ivory-deep` | `#EDE6DB` | `bg-ivory-deep` | Fonds alternés, cards |
| `warm-beige` | `#E4DCCB` | `bg-warm-beige` | Teintes chaudes de support |
| `noir` | `#12100E` | `bg-noir` | CTA, fonds sombres |
| `ink` | `#1C1917` | `text-ink` | Texte principal |
| `gold` | `#B98A3E` | `text-gold` | Accents, focus |
| `gold-light` | `#D4AF6A` | `bg-gold-light` | Accents sur fond sombre |
| `bordeaux` | `#5E1F2A` | `bg-bordeaux` | Accents secondaires |
| `success` | `#3E6B4F` | `text-success` | États positifs |
| `warning` | `#9A6B2F` | `text-warning` | États d'alerte |
| `danger` | `#8C2F39` | `text-danger` | États d'erreur |

Neutres noirs volontairement « chauds » : pas de gris pur, l'ensemble reste doré/ivoire.

## Typographies (implémentées)

- **Titres (serif)** : **Fraunces** (variable `9..144` opsz, 300–700) → `font-serif`
- **Texte (sans)** : **Inter** (300–700) → `font-sans` (défaut du `body`)
- Style de marque : titres serif légers, petites capitales espacées pour les étiquettes (`uppercase tracking-[0.28em]`), CTA en capitales espacées (`tracking-[0.18em]`)
- Chargées via Google Fonts (preconnect + `display=swap`), voir `frontend/index.html`

## Rayons

- Boutons : `rounded-btn` = 2 px
- Cards : `rounded-card` = 4 px
- Pas de radius excessif.

## Espacements & conteneur

- Échelle 4 px ; sections très généreuses (`space-y-24`, `py-16/24`)
- `Container` : `max-w-[76rem]`, largeur `wide` 88rem / `narrow` 52rem, padding responsive (`px-5 sm:px-8 lg:px-12`)

## Composants (v0)

| Composant | Fichier | Notes |
| --- | --- | --- |
| `Button` | `components/ui/Button.tsx` | Variants `primary · light · outline · ghost · bordeaux` ; tailles `sm · md · lg` ; rend `<a>` si `href` présent |
| `Badge` | `components/ui/Badge.tsx` | Ton `gold · noir · bordeaux · outline` ; étiquette uppercase espacée |
| `Card` | `components/ui/Card.tsx` | Racine « group » pour les effets de survol |
| `CardMedia` | `components/ui/CardMedia.tsx` | Image `object-cover`, zoom au survol, `aspect` configurable |
| `CardContent` | `components/ui/CardContent.tsx` | Padding interne `p-6/p-8` |
| `CardTitle` | `components/ui/CardTitle.tsx` | Titre serif |
| `CardDescription` | `components/ui/CardDescription.tsx` | Texte secondaire `ink/70` |
| `Container` | `components/ui/Container.tsx` | `as` + `size` + `className` |
| `Skeleton` | `components/ui/Skeleton.tsx` | Placeholder de chargement (`animate-pulse`) |
| `SectionHeading` | `components/ui/SectionHeading.tsx` | Overline + titre serif + description |
| `Reveal` | `components/ui/Reveal.tsx` | Apparition au scroll (Motion), respecte `prefers-reduced-motion` |
| `SearchBar` | `components/search/SearchBar.tsx` | Ville / catégorie / date → navigue vers `/experiences` |

## Composants catalogue (Phase 4)

| Composant | Fichier | Notes |
| --- | --- | --- |
| `ServiceCard` | `components/catalog/ServiceCard.tsx` | Card prestation : image, badges, prix, durée, note |
| `FiltersPanel` | `components/catalog/FiltersPanel.tsx` | Ville, budget, durée (sidebar desk / repli mobile) |
| `CategoryChips` | `components/catalog/CategoryChips.tsx` | Filtre rapide par catégorie |

## Routage et navigation

- `react-router-dom` : `/` (landing), `/experiences` (catalogue), `/experiences/:slug` (fiche), `*` (404)
- Les filtres du catalogue sont portés par l'URL (`?categorie&ville&budget&duree&tri`) : partageables, bouton retour fonctionnel
- `Button` accepte `to` (rend un `Link`) ou `href` (rend un `<a>`)

## Interactivité et accessibilité

- Transitions `duration-300` (couleurs) / `duration-700` (médias) ; micro-interactions sur hover
- `:focus-visible` souligné doré (`outline-gold`, offset 4) sur tous les éléments
- `::selection` noir sur ivoire
- `prefers-reduced-motion` : coupe toutes les animations/transitions
- Navigation clavier, labels et aria à traiter écran par écran

## États

Chaque vue définit ses états `loading · error · empty` — jamais de blanc mort (voir `docs/architecture.md`).

## Page de validation

`frontend/src/pages/DesignSystemPreview.tsx` (rendue par défaut pendant la phase 2 ; sera remplacée par la landing page en phase 3).
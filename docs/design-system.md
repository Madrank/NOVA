# Design System — NOVA

## Direction artistique

Luxe · minimaliste · éditorial · immersif · moderne · élégant.
Photographie forte, grands espaces, grandes typographies, compositions asymétriques, transitions élégantes, animations subtiles.

## Palette

| Token | Valeur | Usage |
| --- | --- | --- |
| `ivory` | `#F5F1EA` | Fonds clairs, sections editoriales |
| `ivory-deep` | `#EDE6DB` | Fonds alternés |
| `black` | `#12100E` | Texte, fonds sombres |
| `ink` | `#1C1917` | Noir profond de marque |
| `gold` | `#B98A3E` | Accents, séparateurs, détails |
| `gold-light` | `#D4AF6A` | Accents sur fond sombre |
| `bordeaux` | `#5E1F2A` | Accents forts, CTA secondaires |
| `warm-beige` | `#E4DCCB` | Teintes chaudes de support |
| `success` | `#3E6B4F` | États positifs |
| `warning` | `#9A6B2F` | États d'alerte |
| `danger` | `#8C2F39` | États d'erreur |

Couleurs criardes et design SaaS générique interdits.

## Typographies (à valider avec le web designer)

- **Titres** : serif éditorial haut de gamme (candidats : Cormorant Garamond, Playfair Display, Fraunces)
- **Texte** : sans-serif élégant (candidats : Inter, Jost, Montserrat)
- Grande échelle de titres, interlignage aéré, jamais de graisses lourdes sur de petites tailles.

## Espacements

Échelle 4 px de base, amplifiée : sections très généreuses (xl, 2xl, 3xl). Rythme de page éditorial.

## Éléments

| Élément | Règles |
| --- | --- |
| **Buttons** | CTA texte clair sur fond sombre ou doré ; radius réduit ; micro-interaction au survol |
| **Inputs** | Sous-ligné ou bordure subtile, labels visibles, focus doré |
| **Cards** | Sans ombre excessive, images pleine largeur, espace, bordure subtile |
| **Badges** | Discrets, capitale, lettres espacées |
| **Navigation** | Dense sur desktop, menu plein écran sur mobile |
| **Modales** | Douces, profondeur subtile |

## Animation

Mouvements courts et raffinés (Framer Motion) : fondu + translation légère, entrées séquencées, transitions de page douces. Respect de `prefers-reduced-motion`.

## États

Chaque vue définit ses états : `loading`, `error`, `empty` — jamais de blanc mort.
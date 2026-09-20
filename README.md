# NOVA

**NOVA** est une plateforme premium de réservation d'expériences de bien-être et de beauté : massage, spa, sauna, soins du visage, yoga, méditation, coiffure, soins premium, expériences duo et coffrets cadeaux.

> « Prenez le temps de vous retrouver. »

## Positionnement

NOVA se développe comme une véritable marque : une expérience digitale haut de gamme, éditoriale et immersive. Le produit cible une clientèle premium et doit être comparable visuellement à une marque de beauté, de mode ou de bien-être.

## Fonctionnalités

| Domaine | Détails |
| --- | --- |
| **Découverte** | Catégories, recherche, filtres, fiches établissements, prestations, tarifs |
| **Réservation** | Disponibilités réelles, choix date/heure, conflits bloqués côté backend, statuts |
| **Paiement** | Stripe, webhooks, statuts de paiement sécurisés |
| **Comptes** | Client, professionnel, admin — authentification JWT sécurisée |
| **Notifications** | Emails de confirmation, rappel, modification, annulation |
| **Espaces dédiés** | Dashboard professionnel (calendrier, prestations, disponibilités, statistiques), administration séparée |

## Stack technique

| Couche | Technologie |
| --- | --- |
| **Frontend** | React · TypeScript · Vite · Tailwind CSS |
| **Backend** | Node.js · Express · TypeScript · API REST |
| **Base de données** | PostgreSQL |
| **Paiement** | Stripe |
| **Auth** | JWT |
| **UI** | Framer Motion, Lucide, React Hook Form, Zod (selon besoin) |

## Architecture

Monorepo simple :

```
nova/
├── frontend/   # Application React (Vite + Tailwind)
├── backend/    # API REST (Express + TypeScript)
├── docs/       # Documentation technique et décisions
├── README.md
└── ...
```

### Backend

Séparation claire des responsabilités : routes · controllers · services · repositories · middlewares · validators · config. Authentification JWT, rôles (client / professionnel / admin), données sensibles jamais exposées côté frontend.

### Base de données

PostgreSQL, modélisée progressivement : `users`, `professionals`, `establishments`, `services`, `categories`, `availability`, `bookings`, `payments`, `reviews`, `notifications`. Les tables sont créées au fil des fonctionnalités, jamais toutes d'un coup.

## Installation

### Frontend (Phase 2 — design system)

```
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run lint     # oxlint
npm run build    # tsc -b + build de production
```

Prérequis complets : Node.js ≥ 20, npm, PostgreSQL, compte Stripe.

> La partie backend et la base de données seront détaillées quand leur phase sera ouverte.

## Développement

Le projet suit une méthodologie Git stricte :

- `main` : versions stables
- `develop` : intégration des fonctionnalités
- `feature/*` : une branche par fonctionnalité, fusionnée via Pull Request après revue

Les commits suivent la convention : `feat:`, `fix:`, `test:`, `docs:`, `chore:`.

## Roadmap

Le projet avance par phases progressives (voir `docs/phases.md`) : cadrage → design system → landing page → catalogue → authentification → profils → réservation → disponibilités → paiement → notifications → dashboard pro → administration → tests → sécurité → optimisation → déploiement.

## Licence

© NOVA. Tous droits réservés.
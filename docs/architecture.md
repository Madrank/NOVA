# Architecture — NOVA

## Décision retenue

Monorepo simple à deux packages indépendants (frontend / backend), versionnés dans un même dépôt. Pas de workspace npm pour l'instant : les deux applications vivent leur propre cycle de vie (`package.json` dédié, dev/build indépendants), ce qui simplifie le développement et le déploiement.

```
nova/
├── frontend/
│   └── src/
│       ├── auth/           # Contexte d'authentification, gardes (RequireAuth/RequireRole)
│       ├── components/     # Composants UI réutilisables (design system, cartes réseau)
│       ├── pages/          # Écrans / routes
│       ├── services/       # Appels API (client HTTP factorisé dans api.ts)
│       ├── lib/            # Utilitaires (dates, format, etc.)
│       ├── types/          # Types TypeScript par domaine (auth, service, professional, establishment)
│       ├── data/           # Données mock (catalogue Phase 4, en attente d'API)
│       └── main.tsx
├── backend/
│   ├── db/init/               # 001_auth.sql … 005_payments.sql (création du volume)
│   ├── .env.example           # Variables d'environnement (copier vers .env)
│   └── src/
│       ├── controllers/       # HTTP : valider l'entrée, appeler le service, répondre
│       ├── routes/            # auth, establishments, professionals (ordre /me avant /:slug)
│       ├── services/          # Logique métier
│       ├── repositories/      # Accès aux données (PostgreSQL)
│       ├── middlewares/       # Auth, rôles, validation, erreurs
│       ├── validators/        # Schémas zod des entrées
│       ├── lib/               # JWT, erreurs applicatives, slugify
│       ├── config/            # Configuration / variables d'environnement
│       ├── types/             # Types partagés backend (auth, establishment, professional)
│       ├── app.ts             # Assemblage Express
│       └── server.ts          # Point d'entrée
├── docker-compose.yml         # PostgreSQL 16 (port hôte 5434)
├── docs/
│   ├── architecture.md
│   ├── design-system.md
│   ├── phases.md
│   └── decisions.md
└── README.md
```

## API REST

| Méthode | Endpoint | Accès | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | public | État du service |
| `POST` | `/api/auth/register` | public | Création de compte (rôle `client` ou `professional` optionnel) |
| `POST` | `/api/auth/login` | public | Connexion, retour `{ user, token }` |
| `GET` | `/api/auth/me` | authentifié | Profil connecté |
| `GET` | `/api/establishments` | public | Liste des établissements actifs |
| `GET` | `/api/establishments/:slug` | public | Détail + professionnels du lieu |
| `POST` | `/api/establishments` | admin | Création d'un établissement |
| `GET` | `/api/professionals` | public | Liste des professionnels actifs |
| `GET` | `/api/professionals/me` | pro | Fiche du professionnel connecté (null si absente) |
| `POST` | `/api/professionals/me` | pro | Création de la fiche du professionnel |
| `PATCH` | `/api/professionals/me` | pro | Mise à jour de la fiche (rattachement d'établissement inclus) |
| `GET` | `/api/professionals/:slug` | public | Fiche publique d'un professionnel |
| `GET` | `/api/services` | public | Catalogue des prestations (12 seedées) |
| `GET` | `/api/services/:slug` | public | Fiche d'une prestation (établissement + pro inclus) |
| `GET` | `/api/services/:slug/availability` | public | Créneaux libres (15 prochains jours) |
| `POST` | `/api/bookings` | client | Création d'une réservation `pending` (créneau verrouillé, paiement requis) |
| `GET` | `/api/bookings/me` | client | Réservations du client connecté (statut de paiement inclus) |
| `POST` | `/api/bookings/:id/pay` | client/pro/admin | Confirmation du paiement (démo ou Stripe), passage à `confirmed` |
| `POST` | `/api/bookings/:id/cancel` | client/pro/admin | Annulation (raison optionnelle, slot libéré, remboursement auto si payé) |
| `GET` | `/api/professionals/me/availability` | pro | Créneaux à venir du pro (prestations incluses) |
| `POST` | `/api/professionals/me/availability` | pro | Génération de créneaux (jours + plages, pas = durée de prestation) |
| `DELETE` | `/api/professionals/me/availability/:slotId` | pro | Suppression d'un créneau libre (refus 409 si réservé) |
| `GET` | `/api/professionals/me/appointments` | pro | Réservations confirmées à venir (client inclus) |
| `GET` | `/api/professionals/me/dashboard` | pro | Données du tableau de bord (stats, prochain RDV, agenda) |
| `GET` | `/api/payments/config` | public | Configuration paiement (`demo`, `publishableKey`, `currency`, `holdMinutes`) |
| `POST` | `/api/webhooks/stripe` | public | Webhook Stripe (corps brut, signature vérifiée via `STRIPE_WEBHOOK_SECRET`) |
| `GET` | `/api/notifications` | authentifié | Notifications in-app (20 par défaut, `?limit=`) + `unreadCount` |
| `GET` | `/api/notifications/unread-count` | authentifié | Nombre de notifications non lues (léger, pour le badge) |
| `POST` | `/api/notifications/:id/read` | authentifié | Marquage d'une notification comme lue |
| `POST` | `/api/notifications/read-all` | authentifié | Marquage de toutes les notifications comme lues |
| `GET` | `/api/admin/overview` | admin | Vue d'ensemble (compteurs utilisateurs/réservations/CA/contenu + dernières réservations) |
| `GET` | `/api/admin/users` | admin | Liste des utilisateurs (`?role=`, `?q=`) |
| `PATCH` | `/api/admin/users/:id/role` | admin | Changement de rôle (client ↔ pro, admins protégés) |
| `GET` | `/api/admin/bookings` | admin | Liste des réservations (`?status=`) |
| `GET` | `/api/admin/services` | admin | Liste des services (pro + établissement inclus) |
| `PATCH` | `/api/admin/services/:id/active` | admin | Publication / dépublication d'un service |

## Principes directeurs

1. **Frontend ≠ source de vérité.** Toute décision métier (disponibilité, prix, statut) est validée côté backend.
2. **Séparation des responsabilités.** Pas de logique métier dans les contrôleurs ou les composants UI.
3. **Authentification et rôles.** JWT. Profils `client`, `professional`, `admin`, chacun avec ses périmètres.
4. **Réservations sans conflit.** Contrainte d'exclusion côté base de données + vérification dans le service de réservation.
5. **Données sensibles.** Jamais de mot de passe en clair, jamais de données bancaires stockées (Stripe).

## Tests

- **Backend** (`npm test` — Vitest + supertest) : tests unitaires (mail, validators, garanties du service admin via mocks) et tests d'intégration des routes API contre la base de développement (inscription/connexion, catalogue, création de créneau, réservation → paiement démo → confirmation → annulation → notifications, dashboard pro, back-office admin et ses gardes). Les créneaux de test sont posés à des horaires libres de tout chevauchement (13h local). `fileParallelism: false` pour préserver l'état partagé. Les fichiers `*.test.ts` ne sont pas embarqués dans `dist` (exclus par `tsconfig.json`).
- **Frontend** (`npm test` — Vitest + Testing Library, environnement jsdom) : logique de recherche du catalogue (`searchServices`, filtres/tri/accentuation), navigation par ancres (`HashLink`), variantes de rendu (`Button`). Nettoyage automatique entre les tests dans `src/test/setup.ts`.

## Réseau de table (évolutif)

Créé progressivement, au rythme des fonctionnalités :

- `users` — comptes et rôles (`client`, `professional`, `admin`)
- `professionals` — profils professionnels (slugs uniques, `user_id` → 1:1, `establishment_id` nullable)
- `establishments` — établissements (slugs uniques, adresse à plat, actifs/inactifs)
- `categories` — catégories d'expériences
- `services` — prestations
- `availability` — créneaux de disponibilité
- `bookings` — réservations (client, pro, établissement, prestation, plage horaire, prix, statut)
- `payments` — paiements Stripe
- `reviews` — avis client
- `notifications` — notifications / emails

## Décisions structurantes

Voir `docs/decisions.md` pour les ADR (Architecture Decision Records).
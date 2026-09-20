# Architecture — NOVA

## Décision retenue

Monorepo simple à deux packages indépendants (frontend / backend), versionnés dans un même dépôt. Pas de workspace npm pour l'instant : les deux applications vivent leur propre cycle de vie (`package.json` dédié, dev/build indépendants), ce qui simplifie le développement et le déploiement.

```
nova/
├── frontend/
│   └── src/
│       ├── components/     # Composants UI réutilisables (design system)
│       ├── pages/          # Écrans / routes
│       ├── layouts/        # Layouts (public, dashboard, back-office)
│       ├── hooks/          # Logique réutilisable côté React
│       ├── services/       # Appels API
│       ├── lib/            # Utilitaires (dates, format, etc.)
│       ├── types/          # Types TypeScript partagés
│       ├── assets/         # Images, polices, icônes
│       └── main.tsx
├── backend/
│   └── src/
│       ├── controllers/    # HTTP : valider l'entrée, appeler le service, répondre
│       ├── routes/         # Déclaration des routes Express
│       ├── services/       # Logique métier
│       ├── repositories/   # Accès aux données (PostgreSQL)
│       ├── middlewares/    # Auth, erreurs, etc.
│       ├── validators/     # Validation des entrées
│       ├── lib/            # JWT, emails, Stripe (clients externes)
│       ├── config/         # Configuration / variables d'environnement
│       ├── types/          # Types partagés backend
│       └── server.ts       # Point d'entrée
├── docs/
│   ├── architecture.md
│   ├── design-system.md
│   ├── phases.md
│   └── decisions.md
└── README.md
```

## Principes directeurs

1. **Frontend ≠ source de vérité.** Toute décision métier (disponibilité, prix, statut) est validée côté backend.
2. **Séparation des responsabilités.** Pas de logique métier dans les contrôleurs ou les composants UI.
3. **Authentification et rôles.** JWT. Profils `client`, `professional`, `admin`, chacun avec ses périmètres.
4. **Réservations sans conflit.** Contrainte d'exclusion côté base de données + vérification dans le service de réservation.
5. **Données sensibles.** Jamais de mot de passe en clair, jamais de données bancaires stockées (Stripe).

## Réseau de table (évolutif)

Créé progressivement, au rythme des fonctionnalités :

- `users` — comptes et rôles
- `professionals` — profils professionnels
- `establishments` — établissements
- `categories` — catégories d'expériences
- `services` — prestations
- `availability` — créneaux de disponibilité
- `bookings` — réservations (client, pro, établissement, prestation, plage horaire, prix, statut)
- `payments` — paiements Stripe
- `reviews` — avis client
- `notifications` — notifications / emails

## Décisions structurantes

Voir `docs/decisions.md` pour les ADR (Architecture Decision Records).
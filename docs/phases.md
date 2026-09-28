# Phases — Plan de développement NOVA

Chaque phase produit un livrable fonctionnel. Une fonctionnalité n'avance sur la branche suivante qu'après revue.

| Phase | Livrable | Branche de travail |
| --- | --- | --- |
| **Phase 0** | Cadrage du projet | — |
| **Phase 1** | Repository + architecture | `main` / `develop` / `feature/design-system` |
| **Phase 2** | Design system (tokens, composants UI de base) | `feature/design-system` |
| **Phase 3** | Landing page éditoriale | `feature/landing-page` |
| **Phase 4** | Catalogue des expériences (découverte, recherche, filtres) | `feature/search` |
| **Phase 5** | Authentification (client/pro/admin) + profil | `feature/authentication` |
| **Phase 6** | Profils professionnels et établissements | `feature/professional-profiles` |
| **Phase 7** | Système de réservation (disponibilités, conflits, statuts) | `feature/booking` |
| **Phase 8** | Calendrier et gestion des disponibilités | `feature/availability` |
| **Phase 9** | Paiement Stripe (paiement, webhooks, statuts) | `feature/payment` |
| **Phase 9.5** | Photographies réelles (Pexels, locales) | `develop` |
| **Phase 10** | Notifications et emails | `feature/notifications` |
| **Phase 11** | Dashboard professionnel | `feature/professional-dashboard` |
| **Phase 12** | Administration (back-office séparé) | `feature/admin` |
| **Phase 13** | Tests (unitaires, intégration, e2e ciblés) | `develop` |
| **Phase 14** | Sécurité (durcissement, rate limiting, revue) | `develop` |
| **Phase 15** | Optimisation (performance, accessibilité, SEO) | `develop` |
| **Phase 16** | Déploiement (CI/CD, environnements) | `main` |

## État d'avancement

- [x] **Phase 0** — Cadrage validé
- [x] **Phase 1** — Repository + architecture
- [x] **Phase 2** — Design system v0 (tokens + composants de base)
- [x] **Phase 3** — Landing page éditoriale
- [x] **Phase 4** — Catalogue des expériences (découverte, recherche, filtres, fiches)
- [x] **Phase 5** — Authentification (client/pro/admin) + profil — fusionnée (PR #6)
- [x] **Phase 6** — Profils professionnels et établissements — fusionnée (PR #7)
- [x] **Phase 7** — Système de réservation (disponibilités, conflits, statuts) — fusionnée (PR #8)
- [x] **Phase 8** — Calendrier et gestion des disponibilités — fusionnée (PR #9)
- [ ] **Phase 9** — Paiement Stripe (paiement, webhooks, statuts) — implémentée et testée (mode démo actif) — en cours (arbre de travail `develop`, commits à la fin du projet)
- [ ] **Phase 9.5** — Photographies réelles (Pexels, stockées en local) sur toutes les surfaces : services, établissements, praticiens, landing, comptes (migration `006_images.sql`) — en cours
- [ ] **Phase 10** — Notifications et emails : table `notifications`, job de rappel J-1, emails (driver log/SMTP), cloche UI dans le header (migration `007_notifications.sql`) — implémentée et testée — en cours
- [ ] **Phase 11** — Dashboard professionnel : `/tableau-de-bord` pro-only, stats (à venir, aujourd'hui, en attente de paiement, terminés, CA confirmé, note), prochain RDV, liste RDV, raccourcis — endpoint `GET /api/professionals/me/dashboard` — implémentée et testée — en cours
- [ ] **Phase 12** — Administration (back-office `/admin` admin-only) : vue d'ensemble, utilisateurs (rôles), réservations (filtre statut), services (publié/dépublié) — endpoints `GET/PATCH /api/admin/*` — compte seed `admin@nova.fr` (`db:seed-admin`) — implémentée et testée — en cours
- [ ] **Phase 13** — Tests : **backend** Vitest + supertest (`npm test`, 24 tests : unitaires mail/validators/garanties admin + intégration complète auth/booking/paiement démo/admin contre la DB dev) ; **frontend** Vitest + Testing Library (+ cleanup auto, `npm test`, 15 tests : logique de recherche, HashLink, Button). Fichiers `*.test.ts(x)` exclus du build backend via tsconfig — implémentée et verte — en cours

## Règle de progression

Ne jamais reprendre une fonctionnalité déjà terminée : toujours partir de l'état réel du dépôt (voir README). Une branche `feature/*` n'est fusionnée dans `develop` qu'après revue (PR).
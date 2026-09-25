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
- [x] **Phase 5** — Authentification (client/pro/admin) + profil — en revue (PR `feature/authentication`)
- [ ] **Phase 6** — Profils professionnels et établissements

## Prochaine fonctionnalité

À décider avec le web designer, une fois le design system fusionné. Candidat naturel :
1. **Landing page** — vitrine prioritaire selon le cahier des charges

> Règle : ne jamais reprendre une fonctionnalité déjà terminée. Toujours partir de l'état réel du dépôt (voir README).
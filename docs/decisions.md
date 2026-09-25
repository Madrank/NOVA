# Décisions d'architecture (ADR)

Ce document enregistre les décisions structurantes. Il suit l'esprit des Architecture Decision Records : contexte, décision, conséquences.

## ADR-001 — Monorepo simple frontend/backend

**Contexte.** Le projet nécessite une API REST et une application web étroitement liées, développées par une équipe réduite.

**Décision.** Un seul dépôt Git `nova` contenant `frontend/` et `backend/`, chacun avec son propre `package.json`. Pas de workspace npm pour l'instant.

**Conséquences.** Dev/build indépendants, déploiement distinct possible, gestion simple. Le passage à un workspace npm reste possible si le besoin apparaît.

## ADR-002 — TypeScript partout

**Contexte.** Qualité, maintenabilité, typage au contrat entre frontend et backend.

**Décision.** TypeScript strict côté frontend (React + Vite) et côté backend (Express + Node).

**Conséquences.** Contrats typés explicites entre l'API et le client ; outillage `tsc` pour la vérification.

## ADR-003 — L'API est la source de vérité métier

**Contexte.** Les conflits de réservation et les prix ne doivent pas dépendre du client.

**Décision.** Toute opération à impact métier (réservation, paiement, statut) est validée et exécutée côté backend, avec contraintes en base de données.

**Conséquences.** Le frontend ne fait que présenter ; la cohérence des données est garantie indépendamment du client.

## ADR-004 — Authentification JWT avec rôles

**Contexte.** Trois profils distincts : client, professionnel, administrateur.

**Décision.** JWT émis par le backend, middleware d'autorisation par rôle, mots de passe hashés (bcrypt/argon2), jamais stockés en clair.

**Conséquences.** Middleware réutilisable, périmètres clairs par rôle, surface d'attaque réduite.

## ADR-005 — Stripe externalise le paiement

**Contexte.** Paiement sécurisé sans stockage de données bancaires.

**Décision.** Paiements via Stripe (Checkout/Intent API selon le besoin), webhooks pour confirmer côté serveur, statuts de paiement persistés en base.

**Conséquences.** Aucune donnée bancaire en base ; la confirmation naît d'événements serveur Stripe, jamais d'un appel frontend seul.

## ADR-006 — Réservations sans conflit

**Contexte.** Un professionnel ne peut pas être doublement réservé sur le même créneau.

**Décision.** Contrainte d'exclusion en base (plages horaires non chevauchantes) + vérification transactionnelle côté service.

**Conséquences.** L'invariant « pas de chevauchement » est garanti même en cas d'accès concurrent.

## ADR-007 — Typographies de marque Fraunces + Inter

**Contexte.** Une identité éditoriale premium nécessite une paire typographique cohérente.

**Décision.** Fraunces (serif variable, titres) et Inter (sans-serif, texte courant), chargées via Google Fonts avec `display=swap`. Définies comme tokens Tailwind `--font-serif` / `--font-sans`, remplaçables sans toucher aux composants.

**Conséquences.** Identité typographique stable dès le design system ; le remplacement éventuel des polices est un changement de token unique.

## ADR-008 — Tailwind CSS v4 (configuration CSS-first)

**Contexte.** Besoin d'un design system fort, typé et mis à jour, sans configuration JS lourde.

**Décision.** Tailwind v4 avec plugin Vite `@tailwindcss/vite`, tokens déclarés dans `src/index.css` via `@theme`. Pas de `tailwind.config.*`.

**Conséquences.** Tokens co-localisés avec la feuille de style, build plus rapide, utilitaires auto-générés (`bg-ivory`, `text-gold`, `font-serif`…).

## ADR-009 — Alias `@/*` vers `src/`

**Contexte.** Lisibilité des imports dans une base qui grossit.

**Décision.** Alias `@` mappé sur `src/` (Vite `resolve.alias` + `tsconfig` paths). Pas de `baseUrl` (déprécié en TypeScript 6).

**Conséquences.** Imports absolus courts (`@/components/ui/Button`), refactors sereins.

## ADR-010 — react-router-dom, l'état de navigation vit dans l'URL

**Contexte.** Parcours multi-écrans (landing, catalogue, fiches) avec filtres.

**Décision.** `react-router-dom` en SPA. Les filtres de recherche sont sérialisés dans la query string (`categorie`, `ville`, `budget`, `duree`, `tri`) ; la page les lit comme seule source de vérité (`useSearchParams` + `useMemo`), jamais de state dupliqué.

**Conséquences.** URLs partageables, bouton retour fonctionnel, zéro divergence entre l'UI et l'URL. `Button` s'enrichit d'une variante `to` (rend un `Link`).

## ADR-011 — Couche de recherche : contrat typé asynchrone, mock d'abord

**Contexte.** La recherche et les filtres doivent exister avant le backend et sans le bloquer.

**Décision.** `services/discovery.ts` expose `searchServices(filters): Promise<SearchResult>` sur un jeu de données mock (`data/services.ts`), isolé des composants. Une latence simulée matérialise le tour réseau.

**Conséquences.** Les composants ne changent pas lors du branchement de l'API REST : seul le corps de `searchServices` est remplacé. Les types (`frontend/src/types/service.ts`) reflètent le futur schéma.

## ADR-012 — Animations au scroll via `motion` + respect de `prefers-reduced-motion`

**Contexte.** Effets immersifs sans nuire à l'accessibilité.

**Décision.** `Reveal` utilise `whileInView` (une seule fois), fondu + translation légère, et désactive la translation via `useReducedMotion` quand l'utilisateur le demande.

**Conséquences.** Entrées séquencées élégantes ; aucun mouvement imposé aux utilisateurs sensibles.

## ADR-013 — Backend Express : pipeline validation · service · repository

**Contexte.** La Phase 5 introduit l'API REST ; la base grandit avec le booking, le paiement, etc.

**Décision.** Récipient : `routes` → `validators` (zod, injoignable : le corps est remplacé après `safeParse`) → `controllers` (HTTP pur) → `services` (logique métier) → `repositories` (SQL). Erreurs applicatives via `AppError(status, code, message, details)` centralisées dans un handler unique ; réponse d'erreur normalisée `{ error: { code, message, details? } }`.

**Conséquences.** La logique métier est testable sans HTTP ; l'API reste cohérente quand les routes s'ajoutent.

## ADR-014 — Auth : JWT HS256 + argon2id + rôles dans le token

**Contexte.** Trois profils (client, professional, admin), sessions sans état côté serveur.

**Décision.** `jsonwebtoken` (HS256, secret 64 octets en prod, expiration 7 j) portant `{ userId, role }`. Mots de passe hashés argon2id (mémoire 19 456 Ko, 2 itérations). Moyens : `requireAuth` (lit le Bearer), `requireRole(...roles)` composable. Les cookies sont écartés au profit du header `Authorization` (SPA + API distinctes).

**Conséquences.** Middlewares réutilisables par périmètre ; aucun secret ni password en clair ; rejet explicite `INVALID_CREDENTIALS` pour login en échec (pas de fuite d'existence de compte sur login).

## ADR-015 — PostgreSQL via Docker Compose + init SQL au premier démarrage

**Contexte.** Base requise dès la Phase 5, plusieurs machines de dev possibles.

**Décision.** `docker-compose.yml` à la racine : `postgres:16-alpine`, port hôte **5434** (évite les conflits 5432/5433), credentials dev `nova`/`nova`. Les schémas vivent dans `backend/db/init/*.sql` (montés dans `/docker-entrypoint-initdb.d`, exécutés à la création du volume). Pas d'ORM : `pg` + SQL explicite dans les repositories.

**Conséquences.** Base reproductible (`npm run db:up`), évolution des tables au fil des phases ; libre choix de faire évoluer les migrations quand le besoin de versioning apparaîtra.
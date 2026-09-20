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
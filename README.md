# 🏗️ MAS Monorepo

> Monorepo Nx hébergeant plusieurs projets — application mobile React Native, portfolio Angular, services Node.js / IA — partageant des librairies communes, un tooling unifié et un pipeline CI/CD `nx affected`.

---

## ✨ Vision

Un seul repo pour **tous les projets** :

- Architecture partagée entre apps très différentes (mobile, web, back)
- Librairies extraites une fois, consommées partout
- CI/CD granulaire : seul ce qui change est retesté, rebuilté, déployé
- Discipline commune (lint, format, tests, storybook, docs)

---

## 📚 Sommaire

- [Pourquoi Nx](#-pourquoi-nx)
- [Structure du monorepo](#-structure-du-monorepo)
- [Projets](#-projets)
- [Librairies partagées](#-librairies-partagées)
- [Storybook](#-storybook-visual-tdd)
- [Scripts & commandes utiles](#-scripts--commandes-utiles)
- [Démarrage rapide](#-démarrage-rapide)
- [Roadmap](#-roadmap)

---

## 🚀 Pourquoi Nx

### `nx affected` — ne travailler que sur ce qui change

```bash
nx affected:test     # teste uniquement les projets impactés par le diff
nx affected:lint     # idem lint
nx affected:build    # idem build
```

Quand une PR touche `@mas/rn/ui`, seuls les projets qui en dépendent sont rejoués. Le reste est ignoré.

### Graph de dépendances

```bash
npx nx graph         # visualise toutes les relations inter-projets
```

### Cache distribué

Nx cache les outputs de chaque tâche. Si rien n'a changé, le résultat est restitué instantanément.

### Scalabilité

Ajouter un nouveau projet (Angular, Node, Python…) sans toucher le tooling existant. Chaque projet a son `project.json`, ses targets, ses règles.

---

## 🗂️ Structure du monorepo

```text
mas-repo/
│
├─ apps/
│  ├─ rn-pic-swipe-wipe/        # 📱 App mobile React Native / Expo
│  ├─ storybook-native/         # 📖 Shell Expo pour Storybook on-device
│  ├─ storybook-launcher/       # 🚀 CLI de lancement Storybook par librairie
│  ├─ portfolio/                # 🌐 Portfolio Angular (à venir)
│  └─ [ai-services]/            # 🤖 Services Node.js / IA (à venir)
│
├─ libs/
│  ├─ react-native/
│  │  ├─ ui/          @mas/rn/ui         # Design System + composants RN (+ useResultedStyle)
│  │  ├─ store/       (moved → shared)   # Voir @mas/shared/store
│  │  ├─ media/       @mas/rn/media      # Scan galerie + permissions (agnostique métier)
│  │  └─ database/    @mas/rn/database   # ExpoSQLiteAdapter (adaptateur SQLite)
│  │
│  └─ shared/
│     ├─ store/        @mas/shared/store   # Factory générique createAppStore<TReducers, TExtra> (framework-agnostic)
│     ├─ types/        @mas/shared/types   # ThemeTokens, StylesOverride
│     ├─ frontend-dal/ @mas/frontend-dal   # IRepository<T> — abstraction CRUD
│     └─ mas-sqlite/   @mas/mas-sqlite     # BaseSQLiteRepository<T>, DatabaseManager
│
├─ tsconfig.base.json    # Aliases @mas/* centralisés
├─ nx.json
└─ package.json          # npm workspaces, legacy-peer-deps
```

### Conventions d'import

| Contexte | Règle |
|---|---|
| Cross-lib | `@mas/*` (alias tsconfig) |
| Même lib | chemins relatifs |
| App → libs | `@mas/*` |
| App → internal | aliases locaux (`@components/*`, `@styles/*`, etc.) |

---

## 📦 Projets

### 📱 `rn-pic-swipe-wipe` — App mobile de tri de galerie

Application React Native / Expo pour trier des milliers de photos et vidéos via une UI gestuelle (swipe keep/trash), avec persistance locale et architecture en couches.

**Stack** : Expo SDK 54, RN 0.81.5, Expo Router v6, Redux Toolkit, Reanimated v4, SQLite, expo-media-library

**Philosophie** :
- SoC strict : screens / components / store / services / database / hooks
- "Offline-first" : zéro dépendance réseau, ledger transactionnel SQLite
- 60 FPS : animations sur le thread UI (worklets), styles mémorisés

[→ Voir l'app](apps/rn-pic-swipe-wipe/)

---

### 🌐 `portfolio` — Portfolio Angular *(à venir)*

Portfolio personnel servi comme application Angular dans le monorepo. Partage potentiel de types/config avec les autres projets. Utilisé aussi pour valider le pipeline Nx multi-framework (RN + Angular dans le même `nx affected`).

---

### 🤖 Services Node.js / IA *(à venir)*

Services backend / scripts IA hébergés dans le même monorepo. Peuvent consommer des librairies `@mas/shared/*` (types, config, utils).

---

### 📖 `storybook-native` — Shell Expo Storybook

Shell Expo dédié au Storybook on-device. N'est pas l'app principale — c'est un environnement d'isolation pour prévisualiser les composants de n'importe quelle lib du monorepo.

Config active (`main.ts`, `preview.tsx`, `storybook.requires.ts`) auto-générée par le launcher et gitignorée.

---

### 🚀 `storybook-launcher` — CLI de lancement

Script Node.js interactif qui :
1. Scanne le monorepo, détecte toutes les libs/apps ayant des stories
2. Propose un menu de sélection coloré
3. Génère dynamiquement la config Storybook pour la lib choisie
4. Lance `expo start` dans `storybook-native`

**Système de cache par lib** : chaque lib a son dossier `configs/{lib}/` (gitignorée) avec `main.ts`, `preview.tsx` et `storybook.requires.ts` mis en cache pour éviter la régénération inutile.

---

## 📚 Librairies partagées

### `@mas/rn/media` — Scan galerie (mission library)

Complètement agnostique au métier (aucune connaissance de verdicts, buckets, Redux) :

- Types : `MediaAsset`, `AppMediaType`, `AppPermissionStatus`
- Fonctions : `requestMediaPermission()`, `scanMedia({ limit, mediaTypes? })`
- Retourne un tableau plat de `MediaAsset[]` — c'est tout

### `@mas/shared/store` — Factory de store Redux (framework-agnostic)

Crée un store Redux Toolkit générique. N'a aucune connaissance de slices ou business logic. Compatible React, React Native, Angular, Vue, Node.js :

- `createAppStore<TReducers, TExtra>(reducers, extra?)` — injecte `extra` dans chaque thunk via `thunkApi.extra`
- Chaque app fournit ses propres reducers, types et slices

### [`@mas/rn/ui`](libs/react-native/ui/README.md) — Design System React Native

- Composants atomiques et organismes (`CardsDeck`, `VideoContainer`, `Icon`…)
- `ThemeProvider` + `useTheme` (light/dark, tokens typés via `@mas/shared/types`)
- Pattern **Style Factory** (`makeStyles` + `StylesOverride<T>`)
- `useResultedStyle` — compose styles de base + overrides par clé
- Storybook preview propre : `ThemeProvider` + `ThemeToggle`

### [`@mas/rn/database`](libs/react-native/database/README.md) — Adaptateur SQLite

`ExpoSQLiteAdapter` implémente `IRepository<T>` de `@mas/frontend-dal`. La définition des tables (schéma, colonnes) est à la charge de l'app.

### [`@mas/frontend-dal`](libs/shared/frontend-dal/README.md) — Abstraction CRUD

Interface générique `IRepository<T>` — les libs et services sont agnostiques au type de base de données.

### [`@mas/mas-sqlite`](libs/shared/mas-sqlite/README.md) — Implémentation SQLite générique

`BaseSQLiteRepository<T>` + `DatabaseManager` — implémente `IRepository<T>` sur n'importe quel `ISQLiteAdapter`.

### [`@mas/shared/types`](libs/shared/types/README.md) — Types partagés

`ThemeTokens`, `StylesOverride<T>` — types agnostiques consommés par toutes les libs et apps.

---

## 📕 Storybook (Visual TDD)

```bash
npm run storybook
```

Sélectionner la lib dans le menu → Expo start → Scanner le QR dans Expo Go.

| Lib | Preview | Fonctionnalités |
|---|---|---|
| `@mas/rn/ui` | `libs/react-native/ui/.storybook/preview.tsx` | ThemeProvider + ThemeToggle (switch light/dark) |
| `rn-pic-swipe-wipe` | `apps/rn-pic-swipe-wipe/.storybook/preview.tsx` | ThemeProvider |

---

## ⚙️ Scripts & commandes utiles

### Générateur de projets Nx

```bash
npm run generate           # Scaffolde un nouveau app ou lib (interactif)
npm run generate:test      # Lance un scénario de test + undo git intégré
```

Technos supportées : Angular, React, React Native / Expo, Vue, NestJS, Node.js.
Couvre tous les flags `nx generate` pertinents (style, bundler, test runner, standalone, publishable…).

### App mobile

```bash
npm run start              # Expo start
npm run android            # Run sur Android
npm run storybook          # Launcher Storybook interactif
```

### Nx

```bash
npx nx graph                          # Graphe de dépendances
nx run rn-pic-swipe-wipe:typecheck    # Typecheck app
nx run rn-pic-swipe-wipe:test         # Tests app
nx affected:test                      # Tests projets impactés seulement
nx affected:lint                      # Lint projets impactés seulement
```

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js + npm
- Android Studio (pour le dev mobile)
- Un device physique recommandé (MediaLibrary + performance vidéo)

### Installation

```bash
npm install
```

### App principale

```bash
npm run start
```

### Storybook

```bash
npm run storybook
```

---

## 🧭 Roadmap

### Tooling monorepo

- ✅ Structure Nx + npm workspaces
- ✅ Librairies `@mas/*` extraites selon le principe mission-library (ui, store, media, database, shared)
- ✅ Architecture mission-library : libs sans logique métier, DI via RTK extraArgument
- ✅ Aliases TypeScript centralisés (`tsconfig.base.json`)
- ✅ Storybook on-device avec launcher par librairie
- ✅ Générateur interactif `npm run generate` (Angular/React/RN/Vue/NestJS/Node)
- ✅ `project.json` Nx pour tous les projets
- ⏳ ESLint + Prettier configurés monorepo-wide
- ⏳ Husky + lint-staged (`nx affected:lint` en pre-commit)
- ⏳ Jest configuré sur tous les projets (`nx affected:test`)
- ⏳ GitHub Actions CI avec `nx affected` (build + test + lint)
- ⏳ CD par projet affecté (EAS Build pour RN, Firebase/Vercel pour Angular)

### `rn-pic-swipe-wipe`

- ✅ Scan galerie + normalisation MediaItem
- ✅ Deck gestuel (swipe keep/trash)
- ✅ Ledger SQLite + reprise tri
- ⏳ "Commit screen" : résumé Keep/Trash + confirmation
- ⏳ Filtres : screenshots, vidéos courtes, tailles, dates
- ⏳ Mode "Review Trash" avant suppression finale
- ⏳ Export/backup du ledger

### `portfolio` (Angular)

- ⏳ Génération app Angular dans le monorepo
- ⏳ Portail de documentation technique (TypeDoc)
- ⏳ Intégré au graphe Nx (`nx affected` inclut le portfolio si une lib partagée change)
- ⏳ Déploiement CD

### Services Node.js / IA

- ⏳ À définir selon les projets

---

## 📌 Statut

**MAS Repo v0.3.0** — Monorepo privé en construction.
Architecture mission-library en place : chaque lib a une responsabilité unique et est agnostique au métier. Logique business dans l'app. DI via RTK extraArgument.

# @mas/shared/i18n

**Framework-agnostic** internationalisation (i18n) wrapper for the MAS monorepo.
Thin layer over `i18next` + `react-i18next` that standardises language detection, persistence, and locale metadata across all apps.

---

## Features

| Feature                  | Details                                                                |
| ------------------------ | ---------------------------------------------------------------------- |
| **One-call init**        | `initI18n()` wires up i18next, browser language detector, and storage  |
| **Hook**                 | `useT()` — convenience wrapper around `useTranslation()`               |
| **Locale registry**      | `LOCALE_REGISTRY` — flag emoji, native label, English label per locale |
| **Language persistence** | Auto-saved in `localStorage` via `i18next-browser-languagedetector`    |
| **Fallback chain**       | Configurable default locale (defaults to `en`)                         |
| **Zero business logic**  | No knowledge of app features — just wiring and metadata                |

---

## Architecture

```
src/
├── init.ts        # initI18n() — i18next bootstrap with detector + react binding
├── useT.ts        # useT() — re-export of useTranslation() for shorter imports
├── locales.ts     # LOCALE_REGISTRY + getLocaleMeta() — flag/label metadata
└── index.ts       # Barrel export
```

---

## Usage

### 1. Bootstrap (call once at app startup)

```ts
import { initI18n } from '@mas/shared/i18n';
import en from './i18n/en.json';
import fr from './i18n/fr.json';

initI18n({
  supportedLocales: ['en', 'fr'],
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  defaultLocale: 'en',
});
```

### 2. Translate in components

```tsx
import { useT } from '@mas/shared/i18n';

function Greeting() {
  const { t } = useT();
  return <h1>{t('home.title')}</h1>;
}
```

### 3. Access locale metadata

```ts
import { LOCALE_REGISTRY, getLocaleMeta } from '@mas/shared/i18n';

// All known locales
Object.values(LOCALE_REGISTRY);
// → [{ code: 'en', flag: '🇬🇧', label: 'English', labelEn: 'English' }, ...]

// Safe lookup (returns fallback for unknown codes)
getLocaleMeta('fr');
// → { code: 'fr', flag: '🇫🇷', label: 'Français', labelEn: 'French' }
```

---

## API reference

### `initI18n(options)`

Initialises i18next for a React app. Call once before rendering.

| Param                      | Type                                     | Default         | Description                         |
| -------------------------- | ---------------------------------------- | --------------- | ----------------------------------- |
| `options.supportedLocales` | `string[]`                               | —               | Locale codes to enable              |
| `options.resources`        | `Record<string, Record<string, object>>` | —               | Translation JSON keyed by locale/ns |
| `options.defaultLocale`    | `string`                                 | `'en'`          | Fallback when detection fails       |
| `options.ns`               | `string`                                 | `'translation'` | i18next namespace                   |

### `useT(ns?)`

Returns `{ t, i18n, ready }` — same shape as `useTranslation()` from `react-i18next`.

### `LOCALE_REGISTRY`

`Record<string, LocaleMeta>` with built-in entries for: `en`, `fr`, `es`, `de`, `it`, `pt`, `ar`, `ja`, `zh`, `ko`.

### `getLocaleMeta(code)`

Safe lookup into `LOCALE_REGISTRY`. Returns a fallback `{ code, flag: '🏳️', label: code, labelEn: code }` for unknown codes.

### `LocaleMeta`

```ts
interface LocaleMeta {
  code: string; // 'fr'
  flag: string; // '🇫🇷'
  label: string; // 'Français' (native)
  labelEn: string; // 'French' (English)
}
```

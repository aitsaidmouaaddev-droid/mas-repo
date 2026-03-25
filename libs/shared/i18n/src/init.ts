import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export interface InitI18nOptions {
  /** Locale codes to enable (must exist in LOCALE_REGISTRY) */
  supportedLocales: string[];
  /** Translation resources keyed by locale then namespace */
  resources: Record<string, Record<string, object>>;
  /** Fallback locale when detection fails */
  defaultLocale?: string;
  /** i18next namespace to use (default: 'translation') */
  ns?: string;
}

/**
 * Initialise i18next for a React app.
 *
 * Language is persisted in `localStorage` via the built-in detector.
 * Call this once at app bootstrap, before rendering.
 */
export function initI18n({
  supportedLocales,
  resources,
  defaultLocale = 'en',
  ns = 'translation',
}: InitI18nOptions) {
  return i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      supportedLngs: supportedLocales,
      fallbackLng: defaultLocale,
      defaultNS: ns,
      resources,
      detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: 'i18nextLng',
        caches: ['localStorage'],
      },
      interpolation: { escapeValue: false },
    });
}

import { useTranslation } from 'react-i18next';

/**
 * Convenience wrapper around `useTranslation()`.
 *
 * Returns `{ t, i18n, ready }` — same shape as react-i18next but shorter to
 * import from `@mas/shared/i18n`.
 */
export function useT(ns?: string) {
  return useTranslation(ns);
}

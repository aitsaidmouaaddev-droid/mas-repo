/**
 * Supported locale metadata — flag emoji, native label, and English label.
 *
 * This is the built-in registry. Apps pass `supportedLocales` keys from this
 * map to `initI18n()` to declare which locales they support.
 */
export interface LocaleMeta {
  code: string;
  flag: string;
  label: string;
  labelEn: string;
}

export const LOCALE_REGISTRY: Record<string, LocaleMeta> = {
  en: { code: 'en', flag: '🇬🇧', label: 'English', labelEn: 'English' },
  fr: { code: 'fr', flag: '🇫🇷', label: 'Français', labelEn: 'French' },
  es: { code: 'es', flag: '🇪🇸', label: 'Español', labelEn: 'Spanish' },
  de: { code: 'de', flag: '🇩🇪', label: 'Deutsch', labelEn: 'German' },
  it: { code: 'it', flag: '🇮🇹', label: 'Italiano', labelEn: 'Italian' },
  pt: { code: 'pt', flag: '🇧🇷', label: 'Português', labelEn: 'Portuguese' },
  ar: { code: 'ar', flag: '🇸🇦', label: 'العربية', labelEn: 'Arabic' },
  ja: { code: 'ja', flag: '🇯🇵', label: '日本語', labelEn: 'Japanese' },
  zh: { code: 'zh', flag: '🇨🇳', label: '中文', labelEn: 'Chinese' },
  ko: { code: 'ko', flag: '🇰🇷', label: '한국어', labelEn: 'Korean' },
};

export function getLocaleMeta(code: string): LocaleMeta {
  return LOCALE_REGISTRY[code] ?? { code, flag: '🏳️', label: code, labelEn: code };
}

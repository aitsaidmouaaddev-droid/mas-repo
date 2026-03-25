import { initI18n } from '@mas/shared/i18n';
import en from './en.json';
import fr from './fr.json';
import de from './de.json';
import es from './es.json';
import it from './it.json';

initI18n({
  supportedLocales: ['en', 'fr', 'de', 'es', 'it'],
  defaultLocale: 'en',
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    de: { translation: de },
    es: { translation: es },
    it: { translation: it },
  },
});

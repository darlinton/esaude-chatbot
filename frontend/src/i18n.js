import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en/translation.json';
import ptTranslation from './locales/pt/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      pt: {
        translation: ptTranslation,
      },
    },
    lng: 'pt', // Set the default language to Portuguese
    fallbackLng: 'en', // Fallback to English if a translation is missing

    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;

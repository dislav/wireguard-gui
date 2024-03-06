import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Resources
import translationEn from './locales/en/translation.json';
import translationRu from './locales/ru/tranlsation.json';
import AuthEn from './locales/en/Auth.json';
import AuthRu from './locales/ru/Auth.json';
import ClientEn from './locales/en/Client.json';
import ClientRu from './locales/ru/Client.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEn,
      Auth: AuthEn,
      Client: ClientEn,
    },
    ru: {
      translation: translationRu,
      Auth: AuthRu,
      Client: ClientRu,
    },
  },
  fallbackLng: 'ru',
});

export default i18n;

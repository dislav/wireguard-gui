import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Resources
import translationEn from './locales/en/translation.json';
import translationRu from './locales/ru/tranlsation.json';
import LoginFormEn from './locales/en/LoginForm.json';
import LoginFormRu from './locales/ru/LoginForm.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEn,
      LoginForm: LoginFormEn,
    },
    ru: {
      translation: translationRu,
      LoginForm: LoginFormRu,
    },
  },
  fallbackLng: 'ru',
});

export default i18n;

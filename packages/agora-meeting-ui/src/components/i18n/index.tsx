import React, { useEffect, useLayoutEffect } from 'react';
import i18n from 'i18next';
import { isEmpty } from 'lodash';
import {
  I18nextProvider,
  initReactI18next,
  useTranslation,
} from 'react-i18next';
import { en } from '../../utilities/translate/en';
import { zh } from '../../utilities/translate/zh';

export type LanguageEnum = 'en' | 'zh';

export let language: LanguageEnum = 'zh';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      ...en,
    },
  },
  zh: {
    translation: {
      ...zh,
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: language,
    // keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });



export const changeLanguage = (language: LanguageEnum) => {
  language = language;
  i18n.changeLanguage(language);
};

//@ts-ignore
window.changeLanguage = changeLanguage;

export const getLanguage = () => language;

export const setLanguage = (lang: LanguageEnum) => changeLanguage(lang);

export const transI18n = (text: string, options?: any) => {
  let content = i18n.t(text);
  if (!isEmpty(options)) {
    Object.keys(options).forEach((k) => {
      k = k + '';
      content = content.replace(`{${k}}`, options[k] || '');
    });
  }
  return content;
};

export const t = (text: string) => transI18n(text);

type I18nProvider = {
  children: React.ReactChild;
};

export const I18nProvider: React.FC<I18nProvider> = ({ children }) => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

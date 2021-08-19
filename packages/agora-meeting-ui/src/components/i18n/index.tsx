import React, { useEffect } from 'react';
import i18n from 'i18next';
import { isEmpty } from 'lodash';
import {
  I18nextProvider,
  initReactI18next,
  useTranslation,
} from 'react-i18next';
import { en } from '../../utilities/translate/en';
import { zh } from '../../utilities/translate/zh';

let language = 'zh';

// export const t = (text: string) => {
//   // TODO:qinzhen:useTranslation
//   const { t: translate } = useTranslation();
//   return translate(text);
// };

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      'Close Microphone': 'close microphone',
      'Open Microphone': 'open microphone',
      'Close Camera': 'close camera',
      'Open Camera': 'open camera',
      'Clear Podium': 'Close Podium',
      'Clear Podiums': 'Clear Podiums',
      'Close Whiteboard': 'close whiteboard',
      'Open Whiteboard': 'open whiteboard',
      Star: 'star',
      'Open Private Call': 'open private call',
      'Close Private Call': 'close private call',
      ...en,
    },
  },
  zh: {
    translation: {
      'Close Microphone': '禁用麦克风',
      'Open Microphone': '开启麦克风',
      'Close Camera': '禁用摄像头',
      'Open Camera': '开启摄像头',
      'Clear Podium': '下台',
      'Clear Podiums': '全体下台',
      'Close Whiteboard': '取消授权白板',
      'Open Whiteboard': '授权白板',
      Star: '奖励',
      'Open Private Call': '开启私密语音',
      'Close Private Call': '关闭私密语音',
      ...zh,
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'zh',
    // keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export const changeLanguage = (language: string) => {
  language = language;
  i18n.changeLanguage(language);
};

//@ts-ignore
window.changeLanguage = changeLanguage;

export const getLanguage = () => language;

export const setLanguage = (lang: string) => changeLanguage(lang);

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
  language: string;
};

export const I18nProvider: React.FC<I18nProvider> = ({
  children,
  language,
}) => {
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

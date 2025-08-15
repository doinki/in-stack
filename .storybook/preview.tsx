import '../app/tailwind.css';

import type { Preview } from '@storybook/react-vite';
import i18next from 'i18next';
import { useEffect } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { reactRouterParameters, withRouter } from 'storybook-addon-remix-react-router';

import { supportedLanguages } from '~/constants/locale';

import en from '../public/locales/en.json';
import ko from '../public/locales/ko.json';

i18next.use(initReactI18next).init({
  initAsync: false,
  interpolation: {
    escapeValue: false,
  },
  lng: 'ko',
  react: {
    useSuspense: false,
  },
  resources: {
    en: {
      translation: en,
    },
    ko: {
      translation: ko,
    },
  },
  supportedLngs: supportedLanguages,
});

export const globalTypes = {
  locale: {
    description: 'Change the locale of the storybook',
    name: 'Locale',
    toolbar: {
      icon: 'globe',
      items: [
        { title: '한국어', value: 'ko' },
        { title: 'English', value: 'en' },
      ],
      showName: true,
    },
  },
};

const preview: Preview = {
  decorators: [withProviders, withRouter],
  parameters: {
    reactRouter: reactRouterParameters({}),
  },
};

export default preview;

function withProviders(Story: any, context: any) {
  const { locale } = context.globals;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    i18next.changeLanguage(locale, () => {
      document.documentElement.lang = locale;
    });
  }, [locale]);

  return (
    <I18nextProvider i18n={i18next}>
      <Story />
    </I18nextProvider>
  );
}

import type { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import type { InitOptions } from 'i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import type { SupportedLanguage } from '~/constants/locale';

interface Env {
  Variables: {
    i18next: typeof i18next;
    language: SupportedLanguage;
  };
}

export interface I18nOptions extends Omit<InitOptions, 'fallbackLng' | 'supportedLngs'> {
  fallbackLng: string;
  getLanguage: (c: Context, options: I18nOptions) => SupportedLanguage;
  supportedLngs: readonly string[];
}

export function i18n(options: I18nOptions) {
  return createMiddleware<Env>(async (c, next) => {
    const instance = i18next.createInstance();

    const language = options.getLanguage(c, options);

    instance.use(initReactI18next).init({
      ...options,
      initAsync: false,
      interpolation: {
        escapeValue: false,
      },
      lng: options.getLanguage(c, options),
      react: {
        useSuspense: false,
      },
    });

    c.set('language', language);
    c.set('i18next', instance);

    await next();
  });
}

import * as Sentry from '@sentry/react-router';
import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { HydratedRouter } from 'react-router/dom';

import { supportedLanguages } from './constants/locale';
import { getLanguage } from './utils/locale';

if (import.meta.env.MSW) {
  const worker = await import('~/mocks/browser').then((m) => m.worker);

  worker.start();
}

Sentry.init({
  attachStacktrace: true,
  dsn: import.meta.env.SENTRY_DSN,
  enableLogs: true,
  enabled: import.meta.env.PROD && !!import.meta.env.SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.reactRouterTracingIntegration(),
    Sentry.browserProfilingIntegration(),
    Sentry.replayIntegration(),
    Sentry.extraErrorDataIntegration({ depth: 4 }),
  ],
  profileLifecycle: 'trace',
  profilesSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  sendDefaultPii: true,
  tracePropagationTargets: [/^\//],
  tracesSampleRate: 1.0,
});

i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    initAsync: false,
    interpolation: {
      escapeValue: false,
    },
    lng: getLanguage(window.location.pathname),
    react: {
      useSuspense: false,
    },
    supportedLngs: supportedLanguages,
  })
  .then(() => {
    startTransition(() => {
      hydrateRoot(
        document,
        <StrictMode>
          <I18nextProvider i18n={i18next}>
            <HydratedRouter />
          </I18nextProvider>
        </StrictMode>,
      );
    });
  });

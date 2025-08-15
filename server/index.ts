import { join } from 'node:path';
import { styleText } from 'node:util';

import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { ip } from 'address';
import { config } from 'dotenv';
import { Hono } from 'hono';
import type { TimingVariables } from 'hono/timing';
import { endTime, startTime, timing } from 'hono/timing';
import type i18next from 'i18next';
import { cacheHeader } from 'pretty-cache-header';
import type { ServerBuild } from 'react-router';
import { createRequestHandler } from 'react-router-hono';
import { gracefulShutdown } from 'server.close';

import type { SupportedLanguage } from '~/constants/locale';
import { defaultLanguage, supportedLanguages } from '~/constants/locale';
import { getLanguage } from '~/utils/locale';
import { removeTrailingSlash } from '~/utils/remove-trailing-slash';

import en from '../public/locales/en.json';
import ko from '../public/locales/ko.json';
import { i18n } from './i18next';
import { init } from './init';

const start = performance.now();

process.chdir(join(import.meta.dirname, '..'));

config({ quiet: true });
init();

const app = new Hono<{ Variables: TimingVariables }>();

app.use(timing());

if (import.meta.env.PROD) {
  app.use(
    serveStatic({
      onFound: (path, c) => {
        if (path.startsWith('client/assets/')) {
          c.header(cacheHeader({ immutable: true, maxAge: '1y', public: true }));
        } else if (path.startsWith('client/locales/')) {
          c.header(
            'Cache-Control',
            cacheHeader({
              maxAge: '5m',
              mustRevalidate: true,
              public: true,
              staleWhileRevalidate: '1h',
            }),
          );
        } else if (path.endsWith('.html')) {
          c.header(cacheHeader({ maxAge: '1m' }));
        } else {
          c.header(
            'Cache-Control',
            cacheHeader({
              maxAge: '1h',
              mustRevalidate: true,
              public: true,
              staleWhileRevalidate: '24h',
            }),
          );
        }
      },
      root: 'client',
    }),
  );
}

app.get('*', async (c, next) => {
  if (c.req.path.at(-1) === '/' && c.req.path !== '/') {
    const url = new URL(c.req.url);
    url.pathname = removeTrailingSlash(url.pathname).replace(/\/+/g, '/');

    return c.redirect(url);
  }

  return next();
});

app.use(
  i18n({
    fallbackLng: defaultLanguage,
    getLanguage: (c) => getLanguage(c.req.path),
    resources: {
      en: { translation: en },
      ko: { translation: ko },
    },
    supportedLngs: supportedLanguages,
  }),
);

// eslint-disable-next-line import/no-unresolved
const serverBuild: ServerBuild = await import('virtual:react-router/server-build');

app.use(
  createRequestHandler({
    build: serverBuild,
    getLoadContext: (c) => ({
      i18next: c.get('i18next'),
      language: c.get('language'),
      serverBuild,
      timing: {
        endTime: endTime.bind(null, c),
        startTime: startTime.bind(null, c),
      },
    }),
  }),
);

if (import.meta.env.PROD) {
  const hostname = process.env.HOST || '0.0.0.0';
  const port = Number(process.env.PORT) || 3000;

  const localUrl = styleText('cyan', `http://localhost:${styleText('bold', port.toString())}`);
  let lanUrl: string | null = null;
  const localIp = ip();
  if (localIp && /^10\.|^172\.(1[6-9]|2\d|3[01])\.|^192\.168\./.test(localIp)) {
    lanUrl = styleText('cyan', `http://${localIp}:${styleText('bold', port.toString())}`);
  }

  const server = serve(
    {
      fetch: app.fetch,
      hostname,
      port,
      serverOptions: {
        keepAlive: true,
        keepAliveTimeout: 20_000,
      },
    },
    () => {
      console.log(
        [
          `${styleText('dim', 'ready in')} ${styleText('bold', (performance.now() - start).toFixed(2))} ms`,
          `${styleText('green', '➜')} ${styleText('bold', 'Local')}:   ${localUrl}`,
          lanUrl && `${styleText('green', '➜')} ${styleText('bold', 'Network')}: ${lanUrl}`,
        ]
          .filter(Boolean)
          .join('\n')
          .trim(),
      );
    },
  );

  gracefulShutdown(server);
}

export default app;

declare module 'react-router' {
  interface AppLoadContext {
    i18next: typeof i18next;
    language: SupportedLanguage;
    serverBuild: ServerBuild;
    timing: {
      endTime: (name: string, precision?: number) => void;
      startTime: (name: string, description?: string) => void;
    };
  }
}

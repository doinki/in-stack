import { createHash } from 'node:crypto';
import { join } from 'node:path';

import devServer, { defaultOptions } from '@hono/vite-dev-server';
import { reactRouter } from '@react-router/dev/vite';
import { sentryReactRouter } from '@sentry/react-router';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { reactRouterDevTools } from 'react-router-devtools';
import { visualizer } from 'rollup-plugin-visualizer';
import type { ConfigEnv, PluginOption } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import { envOnlyMacros } from 'vite-env-only';
import tsconfigPaths from 'vite-tsconfig-paths';

const PORT = 3000;
const SERVER_ENTRY = 'server/index.ts';

export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), '');

  return {
    build: {
      rollupOptions: {
        input: config.isSsrBuild ? SERVER_ENTRY : undefined,
        output: {
          ...(env.MODE === 'production' && {
            assetFileNames: ({ names }: { names: string[] }) =>
              `assets/${hash(names.reduce((prev, curr) => prev + curr))}-[hash:10][extname]`,
            chunkFileNames: ({ name }: { name: string }) => `assets/${hash(name)}-[hash:10].js`,
            entryFileNames: ({ name }: { name: string }) => `assets/${hash(name)}-[hash:10].js`,
          }),
        },
      },
      sourcemap: !!env.SENTRY_AUTH_TOKEN,
      // https://tailwindcss.com/docs/compatibility#browser-support
      target: config.isSsrBuild ? 'node24' : ['chrome111', 'safari16.4', 'firefox128'],
    },
    define: {
      'import.meta.env.MSW': JSON.stringify(env.MSW === 'true'),
      'import.meta.env.SENTRY_DSN': JSON.stringify(env.SENTRY_DSN),
    },
    plugins: generatePlugins(config, env, {
      isAnalyzeEnabled: env.ANALYZE === 'true',
      isStorybookEnabled: env.STORYBOOK === 'true',
    }),
    server: {
      port: PORT,
    },
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['app/**/*.test.ts?(x)'],
      setupFiles: 'vitest.setup.ts',
    },
  } as const;
});

function hash(input: string): string {
  return createHash('sha256').update(input).digest('hex').substring(0, 6);
}

function generatePlugins(
  config: ConfigEnv,
  env: Record<string, string>,
  options: { isAnalyzeEnabled: boolean; isStorybookEnabled: boolean },
): PluginOption[] {
  const basePlugins = [tsconfigPaths(), envOnlyMacros(), tailwindcss()];

  if (options.isStorybookEnabled || env.NODE_ENV === 'test') {
    return [...basePlugins, basicSsl()];
  }

  if (env.NODE_ENV === 'development') {
    return [
      ...basePlugins,
      reactRouterDevTools(),
      reactRouter(),
      devServer({
        entry: SERVER_ENTRY,
        exclude: [...defaultOptions.exclude, /^\/app\//],
        injectClientScript: false,
      }),
      basicSsl(),
    ];
  }

  return [
    ...basePlugins,
    reactRouter(),
    sentryReactRouter(
      {
        authToken: env.SENTRY_AUTH_TOKEN,
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,
        telemetry: false,
        unstable_sentryVitePluginOptions: {
          release: {
            name: env.COMMIT_SHA,
            setCommits: {
              auto: true,
            },
          },
        },
      },
      config,
    ),
    options.isAnalyzeEnabled &&
      visualizer({
        filename: join(
          import.meta.dirname,
          `node_modules/.cache/${config.isSsrBuild ? 'server' : 'client'}-stats.html`,
        ),
        open: true,
        template: 'flamegraph',
        title: config.isSsrBuild ? 'Server' : 'Client',
      }),
  ].filter(Boolean);
}

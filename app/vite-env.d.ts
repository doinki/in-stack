/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MSW: string | undefined;
  readonly SENTRY_DSN: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

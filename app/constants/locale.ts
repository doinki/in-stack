import type { href } from 'react-router';

type Path = Parameters<typeof href>[0];

type RemoveLangPrefix<T extends string> = T extends `/:lang?/${infer ActualPath}`
  ? `/${ActualPath}`
  : T extends '/:lang?'
    ? '/'
    : T;

export type RefinedPath = RemoveLangPrefix<Path>;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const defaultLanguage = 'ko';

export const supportedLanguages = [defaultLanguage, 'en'] as const;

import type { href } from 'react-router';

export type HrefPath = Parameters<typeof href>[0];

export type HrefParams<T extends HrefPath> = Parameters<typeof href<T>>[1];

type RemoveLangPrefix<T extends string> = T extends `/:lang?/${infer ActualPath}`
  ? `/${ActualPath}`
  : T extends '/:lang?'
    ? '/'
    : T;

export type RefinedPath = RemoveLangPrefix<HrefPath>;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const defaultLanguage = 'ko';

export const supportedLanguages = [defaultLanguage, 'en'] as const;

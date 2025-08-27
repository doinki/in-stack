import { href } from 'react-router';

import type { HrefParams, HrefPath, RefinedPath, SupportedLanguage } from '~/constants/locale';
import { defaultLanguage, supportedLanguages } from '~/constants/locale';

export function getLanguage(path: string): SupportedLanguage {
  const locale = path.split('/')[1] as SupportedLanguage;

  return supportedLanguages.includes(locale) ? locale : defaultLanguage;
}

export function refineLocalePath(path: string): RefinedPath {
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  const lang = getLanguage(path);

  return path.replace(new RegExp(`^/${lang}(?:/|$)`), '/') as RefinedPath;
}

export function getLocalePath<T extends HrefPath = HrefPath>(
  path: T,
  params?: HrefParams<T>,
): string {
  if (!params) {
    return path;
  }

  // @ts-expect-error
  const lang = params.lang;
  const shouldIncludeLang = lang && lang !== defaultLanguage && supportedLanguages.includes(lang);

  if (!shouldIncludeLang) {
    // @ts-expect-error
    delete params.lang;
  }

  // @ts-expect-error
  return href(path, params);
}

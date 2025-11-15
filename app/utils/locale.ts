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

  return path.replace(new RegExp(`^/${lang}(?:/|$)`), '/');
}

export function getLocalePath<T extends HrefPath = HrefPath>(
  path: T,
  params?: HrefParams<T>,
): string {
  if (!params) {
    return path;
  }

  const lang = params.lang;
  const shouldIncludeLang =
    lang && lang !== defaultLanguage && supportedLanguages.includes(lang as SupportedLanguage);

  if (!shouldIncludeLang) {
    delete params.lang;
  }

  return href(path, params);
}

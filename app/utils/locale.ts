import type { RefinedPath, SupportedLanguage } from '~/constants/locale';
import { defaultLanguage, supportedLanguages } from '~/constants/locale';

import { removeTrailingSlash } from './remove-trailing-slash';

export function getLanguage(path: string): SupportedLanguage {
  const locale = path.split('/')[1] as SupportedLanguage;

  return supportedLanguages.includes(locale) ? locale : defaultLanguage;
}

export function refineLocalePath(path: string): RefinedPath {
  const lang = getLanguage(path);
  const url = new URL(path, 'http://127.0.0.1');

  return url.pathname.replace(new RegExp(`^/${lang}(?:/|$)`), '/') as RefinedPath;
}

export function getLocalePath(path: RefinedPath, language: string) {
  path = refineLocalePath(path);

  if (language === defaultLanguage || !supportedLanguages.includes(language as SupportedLanguage)) {
    return path;
  }

  return removeTrailingSlash(`/${language}${path}`);
}

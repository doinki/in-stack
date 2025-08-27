/* eslint-disable jsx-a11y/anchor-has-content */

import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import type { Path } from 'react-router';
import { Link, NavLink } from 'react-router';

import type { HrefParams, HrefPath, SupportedLanguage } from '~/constants/locale';
import { getLocalePath } from '~/utils/locale';

function useLinkTo<T extends HrefPath = HrefPath>(
  to: T | (Omit<Partial<Path>, 'pathname'> & { pathname?: T }),
  params?: HrefParams<T>,
): string | Partial<Path> {
  const lang = useTranslation().i18n.language as SupportedLanguage;

  if (typeof to === 'string') {
    return getLocalePath(to, { lang, ...params });
  }

  if (!to.pathname) {
    return to;
  }

  return {
    ...to,
    pathname: getLocalePath(to.pathname, { lang, ...params }),
  };
}

export interface LocaleLinkProps<T extends HrefPath = HrefPath>
  extends Omit<ComponentProps<typeof Link>, 'to'> {
  params?: HrefParams<T>;
  to: T | (Omit<Partial<Path>, 'pathname'> & { pathname?: T });
}

export function LocaleLink<T extends HrefPath = HrefPath>({
  params,
  to,
  ...props
}: LocaleLinkProps<T>) {
  return <Link to={useLinkTo(to, params)} {...props} />;
}

export interface LocaleNavLinkProps<T extends HrefPath = HrefPath>
  extends Omit<ComponentProps<typeof NavLink>, 'to'> {
  params?: HrefParams<T>;
  to: T | (Omit<Partial<Path>, 'pathname'> & { pathname?: T });
}

export function LocaleNavLink<T extends HrefPath = HrefPath>({
  params,
  to,
  ...props
}: LocaleNavLinkProps<T>) {
  return <NavLink to={useLinkTo(to, params)} {...props} />;
}

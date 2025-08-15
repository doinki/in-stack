/* eslint-disable jsx-a11y/anchor-has-content */

import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router';

import type { RefinedPath } from '~/constants/locale';
import { getLocalePath } from '~/utils/locale';

function useLinkTo(to: RefinedPath): RefinedPath {
  const { i18n } = useTranslation();

  return getLocalePath(to, i18n.language) as RefinedPath;
}

export interface LocaleLinkProps extends Omit<ComponentProps<typeof Link>, 'to'> {
  to: RefinedPath;
}

export function LocaleLink({ to, ...props }: LocaleLinkProps) {
  return <Link to={useLinkTo(to)} {...props} />;
}

export interface LocaleNavLinkProps extends Omit<ComponentProps<typeof NavLink>, 'to'> {
  to: RefinedPath;
}

export function LocaleNavLink({ to, ...props }: LocaleNavLinkProps) {
  return <NavLink to={useLinkTo(to)} {...props} />;
}

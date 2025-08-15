import type { SeoHandle } from 'react-router-seo';
import { generateSitemap } from 'react-router-seo';
import { serverOnly$ } from 'vite-env-only/macros';

import { getDomainUrl } from '~/utils/get-domain-url';

import type { Route } from './+types/sitemap[.]xml';

export const handle: SeoHandle | undefined = serverOnly$({
  seo: {
    sitemap: false,
  },
});

export const loader = ({ context, request }: Route.LoaderArgs) => {
  return generateSitemap(request, context.serverBuild.routes, {
    url: getDomainUrl(request),
  });
};

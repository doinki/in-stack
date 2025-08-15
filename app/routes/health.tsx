import type { SeoHandle } from 'react-router-seo';
import { serverOnly$ } from 'vite-env-only/macros';

export const handle: SeoHandle | undefined = serverOnly$({
  seo: {
    sitemap: false,
  },
});

export const loader = () => {
  return new Response('OK', { status: 200 });
};

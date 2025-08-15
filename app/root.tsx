import { useTranslation } from 'react-i18next';
import { Links, Meta, Outlet, redirect, Scripts, ScrollRestoration } from 'react-router';

import type { Route } from './+types/root';
import { GeneralErrorBoundary } from './components/common/error-boundary';
import { LanguageUpdater } from './components/common/language-updater';
import { LocalePreloadLink } from './components/common/locale-preload-link';
import { Progress } from './components/ui/progress';
import { ErrorMessage } from './constants/enum';
import type { SupportedLanguage } from './constants/locale';
import { defaultLanguage, supportedLanguages } from './constants/locale';
import tailwindcss from './tailwind.css?url';
import { getDomainUrl } from './utils/get-domain-url';
import { refineLocalePath } from './utils/locale';

export const links: Route.LinksFunction = () => {
  return [{ href: tailwindcss, rel: 'stylesheet' }];
};

export const shouldRevalidate = () => {
  return false;
};

export const loader = ({ params, request }: Route.LoaderArgs) => {
  if (params.lang === defaultLanguage) {
    const url = new URL(request.url);
    url.pathname = refineLocalePath(url.pathname);

    return redirect(url.href);
  }

  if (params.lang && !supportedLanguages.includes(params.lang as SupportedLanguage)) {
    throw new Response(ErrorMessage.NOT_FOUND, { status: 404 });
  }

  return { origin: getDomainUrl(request) };
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  return (
    <html dir={i18n.dir(i18n.language)} lang={i18n.language}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <LocalePreloadLink />
        <Meta />
        <Links />
      </head>
      <body>
        <Progress />
        {children}
        <ScrollRestoration />
        <Scripts />
        <LanguageUpdater />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary className="mx-auto grid min-h-svh w-full max-w-lg place-content-center" />
  );
}

import { PassThrough } from 'node:stream';
import { styleText } from 'node:util';

import { createReadableStreamFromReadable } from '@react-router/node';
import * as Sentry from '@sentry/react-router';
import { isbot } from 'isbot';
import type { RenderToPipeableStreamOptions } from 'react-dom/server';
import { renderToPipeableStream } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import type {
  ActionFunctionArgs,
  AppLoadContext,
  EntryContext,
  LoaderFunctionArgs,
} from 'react-router';
import { ServerRouter } from 'react-router';

if (import.meta.env.MSW) {
  const server = await import('~/mocks/node').then((m) => m.server);

  server.listen({
    onUnhandledRequest(request, print) {
      if (request.url.includes('__rrdt')) {
        return;
      }

      print.warning();
    },
  });
}

export const streamTimeout = 5000;

function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext: AppLoadContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get('user-agent');

    const readyOption: keyof RenderToPipeableStreamOptions =
      (userAgent && isbot(userAgent)) || routerContext.isSpaMode ? 'onAllReady' : 'onShellReady';

    loadContext.timing.startTime('render');

    const { abort, pipe } = renderToPipeableStream(
      <I18nextProvider i18n={loadContext.i18next}>
        <ServerRouter context={routerContext} url={request.url} />
      </I18nextProvider>,
      {
        onError(error: unknown) {
          responseStatusCode = 500;

          if (shellRendered) {
            console.error(error);
          }
        },
        onShellError(error: unknown) {
          reject(error);
        },
        [readyOption]() {
          loadContext.timing.endTime('render');

          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html');

          if (import.meta.env.PROD && import.meta.env.SENTRY_DSN) {
            responseHeaders.append('Document-Policy', 'js-profiling');
          }

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(Sentry.getMetaTagTransformer(body));
        },
      },
    );

    setTimeout(abort, streamTimeout + 1000);
  });
}

export default Sentry.wrapSentryHandleRequest(handleRequest);

export function handleError(
  error: unknown,
  { request }: LoaderFunctionArgs | ActionFunctionArgs,
): void {
  if (request.signal.aborted) {
    return;
  }

  if (error instanceof Error) {
    console.error(styleText('red', String(error.stack)));
  } else {
    console.error(error);
  }

  Sentry.captureException(error);
}

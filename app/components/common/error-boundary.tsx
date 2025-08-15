import type { ReactNode } from 'react';
import type { ErrorResponse } from 'react-router';
import { isRouteErrorResponse, useParams, useRouteError } from 'react-router';

import { getErrorMessage } from '~/utils/get-error-message';
import { isObjectLike } from '~/utils/is-object-like';

type StatusHandler = (info: {
  error: ErrorResponse;
  params: Record<string, string | undefined>;
}) => ReactNode;

export function GeneralErrorBoundary({
  className,
  defaultStatusHandler = statusHandler,
  statusHandlers,
  unexpectedErrorHandler = errorHandler,
}: {
  className?: string;
  defaultStatusHandler?: StatusHandler;
  statusHandlers?: Record<number, StatusHandler>;
  unexpectedErrorHandler?: (error: unknown) => ReactNode;
}) {
  const params = useParams();
  const error = useRouteError();

  return (
    <div className={className}>
      {isRouteErrorResponse(error)
        ? (statusHandlers?.[error.status] || defaultStatusHandler)({ error, params })
        : unexpectedErrorHandler?.(error)}
    </div>
  );
}

export function statusHandler({ error }: { error: ErrorResponse }) {
  return (
    <div className="flex min-h-12 items-center gap-4">
      <h1 className="text-2xl font-medium">{error.status}</h1>
      <hr className="border-t-o h-full border-r" />
      <h2 className="text-sm">
        {isObjectLike(error.data) ? JSON.stringify(error.data, null, 2) : error.data}
      </h2>
    </div>
  );
}

export function errorHandler(error: unknown) {
  return <p className="text-sm">{getErrorMessage(error)}</p>;
}

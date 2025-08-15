import { GeneralErrorBoundary } from '~/components/common/error-boundary';
import { ErrorMessage } from '~/constants/enum';

export const loader = () => {
  throw new Response(ErrorMessage.NOT_FOUND, { status: 404 });
};

export const action = () => {
  throw new Response(ErrorMessage.NOT_FOUND, { status: 404 });
};

export default function NotFound() {
  return <GeneralErrorBoundary />;
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary className="mx-auto grid min-h-svh w-full max-w-lg place-content-center" />
  );
}

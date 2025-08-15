import { ErrorMessage } from '~/constants/enum';

import { isObjectLike } from './is-object-like';

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (isObjectLike(error) && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return ErrorMessage.UNKNOWN;
}

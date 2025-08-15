import { isObjectLike } from './is-object-like';

export function isPlainObject<T extends object>(value: unknown): value is T {
  if (!isObjectLike(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return (
    (prototype === null ||
      prototype === Object.prototype ||
      Object.getPrototypeOf(prototype) === null) &&
    !(Symbol.toStringTag in value) &&
    !(Symbol.iterator in value)
  );
}

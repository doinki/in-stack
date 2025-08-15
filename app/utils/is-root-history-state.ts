import { isPlainObject } from './is-plain-object';

export function isRootHistoryState(): boolean {
  return (
    isPlainObject<{ idx?: number }>(globalThis.history?.state) && !globalThis.history.state.idx
  );
}

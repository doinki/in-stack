import { useCallback } from 'react';
import type { NavigateOptions } from 'react-router';
import { useNavigate } from 'react-router';

import type { RefinedPath } from '~/constants/locale';
import { isRootHistoryState } from '~/utils/is-root-history-state';

type SafeBack = (path?: RefinedPath, options?: NavigateOptions) => Promise<void> | void;

export function useSafeBack(defaultPath: RefinedPath = '/') {
  const navigate = useNavigate();

  return useCallback<SafeBack>(
    (path, options) => {
      if (isRootHistoryState()) {
        return navigate(path ?? defaultPath, options);
      } else {
        return navigate(-1);
      }
    },
    [defaultPath, navigate],
  );
}

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { getLanguage } from '~/utils/locale';

export function LanguageUpdater() {
  const { i18n } = useTranslation();

  const location = useLocation();
  const language = getLanguage(location.pathname);

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [i18n, language]);

  return null;
}

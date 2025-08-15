import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function LocalePreloadLink() {
  const { i18n } = useTranslation();
  const [defaultLanguage] = useState(i18n.language);

  return (
    <link
      as="fetch"
      crossOrigin="anonymous"
      href={`/locales/${defaultLanguage}.json`}
      rel="preload"
    />
  );
}

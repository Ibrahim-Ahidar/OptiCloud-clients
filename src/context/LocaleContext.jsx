import { createContext, useContext, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../i18n/index.js';

const LocaleContext = createContext();

export const useLocale = () => useContext(LocaleContext);

export const LocaleProvider = ({ children }) => {
  const { i18n } = useTranslation();

  const setLanguage = useCallback((code) => {
    i18n.changeLanguage(code);
  }, [i18n]);

  const value = useMemo(() => ({
    language: i18n.language,
    setLanguage,
    languages: LANGUAGES,
  }), [i18n.language, setLanguage]);

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

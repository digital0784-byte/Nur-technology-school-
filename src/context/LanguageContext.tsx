import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { UI_TRANSLATIONS, LANGUAGE_NAMES } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  isRtl: boolean;
  languageDetails: typeof LANGUAGE_NAMES[Language];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_tutorial_language') as Language;
    if (saved && ['am', 'om', 'ti', 'ar', 'so', 'en'].includes(saved)) {
      return saved;
    }
    return 'am'; // Amharic by default
  });

  const isRtl = language === 'ar';

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('app_tutorial_language', newLang);
  };

  useEffect(() => {
    // Dynamic update of HTML document lang and dir attributes
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language, isRtl]);

  const t = (key: string, fallback?: string): string => {
    const currentDict = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.am;
    if (currentDict && currentDict[key]) {
      return currentDict[key];
    }
    // Fallback to Amharic if key exists there
    if (UI_TRANSLATIONS.am && UI_TRANSLATIONS.am[key]) {
      return UI_TRANSLATIONS.am[key];
    }
    // Fallback to English if key exists there
    if (UI_TRANSLATIONS.en && UI_TRANSLATIONS.en[key]) {
      return UI_TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRtl,
        languageDetails: LANGUAGE_NAMES[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

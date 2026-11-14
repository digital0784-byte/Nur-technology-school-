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

const VALID_LANGUAGES: Language[] = ['am', 'om', 'ti', 'ar', 'so', 'en'];

const readInitialLanguage = (): Language => {
  try {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang') as Language | null;
    if (urlLang && VALID_LANGUAGES.includes(urlLang)) {
      return urlLang;
    }
  } catch {
    // Ignore URL parsing errors
  }
  try {
    const saved = window.localStorage.getItem('app_tutorial_language') as Language | null;
    if (saved && VALID_LANGUAGES.includes(saved)) {
      return saved;
    }
  } catch {
    // Ignore storage access errors in third-party iframes / private browsing
  }
  return 'am';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(readInitialLanguage);

  const isRtl = language === 'ar';

  const setLanguage = (newLang: Language) => {
    if (!VALID_LANGUAGES.includes(newLang)) return;
    setLanguageState(newLang);
    try {
      window.localStorage.setItem('app_tutorial_language', newLang);
    } catch {
      // Ignore storage access errors in third-party iframes / private browsing
    }
  };

  useEffect(() => {
    // Dynamic update of HTML document lang and dir attributes
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language, isRtl]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'app_tutorial_language' && e.newValue && VALID_LANGUAGES.includes(e.newValue as Language)) {
        setLanguageState(e.newValue as Language);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
        languageDetails: LANGUAGE_NAMES[language] || LANGUAGE_NAMES.am,
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

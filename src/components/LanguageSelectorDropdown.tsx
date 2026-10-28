import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';
import { LANGUAGE_NAMES } from '../i18n/translations';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'header' | 'modal';
}

export const LanguageSelectorDropdown: React.FC<LanguageSelectorProps> = ({ variant = 'header' }) => {
  const { language, setLanguage, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languagesList = Object.keys(LANGUAGE_NAMES) as Language[];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg border font-medium text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
          variant === 'modal'
            ? 'w-full bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
            : 'bg-emerald-50/80 hover:bg-emerald-100/90 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 shadow-xs'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Switch Language"
      >
        <span className="flex items-center gap-1.5 min-w-0">
          <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="truncate font-semibold">{LANGUAGE_NAMES[language].nativeName}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            isRtl ? 'left-0' : 'right-0'
          } mt-1.5 w-48 sm:w-56 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs sm:text-sm animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
            Languages / ቋንቋዎች
          </div>
          {languagesList.map((langKey) => {
            const item = LANGUAGE_NAMES[langKey];
            const isSelected = language === langKey;
            return (
              <button
                key={langKey}
                type="button"
                onClick={() => {
                  setLanguage(langKey);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.flag}</span>
                  <div>
                    <div className="leading-tight">{item.nativeName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{item.label}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

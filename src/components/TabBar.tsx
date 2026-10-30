import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ModuleId } from '../types';
import { ChevronRight, Home, Sparkles } from 'lucide-react';

interface TabBarProps {
  currentModule: ModuleId;
  onSelectModule: (mod: ModuleId) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ currentModule, onSelectModule }) => {
  const { t, isRtl } = useLanguage();
  const { activeGrade, isSuperAdmin } = useAuth();

  return (
    <div className="flex items-center justify-between text-xs py-2 px-1 mb-4 border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 truncate">
        <button
          type="button"
          onClick={() => onSelectModule('student_app')}
          className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 font-semibold"
        >
          <Home className="w-3.5 h-3.5" />
          <span>መነሻ (Home)</span>
        </button>

        <ChevronRight className={`w-3 h-3 text-slate-400 shrink-0 ${isRtl ? 'rotate-180' : ''}`} />

        <span className="font-bold text-emerald-700 dark:text-emerald-300">
          Grade {activeGrade}
        </span>

        <ChevronRight className={`w-3 h-3 text-slate-400 shrink-0 ${isRtl ? 'rotate-180' : ''}`} />

        <span className="font-extrabold text-slate-800 dark:text-slate-100 truncate">
          {t(`mod_${currentModule}`)}
        </span>
      </div>

      {/* Quick shortcuts */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onSelectModule('premium_learning_center')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-amber-300 border border-purple-500/40 font-bold text-[11px] shadow-xs transition"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>💎 ፕሪሚየም ማዕከል</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectModule('ai_tutor')}
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] hover:bg-emerald-100"
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          NUR AI Tutor
        </button>
      </div>
    </div>
  );
};

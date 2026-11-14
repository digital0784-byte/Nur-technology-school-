import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ModuleId } from '../../types';
import { Home, BookOpen, Bot, Award, Camera, Crown, Sparkles, Bookmark } from 'lucide-react';
import {
  TextbookReadingProgress,
  SupplementaryReadingProgress,
  getLastReadTextbook,
  getLastReadSupplementary,
  isSupplementaryBookEligibleForGrade,
  syncBookReadingProgressFromCloud,
  requestAutoResumeTextbook,
  computeReadingPercent,
} from '../../services/bookReadingProgressService';

interface StudentPortalDashboardProps {
  onNavigateModule: (mod: ModuleId) => void;
}

export const StudentPortalDashboard: React.FC<StudentPortalDashboardProps> = ({ onNavigateModule }) => {
  const { currentUser, activeGrade, isSuperAdmin } = useAuth();
  const { t } = useLanguage();
  const readAllowedSupp = () => {
    const raw = getLastReadSupplementary(currentUser.id);
    if (!raw) return null;
    return isSupplementaryBookEligibleForGrade(raw.bookId, activeGrade, isSuperAdmin) ? raw : null;
  };
  const [lastTextbook, setLastTextbook] = useState<TextbookReadingProgress | null>(() =>
    getLastReadTextbook(currentUser.id, activeGrade, !isSuperAdmin)
  );
  const [lastSupp, setLastSupp] = useState<SupplementaryReadingProgress | null>(() => readAllowedSupp());

  useEffect(() => {
    setLastTextbook(getLastReadTextbook(currentUser.id, activeGrade, !isSuperAdmin));
    setLastSupp(readAllowedSupp());

    let cancelled = false;
    syncBookReadingProgressFromCloud(currentUser.id).then(() => {
      if (cancelled) return;
      setLastTextbook(getLastReadTextbook(currentUser.id, activeGrade, !isSuperAdmin));
      setLastSupp(readAllowedSupp());
    });
    return () => {
      cancelled = true;
    };
  }, [currentUser.id, activeGrade, isSuperAdmin]);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase mb-2">
              <Home className="w-3.5 h-3.5" />
              {t('student_portal')} • {t('grade')} {activeGrade}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              {t('portal_welcome')} {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-lg">
              {t('portal_sub')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-center border border-white/20">
              <div className="text-xl font-black text-amber-300">⚡ {currentUser.xp}</div>
              <div className="text-[10px] text-white/80 uppercase font-bold">Total XP</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-center border border-white/20">
              <div className="text-xl font-black text-emerald-300">🔥 {currentUser.streakDays}</div>
              <div className="text-[10px] text-white/80 uppercase font-bold">Days Streak</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => onNavigateModule('lesson')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-all shadow-xs space-y-2 group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">{t('quick_continue_lesson')}</div>
            <div className="text-[10px] text-slate-400">{t('quick_continue_lesson_sub')}</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateModule('ai_tutor')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-all shadow-xs space-y-2 group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">{t('quick_ask_ai')}</div>
            <div className="text-[10px] text-slate-400">{t('quick_ask_ai_sub')}</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateModule('quiz')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-all shadow-xs space-y-2 group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">{t('quick_take_quiz')}</div>
            <div className="text-[10px] text-slate-400">{t('quick_take_quiz_sub')}</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateModule('photo_voice_tutor')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-all shadow-xs space-y-2 group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">{t('quick_photo_solve')}</div>
            <div className="text-[10px] text-slate-400">{t('quick_photo_solve_sub')}</div>
          </div>
        </button>
      </div>

      {/* Continue Reading Card (when student has saved textbook or supplementary progress) */}
      {(lastTextbook || lastSupp) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lastTextbook && (
            <button
              type="button"
              onClick={() => {
                requestAutoResumeTextbook(lastTextbook.bookId);
                onNavigateModule('textbook');
              }}
              className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950 border border-emerald-500/40 text-left hover:border-emerald-400 transition-all shadow-md flex items-center justify-between gap-3 group"
            >
              <div className="min-w-0 space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300">
                  <Bookmark className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t('resume_textbook_badge')}</span>
                </div>
                <div className="text-xs sm:text-sm font-black text-white truncate">
                  {lastTextbook.bookTitle || `${t('grade')} ${lastTextbook.grade} Textbook`}
                </div>
                <div className="text-[11px] text-emerald-100/80 truncate">
                  Unit {lastTextbook.unitNumber} • Page {lastTextbook.pageNumber}
                  {lastTextbook.totalPages > 0
                    ? ` (${computeReadingPercent(lastTextbook.pageNumber, lastTextbook.totalPages)}%)`
                    : ''}
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500 group-hover:bg-emerald-400 text-slate-950 font-black text-xs shrink-0 transition">
                {t('continue_btn')} →
              </span>
            </button>
          )}

          {lastSupp && (
            <button
              type="button"
              onClick={() => onNavigateModule('supplementary')}
              className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-purple-950 border border-indigo-500/40 text-left hover:border-indigo-400 transition-all shadow-md flex items-center justify-between gap-3 group"
            >
              <div className="min-w-0 space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-300">
                  <Bookmark className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t('resume_supp_badge')}</span>
                </div>
                <div className="text-xs sm:text-sm font-black text-white truncate">
                  {lastSupp.bookTitle}
                </div>
                <div className="text-[11px] text-indigo-100/80 truncate">
                  {lastSupp.series} Series • Unit {lastSupp.chapterNumber}
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-indigo-400 group-hover:bg-indigo-300 text-slate-950 font-black text-xs shrink-0 transition">
                {t('continue_btn')} →
              </span>
            </button>
          )}
        </div>
      )}

      {/* VIP Premium Learning Hub Card */}
      <button
        type="button"
        onClick={() => onNavigateModule('premium_learning_center')}
        className="w-full p-4.5 rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950 border-2 border-amber-500/40 text-left hover:border-amber-400 transition-all shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform border border-amber-500/30">
            <Crown className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="text-sm font-black text-amber-300 flex items-center gap-1.5">
              <span>{t('vip_hub_title')}</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              {t('mod_premium_learning_center_sub')}
            </div>
          </div>
        </div>
        <span className="self-start sm:self-center px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 group-hover:from-amber-400 group-hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition shrink-0">
          {t('vip_hub_open')} →
        </span>
      </button>
    </div>
  );
};

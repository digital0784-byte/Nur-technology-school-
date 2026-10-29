import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelectorDropdown } from './LanguageSelectorDropdown';
import { GradeLevel } from '../types';
import {
  Menu,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Lock,
  UserCheck,
  Sparkles,
  Award,
  Zap,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  canGoBack: boolean;
  onGoBack: () => void;
  onOpenProfileModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  canGoBack,
  onGoBack,
  onOpenProfileModal,
}) => {
  const { currentUser, activeGrade, setActiveGrade, isSuperAdmin, isGradeLocked } = useAuth();
  const { status, subscription } = useSubscription();
  const { t, isRtl } = useLanguage();
  const [showRoleInfo, setShowRoleInfo] = useState(false);

  const availableGrades: GradeLevel[] = [9, 10, 11, 12];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Flex Row with Strict Mobile Safety */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Left Side: Mobile Menu, Back Arrow & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Toggle Navigation Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Global "ወደ ኋላ" (Back Arrow) Button */}
          {canGoBack && (
            <button
              type="button"
              onClick={onGoBack}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-colors shrink-0 shadow-xs"
              title={t('back_button')}
            >
              {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span className="hidden xs:inline">{t('back_button')}</span>
            </button>
          )}

          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0 ring-2 ring-emerald-500/20">
              ኑ
            </div>
            <div className="hidden min-[420px]:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                  {t('app_title')}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  2019 E.C.
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate max-w-[170px] sm:max-w-xs">
                {t('app_subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Center / Right Controls: Grade Switcher & Dynamic Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dynamic Grade Switcher for Super Admin vs Strict Lock for Student */}
          {isSuperAdmin ? (
            <div className="flex items-center bg-amber-50 dark:bg-amber-950/40 p-1 rounded-xl border border-amber-300 dark:border-amber-700/60 shadow-xs">
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 dark:text-amber-200 px-2 py-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Super Admin:
              </span>
              <div className="flex items-center gap-0.5">
                {availableGrades.map((gradeNum) => (
                  <button
                    key={gradeNum}
                    type="button"
                    onClick={() => setActiveGrade(gradeNum)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeGrade === gradeNum
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-amber-900 dark:text-amber-200 hover:bg-amber-200/50 dark:hover:bg-amber-900/40'
                    }`}
                    title={`Switch view to Grade ${gradeNum}`}
                  >
                    {t('grade')} {gradeNum}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Student Strictly Locked Grade Badge & VIP Status */
            <div className="flex items-center gap-1.5">
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold shadow-xs"
                title={t('grade_locked_desc')}
              >
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  {t('grade')} {activeGrade}
                </span>
              </div>

              {/* Subscription Status Pill */}
              {status === 'ACTIVE' ? (
                <span
                  title={`ንቁ ወርሃዊ ፈቃድ (${subscription.daysRemaining} ቀናት ቀርተዋል)`}
                  className="hidden md:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px] border border-emerald-300 dark:border-emerald-700"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  VIP ({subscription.daysRemaining}d)
                </span>
              ) : status === 'PENDING' ? (
                <span
                  title="የክፍያ ማረጋገጫ በመጠባበቅ ላይ"
                  className="hidden md:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-[11px] border border-amber-300 dark:border-amber-700 animate-pulse"
                >
                  <Clock className="w-3 h-3 text-amber-600" />
                  Pending
                </span>
              ) : null}
            </div>
          )}

          {/* STRICT REQUIREMENT: LanguageSelectorDropdown on top flex row, always visible on 360px mobile! */}
          <div className="shrink-0">
            <LanguageSelectorDropdown variant="header" />
          </div>

          {/* User Profile / Quick Switcher Trigger */}
          <button
            type="button"
            onClick={onOpenProfileModal}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            title={isSuperAdmin ? 'Super Admin Profile' : 'Student Profile'}
          >
            <div className="relative">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                  isSuperAdmin
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 ring-2 ring-amber-400'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 ring-2 ring-emerald-400'
                }`}
              >
                {currentUser.name.charAt(0)}
              </div>
              {isSuperAdmin && (
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white">
                  ★
                </div>
              )}
            </div>

            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold leading-tight truncate max-w-[110px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                {isSuperAdmin ? (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">Super Admin</span>
                ) : (
                  <span>Grade {activeGrade}</span>
                )}
                <span className="text-amber-500 font-bold">⚡ {currentUser.xp} XP</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

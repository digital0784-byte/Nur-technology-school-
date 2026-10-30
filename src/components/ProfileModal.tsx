import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Shield,
  ShieldCheck,
  User,
  Lock,
  Unlock,
  Award,
  Zap,
  Calendar,
  CheckCircle,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    activeGrade,
    isSuperAdmin,
    isGradeLocked,
    logout,
  } = useAuth();
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header Strip */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm ${
                isSuperAdmin
                  ? 'bg-gradient-to-tr from-amber-600 to-orange-500'
                  : 'bg-gradient-to-tr from-emerald-600 to-teal-600'
              }`}
            >
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                {currentUser.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Role & Grade Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Role & Access
              </span>
              <div className="flex items-center gap-1.5">
                {isSuperAdmin ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                      Super Admin (Master)
                    </span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      Enrolled Student
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Grade Level
              </span>
              <div className="flex items-center gap-1.5">
                {isSuperAdmin ? (
                  <>
                    <Unlock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      All Grades (9-12)
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Grade {activeGrade} (Strictly Locked)
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Grade Immutability Notice for Students */}
          {!isSuperAdmin && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-bold block">የክፍል ደረጃ ተቆልፏል (Grade Immutable):</span>
                አንድ ተጠቃሚ ወደ ሲስተሙ ከተመዘገበ በኋላ ከተመዘገበበት የክፍል ደረጃ በራሱ ፍቃድ መቀየር አይቻልም። መቀየር ከፈለጉ እባክዎ ዋና አስተዳዳሪውን (Nuriye Ahmed Adem - 0910097862) ያነጋግሩ።
              </div>
            </div>
          )}

          {/* Academic Stats */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block mb-2">
              📊 የትምህርት አፈጻጸም / Academic Summary
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/50">
                <span className="text-xs sm:text-sm font-extrabold text-amber-600 dark:text-amber-400 block">
                  ⚡ {currentUser.xp}
                </span>
                <span className="text-[10px] text-slate-500">XP Points</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/50">
                <span className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 block">
                  🔥 {currentUser.streakDays} Days
                </span>
                <span className="text-[10px] text-slate-500">Study Streak</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/50">
                <span className="text-xs sm:text-sm font-extrabold text-indigo-600 dark:text-indigo-400 block">
                  {currentUser.completedLessonsCount}
                </span>
                <span className="text-[10px] text-slate-500">Lessons Done</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              await logout();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold transition-all cursor-pointer"
          >
            ውጣ / Log out
          </button>
        </div>
      </div>
    </div>
  );
};

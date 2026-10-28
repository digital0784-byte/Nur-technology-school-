import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelectorDropdown } from './LanguageSelectorDropdown';
import { GradeLevel } from '../types';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Lock,
} from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const { completeOnboarding, loginAsSuperAdmin } = useAuth();
  const { t } = useLanguage();
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(10);
  const [studentName, setStudentName] = useState('Almaz Tadesse');

  if (!isOpen) return null;

  const grades: { level: GradeLevel; subtitle: string; desc: string }[] = [
    {
      level: 9,
      subtitle: '9ኛ ክፍል (የመጀመሪያ ሁለተኛ ደረጃ)',
      desc: 'Set Theory, Kinematics, Atomic Structure, and Foundational High School Competencies.',
    },
    {
      level: 10,
      subtitle: '10ኛ ክፍል (የብቃት ፈተና ዝግጅት)',
      desc: 'Quadratic Functions, Electromagnetism, Chemical Bonding, and National Assessment focus.',
    },
    {
      level: 11,
      subtitle: '11ኛ ክፍል (ተፈጥሮና ማህበራዊ ሳይንስ)',
      desc: 'Rational Functions, Sequences & Series, Thermodynamics, and Stream-specific tracks.',
    },
    {
      level: 12,
      subtitle: '12ኛ ክፍል (የዩኒቨርስቲ መግቢያ ፈተና - EUEE)',
      desc: 'Calculus, Modern Physics, Entrance Examination Strategy, and University Exit Prep.',
    },
  ];

  const handleEnterAsStudent = () => {
    completeOnboarding(selectedGrade, studentName);
    onClose();
  };

  const handleEnterAsSuperAdmin = () => {
    loginAsSuperAdmin();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Banner with Ethiopian Colors */}
        <div className="h-3 bg-gradient-to-r from-emerald-600 via-amber-500 to-red-600" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header & Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 mb-1">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('welcome_title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              {t('welcome_sub')}
            </p>
          </div>

          {/* Place 1 of 2 Authorized Language Selector Placements */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t('choose_language_to_start')}
            </label>
            <LanguageSelectorDropdown variant="modal" />
          </div>

          {/* Student Name Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              የተማሪ ስም / Student Full Name:
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Almaz Tadesse"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Grade Level Selection with Strict Lock Explanation */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t('choose_grade_to_start')}
              </label>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                {t('selected_grade')}: Grade {selectedGrade}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {grades.map((g) => {
                const isSelected = selectedGrade === g.level;
                return (
                  <button
                    key={g.level}
                    type="button"
                    onClick={() => setSelectedGrade(g.level)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        Grade {g.level} / {g.level}ኛ ክፍል
                      </span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {g.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Strict Lock Warning Notice */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{t('strict_lock_warning')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleEnterAsStudent}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              {t('confirm_and_enter')} (Grade {selectedGrade})
            </button>

            <button
              type="button"
              onClick={handleEnterAsSuperAdmin}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              {t('login_as_super_admin')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

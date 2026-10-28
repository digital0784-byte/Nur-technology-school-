import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ModuleId } from '../../types';
import { Home, BookOpen, Bot, Award, Camera } from 'lucide-react';

interface StudentPortalDashboardProps {
  onNavigateModule: (mod: ModuleId) => void;
}

export const StudentPortalDashboard: React.FC<StudentPortalDashboardProps> = ({ onNavigateModule }) => {
  const { currentUser, activeGrade } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase mb-2">
              <Home className="w-3.5 h-3.5" />
              {t('student_portal')} • Grade {activeGrade}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              እንኳን ደህና መጣህ፣ {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-lg">
              የኢ.ፌ.ዲ.ሪ የትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት (2019 ዓ.ም) የመማሪያ መግቢያ።
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
            <div className="text-xs font-bold text-slate-900 dark:text-white">ትምህርት ቀጥል</div>
            <div className="text-[10px] text-slate-400">Lessons & Units</div>
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
            <div className="text-xs font-bold text-slate-900 dark:text-white">ኑር ኤአይ ጠይቅ</div>
            <div className="text-[10px] text-slate-400">Socratic Tutor</div>
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
            <div className="text-xs font-bold text-slate-900 dark:text-white">ፈተና ውሰድ</div>
            <div className="text-[10px] text-slate-400">Timed Quizzes</div>
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
            <div className="text-xs font-bold text-slate-900 dark:text-white">ፎቶ ጥያቄ ፍታ</div>
            <div className="text-[10px] text-slate-400">OCR Solver</div>
          </div>
        </button>
      </div>
    </div>
  );
};

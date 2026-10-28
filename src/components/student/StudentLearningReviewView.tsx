import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LineChart, TrendingUp, Clock } from 'lucide-react';

export const StudentLearningReviewView: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 to-purple-950 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-700 text-[11px] font-bold uppercase mb-1">
          <LineChart className="w-3.5 h-3.5" />
          {t('mod_student_review')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_student_review')}</h1>
        <p className="text-xs sm:text-sm text-indigo-100">{t('mod_student_review_sub')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            የትምህርት ብቃት ጥንካሬዎች (Top Strengths)
          </h3>
          <div className="space-y-2">
            {[
              { subject: 'Mathematics (Sets & Equations)', score: 94 },
              { subject: 'Physics (Newtonian Mechanics)', score: 88 },
              { subject: 'English (Grammar & Comprehension)', score: 91 },
            ].map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{s.subject}</span>
                  <span className="text-emerald-600 font-bold">{s.score}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            መከለስ ያለባቸው ነጥቦች (Recommended Focus Units)
          </h3>
          <div className="space-y-2">
            {[
              { subject: 'Physics (Carnot Heat Cycles)', score: 62 },
              { subject: 'Chemistry (Chemical Energetics)', score: 68 },
            ].map((w, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{w.subject}</span>
                  <span className="text-amber-600 font-bold">{w.score}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${w.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

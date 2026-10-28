import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SAMPLE_ENTRANCE_EXAM_QUESTIONS } from '../../data/curriculum';
import { Target, CheckCircle2, Clock } from 'lucide-react';

export const ObjectivesExamView: React.FC = () => {
  const { activeGrade, updateUserXP } = useAuth();
  const { t } = useLanguage();
  const [selectedAns, setSelectedAns] = useState<number | null>(null);

  const q = SAMPLE_ENTRANCE_EXAM_QUESTIONS[0];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700 text-[11px] font-bold uppercase mb-1">
          <Target className="w-3.5 h-3.5" />
          {t('mod_objectives_exam')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_objectives_exam')}</h1>
        <p className="text-xs sm:text-sm text-emerald-100">{t('mod_objectives_exam_sub')}</p>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3 text-xs text-slate-500">
          <span className="font-bold text-emerald-600">Unit 1 Competency Assessment</span>
          <span>Grade {activeGrade}</span>
        </div>
        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{q.question}</h3>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setSelectedAns(i);
                if (i === q.correctIndex) updateUserXP(50);
              }}
              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                selectedAns === i ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 font-bold' : 'hover:border-emerald-400'
              }`}
            >
              <span>{opt}</span>
              {selectedAns === i && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

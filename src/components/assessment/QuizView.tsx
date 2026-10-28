import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SAMPLE_ENTRANCE_EXAM_QUESTIONS } from '../../data/curriculum';
import { HelpCircle, Clock, CheckCircle2 } from 'lucide-react';

export const QuizView: React.FC = () => {
  const { updateUserXP } = useAuth();
  const { t } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const questions = SAMPLE_ENTRANCE_EXAM_QUESTIONS;
  const q = questions[currentIdx] || questions[0];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700 text-[11px] font-bold uppercase mb-1">
          <HelpCircle className="w-3.5 h-3.5" />
          {t('mod_quiz')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_quiz')}</h1>
        <p className="text-xs sm:text-sm text-emerald-100">{t('mod_quiz_sub')}</p>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-3 text-xs">
          <span className="font-bold text-emerald-600 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            ጥያቄ {currentIdx + 1} ከ {questions.length}
          </span>
          <span className="font-mono text-amber-500 font-bold">+50 XP</span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          {q.question}
        </h3>

        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              disabled={selected !== null}
              onClick={() => {
                setSelected(i);
                if (i === q.correctIndex) updateUserXP(50);
              }}
              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                selected === null
                  ? 'hover:border-emerald-500'
                  : i === q.correctIndex
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 font-bold text-emerald-900 dark:text-emerald-200'
                  : selected === i
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 font-bold text-rose-900'
                  : 'opacity-50'
              }`}
            >
              <span>{opt}</span>
              {selected !== null && i === q.correctIndex && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </button>
          ))}
        </div>

        {selected !== null && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                if (currentIdx < questions.length - 1) {
                  setCurrentIdx((c) => c + 1);
                  setSelected(null);
                } else {
                  setCurrentIdx(0);
                  setSelected(null);
                }
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              {currentIdx < questions.length - 1 ? t('next') + ' ▶' : 'እንደገና ጀምር / Restart'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

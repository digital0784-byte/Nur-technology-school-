import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SAMPLE_ENTRANCE_EXAM_QUESTIONS } from '../../data/curriculum';
import { FileCheck2, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

export const AIQuizExamEngineView: React.FC = () => {
  const { activeGrade, updateUserXP } = useAuth();
  const { t } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExp, setShowExp] = useState(false);
  const [score, setScore] = useState(0);

  const questions = SAMPLE_ENTRANCE_EXAM_QUESTIONS;
  const q = questions[currentIdx] || questions[0];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExp(true);
    if (idx === q.correctIndex) {
      setScore((s) => s + 1);
      updateUserXP(50);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-700 text-[11px] font-bold uppercase mb-1">
          <FileCheck2 className="w-3.5 h-3.5" />
          {t('mod_assessment_engine')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_assessment_engine')}</h1>
        <p className="text-xs sm:text-sm text-blue-100">{t('mod_assessment_engine_sub')}</p>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-xs font-bold text-blue-600">
            Diagnostic Probe {currentIdx + 1} of {questions.length}
          </span>
          <span className="text-xs font-mono text-slate-400">Score: {score} Correct</span>
        </div>

        <h2 className="text-base font-bold text-slate-900 dark:text-white">{q.question}</h2>

        <div className="space-y-2.5">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex;
            const isChosen = selected === i;

            let style = 'border-slate-200 dark:border-slate-800 hover:border-blue-400';
            if (selected !== null) {
              if (isCorrect) style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold';
              else if (isChosen) style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 font-bold';
            }

            return (
              <button
                key={i}
                type="button"
                disabled={selected !== null}
                onClick={() => handleSelect(i)}
                className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
              >
                <span>{opt}</span>
                {selected !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {selected !== null && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
              </button>
            );
          })}
        </div>

        {showExp && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
            💡 {q.explanation}
          </div>
        )}

        {selected !== null && currentIdx < questions.length - 1 && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setCurrentIdx((i) => i + 1);
                setSelected(null);
                setShowExp(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
            >
              {t('next')} ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

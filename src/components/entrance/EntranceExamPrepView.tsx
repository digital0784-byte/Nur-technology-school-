import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SAMPLE_ENTRANCE_EXAM_QUESTIONS } from '../../data/curriculum';
import { GraduationCap, Award, CheckCircle2, XCircle } from 'lucide-react';

export const EntranceExamPrepView: React.FC = () => {
  const { activeGrade, updateUserXP } = useAuth();
  const { t } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const questions = SAMPLE_ENTRANCE_EXAM_QUESTIONS;
  const q = questions[currentIdx] || questions[0];

  const handleSelect = (idx: number) => {
    if (selectedAns !== null) return;
    setSelectedAns(idx);
    if (idx === q.correctIndex) {
      setScore((s) => s + 1);
      updateUserXP(60);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-700 via-amber-800 to-orange-900 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-600 text-[11px] font-bold uppercase mb-1">
          <GraduationCap className="w-3.5 h-3.5" />
          {t('mod_entrance_prep')} • EUEE National Prep
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_entrance_prep')}</h1>
        <p className="text-xs sm:text-sm text-amber-100">{t('mod_entrance_prep_sub')}</p>
      </div>

      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs text-amber-950 dark:text-amber-200">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600 shrink-0" />
          <span>የኢትዮጵያ ዩኒቨርስቲ መግቢያ ፈተና (EUEE) ዝግጅት ሞዴል ባንክ።</span>
        </div>
        <span className="font-bold text-[11px] px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
          Grade {activeGrade}
        </span>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-3 text-xs">
          <span className="font-bold text-amber-600">
            EUEE Question {currentIdx + 1} of {questions.length}
          </span>
          <span className="font-mono text-slate-400">Score: {score}</span>
        </div>

        <div className="space-y-2">
          <span className="text-[11px] px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
            {q.topicRef}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {q.question}
          </h2>
        </div>

        <div className="space-y-2.5">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex;
            const isChosen = selectedAns === i;

            let style = 'border-slate-200 dark:border-slate-800 hover:border-amber-400';
            if (selectedAns !== null) {
              if (isCorrect) style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold';
              else if (isChosen) style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 font-bold';
            }

            return (
              <button
                key={i}
                type="button"
                disabled={selectedAns !== null}
                onClick={() => handleSelect(i)}
                className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
              >
                <span>{opt}</span>
                {selectedAns !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {selectedAns !== null && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
              </button>
            );
          })}
        </div>

        {selectedAns !== null && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
              💡 {q.explanation}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (currentIdx < questions.length - 1) {
                    setCurrentIdx((c) => c + 1);
                    setSelectedAns(null);
                  } else {
                    setCurrentIdx(0);
                    setSelectedAns(null);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
              >
                {currentIdx < questions.length - 1 ? t('next') + ' ▶' : 'ድጋሚ ጀምር / Restart'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

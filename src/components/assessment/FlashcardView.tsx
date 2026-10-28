import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SAMPLE_FLASHCARDS } from '../../data/curriculum';
import { Layers, RotateCw } from 'lucide-react';

export const FlashcardView: React.FC = () => {
  const { updateUserXP } = useAuth();
  const { t } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const card = SAMPLE_FLASHCARDS[currentIdx % SAMPLE_FLASHCARDS.length];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-900 to-indigo-950 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-700 text-[11px] font-bold uppercase mb-1">
          <Layers className="w-3.5 h-3.5" />
          {t('mod_flashcards')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_flashcards')}</h1>
        <p className="text-xs sm:text-sm text-violet-100">{t('mod_flashcards_sub')}</p>
      </div>

      <div className="max-w-xl mx-auto space-y-4">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="cursor-pointer min-h-[260px] p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-violet-300 dark:border-violet-800 shadow-md flex flex-col justify-between transition-transform hover:scale-[1.01]"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase text-violet-600 dark:text-violet-400">
              {card.subject} • Grade {card.grade}
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <RotateCw className="w-3.5 h-3.5" /> ጠቅ ያድርጉ (Tap to Flip)
            </span>
          </div>

          <div className="py-6 text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isFlipped ? '✅ መልስ / Answer' : '❓ ጥያቄ / Question'}
            </span>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {isFlipped ? card.back : card.front}
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-400">
            Card {((currentIdx % SAMPLE_FLASHCARDS.length) + 1)} of {SAMPLE_FLASHCARDS.length}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setCurrentIdx((c) => c + 1);
              setIsFlipped(false);
              updateUserXP(10);
            }}
            className="py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold text-xs"
          >
            ከባድ (Hard)
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentIdx((c) => c + 1);
              setIsFlipped(false);
              updateUserXP(25);
            }}
            className="py-2.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold text-xs"
          >
            መካከለኛ (Good)
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentIdx((c) => c + 1);
              setIsFlipped(false);
              updateUserXP(40);
            }}
            className="py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs"
          >
            ቀላል (Easy)
          </button>
        </div>
      </div>
    </div>
  );
};

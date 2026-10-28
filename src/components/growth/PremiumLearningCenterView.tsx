import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles } from 'lucide-react';

export const PremiumLearningCenterView: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-700 text-[11px] font-bold uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          {t('mod_premium_learning_center')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_premium_learning_center')}</h1>
        <p className="text-xs sm:text-sm text-purple-100">{t('mod_premium_learning_center_sub')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
            🧪
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            3D Interactive Virtual Science Labs
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Perform hazardous chemical titrations and physics optical experiments virtually without laboratory resource constraints.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
            🎓
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            University Entrance Exam Masterclass Bootcamp
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Curated crash course series by top Ethiopian national examiners breaking down high-frequency entrance exam trap questions.
          </p>
        </div>
      </div>
    </div>
  );
};

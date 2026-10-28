import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getCurriculumByGrade } from '../../data/curriculum';
import { GitFork } from 'lucide-react';

export const EthiopianCurriculumEngineView: React.FC = () => {
  const { activeGrade } = useAuth();
  const { t, language } = useLanguage();
  const subjects = getCurriculumByGrade(activeGrade);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-800 to-emerald-900 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-700 text-[11px] font-bold uppercase mb-1">
          <GitFork className="w-3.5 h-3.5" />
          {t('mod_curriculum_engine')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_curriculum_engine')}</h1>
        <p className="text-xs sm:text-sm text-teal-100">{t('mod_curriculum_engine_sub')}</p>
      </div>

      <div className="space-y-4">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                  {sub.code}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {sub.name[language] || sub.name.en}
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Grade {sub.grade} • MoE Standard Core
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-lg">
                {sub.units.length} Units Total
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sub.units.map((unit) => (
                <div
                  key={unit.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5"
                >
                  <div className="text-[11px] font-bold text-emerald-600">
                    Unit {unit.unitNumber}: {unit.title}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{unit.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {unit.topics.map((top) => (
                      <span
                        key={top.id}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {top.title}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

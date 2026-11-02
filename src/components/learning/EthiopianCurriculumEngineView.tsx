import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getCurriculumByGrade } from '../../data/curriculum';
import { GitFork, Sparkles, BookOpen, Calculator } from 'lucide-react';
import { SubTopicDeepDiveModal, SubTopicItem } from './SubTopicDeepDiveModal';

export const EthiopianCurriculumEngineView: React.FC = () => {
  const { activeGrade } = useAuth();
  const { t, language } = useLanguage();
  const subjects = getCurriculumByGrade(activeGrade);

  const [deepDiveData, setDeepDiveData] = useState<{
    subjectName: string;
    subjectCode: string;
    grade: number;
    unitTitle: string;
    unitNumber: number;
    topic: SubTopicItem;
  } | null>(null);

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

      {/* Feature Highlight Banner: Sub-topic Explanation & Worked Examples */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-emerald-950 dark:text-emerald-100">
              ለሁሉም ንዑስ ርዕሶች የተሟላ ትንታኔ እና ምሳሌዎች (Detailed Explanation & Worked Examples)
            </h4>
            <p className="text-[11px] sm:text-xs text-emerald-800 dark:text-emerald-300">
              ማንኛውንም ንዑስ ርዕስ (Sub-topic) በመጫን ዝርዝር የፅንሰ-ሀሳብ ማብራሪያ፣ ቁልፍ ቃላት፣ እና ደረጃ በደረጃ የተሰሩ ስሌቶችን ወዲያውኑ ማግኘት ይችላሉ።
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
          <Calculator className="w-3.5 h-3.5 text-emerald-600" />
          ደረጃ በደረጃ ስሌት
        </div>
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
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                >
                  <div className="text-[11px] font-bold text-emerald-600">
                    Unit {unit.unitNumber}: {unit.title}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{unit.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {unit.topics.map((top) => (
                      <button
                        key={top.id}
                        type="button"
                        onClick={() =>
                          setDeepDiveData({
                            subjectName: sub.name[language] || sub.name.en,
                            subjectCode: sub.code,
                            grade: sub.grade,
                            unitTitle: unit.title,
                            unitNumber: unit.unitNumber,
                            topic: {
                              id: top.id,
                              title: top.title,
                              pageReference: top.pageReference,
                              competencyObjectives: top.competencyObjectives,
                              estimatedStudyMinutes: top.estimatedStudyMinutes,
                              summary: top.summary,
                              content: top.content,
                            },
                          })
                        }
                        className="group inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all cursor-pointer text-left"
                        title="ትንታኔ እና ምሳሌዎችን ክፈት"
                      >
                        <span className="truncate max-w-[220px]">{top.title}</span>
                        <Sparkles className="w-2.5 h-2.5 text-emerald-500 opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-transform shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sub-Topic Deep-Dive Modal with Full Explanation & Worked Examples */}
      <SubTopicDeepDiveModal
        isOpen={!!deepDiveData}
        onClose={() => setDeepDiveData(null)}
        subjectName={deepDiveData?.subjectName || ''}
        subjectCode={deepDiveData?.subjectCode || ''}
        grade={deepDiveData?.grade || activeGrade}
        unitTitle={deepDiveData?.unitTitle || ''}
        unitNumber={deepDiveData?.unitNumber || 1}
        topic={deepDiveData?.topic || null}
      />
    </div>
  );
};

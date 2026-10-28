import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getCurriculumByGrade } from '../../data/curriculum';
import { CurriculumTopic } from '../../types';
import { BookOpen, CheckCircle, Sparkles, ChevronDown, ChevronRight } from 'lucide-react';

interface LessonViewProps {
  onAskAi?: (context: { subject: string; topic: string }) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ onAskAi }) => {
  const { activeGrade, markLessonCompleted, completedLessons } = useAuth();
  const { t, language } = useLanguage();

  const subjects = getCurriculumByGrade(activeGrade);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const [selectedTopic, setSelectedTopic] = useState<CurriculumTopic | null>(
    activeSubject?.units[0]?.topics[0] || null
  );

  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    [activeSubject?.units[0]?.id || '']: true,
  });

  const toggleUnit = (uId: string) => {
    setExpandedUnits((prev) => ({ ...prev, [uId]: !prev[uId] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-[11px] font-bold tracking-wider uppercase mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            {t('mod_lesson')} • Grade {activeGrade}
          </div>
          <h1 className="text-xl sm:text-2xl font-black">{t('mod_lesson')}</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90">{t('mod_lesson_sub')}</p>
        </div>
        {selectedTopic && onAskAi && (
          <button
            type="button"
            onClick={() =>
              onAskAi({
                subject: activeSubject?.name[language] || activeSubject?.name.en,
                topic: selectedTopic.title,
              })
            }
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-center"
          >
            <Sparkles className="w-4 h-4" />
            {t('ask_ai')}
          </button>
        )}
      </div>

      {/* Subject Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {subjects.map((sub) => {
          const isSelected = sub.id === selectedSubjectId;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => {
                setSelectedSubjectId(sub.id);
                setSelectedTopic(sub.units[0]?.topics[0] || null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-400'
              }`}
            >
              <span>{sub.name[language] || sub.name.en}</span>
              <span className="text-[10px] opacity-75 font-mono">({sub.units.length} U)</span>
            </button>
          );
        })}
      </div>

      {/* 2-Column Units & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t('units')} ({activeSubject?.units.length || 0})
          </h3>
          <div className="space-y-2">
            {activeSubject?.units.map((unit) => (
              <div
                key={unit.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleUnit(unit.id)}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div>
                    <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      Unit {unit.unitNumber}
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {unit.title}
                    </div>
                  </div>
                  {expandedUnits[unit.id] ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {expandedUnits[unit.id] && (
                  <div className="p-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 space-y-1">
                    {unit.topics.map((tItem) => {
                      const isCurrent = selectedTopic?.id === tItem.id;
                      const isDone = completedLessons.includes(tItem.id);
                      return (
                        <button
                          key={tItem.id}
                          type="button"
                          onClick={() => setSelectedTopic(tItem)}
                          className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between gap-2 ${
                            isCurrent
                              ? 'bg-emerald-600 text-white font-bold shadow-xs'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="truncate">{tItem.title}</span>
                          {isDone && (
                            <CheckCircle
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isCurrent ? 'text-emerald-200' : 'text-emerald-500'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8">
          {selectedTopic ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                    {selectedTopic.pageReference}
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                    {selectedTopic.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {completedLessons.includes(selectedTopic.id) ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {t('completed')}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => markLessonCompleted(selectedTopic.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      ተማርኩ / Mark Done (+100 XP)
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-2">
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                  🎯 የመማር ብቃት ግቦች / Competency Objectives:
                </h4>
                <ul className="space-y-1.5">
                  {selectedTopic.competencyObjectives.map((obj, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  የፅንሰ-ሀሳብ ማብራሪያ / Concept Summary
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedTopic.summary}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedTopic.content}
                </p>
              </div>

              {selectedTopic.ethiopianExample && (
                <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    🇪🇹 ከኢትዮጵያ ነባራዊ ሁኔታ ጋር ያለው ትስስር (Ethiopian Case Study):
                  </span>
                  <p className="text-xs text-emerald-950 dark:text-emerald-100">
                    {selectedTopic.ethiopianExample}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 border border-dashed rounded-3xl">
              ትምህርት ይምረጡ / Please select a topic to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

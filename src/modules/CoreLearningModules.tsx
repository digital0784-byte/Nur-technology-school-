import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CurriculumSubject, CurriculumTopic, CurriculumUnit, ModuleId } from '../types';
import { getCurriculumByGrade } from '../data/curriculum';
import {
  BookOpen,
  CheckCircle,
  GitFork,
  FileText,
  BookmarkCheck,
  Video,
  Play,
  Download,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Bot,
  Search,
} from 'lucide-react';

interface CoreLearningProps {
  moduleId: ModuleId;
  onNavigateToAiTutor?: (context: { subject: string; topic: string }) => void;
}

export const CoreLearningModules: React.FC<CoreLearningProps> = ({
  moduleId,
  onNavigateToAiTutor,
}) => {
  const { activeGrade, markLessonCompleted, completedLessons } = useAuth();
  const { t, language } = useLanguage();

  const subjects = getCurriculumByGrade(activeGrade);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const [selectedTopic, setSelectedTopic] = useState<CurriculumTopic | null>(
    activeSubject?.units[0]?.topics[0] || null
  );

  // Expanded units in curriculum tree
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    [activeSubject?.units[0]?.id || '']: true,
  });

  // DRM PDF Reader State
  const [pdfPage, setPdfPage] = useState(1);
  const totalPages = 42;

  // Video Learning state
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeVideoTopic, setActiveVideoTopic] = useState('Kinematics and Vectors (2D Animation)');

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  // --- 1. LESSON MODULE ---
  if (moduleId === 'lesson') {
    return (
      <div className="space-y-6">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-md">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-[11px] font-bold tracking-wider uppercase mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              {t('mod_lesson')} • Grade {activeGrade}
            </div>
            <h1 className="text-xl sm:text-2xl font-black">{t('mod_lesson')}</h1>
            <p className="text-xs sm:text-sm text-emerald-100/90">{t('mod_lesson_sub')}</p>
          </div>
          {selectedTopic && onNavigateToAiTutor && (
            <button
              type="button"
              onClick={() =>
                onNavigateToAiTutor({
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

        {/* Two-Column Layout: Units List & Topic Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Units & Topics */}
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

          {/* Right Column: Topic Deep-Dive Content */}
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

                {/* Competency Objectives Box */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-2">
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                    🎯 የመማር ብቃት ግቦች / MoE Competency Objectives:
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

                {/* Main Content Body */}
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

                {/* Ethiopian Context Real-World Grounding */}
                {selectedTopic.ethiopianExample && (
                  <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
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
  }

  // --- 2. CURRICULUM TREE ENGINE MODULE ---
  if (moduleId === 'curriculum_engine') {
    return (
      <div className="space-y-6">
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
  }

  // --- 3. TEXTBOOK (DRM PROTECTED PDF VIEWER) ---
  if (moduleId === 'textbook') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-emerald-950 text-white shadow-md">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-[11px] font-bold uppercase mb-1">
              <FileText className="w-3.5 h-3.5" />
              {t('mod_textbook')}
            </div>
            <h1 className="text-xl sm:text-2xl font-black">{t('mod_textbook')}</h1>
            <p className="text-xs sm:text-sm text-slate-300">{t('mod_textbook_sub')}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-300 bg-amber-950/60 border border-amber-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              DRM Active
            </span>
          </div>
        </div>

        {/* PDF Reader Container with Anti-Copy DRM Watermark */}
        <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
          {/* DRM Watermark Overlay */}
          <div className="drm-watermark-overlay flex items-center justify-center">
            <div className="text-slate-400/20 dark:text-slate-600/20 font-black text-2xl sm:text-4xl -rotate-12 select-none pointer-events-none uppercase tracking-widest text-center">
              FDRE Ministry of Education • Grade {activeGrade}
              <br />
              {t('drm_watermark_text')}
            </div>
          </div>

          {/* Reader Top Bar */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900 text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200">
              {activeSubject?.name[language] || activeSubject?.name.en} • Grade {activeGrade} Official Student Textbook
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pdfPage <= 1}
                onClick={() => setPdfPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded-lg border bg-white dark:bg-slate-800 disabled:opacity-40"
              >
                ◀ {t('previous')}
              </button>
              <span className="font-mono text-xs">
                Page {pdfPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={pdfPage >= totalPages}
                onClick={() => setPdfPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded-lg border bg-white dark:bg-slate-800 disabled:opacity-40"
              >
                {t('next')} ▶
              </button>
            </div>
          </div>

          {/* Simulated High-Fidelity Textbook Page */}
          <div className="p-8 sm:p-12 min-h-[460px] flex flex-col justify-between select-none">
            <div className="space-y-5">
              <div className="border-b-2 border-emerald-600 pb-2 flex justify-between items-baseline">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                  Federal Democratic Republic of Ethiopia • Ministry of Education
                </span>
                <span className="text-xs font-mono text-slate-400">Unit 1 • Section {pdfPage}</span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {activeSubject?.units[0]?.topics[0]?.title || 'Foundational Competency'}
              </h2>

              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-4">
                <p>
                  This curriculum textbook is prepared and published under the guidelines of the Ministry of Education (MoE) New Curriculum framework (2019 E.C. / 2026). It contains all mandatory competency standards, review exercises, and national examination prep problems for Ethiopian secondary students.
                </p>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200">
                  THEOREM 1.4 (Competency Standard):
                  <br />
                  Let S be a universal set representing national agricultural outputs. Every subset A ⊆ S satisfies:
                  <br />
                  A ∪ A' = S and A ∩ A' = ∅.
                </div>
                <p>
                  Review question: Identify the cardinality of agricultural zones categorized under Kolla, Weyna Dega, and Dega in southern rift regions.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
              <span>Ethiopian MoE Curriculum • 2019 E.C.</span>
              <span className="font-bold">Page {pdfPage}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 4. SUPPLEMENTARY LIBRARY ---
  if (moduleId === 'supplementary') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-700 text-[11px] font-bold uppercase mb-1">
            <BookmarkCheck className="w-3.5 h-3.5" />
            {t('mod_supplementary')}
          </div>
          <h1 className="text-xl sm:text-2xl font-black">{t('mod_supplementary')}</h1>
          <p className="text-xs sm:text-sm text-indigo-100">{t('mod_supplementary_sub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Ethiopian High School Formula Handbook',
              category: 'STEM Quick Reference',
              pages: '128 Pages',
              desc: 'Complete collection of Mathematics, Physics, and Chemistry formulas for Grades 9-12.',
            },
            {
              title: 'MoE Model Exam Solution Manual (2019 E.C.)',
              category: 'National Exam Bank',
              pages: '240 Pages',
              desc: 'Detailed step-by-step solutions with examiner commentary for chapter objectives.',
            },
            {
              title: 'STEM Laboratory Experiment Manual',
              category: 'Practical Skills',
              pages: '96 Pages',
              desc: 'Safety guidelines, chemical reagent reactions, and physics vernier measurement setups.',
            },
            {
              title: 'English Language Competency & Writing Guide',
              category: 'Humanities',
              pages: '112 Pages',
              desc: 'Grammar mastery, essay composition, and reading comprehension techniques.',
            },
          ].map((book, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  {book.category}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1.5">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{book.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 font-mono text-[11px]">{book.pages}</span>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  {t('download_pdf')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- 5. VIDEO LEARNING (HD & ANIMATIONS) ---
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-900 to-amber-900 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-700 text-[11px] font-bold uppercase mb-1">
          <Video className="w-3.5 h-3.5" />
          {t('mod_video_learning')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_video_learning')}</h1>
        <p className="text-xs sm:text-sm text-rose-100">{t('mod_video_learning_sub')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Video Player Display */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative aspect-video rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shadow-xl">
            {isPlayingVideo ? (
              <div className="p-6 text-center text-white space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-600 animate-pulse mx-auto flex items-center justify-center">
                  <Play className="w-6 h-6 fill-white" />
                </div>
                <h3 className="font-bold text-base">{activeVideoTopic}</h3>
                <p className="text-xs text-slate-400">
                  Streaming HD 1080p • Ethiopian MoE Certified Instructor Commentary
                </p>
                <button
                  type="button"
                  onClick={() => setIsPlayingVideo(false)}
                  className="px-4 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-semibold"
                >
                  Pause Video
                </button>
              </div>
            ) : (
              <div className="p-6 text-center text-white space-y-3">
                <button
                  type="button"
                  onClick={() => setIsPlayingVideo(true)}
                  className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center shadow-lg transition-transform hover:scale-105 mx-auto"
                >
                  <Play className="w-8 h-8 fill-white ml-1" />
                </button>
                <div className="font-bold text-sm sm:text-base">{activeVideoTopic}</div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Grade {activeGrade} HD Animation Video
                </span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {activeVideoTopic}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Visualizing abstract equations using 3D simulations. Concepts covered include acceleration vectors, free-body resolution on inclined planes, and practical Ethiopian engineering case studies.
            </p>
          </div>
        </div>

        {/* Video Playlist */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recommended Video Lessons
          </h3>
          <div className="space-y-2">
            {[
              {
                title: 'Kinematics & Projectiles (2D Animation)',
                duration: '14:20 min',
                instructor: 'Dr. Bekele M.',
              },
              {
                title: 'Chemical Reactions & Stoichiometry',
                duration: '18:45 min',
                instructor: 'Teacher Senait K.',
              },
              {
                title: 'Limits & Calculus in 3D Motion',
                duration: '22:10 min',
                instructor: 'Prof. Ahmed Adem',
              },
              {
                title: 'Electromagnetism & Hydroelectric Turbines',
                duration: '16:05 min',
                instructor: 'Eng. Solomon T.',
              },
            ].map((vid, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveVideoTopic(vid.title);
                  setIsPlayingVideo(true);
                }}
                className="w-full p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-all flex items-center gap-3 shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {vid.title}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between mt-0.5">
                    <span>{vid.instructor}</span>
                    <span className="font-mono">{vid.duration}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

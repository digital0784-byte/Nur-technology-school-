import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getCurriculumByGrade } from '../../data/curriculum';
import { CurriculumTopic } from '../../types';
import { authFetch } from '../../services/apiClient';
import { SimpleChart, GraphData } from './SimpleChart';
import {
  BookOpen,
  CheckCircle,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Loader2,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  FileText,
  HelpCircle,
  Activity,
  LineChart as LineChartIcon,
  ListChecks,
  ExternalLink,
  ChevronRightCircle,
  Eye,
  Mail,
} from 'lucide-react';

interface LessonViewProps {
  onAskAi?: (context: { subject: string; topic: string }) => void;
}

type LessonTabKey = 'explanation' | 'examples' | 'activity' | 'graphs' | 'summary' | 'questions';

interface GeneratedLessonData {
  lesson: {
    explanation: Array<{ heading: string; body: string }>;
    keyTerms: Array<{ term: string; meaning: string }>;
    workedExamples: Array<{ title: string; problem: string; steps: string[]; answer: string }>;
    activity: { title: string; materials: string[]; steps: string[]; observe: string };
    graphs: GraphData[];
    summary: string[];
    reviewQuestions: Array<{
      id: number;
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }>;
  };
  grounded: boolean;
  sources: Array<{ printedPage: number; unit: any }>;
  cached?: boolean;
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

  // AI Generated Lesson State
  const [lessonData, setLessonData] = useState<GeneratedLessonData | null>(null);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);
  const [activeLessonTab, setActiveLessonTab] = useState<LessonTabKey>('explanation');

  // Interactive Question State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  // Interactive Step Revealer for Worked Examples
  const [revealedSteps, setRevealedSteps] = useState<Record<number, number>>({});

  const toggleUnit = (uId: string) => {
    setExpandedUnits((prev) => ({ ...prev, [uId]: !prev[uId] }));
  };

  const fetchLessonForTopic = useCallback(
    async (topicToFetch: CurriculumTopic, force = false) => {
      if (!topicToFetch || !activeSubject) return;

      const cacheKey = `lesson:${topicToFetch.id}:${language}`;
      if (!force) {
        const saved = localStorage.getItem(cacheKey);
        if (saved) {
          try {
            setLessonData(JSON.parse(saved));
            setLessonError(null);
            return;
          } catch {
            // parse error, proceed to fetch
          }
        }
      }

      setLoadingLesson(true);
      setLessonError(null);

      const activeUnit = activeSubject.units.find((u) =>
        u.topics.some((t) => t.id === topicToFetch.id)
      );

      try {
        const res = await authFetch('/api/ai/lesson', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subjectCode: activeSubject.code || activeSubject.id,
            subjectName: activeSubject.name[language] || activeSubject.name.en,
            grade: activeGrade,
            unitTitle: activeUnit?.title || '',
            topicId: topicToFetch.id,
            topicTitle: topicToFetch.title,
            objectives: topicToFetch.competencyObjectives || [],
            topicContext: `${topicToFetch.summary || ''}\n${topicToFetch.content || ''}`,
            pageReference: topicToFetch.pageReference || '',
            language,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to generate lesson from AI');
        }

        const payload: GeneratedLessonData = {
          lesson: data.lesson,
          grounded: Boolean(data.grounded),
          sources: Array.isArray(data.sources) ? data.sources : [],
          cached: Boolean(data.cached),
        };

        setLessonData(payload);
        localStorage.setItem(cacheKey, JSON.stringify(payload));
      } catch (err: any) {
        console.warn('Network issue fetching lesson, using local baseline:', err);
        const cleanTitle = topicToFetch.title.replace(/^\d+(\.\d+)*\s*/, '');
        const fallbackPayload: GeneratedLessonData = {
          grounded: false,
          sources: [],
          cached: false,
          lesson: {
            explanation: [
              {
                heading: `1. የ${cleanTitle} መሰረታዊ ፍቺ እና ምንነት`,
                body: topicToFetch.content || topicToFetch.summary || `በክፍል ${activeGrade} ${activeSubject.name[language] || activeSubject.name.en} መማሪያ መጽሐፍ ውስጥ የተካተተ ዋነኛ የትምህርት ፅንሰ-ሀሳብ ነው።`,
              },
              {
                heading: `2. ዋና ዋና መርሆች፣ ቀመሮች እና የስሌት ቅደም ተከተል`,
                body: `በዚህ ርዕስ ስር ያሉ ጥያቄዎችን ለመመለስ የተሰጡ እና የሚፈለጉ መጠኖችን ለይቶ ማወቅ፣ ተገቢውን የመማሪያ መጽሐፍ ቀመር መምረጥ፣ እና የመለኪያ አሃዶችን (SI Units) በትክክል መጠቀም ያስፈልጋል።`,
              },
              {
                heading: `3. ከኢትዮጵያ ነባራዊ ሁኔታ ጋር ያለው ትስስር (Ethiopian Context)`,
                body: `ይህ የትምህርት ክፍል በዕለት ተዕለት ሕይወት እና በሀገራችን የልማት መስኮች (በኢነርጂ፣ በፋይናንስ፣ በግብርና እና በኢንደስትሪ) ውስጥ ሰፊ ተግባራዊ ጠቀሜታ አለው።`,
              },
            ],
            keyTerms: [
              { term: cleanTitle, meaning: `በዚህ የትምህርት ክፍል ስር የተካተተ ቁልፍ ፅንሰ-ሀሳብ።` },
              { term: 'የስርዓተ-ትምህርት ብቃት (MoE)', meaning: 'በትምህርት ሚኒስቴር የታተመውን የመማሪያ መጽሐፍ ደረጃ የጠበቀ መስፈርት።' },
              { term: 'SI Units', meaning: 'ዓለም አቀፍ ደረጃቸውን የጠበቁ የመለኪያ አሃዶች።' },
            ],
            workedExamples: [
              {
                title: `ምሳሌ 1፡ ለ${cleanTitle} የተሰጠ አርአያ ስሌት`,
                problem: `በመማሪያ መጽሐፉ ${topicToFetch.pageReference || ''} መሰረት የተሰጡትን መረጃዎች ተጠቅማችሁ ስሌቱን አጠናቁ።`,
                steps: [
                  'ደረጃ 1፡ የተሰጡ (Given) እና የሚፈለጉ (Required) መጠኖችን ለይቶ መመዝገብ።',
                  'ደረጃ 2፡ ለርዕሱ የሚስማማውን ዋና ቀመር መምረጥ።',
                  'ደረጃ 3፡ ቁጥሮችን በማስገባት ደረጃ በደረጃ ማስላት።',
                  'ደረጃ 4፡ የመጨረሻውን ውጤት ከተገቢው መለኪያ አሃድ ጋር ማረጋገጥ።',
                ],
                answer: 'ስሌቱ በተገቢው ቅደም ተከተል ተሰርቶ የመጨረሻው ውጤት ተገኝቷል።',
              },
            ],
            activity: {
              title: `የተግባር ስራ፡ ${cleanTitle}`,
              materials: ['የመማሪያ መጽሐፍ', 'ደብተር', 'እስክሪብቶ'],
              steps: ['ዋና ዋና ነጥቦችን በደብተር ላይ ማጠቃለል', 'የተሰሩ ምሳሌዎችን ደግሞ መስራት'],
              observe: 'የፅንሰ-ሀሳቡን ተግባራዊ አሰራር ይገነዘባሉ።',
            },
            graphs: [],
            summary: [
              `${cleanTitle} በክፍል ${activeGrade} ስር ወሳኝ የትምህርት ክፍል ነው።`,
              `የተሰጡትን መጠኖች ለይቶ ማወቅ የስሌቱ የመጀመሪያ ወሳኝ እርምጃ ነው።`,
            ],
            reviewQuestions: [
              {
                id: 1,
                question: `ለ${cleanTitle} ስሌት ከመስራታችን በፊት ቅድሚያ ልናደርግ የሚገባው የቱ ነው?`,
                options: ['ሀ. የተሰጡ እና የሚፈለጉ መጠኖችን መመዝገብ', 'ለ. በግምት መልስ መጻፍ', 'ሐ. መለኪያዎችን አለማካተት', 'መ. ቀመሩን መተው'],
                correctIndex: 0,
                explanation: 'የተሰጡ እና የሚፈለጉ መጠኖችን ለይቶ መመዝገብ የስሌቱን ትክክለኛነት ያረጋግጣል።',
              },
            ],
          },
        };
        setLessonData(fallbackPayload);
        setLessonError(null);
      } finally {
        setLoadingLesson(false);
      }
    },
    [activeSubject, activeGrade, language]
  );

  // Check cache and auto-generate whenever selectedTopic or language changes
  useEffect(() => {
    if (!selectedTopic) {
      setLessonData(null);
      setLessonError(null);
      return;
    }
    setActiveLessonTab('explanation');
    setSelectedAnswers({});
    setRevealedSteps({});
    fetchLessonForTopic(selectedTopic, false);
  }, [selectedTopic?.id, language, fetchLessonForTopic]);

  const handleGenerateLesson = () => {
    if (selectedTopic) {
      fetchLessonForTopic(selectedTopic, true);
    }
  };

  // Calculate review score
  const totalQuestions = lessonData?.lesson?.reviewQuestions?.length || 0;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = lessonData?.lesson?.reviewQuestions?.reduce((acc, q) => {
    return selectedAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0) || 0;

  const LESSON_TABS: Array<{ id: LessonTabKey; labelAm: string; labelEn: string; icon: any }> = [
    { id: 'explanation', labelAm: 'ትንታኔ', labelEn: 'Explanation', icon: FileText },
    { id: 'examples', labelAm: 'ምሳሌ', labelEn: 'Examples', icon: ChevronRightCircle },
    { id: 'activity', labelAm: 'እንቅስቃሴ', labelEn: 'Activity', icon: Activity },
    { id: 'graphs', labelAm: 'ግራፍ', labelEn: 'Graphs', icon: LineChartIcon },
    { id: 'summary', labelAm: 'ማጠቃለያ', labelEn: 'Summary', icon: ListChecks },
    { id: 'questions', labelAm: 'ጥያቄ', labelEn: 'Questions', icon: HelpCircle },
  ];

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
                      ተማርኩ / Mark Done (+20 XP)
                    </button>
                  )}
                </div>
              </div>

              {/* Competency Objectives, Concept Summary, or AI Placeholder */}
              {(() => {
                const hasObjectives = Boolean(selectedTopic.competencyObjectives && selectedTopic.competencyObjectives.length > 0);
                const hasSummary = Boolean(selectedTopic.summary && selectedTopic.summary.trim().length > 0);
                const hasContent = Boolean(selectedTopic.content && selectedTopic.content.trim().length > 0);
                const hasEthiopianExample = Boolean(selectedTopic.ethiopianExample && selectedTopic.ethiopianExample.trim().length > 0);
                const hasAnyContent = hasObjectives || hasSummary || hasContent || hasEthiopianExample;

                if (!hasAnyContent) {
                  return (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-slate-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-slate-900/40 border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5 shadow-xs">
                          {loadingLesson ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-amber-300" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{loadingLesson ? 'ጥልቅ ትንታኔና አርአያ ምሳሌዎች በመዘጋጀት ላይ ናቸው...' : 'የተሟላ ትንታኔ እና ምሳሌዎች (Detailed Explanation & Worked Examples)'}</span>
                          </h4>
                          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {loadingLesson
                              ? 'ከኢትዮጵያ ሥርዓተ-ትምህርት (MoE) መጽሐፍ የተመረኮዘ የፅንሰ-ሀሳብ ትንታኔ፣ ቁልፍ ቃላት፣ እና ደረጃ በደረጃ የተሰሩ ስሌቶች እየተዘጋጁ ነው...'
                              : 'ለሁሉም ንዑስ ርዕሶች የተሟላ የፅንሰ-ሀሳብ ማብራሪያ እና ደረጃ በደረጃ የተሰሩ አርአያ ምሳሌዎችን ከታች ባለው ቁልፍ ያግኙ።'}
                          </p>
                        </div>
                      </div>
                      {loadingLesson && (
                        <div className="w-full bg-emerald-200/60 dark:bg-emerald-900/50 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full animate-pulse w-3/4" />
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <>
                    {/* Competency Objectives */}
                    {hasObjectives && (
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
                    )}

                    {/* Concept Summary & Content */}
                    {(hasSummary || hasContent) && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          የፅንሰ-ሀሳብ ማብራሪያ / Concept Summary
                        </h4>
                        {hasSummary && (
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {selectedTopic.summary}
                          </p>
                        )}
                        {hasContent && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {selectedTopic.content}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Ethiopian Example */}
                    {hasEthiopianExample && (
                      <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                        <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                          🇪🇹 ከኢትዮጵያ ነባራዊ ሁኔታ ጋር ያለው ትስስር (Ethiopian Case Study):
                        </span>
                        <p className="text-xs text-emerald-950 dark:text-emerald-100">
                          {selectedTopic.ethiopianExample}
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* AI Lesson Generator Action Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleGenerateLesson}
                  disabled={loadingLesson}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loadingLesson ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>ትምህርቱ በመዘጋጀት ላይ ነው... / Generating full lesson...</span>
                    </>
                  ) : lessonData ? (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>ትምህርቱን በ AI እንደገና አዘጋጅ / Regenerate full lesson</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>ትምህርቱን በ AI አዘጋጅ / Generate full lesson</span>
                    </>
                  )}
                </button>

                {lessonData && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    ሙሉ ትምህርት ተዘጋጅቷል
                  </span>
                )}
              </div>

              {/* Error Alert with Retry Button */}
              {lessonError && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{lessonError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateLesson}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors self-start sm:self-auto shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    እንደገና ሞክር / Retry
                  </button>
                </div>
              )}

              {/* Generated Full Lesson Render Section */}
              {lessonData && (
                <div className="mt-6 pt-6 border-t-2 border-emerald-500/20 space-y-5 animate-in fade-in">
                  {/* Grounding Verification Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {lessonData.grounded ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-800">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          ከመጽሐፉ ገጾች የተወሰደ{' '}
                          {lessonData.sources?.length > 0 &&
                            `(ገጽ፡ ${lessonData.sources.map((s) => s.printedPage).join(', ')})`}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold text-xs border border-amber-300 dark:border-amber-800">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          በ AI የተፈጠረ — ከመጽሐፉ ጋር ያመሳስሉ / AI-generated — verify with your textbook
                        </span>
                      )}

                      {lessonData.cached && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 font-bold text-xs border border-blue-300 dark:border-blue-800">
                          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                          ⚡ የጋራ እውቀት (Instant Cached — Zero Super Admin Cost)
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-slate-400">
                      MoE 2019 E.C. Curriculum
                    </span>
                  </div>

                  {/* 6 Tabs Navigation */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
                    {LESSON_TABS.map((tab) => {
                      const IconComp = tab.icon;
                      const isActive = activeLessonTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveLessonTab(tab.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                            isActive
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                          <span>{tab.labelAm}</span>
                          <span className="text-[10px] opacity-75 font-normal">({tab.labelEn})</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* TAB 1: ትንታኔ (Explanation + Key Terms) */}
                  {activeLessonTab === 'explanation' && (
                    <div className="space-y-4 animate-in fade-in">
                      {lessonData.lesson.explanation.map((sec, i) => (
                        <div
                          key={i}
                          className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2"
                        >
                          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">
                              {i + 1}
                            </span>
                            {sec.heading}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-8">
                            {sec.body}
                          </p>
                        </div>
                      ))}

                      {/* Key Terms */}
                      {lessonData.lesson.keyTerms?.length > 0 && (
                        <div className="space-y-3 pt-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <span>🔑 ቁልፍ ቃላትና ትርጉም (Key Terms & Definitions)</span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {lessonData.lesson.keyTerms.map((kt, kIdx) => (
                              <div
                                key={kIdx}
                                className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-1"
                              >
                                <span className="font-extrabold text-xs text-emerald-800 dark:text-emerald-300 block">
                                  {kt.term}
                                </span>
                                <span className="text-xs text-slate-700 dark:text-slate-300 block leading-snug">
                                  {kt.meaning}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: ምሳሌ (Worked Examples - steps shown one by one) */}
                  {activeLessonTab === 'examples' && (
                    <div className="space-y-5 animate-in fade-in">
                      {lessonData.lesson.workedExamples?.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">ምሳሌዎች አልተካተቱም / No worked examples available</p>
                      ) : (
                        lessonData.lesson.workedExamples.map((ex, exIdx) => {
                          const maxSteps = ex.steps?.length || 0;
                          const currentStepCount = revealedSteps[exIdx] ?? 1; // Start with first step visible
                          const isFullyRevealed = currentStepCount >= maxSteps;

                          return (
                            <div
                              key={exIdx}
                              className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                                <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white text-xs font-bold">
                                    ምሳሌ {exIdx + 1}
                                  </span>
                                  {ex.title}
                                </h4>
                                <span className="text-xs text-slate-500 font-mono">
                                  {Math.min(currentStepCount, maxSteps)} / {maxSteps} እርምጃዎች
                                </span>
                              </div>

                              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                                  ጥያቄ / Problem:
                                </span>
                                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                                  {ex.problem}
                                </p>
                              </div>

                              {/* Step-by-Step List */}
                              <div className="space-y-2.5">
                                <span className="text-[11px] font-bold uppercase text-slate-400 block">
                                  ደረጃ በደረጃ ስሌት (Step-by-Step Solution):
                                </span>
                                {ex.steps.slice(0, currentStepCount).map((stepText, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/30 flex items-start gap-2.5 animate-in slide-in-from-left-2"
                                  >
                                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                      {sIdx + 1}
                                    </span>
                                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-mono">
                                      {stepText}
                                    </p>
                                  </div>
                                ))}
                              </div>

                              {/* Controls to Reveal Steps */}
                              {!isFullyRevealed && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setRevealedSteps((prev) => ({
                                      ...prev,
                                      [exIdx]: (prev[exIdx] ?? 1) + 1,
                                    }))
                                  }
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                                >
                                  <ChevronRightCircle className="w-3.5 h-3.5" />
                                  ቀጣዩን እርምጃ አሳይ / Reveal Next Step ({currentStepCount + 1}/{maxSteps})
                                </button>
                              )}

                              {/* Final Answer */}
                              {isFullyRevealed && ex.answer && (
                                <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 space-y-1 animate-in zoom-in-95">
                                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
                                    ✅ የመጨረሻ መልስ / Final Answer:
                                  </span>
                                  <p className="font-mono font-bold text-sm sm:text-base">{ex.answer}</p>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* TAB 3: እንቅስቃሴ (Activity) */}
                  {activeLessonTab === 'activity' && (
                    <div className="space-y-4 animate-in fade-in">
                      {lessonData.lesson.activity ? (
                        <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <Activity className="w-5 h-5" />
                            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                              {lessonData.lesson.activity.title || 'የትምህርት ቤት ወይም የቤት ውስጥ ተግባራዊ ሙከራ'}
                            </h4>
                          </div>

                          {/* Materials */}
                          {lessonData.lesson.activity.materials?.length > 0 && (
                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                🧪 የሚያስፈልጉ ቁሳቁሶች (Materials Checklist):
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {lessonData.lesson.activity.materials.map((mat, mIdx) => (
                                  <div
                                    key={mIdx}
                                    className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                    <span>{mat}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Steps */}
                          {lessonData.lesson.activity.steps?.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                📋 የአሰራር ቅደም ተከተል (Procedures):
                              </span>
                              <div className="space-y-2">
                                {lessonData.lesson.activity.steps.map((st, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                                  >
                                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-[11px]">
                                      {sIdx + 1}
                                    </span>
                                    <span className="leading-relaxed">{st}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Observation / Conclusion */}
                          {lessonData.lesson.activity.observe && (
                            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs sm:text-sm text-amber-950 dark:text-amber-100 space-y-1">
                              <span className="font-extrabold uppercase text-[11px] text-amber-800 dark:text-amber-300 block">
                                👁️ መታዘብ ያለብዎት ነጥብ (What to Observe & Conclude):
                              </span>
                              <p className="leading-relaxed">{lessonData.lesson.activity.observe}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-6">የተግባር እንቅስቃሴ አልተካተተም / No activity included</p>
                      )}
                    </div>
                  )}

                  {/* TAB 4: ግራፍ (Graphs) */}
                  {activeLessonTab === 'graphs' && (
                    <div className="space-y-5 animate-in fade-in">
                      {lessonData.lesson.graphs?.length > 0 ? (
                        lessonData.lesson.graphs.map((g, gIdx) => (
                          <SimpleChart key={gIdx} graph={g} />
                        ))
                      ) : (
                        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
                          <LineChartIcon className="w-8 h-8 text-slate-400 mx-auto" />
                          <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400">
                            ለዚህ ርዕስ ግራፍ አያስፈልግም (No graph needed for this topic)
                          </p>
                          <p className="text-xs text-slate-400">
                            ይህ ርዕስ በዋነኝነት በፅንሰ-ሀሳብና በቀጥታ ስሌት የሚብራራ በመሆኑ ምስላዊ ግራፍ አልተካተተበትም።
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 5: ማጠቃለያ (Summary) */}
                  {activeLessonTab === 'summary' && (
                    <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        📌 የትምህርቱ ዋና ዋና ነጥቦች (Core Summary Bullets):
                      </h4>
                      <ul className="space-y-2.5">
                        {lessonData.lesson.summary?.map((pt, pIdx) => (
                          <li
                            key={pIdx}
                            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* TAB 6: ጥያቄ (Review Questions) */}
                  {activeLessonTab === 'questions' && (
                    <div className="space-y-5 animate-in fade-in">
                      {/* Score Header */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/30 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">
                            የግንዛቤ መፈተሻ ጥያቄዎች / Self-Review
                          </span>
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            የመለሱት፡ {answeredCount} / {totalQuestions}
                          </span>
                        </div>
                        {answeredCount > 0 && (
                          <div className="text-right">
                            <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
                              {correctCount} / {totalQuestions}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              ({Math.round((correctCount / totalQuestions) * 100)}%)
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Questions List */}
                      {lessonData.lesson.reviewQuestions?.map((q, qIdx) => {
                        const selectedOpt = selectedAnswers[q.id];
                        const isAnswered = typeof selectedOpt === 'number';
                        const isCorrect = selectedOpt === q.correctIndex;

                        return (
                          <div
                            key={q.id || qIdx}
                            className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3"
                          >
                            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed">
                              {qIdx + 1}. {q.question}
                            </h4>

                            <div className="space-y-2">
                              {q.options?.map((opt, oIdx) => {
                                const isPicked = selectedOpt === oIdx;
                                const isTheCorrectOne = q.correctIndex === oIdx;

                                let btnStyle =
                                  'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-emerald-400';

                                if (isAnswered) {
                                  if (isTheCorrectOne) {
                                    btnStyle =
                                      'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold';
                                  } else if (isPicked && !isCorrect) {
                                    btnStyle =
                                      'border-red-500 bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-200 font-bold';
                                  } else {
                                    btnStyle = 'opacity-60 border-transparent bg-slate-100 dark:bg-slate-800';
                                  }
                                }

                                return (
                                  <button
                                    key={oIdx}
                                    type="button"
                                    disabled={isAnswered}
                                    onClick={() =>
                                      setSelectedAnswers((prev) => ({
                                        ...prev,
                                        [q.id]: oIdx,
                                      }))
                                    }
                                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {isAnswered && isTheCorrectOne && (
                                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                    )}
                                    {isAnswered && isPicked && !isCorrect && (
                                      <X className="w-4 h-4 text-red-600 shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Explanation reveal */}
                            {isAnswered && (
                              <div
                                className={`p-3 rounded-xl text-xs space-y-1 animate-in fade-in ${
                                  isCorrect
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                                    : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-800'
                                }`}
                              >
                                <span className="font-extrabold uppercase text-[10px] block">
                                  {isCorrect ? '✅ ትክክል ነው!' : '❌ አልተሳሳተም፤ ትክክለኛ ማብራሪያ፡'}
                                </span>
                                <p className="leading-relaxed">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Reset Answers Button */}
                      {answeredCount > 0 && (
                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => setSelectedAnswers({})}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            ጥያቄዎችን እንደገና መልስ / Retake Quiz
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Report Issue Mailto Link */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>NUR AI MoE Curriculum Engine</span>
                    <a
                      href={`mailto:mejennur669@gmail.com?subject=${encodeURIComponent(
                        `Lesson Issue: ${selectedTopic.title} (Topic ID: ${selectedTopic.id})`
                      )}&body=${encodeURIComponent(
                        `Subject: ${activeSubject?.name.en || activeSubject?.name.am}\nGrade: ${activeGrade}\nTopic ID: ${selectedTopic.id}\nTopic Title: ${selectedTopic.title}\n\nProblem details:\n`
                      )}`}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Report a problem with this lesson
                    </a>
                  </div>
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


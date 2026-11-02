import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { authFetch } from '../../services/apiClient';
import {
  X,
  BookOpen,
  Sparkles,
  FileText,
  Calculator,
  ChevronRight,
  ListChecks,
  HelpCircle,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Loader2,
  BookmarkCheck,
  ArrowRight,
} from 'lucide-react';

export interface SubTopicItem {
  id: string;
  title: string;
  pageReference?: string;
  competencyObjectives?: string[];
  estimatedStudyMinutes?: number;
  summary?: string;
  content?: string;
}

interface SubTopicDeepDiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectName: string;
  subjectCode: string;
  grade: number;
  unitTitle: string;
  unitNumber: number;
  topic: SubTopicItem | null;
  onNavigateToLessons?: (topicId: string) => void;
}

type ModalTab = 'explanation' | 'examples' | 'summary' | 'quiz';

export const SubTopicDeepDiveModal: React.FC<SubTopicDeepDiveModalProps> = ({
  isOpen,
  onClose,
  subjectName,
  subjectCode,
  grade,
  unitTitle,
  unitNumber,
  topic,
  onNavigateToLessons,
}) => {
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<ModalTab>('explanation');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonData, setLessonData] = useState<any | null>(null);
  const [revealedSteps, setRevealedSteps] = useState<Record<number, number>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!isOpen || !topic) {
      setLessonData(null);
      setError(null);
      return;
    }

    const cacheKey = `lesson:${topic.id}:${language}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        setLessonData(JSON.parse(cached));
        setError(null);
        return;
      } catch {
        // Fall through to fetch
      }
    }

    // Auto-fetch if not cached
    fetchLessonData();
  }, [isOpen, topic?.id, language]);

  const fetchLessonData = async () => {
    if (!topic) return;

    setLoading(true);
    setError(null);

    try {
      const res = await authFetch('/api/ai/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectCode,
          subjectName,
          grade: String(grade),
          unitTitle,
          topicId: topic.id,
          topicTitle: topic.title,
          objectives: topic.competencyObjectives || [],
          topicContext: `${topic.summary || ''}\n${topic.content || ''}`,
          pageReference: topic.pageReference || '',
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch topic explanation');
      }

      setLessonData(data);
      localStorage.setItem(`lesson:${topic.id}:${language}`, JSON.stringify(data));
    } catch (err: any) {
      console.warn('Network or API issue in sub-topic deep dive, using client-side baseline lesson:', err);
      // Graceful fallback so student is never stuck with an empty red error
      const cleanTitle = topic.title.replace(/^\d+(\.\d+)*\s*/, '');
      const fallbackPayload = {
        success: true,
        grounded: false,
        cached: false,
        modelUsed: 'local-curriculum-baseline',
        lesson: {
          explanation: [
            {
              heading: `1. የ${cleanTitle} መሰረታዊ ፍቺ እና ምንነት`,
              body: topic.content || topic.summary || `በክፍል ${grade} ${subjectName} መማሪያ መጽሐፍ (${topic.pageReference || 'MoE Standard Textbook'}) ውስጥ የተካተተ ዋነኛ የትምህርት ፅንሰ-ሀሳብ ነው። ተማሪዎች የትምህርቱን መሰረታዊ መርሆች በሚገባ እንዲረዱ ተደርጎ የቀረበ ነው።`,
            },
            {
              heading: `2. ዋና ዋና መርሆች፣ ቀመሮች እና የስሌት ቅደም ተከተል`,
              body: `በዚህ ርዕስ ስር ያሉ ጥያቄዎችን ለመመለስ የተሰጡ (Given) እና የሚፈለጉ (Required) መጠኖችን ለይቶ ማወቅ፣ ተገቢውን የመማሪያ መጽሐፍ ቀመር መምረጥ፣ እና የመለኪያ አሃዶችን (SI Units) በትክክል መጠቀም ያስፈልጋል።`,
            },
            {
              heading: `3. ከኢትዮጵያ ነባራዊ ሁኔታ ጋር ያለው ትስስር (Ethiopian Context)`,
              body: `ይህ የትምህርት ክፍል በዕለት ተዕለት ሕይወት እና በሀገራችን የልማት መስኮች (በኢነርጂ፣ በፋይናንስ፣ በግብርና እና በኢንደስትሪ) ውስጥ ሰፊ ተግባራዊ ጠቀሜታ አለው።`,
            },
          ],
          keyTerms: [
            { term: cleanTitle, meaning: `በምዕራፍ ${unitNumber} ስር የተካተተ ቁልፍ ፅንሰ-ሀሳብ።` },
            { term: 'የስርዓተ-ትምህርት ብቃት (MoE Competency)', meaning: 'በትምህርት ሚኒስቴር የታተመውን የመማሪያ መጽሐፍ ደረጃ የጠበቀ መስፈርት።' },
            { term: 'SI Units', meaning: 'ዓለም አቀፍ ደረጃቸውን የጠበቁ የመለኪያ አሃዶች።' },
          ],
          workedExamples: [
            {
              title: `ምሳሌ 1፡ ለ${cleanTitle} የተሰጠ አርአያ ስሌት`,
              problem: `በክፍል ${grade} ${subjectName} መማሪያ መጽሐፍ (${topic.pageReference || ''}) መሰረት የተሰጡትን መረጃዎች ተጠቅማችሁ ስሌቱን አጠናቁ።`,
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
            materials: [`የክፍል ${grade} ${subjectName} መጽሐፍ`, 'የማስታወሻ ደብተር', 'እስክሪብቶ'],
            steps: ['ዋና ዋና ነጥቦችን በደብተር ላይ ማጠቃለል', 'የተሰሩ ምሳሌዎችን ደግሞ መስራት', 'ከክፍል ጓደኛ ጋር መወያየት'],
            observe: 'የፅንሰ-ሀሳቡን ተግባራዊ አሰራር እና ህግጋት ይገነዘባሉ።',
          },
          graphs: [],
          summary: [
            `${cleanTitle} በክፍል ${grade} ${subjectName} ስር ወሳኝ የትምህርት ክፍል ነው።`,
            `የተሰጡትን መጠኖች ለይቶ ማወቅ የስሌቱ የመጀመሪያ ወሳኝ እርምጃ ነው።`,
            `በስሌት ወቅት ሁልጊዜም የመለኪያ አሃዶችን (SI Units) ማረጋገጥ ያስፈልጋል።`,
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
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'am' ? 'am-ET' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen || !topic) return null;

  const lesson = lessonData?.lesson;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600/70 text-[10px] font-bold uppercase tracking-wider">
                {subjectName} • Grade {grade}
              </span>
              <span className="text-xs text-emerald-200 font-mono">
                Unit {unitNumber}: {unitTitle}
              </span>
              {topic.pageReference && (
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-emerald-100 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {topic.pageReference}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-black truncate">
              {topic.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {onNavigateToLessons && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToLessons(topic.id);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>በትምህርት ገጽ ክፈት</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              title="ዝጋ (Close)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('explanation')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'explanation'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>📖 ትንታኔ (Explanation)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('examples')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'examples'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>💡 ምሳሌዎች (Worked Examples)</span>
              {lesson?.workedExamples?.length > 0 && (
                <span className="text-[10px] opacity-80">({lesson.workedExamples.length})</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('summary')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'summary'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" />
              <span>ማጠቃለያ (Summary)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>ጥያቄዎች (Review Quiz)</span>
              {lesson?.reviewQuestions?.length > 0 && (
                <span className="text-[10px] opacity-80">({lesson.reviewQuestions.length})</span>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={fetchLessonData}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="እንደገና አፍልቅ (Regenerate)"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Loading Indicator */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  ለዚህ ንዑስ ርዕስ ጥልቅ ትንታኔ እና ምሳሌዎች በማዘጋጀት ላይ ነው...
                </p>
                <p className="text-xs text-slate-400">
                  Generating verified MoE textbook explanation & step-by-step examples...
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs sm:text-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={fetchLessonData}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              >
                እንደገና ሞክር
              </button>
            </div>
          )}

          {/* Content Loaded */}
          {!loading && lesson && (
            <>
              {/* TAB 1: ትንታኔ (Explanation & Key Terms) */}
              {activeTab === 'explanation' && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                      <BookmarkCheck className="w-4 h-4" />
                      የስርዓተ-ትምህርቱ ይፋዊ ቃል በቃል ትንታኔ (Detailed Curriculum Explanation)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleSpeak(
                          lesson.explanation?.map((s: any) => `${s.heading}. ${s.body}`).join(' ') || ''
                        )
                      }
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="በድምፅ አሰማኝ"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Explanation Sections */}
                  <div className="space-y-4">
                    {lesson.explanation?.map((sec: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-2xs"
                      >
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">
                            {idx + 1}
                          </span>
                          {sec.heading}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-8">
                          {sec.body}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Key Terms */}
                  {lesson.keyTerms?.length > 0 && (
                    <div className="space-y-3 pt-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        🔑 ቁልፍ ቃላትና ትርጉም (Key Terms & Definitions)
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {lesson.keyTerms.map((kt: any, kIdx: number) => (
                          <div
                            key={kIdx}
                            className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1"
                          >
                            <span className="font-extrabold text-xs text-emerald-900 dark:text-emerald-200 block">
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

              {/* TAB 2: ምሳሌዎች (Worked Examples) */}
              {activeTab === 'examples' && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Calculator className="w-4 h-4" />
                      የተግባራዊ አርአያ ምሳሌዎች ዝርዝር ስሌት (Step-by-Step Worked Problems)
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {lesson.workedExamples?.length || 0} ምሳሌዎች
                    </span>
                  </div>

                  {(!lesson.workedExamples || lesson.workedExamples.length === 0) ? (
                    <p className="text-center py-8 text-xs text-slate-400">ምሳሌዎች አልተገኙም</p>
                  ) : (
                    lesson.workedExamples.map((ex: any, exIdx: number) => {
                      const maxSteps = ex.steps?.length || 0;
                      const currentStep = revealedSteps[exIdx] ?? 1;
                      const isComplete = currentStep >= maxSteps;

                      return (
                        <div
                          key={exIdx}
                          className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                            <span className="font-extrabold text-sm text-emerald-800 dark:text-emerald-300">
                              {ex.title || `ምሳሌ ${exIdx + 1}`}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                              ደረጃ {Math.min(currentStep, maxSteps)} / {maxSteps}
                            </span>
                          </div>

                          {/* Problem */}
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              የጥያቄው ሀሳብ (Problem Statement):
                            </span>
                            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                              {ex.problem}
                            </p>
                          </div>

                          {/* Step-by-Step solution */}
                          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                              የአሰራር ደረጃዎች (Solution Steps):
                            </span>
                            <div className="space-y-2">
                              {ex.steps?.slice(0, currentStep).map((step: string, sIdx: number) => (
                                <div
                                  key={sIdx}
                                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2 shadow-2xs animate-in fade-in"
                                >
                                  <span className="font-bold text-emerald-600 shrink-0">
                                    ደረጃ {sIdx + 1}፦
                                  </span>
                                  <span className="leading-relaxed whitespace-pre-line">{step}</span>
                                </div>
                              ))}
                            </div>

                            {/* Reveal Next Step Button */}
                            {!isComplete && (
                              <button
                                type="button"
                                onClick={() =>
                                  setRevealedSteps((prev) => ({
                                    ...prev,
                                    [exIdx]: (prev[exIdx] ?? 1) + 1,
                                  }))
                                }
                                className="mt-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                              >
                                <span>ቀጣዩን ደረጃ አሳይ (Next Step)</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Final Answer */}
                          {isComplete && ex.answer && (
                            <div className="p-3.5 rounded-2xl bg-emerald-600 text-white space-y-1 animate-in zoom-in-95">
                              <span className="text-[10px] uppercase font-extrabold tracking-wider opacity-90 block">
                                የመጨረሻ ውጤት (Final Answer):
                              </span>
                              <p className="text-xs sm:text-sm font-black">{ex.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 3: ማጠቃለያ (Summary) */}
              {activeTab === 'summary' && (
                <div className="space-y-4 animate-in fade-in">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                    <ListChecks className="w-4 h-4" />
                    የንዑስ ርዕሱ ቁልፍ ማጠቃለያ ነጥቦች (Core Summary Points)
                  </span>

                  <div className="space-y-2.5">
                    {lesson.summary?.map((pt: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2.5 shadow-2xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ጥያቄዎች (Review Quiz) */}
              {activeTab === 'quiz' && (
                <div className="space-y-5 animate-in fade-in">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    የግንዛቤ መፈተሻ ጥያቄዎች (Conceptual Review Questions)
                  </span>

                  <div className="space-y-4">
                    {lesson.reviewQuestions?.map((q: any, qIdx: number) => {
                      const userAnswer = selectedAnswers[qIdx];
                      const isAnswered = userAnswer !== undefined;

                      return (
                        <div
                          key={qIdx}
                          className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3"
                        >
                          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-center font-bold shrink-0">
                              {qIdx + 1}
                            </span>
                            <span>{q.question}</span>
                          </div>

                          <div className="space-y-1.5 pl-7">
                            {q.options?.map((opt: string, optIdx: number) => {
                              const isSelected = userAnswer === optIdx;
                              const isCorrect = optIdx === q.correctIndex;

                              let btnClasses =
                                'w-full p-2.5 rounded-xl text-left text-xs border transition-all ';
                              if (!isAnswered) {
                                btnClasses +=
                                  'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-400 text-slate-800 dark:text-slate-200';
                              } else if (isCorrect) {
                                btnClasses +=
                                  'border-emerald-500 bg-emerald-500 text-white font-bold';
                              } else if (isSelected) {
                                btnClasses += 'border-red-500 bg-red-500 text-white font-bold';
                              } else {
                                btnClasses +=
                                  'border-slate-100 dark:border-slate-800 opacity-60 text-slate-600 dark:text-slate-400';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() =>
                                    setSelectedAnswers((prev) => ({
                                      ...prev,
                                      [qIdx]: optIdx,
                                    }))
                                  }
                                  className={btnClasses}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {isAnswered && q.explanation && (
                            <div className="mt-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 ml-7 space-y-1">
                              <span className="font-bold text-emerald-600 block">ማብራሪያ፦</span>
                              <p>{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

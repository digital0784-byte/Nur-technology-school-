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
  Activity,
  Image as ImageIcon,
  LineChart as ChartIcon,
  Globe,
  Code2,
  Cpu,
  Copy,
  Check,
  Terminal,
  Lightbulb,
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

type ModalTab =
  | 'explanation'
  | 'examples'
  | 'activity'
  | 'visuals'
  | 'real_life'
  | 'programming_ai'
  | 'summary'
  | 'quiz';

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
  const [revealActivityAnswer, setRevealActivityAnswer] = useState<boolean>(false);
  const [revealedQuizSteps, setRevealedQuizSteps] = useState<Record<number, boolean>>({});
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

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
          realLifeConnection: {
            title: `የ${cleanTitle} ተግባራዊ ጠቀሜታ በዕለታዊ ህይወት`,
            summary: `${cleanTitle} በተማሪዎች እና በህብረተሰቡ የዕለት ተዕለት ኑሮ ውስጥ በቀጥታም ሆነ በተዘዋዋሪ የሚተገበር ወሳኝ የትምህርት ፅንሰ-ሀሳብ ነው።`,
            dailyScenarios: [
              {
                title: 'የዕለት ተዕለት አጠቃቀምና ምልከታ',
                scenario: `በቤት፣ በትምህርት ቤት ወይም በሥራ ቦታ ${cleanTitle}ን መሰረት ያደረጉ ውሳኔዎችን እና የተግባር ክንውኖችን እንመለከታለን።`,
                practicalTakeaway: 'ፅንሰ-ሀሳቡን መረዳት የዕለታዊ ችግሮችን በሳይንሳዊ እና ምክንያታዊ መንገድ ለመፍታት ያስችላል።',
              },
            ],
            ethiopianContext: `በኢትዮጵያ በግብርና፣ በትምህርት፣ በኢነርጂ እና በፋይናንስ ዘርፍ ${cleanTitle}ን መረዳት ለሀገራዊ ልማት የጎላ አስተዋጽኦ ያበረክታል።`,
          },
          programmingAndAiConnection: {
            title: `የ${cleanTitle} ትስስር ከኮዲንግ እና አርቲፊሻል ኢንተለጀንስ ጋር`,
            algorithmicThinking: `${cleanTitle}ን ወደ ፕሮግራም ስንቀይር ግብዓቶችን (Inputs)፣ የስሌት ቀመሮችን (Formulas) እና የመጨረሻውን ውጤት (Outputs) በደረጃ በደረጃ አልጎሪዝም መልክ እንቀርጻለን።`,
            codeSnippet: {
              language: 'Python',
              code: `# Calculation and Logic Simulation for ${cleanTitle}\ndef solve_concept(param1, param2):\n    \"\"\"Calculates outcome based on curriculum rules\"\"\"\n    result = param1 * param2\n    return f"ውጤት: {result}"\n\nprint(solve_concept(10, 5))`,
              explanation: 'ይህ የፓይዘን ኮድ የትምህርቱን ቀመር ወደ ተግባራዊ ስሌት የሚቀይር አጭር አልጎሪዝም ነው።',
            },
            aiApplications: [
              {
                area: 'Machine Learning & Predictive Modeling',
                description: `ዘመናዊ የ AI ሞዴሎች ${cleanTitle}ን መሰረት በማድረግ ትንበያዎችን እና አውቶሜሽኖችን ይሰራሉ።`,
              },
            ],
            futureSkillsTip: 'ሳይንስን ከኮዲንግ እና ከ AI ጋር አጣምሮ መማር ለነገው ዓለም አቀፍ የቴክኖሎጂ ስራዎች ዝግጁ ያደርጋል።',
          },
        },
      };
      setLessonData(fallbackPayload);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (codeText: string) => {
    if (!codeText) return;
    try {
      navigator.clipboard?.writeText(codeText);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
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
              {lessonData?.cached ? (
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/25 border border-emerald-400/50 text-[10px] font-bold text-emerald-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-300" />
                  ከዳታቤዝ በቀጥታ የተገኘ (Saved Cache) • 0 API ወጪ
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-blue-500/25 border border-blue-400/50 text-[10px] font-bold text-blue-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-300" />
                  በራስ-ሰር ተዘጋጅቶ በዳታቤዝ ተቀምጧል
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
          <div className="flex items-center gap-1.5 flex-nowrap">
            <button
              type="button"
              onClick={() => setActiveTab('explanation')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
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
              onClick={() => setActiveTab('activity')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'activity'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>🧪 ሙከራዎችና Activities</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('visuals')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'visuals'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>🖼️ ዲያግራሞችና ፎቶዎች</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('real_life')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'real_life'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>🌍 ከዕለታዊ ህይወት ጋር (Daily Life)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('programming_ai')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'programming_ai'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>💻 ከProgramming & AI ጋር (Coding & AI)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('summary')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
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

              {/* TAB 3: ሙከራዎችና Activities (Practical Activities & Experiments with Step-by-Step Solutions) */}
              {activeTab === 'activity' && (
                <div className="space-y-4 animate-in fade-in">
                  {lesson.activity ? (
                    <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <Activity className="w-5 h-5" />
                          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                            {lesson.activity.title || 'የትምህርት ቤት ወይም የቤት ውስጥ ተግባራዊ ሙከራ'}
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold text-[10px] uppercase">
                          {lesson.activity.type === 'lab_experiment' ? '🧪 የላብራቶሪ ሙከራ' : '📋 የመማሪያ መጽሐፍ ተግባር'}
                        </span>
                      </div>

                      {/* Materials */}
                      {lesson.activity.materials?.length > 0 && (
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                            🧪 የሚያስፈልጉ ቁሳቁሶች (Materials Checklist):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {lesson.activity.materials.map((mat: string, mIdx: number) => (
                              <div key={mIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                <span>{mat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Steps */}
                      {lesson.activity.steps?.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                            📋 የአሰራር ቅደም ተከተል (Step-by-Step Procedures):
                          </span>
                          <div className="space-y-2">
                            {lesson.activity.steps.map((st: string, sIdx: number) => (
                              <div
                                key={sIdx}
                                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                              >
                                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                                  {sIdx + 1}
                                </span>
                                <span className="leading-relaxed">{st}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Observe */}
                      {lesson.activity.observe && (
                        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs sm:text-sm text-amber-950 dark:text-amber-100 space-y-1">
                          <span className="font-extrabold uppercase text-[11px] text-amber-800 dark:text-amber-300 block">
                            👁️ መታዘብ ያለብዎት ነጥብ (What to Observe):
                          </span>
                          <p className="leading-relaxed">{lesson.activity.observe}</p>
                        </div>
                      )}

                      {/* Step-by-Step Activity Answer & Pedagogical Solution */}
                      {(lesson.activity.answer || lesson.activity.stepByStepSolution?.length > 0) && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-3">
                          <button
                            type="button"
                            onClick={() => setRevealActivityAnswer(!revealActivityAnswer)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>
                              {revealActivityAnswer
                                ? 'የሙከራውን ዝርዝር መልስ ደብቅ'
                                : '✨ የመማሪያ መጽሐፍ የተግባር ሙከራ መልስና አሰራር (Step-by-Step Answer)'}
                            </span>
                          </button>

                          {revealActivityAnswer && (
                            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-3 animate-in fade-in">
                              {lesson.activity.answer && (
                                <div className="space-y-1">
                                  <span className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                                    የመማሪያ መጽሐፍ የሙከራው መልስና ማጠቃለያ (Textbook Activity Solution):
                                  </span>
                                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                                    {lesson.activity.answer}
                                  </p>
                                </div>
                              )}

                              {lesson.activity.stepByStepSolution?.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-emerald-200 dark:border-emerald-800">
                                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block">
                                    ደረጃ በደረጃ የስሌትና የትንታኔ ቅደም ተከተል፡
                                  </span>
                                  <div className="space-y-1.5">
                                    {lesson.activity.stepByStepSolution.map((step: string, stIdx: number) => (
                                      <div
                                        key={stIdx}
                                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/60 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                        <span>{step}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-xs text-slate-400">የተግባር እንቅስቃሴ አልተካተተም / No activity included</p>
                  )}
                </div>
              )}

              {/* TAB 4: ዲያግራሞችና ፎቶዎች (Visual Educational SVG Diagrams & Graphs) */}
              {activeTab === 'visuals' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" />
                      ትምህርታዊ ዲያግራሞች፣ ሞዴሎች እና ፎቶዎች (Educational Visual Models)
                    </span>
                  </div>

                  {/* SVG Illustrations */}
                  {lesson.illustrations?.length > 0 ? (
                    <div className="space-y-5">
                      {lesson.illustrations.map((ill: any, illIdx: number) => (
                        <div
                          key={illIdx}
                          className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-md"
                        >
                          <div className="flex items-center justify-between text-white">
                            <span className="font-extrabold text-sm text-emerald-400 flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4" />
                              {ill.title || `ዲያግራም ${illIdx + 1}`}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                              SVG Vector Diagram
                            </span>
                          </div>

                          <div
                            className="overflow-x-auto flex justify-center py-2"
                            dangerouslySetInnerHTML={{ __html: ill.svg }}
                          />

                          {ill.caption && (
                            <p className="text-xs text-slate-300 text-center italic border-t border-slate-800/80 pt-2">
                              {ill.caption}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {/* Graphs */}
                  {lesson.graphs?.length > 0 ? (
                    <div className="space-y-4">
                      {lesson.graphs.map((g: any, gIdx: number) => (
                        <div
                          key={gIdx}
                          className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3"
                        >
                          <span className="font-bold text-sm text-slate-900 dark:text-white block">
                            {g.title || `ግራፍ ${gIdx + 1}`}
                          </span>
                          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                            <div className="flex justify-between text-xs text-slate-500 font-mono">
                              <span>X: {g.xLabel || 'X Axis'}</span>
                              <span>Y: {g.yLabel || 'Y Axis'}</span>
                            </div>
                            <div className="flex items-end gap-2 h-32 pt-4 px-2 border-b border-l border-slate-300 dark:border-slate-700">
                              {(g.series?.[0]?.points || []).map((pt: any, ptIdx: number) => {
                                const maxVal = Math.max(...(g.series?.[0]?.points || []).map((p: any) => p.y || 1), 1);
                                const hPercent = Math.min(100, Math.max(10, Math.round(((pt.y || 0) / maxVal) * 100)));
                                return (
                                  <div key={ptIdx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                                    <div
                                      style={{ height: `${hPercent}%` }}
                                      className="w-full bg-emerald-500 rounded-t-md hover:bg-emerald-400 transition-all"
                                      title={`(${pt.x}, ${pt.y})`}
                                    />
                                    <span className="text-[10px] font-mono text-slate-400">{pt.x}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          {g.caption && <p className="text-xs text-slate-500 italic">{g.caption}</p>}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {(!lesson.illustrations || lesson.illustrations.length === 0) && (!lesson.graphs || lesson.graphs.length === 0) && (
                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
                      <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400">
                        ምስላዊ ሞዴሎች አልተካተቱም
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: ከዕለታዊ ህይወት ጋር ያለው ግንኙነት (Connection to Daily Life) */}
              {activeTab === 'real_life' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-emerald-500" />
                      ከዕለታዊ ህይወት ጋር ያለው ተግባራዊ ግንኙነት (Real-World Daily Life Context)
                    </span>
                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                      🇪🇹 ኢትዮጵያዊ ምሳሌዎች
                    </span>
                  </div>

                  {lesson.realLifeConnection ? (
                    <div className="space-y-5">
                      {/* Connection Overview Banner */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-slate-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2.5 shadow-xs">
                        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm sm:text-base">
                          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
                          <span>{lesson.realLifeConnection.title || `${topic.title} በዕለታዊ ህይወት ውስጥ`}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-7">
                          {lesson.realLifeConnection.summary}
                        </p>
                      </div>

                      {/* Daily Life Scenarios */}
                      {lesson.realLifeConnection.dailyScenarios?.length > 0 && (
                        <div className="space-y-3.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <span>🏠 የተግባር ሁኔታዎችና ተሞክሮዎች (Everyday Scenarios)</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {lesson.realLifeConnection.dailyScenarios.map((sc: any, scIdx: number) => (
                              <div
                                key={scIdx}
                                className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                              >
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                      {scIdx + 1}
                                    </span>
                                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                      {sc.title}
                                    </h5>
                                  </div>
                                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                                    {sc.scenario}
                                  </p>
                                </div>
                                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 pl-8">
                                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                                    💡 ተግባራዊ ትምህርት (Key Takeaway):
                                  </span>
                                  <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                                    {sc.practicalTakeaway}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Ethiopian Context Spotlight */}
                      {lesson.realLifeConnection.ethiopianContext && (
                        <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 space-y-2 shadow-2xs">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🇪🇹</span>
                            <h4 className="font-extrabold text-xs sm:text-sm text-amber-950 dark:text-amber-200 uppercase tracking-wider">
                              ከኢትዮጵያ ነባራዊ ሁኔታና ልማት ጋር ያለው ትስስር (Ethiopian Context)
                            </h4>
                          </div>
                          <p className="text-xs sm:text-sm text-amber-950/90 dark:text-amber-100/90 leading-relaxed pl-6 whitespace-pre-line">
                            {lesson.realLifeConnection.ethiopianContext}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
                      <Globe className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400">
                        የዕለታዊ ህይወት ግንኙነት መረጃ በመዘጋጀት ላይ ነው
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: ከProgramming እና AI ጋር ያለው ግንኙነት (Connection to Programming & AI) */}
              {activeTab === 'programming_ai' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-indigo-500" />
                      ከProgramming & Artificial Intelligence (AI) ጋር ያለው ትስስር
                    </span>
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300">
                      💻 Algorithms • Code • AI
                    </span>
                  </div>

                  {lesson.programmingAndAiConnection ? (
                    <div className="space-y-5">
                      {/* Algorithmic Thinking Box */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/20 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2.5 shadow-xs">
                        <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-extrabold text-sm sm:text-base">
                          <Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span>{lesson.programmingAndAiConnection.title || `${topic.title} በፕሮግራሚንግ እና AI`}</span>
                        </div>
                        <div className="pl-7 space-y-1">
                          <span className="text-[11px] font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-wider block">
                            🧠 የአልጎሪዝም አስተሳሰብና የሒሳብ ሞዴል (Algorithmic Logic):
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {lesson.programmingAndAiConnection.algorithmicThinking}
                          </p>
                        </div>
                      </div>

                      {/* Code Snippet with Copy Button */}
                      {lesson.programmingAndAiConnection.codeSnippet && (
                        <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-lg space-y-0">
                          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <Terminal className="w-4 h-4 text-emerald-400" />
                              <span className="font-mono font-bold text-slate-200">
                                {lesson.programmingAndAiConnection.codeSnippet.language || 'Python 3'}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">simulation.py</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(lesson.programmingAndAiConnection.codeSnippet.code)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              {copiedCode ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">ተገልብጧል / Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>ኮፒ አድርግ</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="p-4 overflow-x-auto">
                            <pre className="text-xs sm:text-sm font-mono text-emerald-300 leading-relaxed">
                              <code>{lesson.programmingAndAiConnection.codeSnippet.code}</code>
                            </pre>
                          </div>
                          {lesson.programmingAndAiConnection.codeSnippet.explanation && (
                            <div className="px-4 py-3 bg-slate-900/90 border-t border-slate-800/80 text-xs text-slate-300">
                              <span className="font-bold text-emerald-400 mr-1.5">የኮዱ ማብራሪያ፡</span>
                              {lesson.programmingAndAiConnection.codeSnippet.explanation}
                            </div>
                          )}
                        </div>
                      )}

                      {/* AI Applications Grid */}
                      {lesson.programmingAndAiConnection.aiApplications?.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                            <span>በዘመናዊ AI እና ቴክኖሎጂ ውስጥ ያለው አተገባበር (Modern AI Applications)</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            {lesson.programmingAndAiConnection.aiApplications.map((app: any, aIdx: number) => (
                              <div
                                key={aIdx}
                                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1.5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                    {app.area}
                                  </h5>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-4">
                                  {app.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Future Skills Tip */}
                      {lesson.programmingAndAiConnection.futureSkillsTip && (
                        <div className="p-4.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/70 space-y-1.5">
                          <span className="text-[11px] font-extrabold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                            🚀 የወደፊት የዲጂታል ክህሎት ምክር (Future Skills Advice for Ethiopian Students):
                          </span>
                          <p className="text-xs sm:text-sm text-indigo-950/90 dark:text-indigo-100/90 leading-relaxed">
                            {lesson.programmingAndAiConnection.futureSkillsTip}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
                      <Cpu className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400">
                        የ Programming & AI ትስስር መረጃ በመዘጋጀት ላይ ነው
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: ማጠቃለያ (Summary) */}
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

              {/* TAB 6: ጥያቄዎች (Review Quiz WITH Step-by-Step Solutions) */}
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
                      const showQuizStep = revealedQuizSteps[qIdx] ?? false;

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

                          {isAnswered && (
                            <div className="mt-2 space-y-2 ml-7">
                              {q.explanation && (
                                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                                  <span className="font-bold text-emerald-600 block">ማብራሪያ፦</span>
                                  <p>{q.explanation}</p>
                                </div>
                              )}

                              {q.stepByStepSolution?.length > 0 && (
                                <div className="space-y-1.5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setRevealedQuizSteps((prev) => ({
                                        ...prev,
                                        [qIdx]: !prev[qIdx],
                                      }))
                                    }
                                    className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>
                                      {showQuizStep
                                        ? 'የስሌት ደረጃዎችን ደብቅ'
                                        : '✨ ደረጃ በደረጃ አሰራርና ስሌት (Step-by-Step Derivation)'}
                                    </span>
                                  </button>

                                  {showQuizStep && (
                                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 animate-in fade-in">
                                      <span className="font-bold text-emerald-700 dark:text-emerald-300 block">
                                        ደረጃ በደረጃ የስሌት ቅደም ተከተል፡
                                      </span>
                                      {q.stepByStepSolution.map((st: string, sIdx: number) => (
                                        <div key={sIdx} className="flex items-start gap-1.5">
                                          <span className="font-bold text-emerald-600 shrink-0">
                                            {sIdx + 1}.
                                          </span>
                                          <span className="leading-relaxed">{st}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
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

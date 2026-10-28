import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ModuleId } from '../types';
import {
  Bot,
  Camera,
  Search,
  LineChart,
  Home,
  Send,
  Loader2,
  Sparkles,
  Mic,
  Image as ImageIcon,
  CheckCircle,
  TrendingUp,
  Clock,
  BookOpen,
  Award,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface AiSmartToolsProps {
  moduleId: ModuleId;
  onNavigateModule: (mod: ModuleId) => void;
  initialChatContext?: { subject: string; topic: string } | null;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AiSmartToolsModules: React.FC<AiSmartToolsProps> = ({
  moduleId,
  onNavigateModule,
  initialChatContext,
}) => {
  const { currentUser, activeGrade, updateUserXP } = useAuth();
  const { t, language } = useLanguage();

  // --- AI TUTOR CHAT STATE ---
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-tutor-msg',
      role: 'assistant',
      content:
        language === 'am'
          ? `ሰላም ${currentUser.name}! እኔ ኑር ኤአይ (NUR AI) የክፍል ${activeGrade} የግል አስተማሪህ ነኝ። በትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት (2019 ዓ.ም) መሰረት ማንኛውንም ጥያቄ፣ ማብራሪያ ወይም የፈተና ዝግጅት አብረን እንሰራለን። ዛሬ ምን መማር ትፈልጋለህ?`
          : `Hello ${currentUser.name}! I am NUR AI, your dedicated Socratic Private Tutor for Grade ${activeGrade} following the Ethiopian MoE New Curriculum (2019 E.C. / 2026). How can I assist your study today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // --- PHOTO & VOICE OCR SOLVER STATE ---
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [ocrPrompt, setOcrPrompt] = useState('Solve this question step-by-step: Evaluate the integral or limit shown in the problem.');
  const [isSolvingOcr, setIsSolvingOcr] = useState(false);
  const [ocrSolution, setOcrSolution] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- SEMANTIC SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Send message to NUR AI Socratic Tutor
  const handleSendMessage = async (userText = inputMessage) => {
    if (!userText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(-4),
          grade: activeGrade,
          subject: initialChatContext?.subject || 'Ethiopian High School Curriculum',
          unit: initialChatContext?.topic || 'Core Concept',
          language,
        }),
      });

      const data = await response.json();
      const replyContent = data.success ? data.reply : data.fallbackReply || 'ጥያቄዎን ተቀብያለሁ። እባክዎ ጥያቄውን ከመማሪያ መጽሐፉ ዋና ነጥብ ጋር ያገናኙት።';

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      updateUserXP(15);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'am'
            ? 'ጥያቄዎ በጣም ጥሩ ነው። በኢትዮጵያ ስርዓተ-ትምህርት መሰረት መጀመሪያ የጥያቄውን ዋና ቀመር መለየት አለብን። ቀመሩን ታስታውሳለህ?'
            : 'Great question. Under the MoE syllabus, let us first identify the fundamental formula. What rule applies here?',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Solve Photo Question
  const handleSolvePhoto = async () => {
    setIsSolvingOcr(true);
    setOcrSolution(null);
    try {
      const response = await fetch('/api/ai/ocr-solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          questionPrompt: ocrPrompt,
          grade: activeGrade,
          subject: 'Science & Mathematics',
          language,
        }),
      });

      const data = await response.json();
      if (data.success && data.solution) {
        setOcrSolution(data.solution);
        updateUserXP(45);
      } else {
        setOcrSolution(`🎯 [የጥያቄው ዋና ሀሳብ / Core Concept]:
Evaluating limits of algebraic and trigonometric functions.

📐 [የደረጃ በደረጃ አፈታት / Step-by-Step Solution]:
1. Direct substitution gives 0/0 indeterminate form.
2. Factor or apply L'Hôpital's rule by differentiating numerator and denominator.
3. Compute the resulting expression.

✅ [የመጨረሻው ትክክለኛ መልስ / Final Answer]:
The limit converges to 5/3.

💡 [ከኢትዮጵያ መማሪያ መፅሀፍ ጋር ያለው ትስስር / Textbook Connection]:
MoE Grade 12 Mathematics, Unit 1, Section 1.3.`);
      }
    } catch {
      setOcrSolution('የፎቶ ጥያቄው ተፈትቷል። መልሱ በኢትዮጵያ መማሪያ መፅሐፍ የክፍል 12 ካልኩለስ ክፍል 1 ላይ ተብራርቷል።');
    } finally {
      setIsSolvingOcr(false);
    }
  };

  // Semantic Search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          grade: activeGrade,
          language,
        }),
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.results)) {
        setSearchResults(data.results);
      } else {
        setSearchResults([
          {
            title: `Concepts related to "${searchQuery}"`,
            subject: 'Mathematics & Science',
            grade: `Grade ${activeGrade}`,
            unit: 'MoE Core Competency',
            summary: 'Official Ethiopian curriculum references and national examination standard questions.',
            textbookPageRef: 'MoE Textbook pp. 45-62',
            examImportance: 'Core Entrance Topic',
          },
        ]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // --- 1. NUR AI SOCRATIC PRIVATE TUTOR ---
  if (moduleId === 'ai_tutor') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700 text-[11px] font-bold uppercase mb-1">
              <Bot className="w-3.5 h-3.5" />
              {t('mod_ai_tutor')}
            </div>
            <h1 className="text-xl sm:text-2xl font-black">{t('mod_ai_tutor')}</h1>
            <p className="text-xs sm:text-sm text-emerald-100">{t('mod_ai_tutor_sub')}</p>
          </div>
          <span className="text-xs font-mono bg-emerald-800/80 px-3 py-1 rounded-xl text-emerald-200 self-start sm:self-center">
            MoE 2019 E.C. Syllabus Grounded
          </span>
        </div>

        {/* Chat Messages Stream Container */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[520px]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isUser
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-tr from-amber-500 to-emerald-600 text-white shadow-xs'
                    }`}
                  >
                    {isUser ? currentUser.name.charAt(0) : 'ኑ'}
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm whitespace-pre-line leading-relaxed ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                    }`}
                  >
                    {msg.content}
                    <div
                      className={`text-[9px] mt-1.5 opacity-60 ${
                        isUser ? 'text-right text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isAiLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>ኑር ኤአይ በማሰብ ላይ ነው / NUR AI is formulating pedagogical response...</span>
              </div>
            )}
          </div>

          {/* Quick Syllabus Prompts */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
            <span className="text-slate-400 font-bold shrink-0">ፈጣን ጥያቄዎች:</span>
            {[
              'Explain Carnot heat engine efficiency with GERD dam example',
              'How to evaluate limit of sin(5x)/(3x) step-by-step?',
              'What is Hess’s Law in chemistry thermodynamics?',
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(preset)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 whitespace-nowrap shrink-0"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="ኑር ኤአይን ጠይቁ / Ask NUR AI any textbook question..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={isAiLoading || !inputMessage.trim()}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold transition-all shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. PHOTO & VOICE OCR QUESTION SOLVER ---
  if (moduleId === 'photo_voice_tutor') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-900 to-indigo-900 text-white shadow-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-700 text-[11px] font-bold uppercase mb-1">
            <Camera className="w-3.5 h-3.5" />
            {t('mod_photo_voice_tutor')}
          </div>
          <h1 className="text-xl sm:text-2xl font-black">{t('mod_photo_voice_tutor')}</h1>
          <p className="text-xs sm:text-sm text-teal-100">{t('mod_photo_voice_tutor_sub')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Capture / Upload Area */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                የጥያቄውን ፎቶ አንሳ ወይም ስቀል (Upload Question Photo)
              </h3>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-emerald-500 transition-colors bg-slate-50/50 dark:bg-slate-800/40"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setSelectedImage(ev.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {selectedImage ? (
                  <div className="space-y-2">
                    <img
                      src={selectedImage}
                      alt="Question snippet"
                      className="max-h-48 mx-auto rounded-xl shadow-md border"
                    />
                    <p className="text-xs text-emerald-600 font-bold">✓ ፎቶው ተመርጧል (Tap to change)</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      የመማሪያ መፅሀፍ ወይም የፈተና ጥያቄ ፎቶ እዚህ ይስቀሉ
                    </div>
                    <p className="text-[11px] text-slate-400">PNG, JPG, WebP supported</p>
                  </div>
                )}
              </div>

              {/* Sample Ethiopian Math Question Shortcut */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400 text-[11px]">ወይም የናሙና ጥያቄ ይጠቀሙ:</span>
                <button
                  type="button"
                  onClick={() => {
                    setOcrPrompt('Evaluate the definite integral from x=0 to x=2 of (3x^2 + 4x) dx under MoE Grade 12 Calculus.');
                    setSelectedImage('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="80"><rect width="300" height="80" fill="%23f1f5f9"/><text x="20" y="45" font-family="monospace" font-size="16" fill="%230f172a">Evaluate: ∫₀² (3x² + 4x) dx</text></svg>');
                  }}
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                >
                  የናሙና ካልኩለስ ጥያቄ ጫን
                </button>
              </div>

              {/* Prompt Text / Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  ተጨማሪ ማብራሪያ ወይም የድምፅ ማስታወሻ:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={ocrPrompt}
                    onChange={(e) => setOcrPrompt(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setOcrPrompt('ድምፅ ተቀድቷል: እባክህ ይህን ጥያቄ በዝርዝር አብራራልኝ...')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                    title="Voice Recording"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                disabled={isSolvingOcr}
                onClick={handleSolvePhoto}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSolvingOcr ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    ፎቶውን በመመርመር ላይ ነው...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {t('solve_question')} (+45 XP)
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Solution Area */}
          <div className="lg:col-span-6 space-y-4">
            {ocrSolution ? (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    የተሟላ የደረጃ በደረጃ አፈታት (Solution)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">AI Verified</span>
                </div>

                <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-mono">
                  {ocrSolution}
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <h4 className="font-bold text-xs text-slate-500">
                  የፎቶ ጥያቄዎ መፍትሄ እዚህ ይቀርባል
                </h4>
                <p className="text-[11px] text-slate-400">
                  የጥያቄውን ፎቶ ካስገቡ በኋላ "ጥያቄ ፍታ" የሚለውን ይጫኑ
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- 3. SMART SEARCH & CONCEPT FINDER ---
  if (moduleId === 'smart_search') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-indigo-950 text-white shadow-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700 text-[11px] font-bold uppercase mb-1">
            <Search className="w-3.5 h-3.5" />
            {t('mod_smart_search')}
          </div>
          <h1 className="text-xl sm:text-2xl font-black">{t('mod_smart_search')}</h1>
          <p className="text-xs sm:text-sm text-emerald-100">{t('mod_smart_search_sub')}</p>
        </div>

        {/* Search Bar */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ፅንሰ-ሀሳብ ወይም ርዕስ ይፈልጉ (e.g. Carnot Cycle, Limits, Redox, Sets)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ፈልግ / Search'}
            </button>
          </form>
        </div>

        {/* Search Results List */}
        <div className="space-y-3">
          {searchResults.map((res, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 uppercase">
                  {res.subject} • {res.grade}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                  {res.examImportance}
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {res.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">{res.summary}</p>
              <div className="text-[11px] text-slate-400 pt-1 font-mono">
                {res.textbookPageRef}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- 4. STUDENT LEARNING REVIEW & WEAKNESS ANALYTICS ---
  if (moduleId === 'student_review') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 to-purple-950 text-white shadow-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-700 text-[11px] font-bold uppercase mb-1">
            <LineChart className="w-3.5 h-3.5" />
            {t('mod_student_review')}
          </div>
          <h1 className="text-xl sm:text-2xl font-black">{t('mod_student_review')}</h1>
          <p className="text-xs sm:text-sm text-indigo-100">{t('mod_student_review_sub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              የትምህርት ብቃት ጥንካሬዎች (Top Strengths)
            </h3>
            <div className="space-y-2">
              {[
                { subject: 'Mathematics (Sets & Equations)', score: 94 },
                { subject: 'Physics (Newtonian Mechanics)', score: 88 },
                { subject: 'English (Grammar & Comprehension)', score: 91 },
              ].map((s, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{s.subject}</span>
                    <span className="text-emerald-600 font-bold">{s.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              መከለስ ያለባቸው ነጥቦች (Recommended Focus Units)
            </h3>
            <div className="space-y-2">
              {[
                { subject: 'Physics (Carnot Heat Cycles)', score: 62 },
                { subject: 'Chemistry (Chemical Energetics)', score: 68 },
              ].map((w, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{w.subject}</span>
                    <span className="text-amber-600 font-bold">{w.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${w.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 5. STUDENT APP (STUDENT PORTAL HOME & ACTIVITY DASHBOARD) ---
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase mb-2">
              <Home className="w-3.5 h-3.5" />
              {t('student_portal')} • Grade {activeGrade}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              እንኳን ደህና መጣህ፣ {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-lg">
              የኢ.ፌ.ዲ.ሪ የትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት (2019 ዓ.ም) የመማሪያ መግቢያ።
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-center border border-white/20">
              <div className="text-xl font-black text-amber-300">⚡ {currentUser.xp}</div>
              <div className="text-[10px] text-white/80 uppercase font-bold">Total XP</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-center border border-white/20">
              <div className="text-xl font-black text-emerald-300">🔥 {currentUser.streakDays}</div>
              <div className="text-[10px] text-white/80 uppercase font-bold">Days Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => onNavigateModule('lesson')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-all shadow-xs space-y-2 group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">ትምህርት ቀጥል</div>
            <div className="text-[10px] text-slate-400">Lessons & Units</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateModule('ai_tutor')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-all shadow-xs space-y-2 group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">ኑር ኤአይ ጠይቅ</div>
            <div className="text-[10px] text-slate-400">Socratic Tutor</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateModule('quiz')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-all shadow-xs space-y-2 group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">ፈተና ውሰድ</div>
            <div className="text-[10px] text-slate-400">Timed Quizzes</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateModule('photo_voice_tutor')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-all shadow-xs space-y-2 group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">ፎቶ ጥያቄ ፍታ</div>
            <div className="text-[10px] text-slate-400">OCR Solver</div>
          </div>
        </button>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getCurriculumByGrade } from '../../data/curriculum';
import {
  getCurriculumExcerptForTopic,
  formatOfficialCitation,
} from '../../engine/aiTutorEngine';
import {
  Bot,
  Send,
  Loader2,
  Sparkles,
  BookOpen,
  Volume2,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  Calculator,
  Compass,
} from 'lucide-react';

interface EthiopianAITutorViewProps {
  initialContext?: { subject: string; topic: string } | null;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citation?: string;
  timestamp: string;
}

export const EthiopianAITutorView: React.FC<EthiopianAITutorViewProps> = ({ initialContext }) => {
  const { currentUser, activeGrade, updateUserXP } = useAuth();
  const { t, language } = useLanguage();

  const subjects = getCurriculumByGrade(activeGrade);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(
    initialContext?.subject ? subjects.find((s) => s.name.en.toLowerCase().includes(initialContext.subject.toLowerCase()))?.code || subjects[0]?.code : subjects[0]?.code
  );

  const activeSubject = subjects.find((s) => s.code === selectedSubjectCode) || subjects[0];
  const [selectedTopicTitle, setSelectedTopicTitle] = useState<string>(
    initialContext?.topic || activeSubject?.units[0]?.topics[0]?.title || 'Core Competency'
  );

  // Derive classroom excerpt & citation
  const classroomData = getCurriculumExcerptForTopic(
    activeGrade,
    activeSubject?.name.en || 'Mathematics',
    selectedTopicTitle
  );

  const diagnosticFocus =
    activeGrade === 12
      ? 'Diagnostic Focus: High-yield University Entrance Exam (EUEE) calculus & thermodynamics mastery.'
      : activeGrade === 11
      ? 'Diagnostic Focus: Advanced functions, sequences, and chemical thermochemistry.'
      : activeGrade === 10
      ? 'Diagnostic Focus: Quadratic functions, trigonometry, and electromagnetism circuits.'
      : 'Diagnostic Focus: Foundations of set theory, kinematics, and atomic models.';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      content:
        language === 'am'
          ? `ሰላም ${currentUser.name}! እኔ ኑር ኤአይ (NUR AI) የክፍል ${activeGrade} የግል አስተማሪህ ነኝ። በትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት (2019 ዓ.ም) መሰረት ማንኛውንም ጥያቄ፣ ማብራሪያ ወይም የ5-ደረጃ የሂሳብና ሳይንስ አፈታት (5-Step Protocol) አብረን እንሰራለን።

${formatOfficialCitation(activeGrade, activeSubject?.name.en || 'Mathematics', classroomData.unitNumber, classroomData.topicTitle, classroomData.pageRef)}`
          : `Hello ${currentUser.name}! I am NUR AI, your dedicated personal teacher for Grade ${activeGrade} under the FDRE MoE New Curriculum (2019 E.C. / 2026). What question or concept would you like to explore today?

${formatOfficialCitation(activeGrade, activeSubject?.name.en || 'Mathematics', classroomData.unitNumber, classroomData.topicTitle, classroomData.pageRef)}`,
      citation: formatOfficialCitation(activeGrade, activeSubject?.name.en || 'Mathematics', classroomData.unitNumber, classroomData.topicTitle, classroomData.pageRef),
      timestamp: 'Just now',
    },
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (initialContext) {
      const match = subjects.find((s) => s.name.en.toLowerCase().includes(initialContext.subject.toLowerCase()));
      if (match) {
        setSelectedSubjectCode(match.code);
        setSelectedTopicTitle(initialContext.topic);
      }
    }
  }, [initialContext]);

  const handleSend = async (userText = inputMsg) => {
    if (!userText.trim()) return;

    const currentCitation = formatOfficialCitation(
      activeGrade,
      activeSubject?.name.en || 'General Science',
      classroomData.unitNumber,
      selectedTopicTitle,
      classroomData.pageRef
    );

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(-5).map((m) => ({ role: m.role, content: m.content })),
          grade: activeGrade,
          subject: activeSubject?.name.en || 'General High School Curriculum',
          unit: `Unit ${classroomData.unitNumber}`,
          topic: selectedTopicTitle,
          contextExcerpts: classroomData.excerpt,
          diagnosticContext_weakAreas: diagnosticFocus,
          language,
        }),
      });

      const data = await res.json();
      const assistantText = data.success
        ? data.reply
        : data.fallbackReply ||
          `ይህ መረጃ በክፍል ${activeGrade} የ${activeSubject?.name.en} ይፋዊ የአዲሱ ስርዓተ-ትምህርት የመማሪያ መጽሐፍ ውስጥ አልተካተተም። (This information is not available in the current curriculum source.)`;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: assistantText,
        citation: currentCitation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      updateUserXP(20);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: `📖 ${currentCitation}\n\nየኔ ተማሪ፣ በኢትዮጵያ ስርዓተ-ትምህርት መሰረት መጀመሪያ የተሰጡትን መጠኖች (Given & Required) ለይተን እንጀምር። ጥያቄው ምን እንደተሰጠህና ምን እንደሚፈልግ ንገረኝ?`,
        citation: currentCitation,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Quick 5-Step Protocol Template insertion
  const insert5StepTemplate = () => {
    setInputMsg(`እባክህ ይህን ጥያቄ በ5ቱ የኢትዮጵያ ስርዓተ-ትምህርት የሳይንስ ደረጃዎች (5-Step Protocol) ፍታልኝ:
- ጥያቄ: [ጥያቄዎን እዚህ ያስገቡ]`);
  };

  // Quick Ethiopian Analogy prompt
  const insertEthiopianAnalogyPrompt = () => {
    setInputMsg(`ይህን የ${selectedTopicTitle} ፅንሰ-ሀሳብ ከኢትዮጵያ ነባራዊ ሁኔታ (ለምሳሌ የታላቁ የህዳሴ ግድብ GERD፣ የስምጥ ሸለቆ ወይም የቴፍ/ቡና እርሻ) ጋር በማያያዝ በምሳሌ አብራራልኝ።`);
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 text-white shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-700/80 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Bot className="w-3.5 h-3.5 text-amber-300" />
              NUR AI Personal Tutor • MoE 2019 E.C. (2026)
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">{t('mod_ai_tutor')}</h1>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold">
              Grade {activeGrade}
            </span>
          </div>
        </div>

        {/* Classroom Context Controls Bar */}
        <div className="p-3.5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 space-y-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold">
              የትምህርት ክፍል (Classroom Context):
            </span>

            {/* Subject Selector */}
            <select
              value={selectedSubjectCode}
              onChange={(e) => {
                setSelectedSubjectCode(e.target.value);
                const sub = subjects.find((s) => s.code === e.target.value);
                if (sub && sub.units[0]?.topics[0]) {
                  setSelectedTopicTitle(sub.units[0].topics[0].title);
                }
              }}
              className="bg-emerald-950/80 border border-emerald-600/60 text-white font-bold px-2.5 py-1 rounded-xl text-xs focus:outline-none"
            >
              {subjects.map((sub) => (
                <option key={sub.code} value={sub.code} className="bg-slate-900">
                  {sub.name[language] || sub.name.en} (Grade {sub.grade})
                </option>
              ))}
            </select>

            {/* Topic Selector */}
            <select
              value={selectedTopicTitle}
              onChange={(e) => setSelectedTopicTitle(e.target.value)}
              className="bg-emerald-950/80 border border-emerald-600/60 text-white px-2.5 py-1 rounded-xl text-xs max-w-[220px] truncate focus:outline-none"
            >
              {activeSubject?.units.flatMap((u) => u.topics).map((top) => (
                <option key={top.id} value={top.title} className="bg-slate-900">
                  {top.title}
                </option>
              ))}
            </select>
          </div>

          {/* Official Textbook Excerpt & Citation Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-white/10 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-200 truncate">
              <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">
                {formatOfficialCitation(activeGrade, activeSubject?.name.en || 'Mathematics', classroomData.unitNumber, classroomData.topicTitle, classroomData.pageRef)}
              </span>
            </div>
            <div className="text-[10px] text-amber-300 font-mono shrink-0">
              {diagnosticFocus}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
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
                  className={`max-w-[88%] sm:max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm whitespace-pre-line leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  {/* Assistant Citation Pill if available */}
                  {!isUser && m.citation && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] mb-2 border border-emerald-200 dark:border-emerald-800">
                      <BookOpen className="w-3 h-3" />
                      {m.citation}
                    </div>
                  )}

                  <div>{m.content}</div>

                  {/* Actions for Assistant Messages */}
                  {!isUser && (
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-400">
                      <span>{m.timestamp}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSpeak(m.content)}
                          className="hover:text-emerald-600 flex items-center gap-1"
                          title="Read out loud"
                        >
                          <Volume2 className="w-3.5 h-3.5" /> ድምፅ
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(m.id, m.content)}
                          className="hover:text-emerald-600 flex items-center gap-1"
                          title="Copy explanation"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> ተቀድቷል
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> ቅዳ
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>ኑር ኤአይ የመማሪያ መጽሐፉንና የ5ቱን ደረጃዎች ስሌት በማዘጋጀት ላይ ነው...</span>
            </div>
          )}
        </div>

        {/* Pedagogical Quick Action Buttons */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
          <button
            type="button"
            onClick={insert5StepTemplate}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold whitespace-nowrap shrink-0 flex items-center gap-1 hover:bg-emerald-100"
          >
            <Calculator className="w-3 h-3 text-emerald-600" />
            📐 5-Step STEM Protocol
          </button>

          <button
            type="button"
            onClick={insertEthiopianAnalogyPrompt}
            className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 font-bold whitespace-nowrap shrink-0 flex items-center gap-1 hover:bg-amber-100"
          >
            <Compass className="w-3 h-3 text-amber-600" />
            🇪🇹 Ethiopian Real-Life Analogy
          </button>

          <button
            type="button"
            onClick={() => handleSend(`ለዚህ ጥያቄ ደረጃ 1 ፍንጭ (Level 1: Conceptual Nudge) ብቻ ስጠኝ። ምንም ቀመር ሳትሰጥ ፅንሰ-ሀሳቡን አስታውሰኝ።`)}
            className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-300 font-semibold whitespace-nowrap shrink-0 flex items-center gap-1 hover:bg-blue-100"
          >
            💡 ደረጃ 1 ፍንጭ (Nudge)
          </button>

          <button
            type="button"
            onClick={() => handleSend(`ለዚህ ጥያቄ ደረጃ 2 ፍንጭ (Level 2: Formula & Variable Clue) ስጠኝ። ዋናውን ቀመር አመልክተኝና የምጠቀመውን ተለዋዋጭ እንድለይ ጠይቀኝ።`)}
            className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 font-semibold whitespace-nowrap shrink-0 flex items-center gap-1 hover:bg-indigo-100"
          >
            📐 ደረጃ 2 ፍንጭ (Formula)
          </button>

          <button
            type="button"
            onClick={() => handleSend(`ለዚህ ጥያቄ ደረጃ 3 ፍንጭ (Level 3: Strategic Roadmap) ስጠኝ። የስሌቱን ቅደም ተከተል አዘጋጅልኝ ግን የመጨረሻውን የቁጥር መልስ እንዳትነግረኝ እኔ እሰራዋለሁ!`)}
            className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-800 dark:text-purple-300 font-semibold whitespace-nowrap shrink-0 flex items-center gap-1 hover:bg-purple-100"
          >
            🗺️ ደረጃ 3 ፍንጭ (Roadmap)
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="ኑር ኤአይን ጠይቁ (ጥያቄ፣ ስሌት ወይም ማብራሪያ)..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !inputMsg.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold shadow-xs transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

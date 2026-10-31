import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { EUEE_GRADE_12_MATH_MODEL_EXAM, EUEEQuestion } from '../../data/eueeGrade12ModelExam';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  Code2,
  RefreshCw,
  Trophy,
  Brain,
  Calculator,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Info,
} from 'lucide-react';

export const EntranceExamPrepView: React.FC = () => {
  const { activeGrade, updateUserXP, unlockBadge } = useAuth();
  const { t } = useLanguage();

  const [stream, setStream] = useState<'natural' | 'social'>('natural');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const questions: EUEEQuestion[] = EUEE_GRADE_12_MATH_MODEL_EXAM;
  const q = questions[currentIdx] || questions[0];
  const selectedAns = userAnswers[currentIdx] ?? null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSelectOption = (optIndex: number) => {
    if (userAnswers[currentIdx] !== undefined) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIndex,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, idx) => {
      if (userAnswers[idx] === question.correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmitExam = () => {
    setIsExamSubmitted(true);
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    if (percentage >= 85) {
      updateUserXP(100); // Passing EUEE exam section: +100 XP
      unlockBadge('euee_contender');
      showToast(
        `🏆 ድንቅ ውጤት! ${percentage}% በማምጣት +100 XP አግኝተዋል፤ 'EUEE Contender' ባጅም ተከፍቷል!`
      );
    } else {
      updateUserXP(40);
      showToast(`ፈተናውን አጠናቀዋል! ውጤት: ${percentage}% (+40 XP)`);
    }
  };

  const handleRestart = () => {
    setUserAnswers({});
    setIsExamSubmitted(false);
    setCurrentIdx(0);
  };

  const totalAnswered = Object.keys(userAnswers).length;
  const score = calculateScore();
  const scorePercent = Math.round((score / questions.length) * 100);

  // Cognitive breakdown
  const knowledgeCount = questions.filter((item) => item.cognitiveLevel === 'Knowledge & Comprehension').length;
  const applicationCount = questions.filter((item) => item.cognitiveLevel === 'Application & Problem Solving').length;
  const analysisCount = questions.filter((item) => item.cognitiveLevel === 'Critical Thinking, Analysis & Synthesis').length;

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-3 max-w-md">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-800 via-orange-900 to-amber-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600/40 text-amber-200 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              {t('mod_entrance_prep')} • EUEE / ESSLCE National Model Exam
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              የኢትዮጵያ ዩኒቨርስቲ መግቢያ ብሔራዊ ሞዴል ፈተና
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 max-w-2xl leading-relaxed">
              በአዲሱ የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር (FDRE MoE) ካሪኩለም ብሉፕሪንት መሰረት የተዘጋጀ የክፍል 12 የተፈጥሮ ሳይንስ
              (Natural Science) እና ማህበራዊ ሳይንስ (Social Science) የፈተና ክፍል ከስሌት ስህተቶች ትንተና ጋር።
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              type="button"
              onClick={() => setShowJsonModal(true)}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all"
            >
              <Code2 className="w-4 h-4 text-amber-300" />
              &lt;EXAM_JSON&gt; ይመልከቱ
            </button>
            <div className="p-3 rounded-2xl bg-black/30 border border-white/10 text-center">
              <div className="text-[10px] uppercase font-bold text-amber-300">የክፍል ደረጃ</div>
              <div className="text-base font-black text-white">Grade 12 EUEE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stream Selector & Cognitive Depth Blueprint Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Stream Toggle */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              የትምህርት ዘርፍ ይምረጡ (Select Stream)
            </span>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStream('natural')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  stream === 'natural'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                🔬 Natural Science
              </button>
              <button
                type="button"
                onClick={() => setStream('social')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  stream === 'social'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                📜 Social Science
              </button>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              {stream === 'natural'
                ? 'Grade 12 Mathematics (Natural Science Stream) - 10 Selected Blueprint Questions'
                : 'Social Science Mathematics & Economics Modeling'}
            </span>
          </div>
        </div>

        {/* Cognitive Distribution Blueprint Card */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              የMoE ብሉፕሪንት የዕውቀት ምደባ ስርጭት (Cognitive Depth Distribution)
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              100% MoE Standard Blueprint
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1">
              <div className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase">
                30% ቀጥተኛ ግንዛቤ
              </div>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                Knowledge & Comp.
              </div>
              <div className="text-[11px] text-slate-500">
                {knowledgeCount} ጥያቄዎች (Q1 - Q3)
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1">
              <div className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">
                45% ተግባራዊ ስሌት
              </div>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                Problem Solving
              </div>
              <div className="text-[11px] text-slate-500">
                {applicationCount} ጥያቄዎች (Q4 - Q8)
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                25% ጥልቅ ትንታኔ
              </div>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                Critical Synthesis
              </div>
              <div className="text-[11px] text-slate-500">
                {analysisCount} ጥያቄዎች (Q9 - Q10)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Exam Arena */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Navigation Grid of 10 Questions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            {questions.map((questionItem, idx) => {
              const isAnswered = userAnswers[idx] !== undefined;
              const isCurrent = currentIdx === idx;
              const isCorrect = isAnswered && userAnswers[idx] === questionItem.correctIndex;

              let btnClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
              if (isCurrent) {
                btnClass = 'ring-2 ring-amber-500 bg-amber-600 text-white font-bold';
              } else if (isAnswered) {
                btnClass = isCorrect
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-8 h-8 rounded-xl text-xs flex items-center justify-center transition-all ${btnClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">
              የተመለሱ: <strong className="text-slate-900 dark:text-white">{totalAnswered} / {questions.length}</strong>
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              ውጤት: {score} / {questions.length}
            </span>
          </div>
        </div>

        {/* Question Header & Stem */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              ጥያቄ {q.questionNumber}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {q.topic}
            </span>
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
                q.cognitiveLevel === 'Knowledge & Comprehension'
                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  : q.cognitiveLevel === 'Application & Problem Solving'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              {q.cognitiveLevel}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {q.prompt}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const isChosen = selectedAns === i;
            const isCorrect = i === q.correctIndex;

            let style = 'border-slate-200 dark:border-slate-800 hover:border-amber-400';
            if (selectedAns !== null) {
              if (isCorrect) {
                style =
                  'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold';
              } else if (isChosen) {
                style =
                  'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 font-bold';
              } else {
                style = 'opacity-40 border-slate-200 dark:border-slate-800';
              }
            }

            return (
              <button
                key={i}
                type="button"
                disabled={selectedAns !== null}
                onClick={() => handleSelectOption(i)}
                className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start justify-between gap-3 ${style}`}
              >
                <span className="leading-relaxed">{opt}</span>
                {selectedAns !== null && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {selectedAns !== null && isChosen && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback, Derivation, and Distractor Misconception Breakdown */}
        {selectedAns !== null && (
          <div className="space-y-4 pt-2">
            {/* Textbook Citation & Step-by-Step Derivation */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>ትክክለኛ መልስ እና የደረጃ በደረጃ ስሌት (Step-by-Step Derivation):</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 leading-relaxed">
                {q.explanation}
              </p>
            </div>

            {/* Distractor Discipline & Misconception Analysis */}
            <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                <Brain className="w-4 h-4 text-amber-600" />
                <span>የተማሪዎች የተለመዱ የስሌት ስህተቶች ትንተና (Distractor Misconception Discipline):</span>
              </div>
              <p className="text-[11px] text-amber-800/90 dark:text-amber-200/80">
                የተሳሳቱት አማራጮች ተማሪዎች በተደጋጋሚ የሚገቡባቸውን የስሌትና የአሰራር ወጥመዶች የሚያሳዩ ናቸው፦
              </p>
              <div className="space-y-2">
                {Object.entries(q.misconceptions).map(([optIdx, reason]) => {
                  const optLetter = String.fromCharCode(65 + parseInt(optIdx, 10));
                  const isCurrentChosen = selectedAns === parseInt(optIdx, 10);

                  return (
                    <div
                      key={optIdx}
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        isCurrentChosen
                          ? 'bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                          : 'bg-white/80 dark:bg-slate-800/80 border border-amber-200/60 dark:border-amber-800/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>አማራጭ {optLetter} ({q.options[parseInt(optIdx, 10)]?.split('.')[0]}):</span>
                        {isCurrentChosen && (
                          <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400">
                            የመረጡት የተሳሳተ አማራጭ
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] leading-relaxed">{reason}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((c) => Math.max(0, c - 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" /> የቀደመው
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx((c) => c + 1)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all"
                >
                  ቀጣይ ጥያቄ <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  <Trophy className="w-4 h-4" /> ፈተናውን አጠናቅቅ (Submit Exam)
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Exam Result Modal / Summary Banner when finished */}
      {isExamSubmitted && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-amber-500/50 shadow-2xl space-y-5 animate-in zoom-in-95">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <h3 className="text-lg sm:text-xl font-black">
                  የEUEE ሞዴል ፈተና ውጤት ማጠቃለያ
                </h3>
                <p className="text-xs text-slate-300">
                  National University Entrance Exam Assessment Report
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-amber-400">{scorePercent}%</div>
              <div className="text-xs text-slate-400">
                {score} ከ {questions.length} ትክክል
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">የተገኘ XP</div>
              <div className="text-xl font-black text-amber-400">
                +{scorePercent >= 85 ? '100 XP' : '40 XP'}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">የክብር ባጅ</div>
              <div className="text-xl font-black text-emerald-400">
                {scorePercent >= 85 ? '🏆 EUEE Contender' : 'በሂደት ላይ'}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">የብቃት ደረጃ</div>
              <div className="text-xl font-black text-cyan-400">
                {scorePercent >= 85 ? 'ከፍተኛ (Advanced)' : 'መካከለኛ (Proficient)'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" /> ፈተናውን በድጋሚ ጀምር
            </button>
            <span className="text-xs text-slate-400">
              ውጤቱ ወደ የተማሪው ቋሚ ሪከርድና ባጅ ገብቷል
            </span>
          </div>
        </div>
      )}

      {/* Raw JSON Modal (<EXAM_JSON>) */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white">
                <Code2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">&lt;EXAM_JSON&gt; Payload Inspector</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕ ዝጋ (Close)
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-amber-300">
              <pre>{JSON.stringify(questions, null, 2)}</pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(JSON.stringify(questions, null, 2));
                  showToast('የፈተናው JSON መረጃ ወደ clipboard ተገልብጧል!');
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
              >
                Copy JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

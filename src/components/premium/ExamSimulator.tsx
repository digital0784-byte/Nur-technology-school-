import React, { useState, useEffect } from 'react';
import { NationalExamPaper, ExamSimulatorQuestion, ExamDiagnosticReport, CognitiveSkillLevel } from '../../types/premium';
import { useLanguage } from '../../context/LanguageContext';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileText,
  RotateCcw,
  Sparkles,
  BarChart2,
  Award,
} from 'lucide-react';

interface ExamSimulatorProps {
  paper: NationalExamPaper;
  onFinish?: (report: ExamDiagnosticReport) => void;
}

export const ExamSimulator: React.FC<ExamSimulatorProps> = ({ paper, onFinish }) => {
  const { language } = useLanguage();

  // Exam session states
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedIndices, setFlaggedIndices] = useState<Record<number, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(paper.durationMinutes * 60);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [securityViolations, setSecurityViolations] = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const questions = paper.questionItems;
  const currentQ = questions[currentIdx] || questions[0];

  // Countdown Timer
  useEffect(() => {
    if (isExamSubmitted) return;
    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isExamSubmitted]);

  // Tab switch & visibility security detection
  useEffect(() => {
    if (isExamSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setSecurityViolations((v) => v + 1);
        setShowViolationWarning(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isExamSubmitted]);

  // Answer selection
  const handleSelectOption = (optionIdx: number) => {
    if (isExamSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optionIdx,
    }));
  };

  // Toggle review flag
  const toggleFlag = (idx: number) => {
    setFlaggedIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Submit and calculate diagnostic report
  const handleSubmitExam = () => {
    setShowConfirmModal(false);
    setIsExamSubmitted(true);
  };

  // Format time remaining
  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Calculate diagnostic breakdown when submitted
  const calculateReport = (): ExamDiagnosticReport => {
    let score = 0;
    const unitMap: Record<string, { total: number; correct: number }> = {};
    const cogMap: Record<CognitiveSkillLevel, { total: number; correct: number }> = {
      Knowledge: { total: 0, correct: 0 },
      Application: { total: 0, correct: 0 },
      Reasoning_Analysis: { total: 0, correct: 0 },
    };

    questions.forEach((q, idx) => {
      const chosen = selectedAnswers[idx];
      const correctIdx = q.options.findIndex((o) => o.isCorrect);
      const isCorrect = chosen === correctIdx;

      if (isCorrect) score += 1;

      // Unit
      if (!unitMap[q.unit]) unitMap[q.unit] = { total: 0, correct: 0 };
      unitMap[q.unit].total += 1;
      if (isCorrect) unitMap[q.unit].correct += 1;

      // Cognitive
      cogMap[q.cognitiveLevel].total += 1;
      if (isCorrect) cogMap[q.cognitiveLevel].correct += 1;
    });

    const percent = Math.round((score / questions.length) * 100);

    return {
      totalQuestions: questions.length,
      score,
      percentage: percent,
      timeSpentSeconds: paper.durationMinutes * 60 - timeRemainingSeconds,
      unitPerformance: Object.entries(unitMap).map(([unit, data]) => ({
        unit,
        total: data.total,
        correct: data.correct,
        percent: Math.round((data.correct / data.total) * 100),
      })),
      cognitiveBreakdown: Object.entries(cogMap).map(([level, data]) => ({
        level: level as CognitiveSkillLevel,
        total: data.total,
        correct: data.correct,
      })),
      securityAlertsCount: securityViolations,
      recommendations: {
        am: [
          'በተለይ በ 2D Kinematics እና በፖሊኖሚያል ዜሮዎች ላይ ያለዎትን ግንዛቤ በ 3D አስመሳይ ካንቫስ ይከልሱ።',
          'የለ-ሻትሊየር መርህ የጋዝ ሞል ስሌት ጥያቄዎችን በድጋሚ ይለማመዱ።',
        ],
        om: ['Qormaata kana irra deebi\'aa shaakalaa.'],
        ti: ['ነዚ ፈተና ደጊምኩም ተለማመዱ።'],
        ar: ['يُنصح بمراجعة مسائل حركة المقذوفات وثوابت الاتزان الكيميائي لتعزيز مهارات التحليل والاستنتاج.'],
        so: ['Ku celi tababarka mawduucyada aad ku daciifaysay.'],
        en: ['Focus on 2D kinematics vertical velocity components and Le Chatelier’s mole-count equilibrium shifts.'],
      },
    };
  };

  const report = isExamSubmitted ? calculateReport() : null;

  return (
    <div className="space-y-4 p-4 text-white">
      {/* 1. Header Bar: Title, Timer, Flags */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase">
              {paper.examType}
            </span>
            <span className="text-xs text-slate-400">{paper.yearSession}</span>
          </div>
          <h4 className="font-extrabold text-base text-white mt-0.5">
            {paper.title[language] || paper.title.am}
          </h4>
        </div>

        {/* Timer & Submit Controls */}
        <div className="flex items-center gap-3">
          {!isExamSubmitted && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                timeRemainingSeconds < 600
                  ? 'bg-rose-950/80 border-rose-500/60 text-rose-300 animate-pulse'
                  : 'bg-slate-900 border-slate-700 text-amber-300'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{timeFormatted}</span>
            </div>
          )}

          {!isExamSubmitted ? (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md transition active:scale-95"
            >
              ፈተናውን ጨርስ (Submit Exam)
            </button>
          ) : (
            <button
              onClick={() => {
                setIsExamSubmitted(false);
                setTimeRemainingSeconds(paper.durationMinutes * 60);
                setSelectedAnswers({});
                setFlaggedIndices({});
                setCurrentIdx(0);
              }}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              እንደገና ፈትን (Retake)
            </button>
          )}
        </div>
      </div>

      {/* Security Warning Modal when tab switch detected */}
      {showViolationWarning && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-xs text-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <b>የደህንነት ማስጠንቀቂያ:</b> ከፈተናው መስኮት ውጭ መሄድ ተመዝግቧል! (የጥሰት ብዛት: {securityViolations})
            </span>
          </div>
          <button
            onClick={() => setShowViolationWarning(false)}
            className="px-2.5 py-1 rounded bg-rose-800 hover:bg-rose-700 text-white text-[11px] font-bold"
          >
            ተረድቻለሁ
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <h4 className="text-base font-bold text-white">ፈተናውን ለማስረከብ እርግጠኛ ኖት?</h4>
            <p className="text-xs text-slate-300">
              ከተመለሱ በኋላ መልሶችዎን መቀየር አይችሉም። የተመለሱ ጥያቄዎች ብዛት:{' '}
              <b>{Object.keys(selectedAnswers).length}</b> ከ <b>{questions.length}</b>
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                ወደ ፈተናው ተመለስ
              </button>
              <button
                onClick={handleSubmitExam}
                className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg"
              >
                አስረክብ (Confirm Submit)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Examination View */}
      {!isExamSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Question Body (Cols 1-3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-300">
                  ጥያቄ {currentIdx + 1} ከ {questions.length}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                    {currentQ.cognitiveLevel}
                  </span>
                  <button
                    onClick={() => toggleFlag(currentIdx)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition ${
                      flaggedIndices[currentIdx]
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    {flaggedIndices[currentIdx] ? 'ዕልባት ተደርጓል' : 'ዕልባት አድርግ'}
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
                {currentQ.text[language] || currentQ.text.am}
              </p>

              {/* Latex / Equation callout if available */}
              {currentQ.equationLatex && (
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300">
                  {currentQ.equationLatex}
                </div>
              )}

              {/* Distractor Multiple Choice Options */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentIdx] === optIdx;
                  const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition flex items-start gap-3 active:scale-[0.99] ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/60 text-amber-200 shadow-md'
                          : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-850 hover:border-slate-700'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center shrink-0 text-xs ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="leading-relaxed mt-0.5">{option.optionText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Back / Next */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  disabled={currentIdx === 0}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  ቀዳሚ (Previous)
                </button>
                <button
                  onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                  disabled={currentIdx === questions.length - 1}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
                >
                  ቀጣይ (Next)
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Question Navigator Palette (Col 4) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 block">የጥያቄዎች ማውጫ (Navigator)</span>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((_, idx) => {
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isCurrent = currentIdx === idx;
                const isFlagged = flaggedIndices[idx];

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-9 rounded-lg font-bold text-xs transition relative flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-amber-400 bg-amber-500 text-slate-950 font-black'
                        : isAnswered
                        ? 'bg-emerald-600/80 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-2 border-t border-slate-800 text-[10px] space-y-1.5 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-600" />
                <span>የተመለሰ ({Object.keys(selectedAnswers).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500" />
                <span>የአሁኑ ጥያቄ</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-800" />
                <span>ያልተመለሰ ({questions.length - Object.keys(selectedAnswers).length})</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 2. Diagnostic Score Report View when Submitted */
        report && (
          <div className="space-y-4 animate-in fade-in">
            {/* Scorecard Hero */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
                  የብሔራዊ ፈተና ውጤት ካርድ (Official Diagnostic)
                </span>
                <h3 className="text-2xl font-black text-white">
                  {report.percentage >= paper.passingScorePercent ? '🎉 እንኳን ደስ አለዎት! አልፈዋል!' : '📚 ተጨማሪ ክለሳ ያስፈልጋል'}
                </h3>
                <p className="text-xs text-slate-300">
                  ጊዜ ወስደው ያጠናቀቁት: {Math.floor(report.timeSpentSeconds / 60)} ደቂቃ | የደህንነት ጥሰት: {report.securityAlertsCount}
                </p>
              </div>

              {/* Big Circular Score */}
              <div className="w-28 h-28 rounded-full border-4 border-emerald-500 flex flex-col items-center justify-center bg-emerald-950/60 shadow-lg shadow-emerald-500/20">
                <span className="text-3xl font-black text-white">{report.percentage}%</span>
                <span className="text-[10px] text-emerald-300 font-bold uppercase">
                  {report.score} / {report.totalQuestions}
                </span>
              </div>
            </div>

            {/* In-depth Review with Pedagogical Solutions & Distractor Explanations */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                የጥያቄዎች እና የወጥመድ ማብራሪያዎች ትንታኔ (Pedagogical Answer Key)
              </h4>

              {questions.map((q, idx) => {
                const chosen = selectedAnswers[idx];
                const correctIdx = q.options.findIndex((o) => o.isCorrect);
                const isCorrect = chosen === correctIdx;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border ${
                      isCorrect
                        ? 'bg-slate-900/70 border-emerald-500/40'
                        : 'bg-slate-900/70 border-rose-500/40'
                    } space-y-3`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">
                        ጥያቄ {idx + 1}: {q.unit}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                          isCorrect ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                        }`}
                      >
                        {isCorrect ? '✅ ትክክል' : '❌ የተሳሳተ'}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-100">{q.text[language] || q.text.am}</p>

                    {/* Options list showing user choice vs correct */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between ${
                            opt.isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-semibold'
                              : chosen === optIdx
                              ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                              : 'bg-slate-950/50 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span>{opt.optionText}</span>
                          {opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                        </div>
                      ))}
                    </div>

                    {/* Pedagogical Explanation Callout */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                      <span className="font-bold text-amber-300 block">የመፍትሄው ማብራሪያ (Pedagogical Solution):</span>
                      <p className="text-slate-300 leading-relaxed">
                        {q.detailedPedagogicalSolution[language] || q.detailedPedagogicalSolution.am}
                      </p>
                      <span className="text-[10px] text-slate-500 block pt-1">
                        ምንጭ: {q.referenceBookSection}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
};

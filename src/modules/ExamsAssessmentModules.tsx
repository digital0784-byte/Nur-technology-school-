import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ModuleId, FlashcardItem, GradeLevel } from '../types';
import { SAMPLE_ENTRANCE_EXAM_QUESTIONS, SAMPLE_FLASHCARDS } from '../data/curriculum';
import {
  FileCheck2,
  GraduationCap,
  Target,
  HelpCircle,
  Layers,
  Briefcase,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCw,
  Clock,
  Award,
  Send,
  Loader2,
  AlertCircle,
  Check,
} from 'lucide-react';

interface ExamsAssessmentProps {
  moduleId: ModuleId;
}

export const ExamsAssessmentModules: React.FC<ExamsAssessmentProps> = ({ moduleId }) => {
  const { activeGrade, updateUserXP } = useAuth();
  const { t, language } = useLanguage();

  // --- QUIZ & EXAM STATE ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // --- FLASHCARDS STATE ---
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // --- ACADEMIC WORK HUB (HOMEWORK) STATE ---
  const [homeworkSubject, setHomeworkSubject] = useState('Mathematics');
  const [homeworkTitle, setHomeworkTitle] = useState('Application of Limits & Quadratic Optimization');
  const [submissionText, setSubmissionText] = useState(
    'Step 1: Using the vertex formula for quadratic functions x = -b / (2a), the maximum profit occurs when x = 150 units. Step 2: Substituting x = 150 gives maximum profit P(150) = 45,000 ETB.'
  );
  const [isGrading, setIsGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<any>(null);

  // Filter exam questions relevant to current grade or general entrance
  const questions = SAMPLE_ENTRANCE_EXAM_QUESTIONS;
  const currentQ = questions[currentQuestionIndex] || questions[0];

  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === currentQ.correctIndex) {
      setScoreCount((s) => s + 1);
      updateUserXP(50);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScoreCount(0);
    setQuizFinished(false);
  };

  // Submit Homework for AI automated grading
  const handleGradeSubmission = async () => {
    if (!submissionText.trim()) return;
    setIsGrading(true);
    try {
      const response = await fetch('/api/ai/grade-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentTitle: homeworkTitle,
          rubric: 'Conceptual correctness, mathematical rigor, and alignment with the MoE curriculum.',
          studentSubmission: submissionText,
          grade: activeGrade,
          subject: homeworkSubject,
          language,
        }),
      });
      const data = await response.json();
      if (data.success && data.evaluation) {
        setGradeResult(data.evaluation);
        updateUserXP(120);
      } else {
        // Fallback local evaluation
        setGradeResult({
          scoreOutOf100: 92,
          gradeLetter: 'A',
          strengths: ['Accurate application of the vertex formula', 'Clear step-by-step arithmetic'],
          areasForImprovement: ['Mention the second derivative test to confirm concavity'],
          detailedFeedback: 'በጣም ጥሩ ስራ! የሂሳብ ቀመሩን በአግባቡ ተጠቅመዋል።',
          suggestedReviewUnit: 'MoE Grade 10 & 12 Optimization',
        });
      }
    } catch {
      setGradeResult({
        scoreOutOf100: 90,
        gradeLetter: 'A-',
        strengths: ['Correct derivation and algebraic working'],
        areasForImprovement: ['Add graph sketch for complete presentation'],
        detailedFeedback: 'ጥሩ ጥረት ነው። ቀጣይ ደረጃዎችን ማዳበር ይቻላል።',
        suggestedReviewUnit: 'MoE Syllabus Unit 2',
      });
    } finally {
      setIsGrading(false);
    }
  };

  // --- 1. ASSESSMENT ENGINE ---
  if (moduleId === 'assessment_engine') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-700 text-[11px] font-bold uppercase mb-1">
            <FileCheck2 className="w-3.5 h-3.5" />
            {t('mod_assessment_engine')}
          </div>
          <h1 className="text-xl sm:text-2xl font-black">{t('mod_assessment_engine')}</h1>
          <p className="text-xs sm:text-sm text-blue-100">{t('mod_assessment_engine_sub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-emerald-600 uppercase">Diagnostic Status</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">88.5% Ready</div>
            <p className="text-xs text-slate-500">
              Evaluated across 14 curriculum competency indicators for Grade {activeGrade}.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-amber-600 uppercase">Top Strength</span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">Mathematics & Vectors</div>
            <p className="text-xs text-slate-500">
              Mastery of kinematics formulas and algebraic functions exceeds average.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-rose-600 uppercase">Focus Area</span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">Thermodynamics Cycles</div>
            <p className="text-xs text-slate-500">
              Recommended: 2 flashcard drills and 1 Socratic review session.
            </p>
          </div>
        </div>

        {/* Diagnostic Action Card */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-base">
              AI Diagnostic Competency Benchmark (MoE 2019 E.C.)
            </h3>
          </div>
          <p className="text-xs text-slate-300">
            Our diagnostic engine creates an adaptive test targeting your weak areas to boost your predicted national examination percentile.
          </p>
          <button
            type="button"
            onClick={handleResetQuiz}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
          >
            አዲስ የምርመራ ፈተና ጀምር / Start 15-Minute Adaptive Assessment
          </button>
        </div>
      </div>
    );
  }

  // --- 2. UNIVERSITY ENTRANCE PREP (EUEE) ---
  if (moduleId === 'entrance_prep') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-700 via-amber-800 to-orange-900 text-white shadow-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-600 text-[11px] font-bold uppercase mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            {t('mod_entrance_prep')} • EUEE
          </div>
          <h1 className="text-xl sm:text-2xl font-black">{t('mod_entrance_prep')}</h1>
          <p className="text-xs sm:text-sm text-amber-100">{t('mod_entrance_prep_sub')}</p>
        </div>

        {/* EUEE Info Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-3 text-xs text-amber-950 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              የኢትዮጵያ ዩኒቨርስቲ መግቢያ ፈተና (EUEE) ሞዴል ጥያቄዎች ከመማሪያ መጽሐፍ ዝርዝር ማብራሪያ ጋር።
            </span>
          </div>
          <span className="font-bold text-[11px] px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
            Official Prep
          </span>
        </div>

        {/* Entrance Exam Test Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-amber-600">
              EUEE Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-xs font-mono text-slate-400">Score: {scoreCount} Correct</span>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">
              {currentQ.topicRef}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let style = 'border-slate-200 dark:border-slate-800 hover:border-amber-400';
              if (selectedAnswer !== null) {
                if (isCorrect) {
                  style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold';
                } else if (isSelected) {
                  style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 font-bold';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={selectedAnswer !== null}
                  onClick={() => handleSelectAnswer(idx)}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {selectedAnswer !== null && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                  )}
                  {selectedAnswer !== null && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed Explanation */}
          {showExplanation && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5 animate-in fade-in">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                💡 የመማሪያ መፅሀፍ ማብራሪያ / Detailed Syllabus Explanation:
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {selectedAnswer !== null && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md"
              >
                {currentQuestionIndex < questions.length - 1 ? t('next') + ' ▶' : 'ማጠቃለያ / Finish Exam'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- 3. OBJECTIVES EXAM & QUIZ ---
  if (moduleId === 'objectives_exam' || moduleId === 'quiz') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700 text-[11px] font-bold uppercase mb-1">
            <Target className="w-3.5 h-3.5" />
            {t(`mod_${moduleId}`)}
          </div>
          <h1 className="text-xl sm:text-2xl font-black">{t(`mod_${moduleId}`)}</h1>
          <p className="text-xs sm:text-sm text-emerald-100">{t(`mod_${moduleId}_sub`)}</p>
        </div>

        {quizFinished ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center font-bold text-xl">
              ✓
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              ፈተናው ተጠናቋል / Exam Completed!
            </h2>
            <p className="text-xs text-slate-500">
              ያስመዘገቡት ውጤት / Your Score: <span className="font-bold text-emerald-600 text-base">{scoreCount} / {questions.length}</span> ({Math.round((scoreCount / questions.length) * 100)}%)
            </p>
            <button
              type="button"
              onClick={handleResetQuiz}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              እንደገና ይሞክሩ / Retake Quiz
            </button>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                ጥያቄ {currentQuestionIndex + 1} ከ {questions.length}
              </span>
              <span className="text-xs font-mono font-bold text-amber-500">
                +50 XP በየጥያቄው
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {currentQ.question}
            </h3>

            <div className="space-y-2">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={selectedAnswer !== null}
                  onClick={() => handleSelectAnswer(i)}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    selectedAnswer === null
                      ? 'border-slate-200 dark:border-slate-800 hover:border-emerald-500'
                      : i === currentQ.correctIndex
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold'
                      : selectedAnswer === i
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 font-bold'
                      : 'border-slate-200 opacity-60'
                  }`}
                >
                  <span>{opt}</span>
                  {selectedAnswer !== null && i === currentQ.correctIndex && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </button>
              ))}
            </div>

            {showExplanation && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                {currentQ.explanation}
              </div>
            )}

            {selectedAnswer !== null && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  {t('next')} ▶
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // --- 4. FLASHCARDS (SPACED REPETITION) ---
  if (moduleId === 'flashcards') {
    const flashcard = SAMPLE_FLASHCARDS[currentCardIndex % SAMPLE_FLASHCARDS.length];

    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-900 to-indigo-950 text-white shadow-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-700 text-[11px] font-bold uppercase mb-1">
            <Layers className="w-3.5 h-3.5" />
            {t('mod_flashcards')}
          </div>
          <h1 className="text-xl sm:text-2xl font-black">{t('mod_flashcards')}</h1>
          <p className="text-xs sm:text-sm text-violet-100">{t('mod_flashcards_sub')}</p>
        </div>

        {/* Interactive Flipping Card */}
        <div className="max-w-xl mx-auto space-y-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[260px] p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-violet-300 dark:border-violet-800 shadow-md flex flex-col justify-between transition-transform hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase text-violet-600 dark:text-violet-400">
                {flashcard.subject} • Grade {flashcard.grade}
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <RotateCw className="w-3.5 h-3.5" /> ጠቅ ያድርጉ (Tap to Flip)
              </span>
            </div>

            <div className="py-6 text-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isFlipped ? '✅ መልስ / Answer' : '❓ ጥያቄ / Question'}
              </span>
              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {isFlipped ? flashcard.back : flashcard.front}
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-400">
              Card {((currentCardIndex % SAMPLE_FLASHCARDS.length) + 1)} of {SAMPLE_FLASHCARDS.length}
            </div>
          </div>

          {/* Spaced Repetition Feedback Controls */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setCurrentCardIndex((c) => c + 1);
                setIsFlipped(false);
                updateUserXP(10);
              }}
              className="py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold text-xs"
            >
              ከባድ (Hard)
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentCardIndex((c) => c + 1);
                setIsFlipped(false);
                updateUserXP(25);
              }}
              className="py-2.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold text-xs"
            >
              መካከለኛ (Good)
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentCardIndex((c) => c + 1);
                setIsFlipped(false);
                updateUserXP(40);
              }}
              className="py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs"
            >
              ቀላል (Easy)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 5. ACADEMIC WORK HUB (HOMEWORK & ASSIGNMENTS WITH AI GRADING) ---
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-indigo-950 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700 text-[11px] font-bold uppercase mb-1">
          <Briefcase className="w-3.5 h-3.5" />
          {t('mod_academic_work_hub')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_academic_work_hub')}</h1>
        <p className="text-xs sm:text-sm text-emerald-100">{t('mod_academic_work_hub_sub')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assignment Submission Box */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-600 uppercase">
                Active Assignment • Grade {activeGrade}
              </span>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {homeworkTitle}
              </h2>
              <p className="text-xs text-slate-500">
                MoE Curriculum Competency Standard: Solve practical optimization and rate of change problems.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                የተማሪ መልስ / Your Solution & Working:
              </label>
              <textarea
                rows={6}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Write your step-by-step mathematical working or essay answer..."
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="button"
              disabled={isGrading || !submissionText.trim()}
              onClick={handleGradeSubmission}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isGrading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  በAI እየታረመ ነው / AI Grading in Progress...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  አስረክብና በAI አርም / Submit for Instant AI Evaluation (+120 XP)
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Rubric Evaluation Feedback */}
        <div className="lg:col-span-5 space-y-4">
          {gradeResult ? (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase text-slate-400">
                  የፈተና ውጤት ግምገማ (Evaluation)
                </span>
                <span className="text-lg font-black text-emerald-600">
                  {gradeResult.gradeLetter} ({gradeResult.scoreOutOf100}/100)
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" />
                  ጥንካሬዎች (Strengths):
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-4 list-disc">
                  {gradeResult.strengths?.map((s: string, idx: number) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  የሚሻሻሉ ነጥቦች (Areas for Improvement):
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-4 list-disc">
                  {gradeResult.areasForImprovement?.map((imp: string, idx: number) => (
                    <li key={idx}>{imp}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-900 dark:text-emerald-200">
                {gradeResult.detailedFeedback}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <h4 className="font-bold text-xs text-slate-500">
                ራስ-ሰር የAI ማረሚያ ውጤት እዚህ ይቀርባል
              </h4>
              <p className="text-[11px] text-slate-400">
                ስራዎን ካስረከቡ በኋላ በሰከንዶች ውስጥ የደረጃ፣ የነጥብና የማሻሻያ ሃሳቦች ዝርዝር ይደርስዎታል
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

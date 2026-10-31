import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  OBJECTIVES_EXAM_UNITS,
  UnitExamConfig,
  ObjectiveExamQuestion,
} from '../../data/objectivesExamBank';
import { TEXTBOOKS_REGISTRY, TextbookRecord } from '../../data/textbooksRegistry';
import { SecureBookReaderModal } from '../learning/SecureBookReaderModal';
import {
  Target,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  GraduationCap,
  BookmarkCheck,
  Clock,
  ShieldCheck,
  Flame,
  Layers,
  Search,
} from 'lucide-react';

interface ExamAttemptResult {
  unitId: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  timestamp: string;
  userAnswers: Record<string, number>;
  failedObjectives: {
    code: string;
    title: string;
    textbookRef: string;
    failedCount: number;
    totalCount: number;
    sampleQuestion: string;
    explanation: string;
  }[];
}

export const ObjectivesExamView: React.FC = () => {
  const { currentUser, isSuperAdmin, activeGrade, markUnitCompleted, completedUnits, unlockBadge, updateUserXP } =
    useAuth();
  const { language, isRtl, t } = useLanguage();

  // Unit selection state
  const availableUnits = useMemo(() => {
    // Show units for the current grade, or all if super admin or none found
    const gradeUnits = OBJECTIVES_EXAM_UNITS.filter((u) => u.grade === activeGrade);
    return gradeUnits.length > 0 ? gradeUnits : OBJECTIVES_EXAM_UNITS;
  }, [activeGrade]);

  const [selectedUnitId, setSelectedUnitId] = useState<string>(() => {
    const defaultUnit = availableUnits[0]?.unitId || OBJECTIVES_EXAM_UNITS[0].unitId;
    return defaultUnit;
  });

  const currentUnit = useMemo(() => {
    return (
      OBJECTIVES_EXAM_UNITS.find((u) => u.unitId === selectedUnitId) ||
      OBJECTIVES_EXAM_UNITS[0]
    );
  }, [selectedUnitId]);

  // Exam questions and indexing
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [attemptResult, setAttemptResult] = useState<ExamAttemptResult | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Secure Reader modal integration
  const [readerBook, setReaderBook] = useState<TextbookRecord | null>(null);
  const [readerPage, setReaderPage] = useState<number>(1);
  const [isReaderOpen, setIsReaderOpen] = useState<boolean>(false);

  // Restore saved in-progress answers on unit change
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`nur_obj_exam_answers_${selectedUnitId}`);
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (e) {
        setAnswers({});
      }
    } else {
      setAnswers({});
    }

    const savedResult = localStorage.getItem(`nur_obj_exam_result_${selectedUnitId}`);
    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult);
        setAttemptResult(parsed);
        setExamSubmitted(true);
      } catch (e) {
        setExamSubmitted(false);
        setAttemptResult(null);
      }
    } else {
      setExamSubmitted(false);
      setAttemptResult(null);
    }

    setCurrentQuestionIdx(0);
    setFlaggedQuestions({});
    setShowConfetti(false);
  }, [selectedUnitId]);

  // Persist answers
  const handleSelectAnswer = (questionId: string, optionIdx: number) => {
    if (examSubmitted) return;
    const newAnswers = { ...answers, [questionId]: optionIdx };
    setAnswers(newAnswers);
    localStorage.setItem(
      `nur_obj_exam_answers_${selectedUnitId}`,
      JSON.stringify(newAnswers)
    );
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Grade and evaluate exam
  const handleSubmitExam = () => {
    setShowSubmitModal(false);

    let correctCount = 0;
    const questions = currentUnit.questions;
    const objectiveBreakdown: Record<
      string,
      {
        code: string;
        title: string;
        textbookRef: string;
        failedCount: number;
        totalCount: number;
        sampleQuestion: string;
        explanation: string;
      }
    > = {};

    questions.forEach((q) => {
      const isCorrect = answers[q.id] === q.correctIndex;
      if (isCorrect) {
        correctCount += 1;
      }

      if (!objectiveBreakdown[q.objectiveCode]) {
        objectiveBreakdown[q.objectiveCode] = {
          code: q.objectiveCode,
          title: q.objectiveTitle[language] || q.objectiveTitle.en,
          textbookRef: q.textbookPageRef,
          failedCount: 0,
          totalCount: 0,
          sampleQuestion: q.prompt[language] || q.prompt.en,
          explanation: q.explanation[language] || q.explanation.en,
        };
      }

      objectiveBreakdown[q.objectiveCode].totalCount += 1;
      if (!isCorrect) {
        objectiveBreakdown[q.objectiveCode].failedCount += 1;
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= currentUnit.passingThreshold;

    const failedObjectives = Object.values(objectiveBreakdown).filter(
      (obj) => obj.failedCount > 0
    );

    const result: ExamAttemptResult = {
      unitId: currentUnit.unitId,
      score: correctCount,
      total: questions.length,
      percentage,
      passed,
      timestamp: new Date().toISOString(),
      userAnswers: answers,
      failedObjectives,
    };

    setAttemptResult(result);
    setExamSubmitted(true);
    localStorage.setItem(
      `nur_obj_exam_result_${selectedUnitId}`,
      JSON.stringify(result)
    );

    if (passed) {
      // Award mastery badge and register completed unit
      const badgeSlug = currentUnit.badgeName.en
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_');
      unlockBadge(badgeSlug);
      markUnitCompleted(currentUnit.unitId);
      updateUserXP(100);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000);
    }
  };

  const handleRetakeExam = () => {
    localStorage.removeItem(`nur_obj_exam_answers_${selectedUnitId}`);
    localStorage.removeItem(`nur_obj_exam_result_${selectedUnitId}`);
    setAnswers({});
    setExamSubmitted(false);
    setAttemptResult(null);
    setCurrentQuestionIdx(0);
    setFlaggedQuestions({});
    setShowConfetti(false);
  };

  // Launch secure reader directly to referenced textbook and page
  const handleOpenTextbookRemediation = (textbookRef: string) => {
    // Parse page from string like "MoE Grade 10 Math, pp. 4-10"
    const pageMatch = textbookRef.match(/(\d+)/);
    const targetPage = pageMatch ? parseInt(pageMatch[1], 10) : 1;

    // Look up book in TEXTBOOKS_REGISTRY matching current subject and grade
    const targetBook =
      TEXTBOOKS_REGISTRY.find(
        (b) =>
          b.grade === currentUnit.grade &&
          b.subjectCode.toUpperCase() === currentUnit.subjectCode.toUpperCase()
      ) || TEXTBOOKS_REGISTRY[0];

    setReaderBook(targetBook);
    setReaderPage(targetPage);
    setIsReaderOpen(true);
  };

  const currentQ: ObjectiveExamQuestion = currentUnit.questions[currentQuestionIdx];
  const isAnswered = (qId: string) => answers[qId] !== undefined;
  const totalAnswered = Object.keys(answers).length;
  const isUnitMastered = completedUnits.includes(currentUnit.unitId);

  return (
    <div className={`space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Celebration Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px] animate-pulse" />
          <div className="relative text-center p-8 bg-white/95 dark:bg-slate-900/95 border-2 border-emerald-500 rounded-2xl shadow-2xl max-w-md mx-4 animate-in zoom-in-95 duration-500">
            <span className="text-6xl animate-bounce inline-block mb-3">🏆</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {language === 'am'
                ? 'እንኳን ደስ አለዎት! ምዕራፉን በብቃት አጠናቀዋል!'
                : language === 'om'
                ? 'Baga Gammaddan! Boqonnaa kana milkoominan xumurtaniittu!'
                : language === 'ti'
                ? 'እንቋዕ ሓጎሰኩም! ነቲ ምዕራፍ ብብቕዓት ወዲእኩም!'
                : language === 'ar'
                ? 'تهانينا! لقد أتقنت كفايات الوحدة بنجاح!'
                : language === 'so'
                ? 'Hambalyo! Waxaad si guul leh u dhamaysatay cutubka!'
                : 'Congratulations! Unit Competencies Mastered!'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
              {language === 'am'
                ? `የብቃት ማረጋገጫ ባጅ ተበርክቶልዎታል፡ "${currentUnit.badgeName[language] || currentUnit.badgeName.en}"`
                : `Mastery Badge Awarded: "${currentUnit.badgeName[language] || currentUnit.badgeName.en}" (+100 XP)`}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>
                {language === 'am'
                  ? 'የሚቀጥለው ምዕራፍ ተከፍቷል (Next Unit Unlocked)'
                  : 'Next Unit Curriculum Unlocked'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner with MoE Outcomes Branding */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-800/80 border border-emerald-600/50 text-xs font-bold tracking-wide uppercase text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>MoE 2019 E.C. Outcome-Based Verification (ብቃት ማረጋገጫ)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Target className="w-7 h-7 text-emerald-400" />
              {language === 'am'
                ? 'የምዕራፍ ብቃት ማረጋገጫ ፈተና'
                : language === 'om'
                ? 'Qormaata Boqonnaa Dandeettii'
                : language === 'ti'
                ? 'ናይ ምዕራፍ ብቕዓት መረጋገፂ ፈተነ'
                : language === 'ar'
                ? 'اختبار إتقان كفايات ومخرجات الوحدة'
                : language === 'so'
                ? 'Imtixaanka Xirfadda Cutubka'
                : 'Chapter Objectives Mastery Exam Engine'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              {language === 'am'
                ? 'በኢትዮጵያ ስርዓተ-ትምህርት የተቀመጡትን ዝርዝር ብቃቶች ማሟላትዎን ያረጋግጡ። ቀጣዩን ምዕራፍ ለመክፈት ቢያንስ 75% ማግኘት ግዴታ ነው።'
                : language === 'om'
                ? 'Dandeettiiwwan sirna baruu-barsiisuu Itoophiyaa keessatti tarreeffaman mirkaneessaa. Boqonnaa itti aanu banuuf yoo xiqqaate 75% fiduun dirqama.'
                : language === 'ti'
                ? 'ኣብ ስርዓተ-ትምህርቲ ኢትዮጵያ ዝተቐመጡ ዝርዝር ብቕዓታት ምርግጋፅ። ቀፃሊ ምዕራፍ ንምኽፋት እንተወሓደ 75% ምምፃእ ግዴታ እዩ።'
                : language === 'ar'
                ? 'تحقق من استيفاء الكفايات التعليمية المحددة في المنهج الإثيوبي. يشترط تحقيق 75% فأكثر لفتح الوحدة التالية وتأكيد الإتقان.'
                : language === 'so'
                ? 'Xaqiiji inaad buuxisay xirfadaha manhajka Itoobiya. Waa qasab inaad hesho ugu yaraan 75% si aad u furto cutubka xiga.'
                : 'Verify mastery of official Ethiopian curriculum competencies. A score of ≥ 75% is strictly required to pass and unlock the next unit.'}
            </p>
          </div>

          {/* User Score Badge Summary */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 self-start md:self-auto">
            <div className="w-12 h-12 rounded-lg bg-emerald-700/80 flex items-center justify-center text-2xl shadow-inner">
              {currentUnit.badgeIcon}
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-emerald-200 font-bold">
                {language === 'am' ? 'የብቃት መስፈርት' : 'Mastery Threshold'}
              </div>
              <div className="text-lg font-black text-white">≥ 75% Pass Score</div>
              <div className="text-[11px] text-emerald-200">
                {isUnitMastered ? (
                  <span className="text-emerald-300 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Mastered (የተጠናቀቀ)
                  </span>
                ) : (
                  <span>Status: Pending Verification</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Unit Selector Strip */}
        <div className="mt-6 pt-4 border-t border-emerald-800/60 flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            {language === 'am' ? 'ምዕራፍ ይምረጡ:' : 'Select Unit:'}
          </span>
          {availableUnits.map((u) => {
            const isSelected = u.unitId === selectedUnitId;
            const isPassed = completedUnits.includes(u.unitId);
            return (
              <button
                key={u.unitId}
                type="button"
                onClick={() => setSelectedUnitId(u.unitId)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black'
                    : 'bg-emerald-950/60 text-emerald-100 border-emerald-700/60 hover:bg-emerald-800/80 hover:text-white'
                }`}
              >
                <span>{u.badgeIcon}</span>
                <span>
                  Grade {u.grade} {u.subjectName[language] || u.subjectName.en}: Unit {u.unitNumber}
                </span>
                {isPassed && (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {!examSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigator Panel (1 Col) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  {language === 'am' ? 'የጥያቄዎች ሰሌዳ' : 'Question Palette'}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {totalAnswered} / {currentUnit.questions.length}{' '}
                  {language === 'am' ? 'ተመልሷል' : 'Answered'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{
                    width: `${(totalAnswered / currentUnit.questions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Grid of Question Numbers */}
              <div className="grid grid-cols-5 gap-2 pt-1">
                {currentUnit.questions.map((q, idx) => {
                  const answered = isAnswered(q.id);
                  const isCurrent = currentQuestionIdx === idx;
                  const flagged = flaggedQuestions[q.id];

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center relative border ${
                        isCurrent
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-500/30'
                          : answered
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{idx + 1}</span>
                      {flagged && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-400" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300" />
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-600" />
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Review Flag</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>
                    {language === 'am' ? 'ፈተናውን ጨርስና አስረክብ' : 'Finish & Submit Exam'}
                  </span>
                </button>
              </div>
            </div>

            {/* Competency Information Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>
                  {language === 'am' ? 'የብቃት መመሪያ ደንብ' : 'Verification Guidelines'}
                </span>
              </div>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                <li>• Passing score: ≥ 75% ({Math.ceil(currentUnit.questions.length * 0.75)} of {currentUnit.questions.length} questions).</li>
                <li>• Real-time answer auto-save prevents progress loss.</li>
                <li>• Failure triggers immediate targeted remediation with textbook citations.</li>
              </ul>
            </div>
          </div>

          {/* Question Viewer & Options (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {/* Question Header Meta */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs">
                    Question {currentQuestionIdx + 1} of {currentUnit.questions.length}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px] font-bold">
                    {currentQ.objectiveCode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleFlag(currentQ.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 border ${
                      flaggedQuestions[currentQ.id]
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>🚩</span>
                    <span>
                      {flaggedQuestions[currentQ.id]
                        ? language === 'am'
                          ? 'ምልክት ተደርጎበታል'
                          : 'Flagged'
                        : language === 'am'
                        ? 'ለክለሳ ምልክት አድርግ'
                        : 'Flag for Review'}
                    </span>
                  </button>

                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                    📖 {currentQ.textbookPageRef}
                  </span>
                </div>
              </div>

              {/* Objective Tag Banner */}
              <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                <Target className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-700 dark:text-emerald-400 block">
                    Curriculum Competency Objective
                  </span>
                  <span className="font-semibold text-xs sm:text-sm">
                    {currentQ.objectiveTitle[language] || currentQ.objectiveTitle.en}
                  </span>
                </div>
              </div>

              {/* Question Stem */}
              <div className="space-y-3">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.prompt[language] || currentQ.prompt.en}
                </h2>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = answers[currentQ.id] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectAnswer(currentQ.id, optIdx)}
                      className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 font-bold text-emerald-950 dark:text-emerald-100 shadow-sm ring-1 ring-emerald-500'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-emerald-400 dark:hover:border-emerald-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer Controls: Prev / Next */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
                  className="px-4 py-2 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{language === 'am' ? 'ቀዳሚ ጥያቄ' : 'Previous'}</span>
                </button>

                {currentQuestionIdx < currentUnit.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white flex items-center gap-1 shadow-sm"
                  >
                    <span>{language === 'am' ? 'ቀጣይ ጥያቄ' : 'Next'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-md"
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    <span>{language === 'am' ? 'ፈተናውን አስረክብ' : 'Review & Submit'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Results & Remediation Pathway View */
        <div className="space-y-6 animate-in fade-in duration-300">
          {attemptResult && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {/* Score Header */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="space-y-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-1"
                    style={{
                      backgroundColor: attemptResult.passed ? '#dcfce7' : '#fee2e2',
                      color: attemptResult.passed ? '#15803d' : '#b91c1c',
                    }}
                  >
                    {attemptResult.passed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mastery Verified (ብቃት ተረጋግጧል)</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4" />
                        <span>Remediation Required (ማካካሻ ያስፈልጋል)</span>
                      </>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {currentUnit.unitTitle[language] || currentUnit.unitTitle.en}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Exam evaluated on {new Date(attemptResult.timestamp).toLocaleString()}
                  </p>
                </div>

                {/* Score Dial & Retake Button */}
                <div className="flex items-center gap-4">
                  <div className="text-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 min-w-[110px]">
                    <div className="text-3xl font-black"
                      style={{ color: attemptResult.passed ? '#16a34a' : '#dc2626' }}
                    >
                      {attemptResult.percentage}%
                    </div>
                    <div className="text-[11px] font-bold text-slate-500">
                      {attemptResult.score} / {attemptResult.total} Correct
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRetakeExam}
                    className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>
                      {language === 'am' ? 'እንደገና ይሞክሩ' : 'Retake Exam'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Passed: Mastery Achievement Box */}
              {attemptResult.passed ? (
                <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentUnit.badgeIcon}</span>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        Official Unit Mastery Badge Issued
                      </span>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {currentUnit.badgeName[language] || currentUnit.badgeName.en}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200">
                    {language === 'am'
                      ? 'እንኳን ደስ አለዎት! የዚህን ምዕራፍ የትምህርት ሚኒስቴር የብቃት መመዘኛዎች ከ 75% በላይ በማስመዝገብ አረጋግጠዋል። ቀጣዩ የትምህርት ምዕራፍ እና አሳይመንት ሙሉ በሙሉ ተከፍቷል።'
                      : 'You have achieved over 75% on the MoE competency objectives. The curriculum checklist has been updated in your profile and the subsequent unit is now fully unlocked!'}
                  </p>
                </div>
              ) : (
                /* Failed: Remediation Pathway */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-2">
                    <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <span>
                        {language === 'am'
                          ? 'የማካካሻ የትምህርት መስመር (Remediation Pathway)'
                          : 'Remediation Pathway: Objectives Requiring Review'}
                      </span>
                    </div>
                    <p className="text-xs text-amber-800 dark:text-amber-300">
                      {language === 'am'
                        ? 'ውጤትዎ ከ 75% በታች ነው። የሚቀጥለውን ምዕራፍ ለመክፈት ከዚህ በታች የተዘረዘሩትን የተሳሳቱባቸውን ብቃቶች ከመማሪያ መጽሐፉ ገፅ ጋር በማመሳከር ይከልሱ እና ፈተናውን እንደገና ይውሰዱ።'
                        : 'Your score was below 75%. To unlock the subsequent chapter, review the exact competencies failed below using the official textbook page references and retake the exam.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      {language === 'am' ? 'የተለዩ የተሳሳቱ ብቃቶች' : 'Failed Competency Objectives'}
                    </h4>

                    {attemptResult.failedObjectives.map((obj) => (
                      <div
                        key={obj.code}
                        className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-mono text-xs font-bold">
                              {obj.code}
                            </span>
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {obj.title}
                            </span>
                          </div>
                          <span className="text-xs text-rose-600 font-bold">
                            {obj.failedCount} of {obj.totalCount} Missed
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                          <div className="text-[11px] font-bold text-slate-500 uppercase">
                            Concept Explanation & Misconception Analysis:
                          </div>
                          <p className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60 text-[11px] sm:text-xs">
                            {obj.explanation}
                          </p>
                        </div>

                        {/* Direct Textbook Reading Link Button */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            {obj.textbookRef}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleOpenTextbookRemediation(obj.textbookRef)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                          >
                            <span>
                              {language === 'am' ? 'በመጽሐፉ ገፅ ክለሳ ጀምር' : 'Review in Secure Reader'}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Question by Question Review */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {language === 'am' ? 'የጥያቄዎች ሙሉ ክለሳ' : 'Full Question Audit & Answers'}
                  </span>
                </h3>

                <div className="space-y-4">
                  {currentUnit.questions.map((q, qIdx) => {
                    const userAns = attemptResult.userAnswers[q.id];
                    const isCorrect = userAns === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border text-xs space-y-3 ${
                          isCorrect
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                            Q{qIdx + 1}. {q.prompt[language] || q.prompt.en}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                              isCorrect
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>

                        <div className="space-y-1 text-slate-600 dark:text-slate-300">
                          <div>
                            <span className="font-bold text-slate-500">Your Answer: </span>
                            <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                              {userAns !== undefined ? q.options[userAns] : 'Not answered'}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div>
                              <span className="font-bold text-emerald-600">Correct Answer: </span>
                              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                                {q.options[q.correctIndex]}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                          <span className="font-bold text-slate-700 dark:text-slate-300">Explanation: </span>
                          <span>{q.explanation[language] || q.explanation.en}</span>
                          <div className="mt-1 text-emerald-600 font-semibold">
                            Citation: {q.textbookPageRef}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal before Submit */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">
                  {language === 'am' ? 'ፈተናውን ለማስረከብ እርግጠኛ ነዎት?' : 'Confirm Submission'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'am'
                    ? 'ውጤትዎ ወዲያውኑ ይሰላል እና የብቃት ማረጋገጫው ይከናወናል።'
                    : 'Your answers will be graded against the 75% mastery threshold.'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1.5 border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Questions:</span>
                <span className="font-bold">{currentUnit.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Answered:</span>
                <span className="font-bold text-emerald-600">{totalAnswered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Unanswered:</span>
                <span className="font-bold text-rose-500">
                  {currentUnit.questions.length - totalAnswered}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {language === 'am' ? 'ይቅር / ተመለስ' : 'Cancel & Resume'}
              </button>
              <button
                type="button"
                onClick={handleSubmitExam}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                {language === 'am' ? 'አስረክብ / Submit' : 'Submit Exam Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secure Reader Integration Modal */}
      {readerBook && (
        <SecureBookReaderModal
          book={readerBook}
          initialPage={readerPage}
          isOpen={isReaderOpen}
          onClose={() => setIsReaderOpen(false)}
        />
      )}
    </div>
  );
};

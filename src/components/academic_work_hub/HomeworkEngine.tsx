import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { useLanguage } from '../../context/LanguageContext';
import { CURRICULUM_HOMEWORK_BANK } from '../../data/academicWorkHubData';
import { getCurriculumByGrade } from '../../data/curriculum';
import { HomeworkQuestion } from '../../types/academicWorkHub';
import {
  AcademicWorkHubService,
  FREE_HOMEWORK_LIMIT_PER_CHAPTER,
} from '../../services/academicWorkHubService';
import { authFetch } from '../../services/apiClient';
import { SubscriptionPaymentModal } from '../growth/SubscriptionPaymentModal';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookMarked,
  Award,
  Calculator,
  Compass,
  Lightbulb,
  Lock,
  Crown,
  Layers,
  AlertTriangle,
} from 'lucide-react';

export const HomeworkEngine: React.FC = () => {
  const { activeGrade, currentUser, isSuperAdmin, updateUserXP } = useAuth();
  const { isPremiumLearningUnlocked, premiumLearningPrice } = useSubscription();
  const { t } = useLanguage();

  const isPremiumMember = isSuperAdmin || isPremiumLearningUnlocked;
  const premiumPrice = premiumLearningPrice || 57;

  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedChapter, setSelectedChapter] = useState<string>('All');
  const [activeHintLevels, setActiveHintLevels] = useState<Record<string, number>>({});
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [evaluations, setEvaluations] = useState<
    Record<string, { isCorrect: boolean; message: string; score: number }>
  >({});

  const [aiGenerating, setAiGenerating] = useState(false);
  const [extraAiQuestions, setExtraAiQuestions] = useState<HomeworkQuestion[]>(() =>
    AcademicWorkHubService.getSavedAiHomeworkQuestions(currentUser.id)
  );
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [limitNotice, setLimitNotice] = useState<string | null>(null);

  // Sync saved answers and AI homework when user changes
  useEffect(() => {
    const saved = AcademicWorkHubService.getHomeworkAnswers(currentUser.id);
    const initial: Record<string, { isCorrect: boolean; message: string; score: number }> = {};
    Object.keys(saved).forEach((k) => {
      initial[k] = {
        isCorrect: saved[k].isCorrect,
        message: saved[k].isCorrect ? 'ትክክለኛ መልስ! (Correct Answer)' : 'እንደገና ይሞክሩ (Incorrect)',
        score: saved[k].score || 15,
      };
    });
    setEvaluations(initial);
    setExtraAiQuestions(AcademicWorkHubService.getSavedAiHomeworkQuestions(currentUser.id));
  }, [currentUser.id]);

  // Reset chapter filter when grade or subject changes
  useEffect(() => {
    setSelectedChapter('All');
    setLimitNotice(null);
  }, [activeGrade, selectedSubject]);

  // Curriculum chapters (with their true subject) for current grade & subject
  const { availableChapters, chapterSubjectMap } = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    const subjMap = new Map<string, string>();
    const addChapter = (ch: string | undefined, subj: string) => {
      const clean = (ch || '').trim();
      const lower = clean.toLowerCase();
      if (clean && !seen.has(lower)) {
        seen.add(lower);
        list.push(clean);
        subjMap.set(lower, subj);
      }
    };

    const matchesSubject = (subj: string) =>
      selectedSubject === 'All' ||
      subj.toLowerCase() === selectedSubject.toLowerCase() ||
      subj.toLowerCase().includes(selectedSubject.toLowerCase());

    CURRICULUM_HOMEWORK_BANK.forEach((q) => {
      if (q.grade === activeGrade && matchesSubject(q.subject)) {
        addChapter(q.chapter, q.subject);
      }
    });

    extraAiQuestions.forEach((q) => {
      if (q.grade === activeGrade && matchesSubject(q.subject)) {
        addChapter(q.chapter, q.subject);
      }
    });

    const gradeCurriculum = getCurriculumByGrade(activeGrade);
    gradeCurriculum.forEach((subj) => {
      if (matchesSubject(subj.name.en)) {
        subj.units.forEach((u) => {
          addChapter(`Unit ${u.unitNumber}: ${u.title}`, subj.name.en);
        });
      }
    });

    return { availableChapters: list, chapterSubjectMap: subjMap };
  }, [activeGrade, selectedSubject, extraAiQuestions]);

  // All questions for active grade ordered deterministically (bank first, then chronological AI questions)
  const allGradeQuestions = useMemo(() => {
    const bankForGrade = CURRICULUM_HOMEWORK_BANK.filter((q) => q.grade === activeGrade);
    const aiForGrade = extraAiQuestions.filter((q) => q.grade === activeGrade);
    return [...bankForGrade, ...aiForGrade];
  }, [activeGrade, extraAiQuestions]);

  // Compute per-chapter total counts and 1-based ordinal index per question
  const { chapterCountMap, questionChapterOrdinalMap } = useMemo(() => {
    const counts = new Map<string, number>();
    const ordinals = new Map<string, number>();

    allGradeQuestions.forEach((q) => {
      const cKey = AcademicWorkHubService.getChapterKey(q.grade, q.subject, q.chapter);
      const nextOrdinal = (counts.get(cKey) || 0) + 1;
      counts.set(cKey, nextOrdinal);
      ordinals.set(q.id, nextOrdinal);
    });

    return { chapterCountMap: counts, questionChapterOrdinalMap: ordinals };
  }, [allGradeQuestions]);

  const filteredQuestions = useMemo(() => {
    return allGradeQuestions.filter((q) => {
      const subjectMatch =
        selectedSubject === 'All' || q.subject.toLowerCase() === selectedSubject.toLowerCase();
      const chapterMatch =
        selectedChapter === 'All' ||
        q.chapter.trim().toLowerCase() === selectedChapter.trim().toLowerCase();
      return subjectMatch && chapterMatch;
    });
  }, [allGradeQuestions, selectedSubject, selectedChapter]);

  // Target subject/chapter context for generation & quota bar
  const targetChapter =
    selectedChapter !== 'All'
      ? selectedChapter
      : availableChapters[0] || 'Unit 1: Core Curriculum Chapter';
  const targetSubject =
    selectedSubject === 'All'
      ? chapterSubjectMap.get(targetChapter.trim().toLowerCase()) || 'Mathematics'
      : selectedSubject;

  const targetChapterKey = AcademicWorkHubService.getChapterKey(
    activeGrade,
    targetSubject,
    targetChapter
  );
  const currentTargetChapterCount = chapterCountMap.get(targetChapterKey) || 0;
  const targetChapterAtFreeLimit =
    !isPremiumMember && currentTargetChapterCount >= FREE_HOMEWORK_LIMIT_PER_CHAPTER;

  const handleRevealHint = (qId: string, isLocked: boolean) => {
    if (isLocked) {
      setIsPaymentModalOpen(true);
      return;
    }
    setActiveHintLevels((prev) => {
      const current = prev[qId] || 0;
      return { ...prev, [qId]: Math.min(current + 1, 3) };
    });
  };

  const handleEvaluateAnswer = (
    q: HomeworkQuestion,
    isLocked: boolean,
    chosenAnswer?: string | number
  ) => {
    if (isLocked) {
      setIsPaymentModalOpen(true);
      return;
    }
    const inputVal = chosenAnswer !== undefined ? chosenAnswer : userInputs[q.id];
    if (inputVal === undefined || inputVal === '') return;

    let isCorrect = false;
    let feedback = '';

    if (q.type === 'mcq') {
      const chosenIdx = Number(inputVal);
      isCorrect = chosenIdx === q.correctOptionIndex;
      feedback = isCorrect
        ? 'ትክክለኛ መልስ! የብዜት ቴዎረምን በትክክል ተጠቅመዋል።'
        : 'የተሳሳተ ምርጫ ነው። እባክዎ የቀረበውን የደረጃ በደረጃ ስሌት ይመልከቱ።';
    } else if (q.type === 'numerical') {
      const numVal = parseFloat(String(inputVal).trim());
      const target = q.correctNumericalAnswer ?? 0;
      const tol = q.numericalTolerance ?? 0.05;
      isCorrect = !isNaN(numVal) && Math.abs(numVal - target) <= tol;
      feedback = isCorrect
        ? `ትክክለኛ ስሌት! ${target} ${q.unitOfMeasure || ''} በትክክል ተሰልቷል።`
        : `ትክክል አይደለም። የሚጠበቀው መልስ ${target} ${q.unitOfMeasure || ''} ነበር።`;
    } else {
      const text = String(inputVal).toLowerCase();
      const matched = q.expectedKeyTerms?.some((term) => text.includes(term.toLowerCase()));
      isCorrect = Boolean(matched);
      feedback = isCorrect
        ? 'ትክክለኛ ማብራሪያ! ቁልፍ ቃላትን በትክክል አካተዋል።'
        : 'ማብራሪያዎ ሙሉ አይደለም፤ የቀረበውን ይፋዊ የመማሪያ መጽሐፍ መልስ ያንብቡ።';
    }

    const score = isCorrect ? q.points : 0;
    setEvaluations((prev) => ({
      ...prev,
      [q.id]: { isCorrect, message: feedback, score },
    }));

    AcademicWorkHubService.saveHomeworkAnswer(currentUser.id, q.id, inputVal, isCorrect, score);

    if (isCorrect) {
      updateUserXP(q.points * 3);
    }
  };

  const handleGenerateAIHomework = async () => {
    setLimitNotice(null);

    if (!isPremiumMember && currentTargetChapterCount >= FREE_HOMEWORK_LIMIT_PER_CHAPTER) {
      setLimitNotice(
        `በ"${targetChapter}" ውስጥ ያሉትን ${FREE_HOMEWORK_LIMIT_PER_CHAPTER} ነፃ የቤት ስራ ጥያቄዎች ተጠቅመዋል። ከ5 በላይ ጥያቄዎችን ለመጠቀም የPremium አባል መሆን አለብዎት (${premiumPrice} ETB/ወር)።`
      );
      setIsPaymentModalOpen(true);
      return;
    }

    const remainingFree = FREE_HOMEWORK_LIMIT_PER_CHAPTER - currentTargetChapterCount;
    const requestedCount = isPremiumMember ? 2 : Math.min(2, Math.max(1, remainingFree));
    const staticCountInChapter = CURRICULUM_HOMEWORK_BANK.filter(
      (q) =>
        q.grade === activeGrade &&
        AcademicWorkHubService.getChapterKey(q.grade, q.subject, q.chapter) === targetChapterKey
    ).length;

    setAiGenerating(true);
    try {
      const res = await authFetch('/api/ai/exam-gen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: activeGrade,
          subject: targetSubject,
          count: requestedCount,
          chapter: targetChapter,
          difficulty: 'standard',
          language: 'am',
          purpose: 'homework',
          staticCountInChapter,
        }),
      });
      const data = await res.json();

      if (res.status === 402 || data?.code === 'HOMEWORK_CHAPTER_LIMIT_REACHED') {
        setLimitNotice(
          data?.error ||
            `ነፃ የቤት ስራ በአንድ ቻፕተር ውስጥ ${FREE_HOMEWORK_LIMIT_PER_CHAPTER} ጥያቄ ብቻ ነው። ከ5 በላይ ለመጠቀም Premium አባል ይሁኑ።`
        );
        setIsPaymentModalOpen(true);
        return;
      }

      if (data.success && Array.isArray(data.questions)) {
        const generated: HomeworkQuestion[] = data.questions.map((item: any, i: number) => {
          const safeExplanation = String(item?.explanation || 'በኢትዮጵያ አዲሱ ስርዓተ-ትምህርት መሰረት የተዘጋጀ ማብራሪያ።');
          const safeOptions =
            Array.isArray(item?.options) && item.options.length > 0
              ? item.options.map((o: any) => String(o))
              : ['A. Option 1', 'B. Option 2', 'C. Option 3', 'D. Option 4'];
          return {
            id: `ai-hw-${Date.now()}-${i}`,
            grade: activeGrade,
            subject: targetSubject,
            unit: targetChapter,
            chapter: targetChapter,
            topic: String(item?.competenceTopic || 'AI Generated Homework Practice'),
            type: 'mcq',
            prompt: String(item?.question || 'Practice Question'),
            options: safeOptions,
            correctOptionIndex: Number.isInteger(item?.correctIndex) ? item.correctIndex : 0,
            sampleSolution: safeExplanation,
            stepByStepDerivation: [
              'ደረጃ 1: የጥያቄውን መረጃ በጥንቃቄ መለየት',
              'ደረጃ 2: ተዛማጅ የሆነውን የMoE ቀመር ማስታወስ',
              'ደረጃ 3: ' + safeExplanation,
            ],
            textbookCitation: {
              grade: activeGrade,
              subject: targetSubject,
              unit: targetChapter,
              pageNumber: 'Continuous Exercise',
              edition: 'MoE New Curriculum 2019 E.C.',
            },
            hints: {
              level1Nudge: 'ጥያቄውን በጥንቃቄ በማንበብ ምን እንደተሰጠና ምን እንደሚፈለግ ለዩ።',
              level2FormulaClue: 'ከአዲሱ የኢትዮጵያ ስርዓተ-ትምህርት ጋር የተያያዘውን ቀመር ይጠቀሙ።',
              level3Setup: safeExplanation.substring(0, 80) + '...',
            },
            points: 15,
          };
        });

        setExtraAiQuestions((prev) => {
          const updated = [...prev, ...generated];
          AcademicWorkHubService.saveAiHomeworkQuestions(currentUser.id, updated);
          return updated;
        });
        updateUserXP(40);
      } else if (!res.ok || data?.error) {
        setLimitNotice(data?.error || 'ጥያቄውን ማመንጨት አልተቻለም። እባክዎ እንደገና ይሞክሩ።');
      }
    } catch {
      setLimitNotice('የኔትዎርክ ግንኙነት ችግር አጋጥሟል። እባክዎ እንደገና ይሞክሩ።');
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Filter Controls */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {isPremiumMember ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/40">
              <Crown className="w-3.5 h-3.5" />
              Premium Unlimited Access • ያልተገደበ የክፍል {activeGrade} የቤት ስራ
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              ነፃ ሙከራ: በአንድ ቻፕተር {FREE_HOMEWORK_LIMIT_PER_CHAPTER} ጥያቄ ብቻ • Free: {FREE_HOMEWORK_LIMIT_PER_CHAPTER} Questions / Chapter
            </div>
          )}
          <h2 className="text-xl sm:text-2xl font-black">
            የአዲሱ ስርዓተ-ትምህርት የቤት ስራ እና ልምምድ (Homework Engine)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            {isPremiumMember
              ? 'በእያንዳንዱ ቻፕተር ውስጥ ያልተገደበ የቤት ስራ እና AI ጥያቄዎችን በነፃነት መስራት ይችላሉ።'
              : `በእያንዳንዱ ቻፕተር ውስጥ የመጀመሪያዎቹ ${FREE_HOMEWORK_LIMIT_PER_CHAPTER} ጥያቄዎች ነፃ ናቸው። ከ${FREE_HOMEWORK_LIMIT_PER_CHAPTER} በተጨማሪ ጥያቄዎችን ለመጠቀም የPremium አባል መሆን አለብዎት (${premiumPrice} ETB/ወር)።`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {targetChapterAtFreeLimit ? (
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition"
            >
              <Lock className="w-4 h-4" />
              ከ5 በላይ ለማመንጨት Premium ይሁኑ ({premiumPrice} ETB)
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerateAIHomework}
              disabled={aiGenerating}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${aiGenerating ? 'animate-spin' : ''}`} />
              {aiGenerating ? 'በማመንጨት ላይ...' : '+ አዲስ AI የቤት ስራ ጨምር'}
            </button>
          )}
        </div>
      </div>

      {/* Subject & Chapter Filter Controls */}
      <div className="space-y-3">
        {/* Subject Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology'].map((subj) => (
            <button
              key={subj}
              type="button"
              onClick={() => setSelectedSubject(subj)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                selectedSubject === subj
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
              }`}
            >
              {subj === 'All' ? 'ሁሉም የትምህርት አይነቶች (All)' : subj}
            </button>
          ))}
        </div>

        {/* Chapter Filter & Quota Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <Layers className="w-4 h-4 text-emerald-500 shrink-0" />
            <label
              htmlFor="hw-chapter-select"
              className="text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0"
            >
              ቻፕተር (Chapter):
            </label>
            <select
              id="hw-chapter-select"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">ሁሉም ቻፕተሮች (All Chapters — {availableChapters.length})</option>
              {availableChapters.map((ch) => {
                const chSubj =
                  selectedSubject === 'All'
                    ? chapterSubjectMap.get(ch.trim().toLowerCase()) || 'Mathematics'
                    : selectedSubject;
                const cKey = AcademicWorkHubService.getChapterKey(activeGrade, chSubj, ch);
                const count = chapterCountMap.get(cKey) || 0;
                return (
                  <option key={ch} value={ch}>
                    {ch} ({count} {!isPremiumMember ? `/ ${FREE_HOMEWORK_LIMIT_PER_CHAPTER} ነፃ` : 'ጥያቄዎች'})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isPremiumMember ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-xs font-extrabold">
                <Crown className="w-3.5 h-3.5" />
                ያልተገደበ (Unlimited)
              </span>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="text-right">
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    የቻፕተሩ ነፃ ኮታ: {Math.min(currentTargetChapterCount, FREE_HOMEWORK_LIMIT_PER_CHAPTER)} /{' '}
                    {FREE_HOMEWORK_LIMIT_PER_CHAPTER}
                  </div>
                  <div className="w-28 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full transition-all ${
                        targetChapterAtFreeLimit ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (currentTargetChapterCount / FREE_HOMEWORK_LIMIT_PER_CHAPTER) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                {targetChapterAtFreeLimit && (
                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold transition flex items-center gap-1"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    Premium ይክፈቱ
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Limit Reached Notice Banner */}
      {limitNotice && !isPremiumMember && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-900 dark:text-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <span>{limitNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shrink-0 transition"
          >
            Premium አባል ይሁኑ ({premiumPrice} ETB/ወር)
          </button>
        </div>
      )}

      {/* Question Cards Grid */}
      <div className="space-y-5">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500">
            <BookOpen className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <p className="font-bold">በዚህ መስፈርት የተዘጋጀ የቤት ስራ የለም።</p>
            <p className="text-xs text-slate-400 mt-1">
              እባክዎ ሌላ ቻፕተር/የትምህርት አይነት ይምረጡ ወይም "+ አዲስ AI የቤት ስራ ጨምር" የሚለውን ይጫኑ (በቻፕተር {FREE_HOMEWORK_LIMIT_PER_CHAPTER} ጥያቄ ነፃ)።
            </p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const evalResult = evaluations[q.id];
            const hintLevel = activeHintLevels[q.id] || 0;
            const chapterOrdinal = questionChapterOrdinalMap.get(q.id) || 1;
            const isLocked = !isPremiumMember && chapterOrdinal > FREE_HOMEWORK_LIMIT_PER_CHAPTER;

            return (
              <div
                key={q.id}
                className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border shadow-sm space-y-4 transition ${
                  isLocked
                    ? 'border-amber-500/40 bg-amber-500/[0.02]'
                    : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/30'
                }`}
              >
                {/* Question Header & Citation */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                        isLocked
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                        Grade {q.grade} • {q.subject} • የቻፕተር ጥያቄ #{chapterOrdinal}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {q.unit} → {q.chapter}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isLocked ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 text-[11px] font-extrabold border border-amber-500/30">
                        <Lock className="w-3 h-3" />
                        Premium Only (#{chapterOrdinal})
                      </span>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700">
                        <BookMarked className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{q.textbookCitation.pageNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isLocked ? (
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-amber-500/30 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      ነፃ የቤት ስራ በአንድ ቻፕተር ውስጥ {FREE_HOMEWORK_LIMIT_PER_CHAPTER} ጥያቄ ብቻ ነው
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                      ይህ ጥያቄ (#{chapterOrdinal}) ከአምስት በላይ ስለሆነ ለማንበብ፣ ለመስራት እና መልሱን ለማረጋገጥ የPremium አባል መሆን አለብዎት።
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-extrabold shadow-md inline-flex items-center gap-2 transition"
                    >
                      <Crown className="w-4 h-4" />
                      Premium አባል ይሁኑ — ያልተገደበ ክፈት ({premiumPrice} ETB/ወር)
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Prompt */}
                    <div className="text-slate-900 dark:text-white font-medium text-sm sm:text-base leading-relaxed">
                      {q.prompt}
                    </div>

                    {/* Interaction Section by Type */}
                    {q.type === 'mcq' && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userInputs[q.id] === String(optIdx);
                          const isCorrectOpt = q.correctOptionIndex === optIdx;

                          let btnStyle =
                            'border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200';
                          if (evalResult) {
                            if (isCorrectOpt) {
                              btnStyle =
                                'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold';
                            } else if (isSelected && !evalResult.isCorrect) {
                              btnStyle =
                                'border-red-500 bg-red-50 dark:bg-red-950/60 text-red-900 dark:text-red-200 font-bold';
                            }
                          } else if (isSelected) {
                            btnStyle =
                              'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => {
                                setUserInputs((prev) => ({ ...prev, [q.id]: String(optIdx) }));
                                handleEvaluateAnswer(q, isLocked, optIdx);
                              }}
                              className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {evalResult && isCorrectOpt && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                              {evalResult && isSelected && !evalResult.isCorrect && (
                                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'numerical' && (
                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative flex-1">
                          <Calculator className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="number"
                            step="any"
                            placeholder={`መልስዎን ያስገቡ (${q.unitOfMeasure || 'ቁጥር'})...`}
                            value={userInputs[q.id] || ''}
                            onChange={(e) =>
                              setUserInputs((prev) => ({ ...prev, [q.id]: e.target.value }))
                            }
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleEvaluateAnswer(q, isLocked)}
                          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition shadow-sm"
                        >
                          አረጋግጥ / Verify
                        </button>
                      </div>
                    )}

                    {q.type === 'short_answer' && (
                      <div className="pt-2 space-y-2">
                        <textarea
                          rows={2}
                          placeholder="አጭር መልስዎን ወይም ቀመሩን እዚህ ይጻፉ..."
                          value={userInputs[q.id] || ''}
                          onChange={(e) =>
                            setUserInputs((prev) => ({ ...prev, [q.id]: e.target.value }))
                          }
                          className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleEvaluateAnswer(q, isLocked)}
                          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition shadow-sm"
                        >
                          አስረክብ / Submit
                        </button>
                      </div>
                    )}

                    {/* 3-Level Hint Scaffolding Drawer */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleRevealHint(q.id, isLocked)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                        >
                          <Lightbulb className="w-3.5 h-3.5" />
                          {hintLevel === 0 && 'ፍንጭ አሳይ (Level 1 Hint)'}
                          {hintLevel === 1 && 'ቀጣይ የቀመር ፍንጭ (Level 2 Formula Clue)'}
                          {hintLevel === 2 && 'የስሌት ፍንጭ (Level 3 Algebraic Roadmap)'}
                          {hintLevel >= 3 && 'ሁሉም 3ቱ ፍንጮች ታይተዋል (All Hints Active)'}
                        </button>

                        <span className="text-[11px] text-slate-400 font-semibold">
                          +{q.points} XP የትምህርት ነጥብ
                        </span>
                      </div>

                      {hintLevel >= 1 && (
                        <div className="mt-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1.5 animate-in fade-in">
                          <div className="font-bold flex items-center gap-1 text-amber-600 dark:text-amber-400">
                            <Compass className="w-3.5 h-3.5" />
                            Level 1 Intuitive Nudge:
                          </div>
                          <p>{q.hints.level1Nudge}</p>

                          {hintLevel >= 2 && (
                            <div className="pt-2 border-t border-amber-500/20">
                              <div className="font-bold text-amber-600 dark:text-amber-400">
                                Level 2 Formula Clue:
                              </div>
                              <p>{q.hints.level2FormulaClue}</p>
                            </div>
                          )}

                          {hintLevel >= 3 && (
                            <div className="pt-2 border-t border-amber-500/20">
                              <div className="font-bold text-amber-600 dark:text-amber-400">
                                Level 3 Algebraic Roadmap:
                              </div>
                              <p>{q.hints.level3Setup}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Instant Evaluation Card & Step-by-Step Breakdown */}
                    {evalResult && (
                      <div
                        className={`p-4 rounded-2xl border text-xs sm:text-sm animate-in fade-in space-y-3 ${
                          evalResult.isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/40 text-emerald-950 dark:text-emerald-100'
                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <div className="flex items-center gap-2">
                            {evalResult.isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                            )}
                            <span>{evalResult.message}</span>
                          </div>
                          {evalResult.isCorrect && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px]">
                              +{evalResult.score} XP የተገኘ
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5 text-xs border-t border-slate-200 dark:border-slate-700/60 pt-2.5">
                          <div className="font-extrabold text-slate-900 dark:text-white">
                            ትክክለኛ የደረጃ በደረጃ ስሌት (Step-by-Step Derivation):
                          </div>
                          <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300">
                            {q.stepByStepDerivation.map((step, sIdx) => (
                              <li key={sIdx}>{step}</li>
                            ))}
                          </ol>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          <Award className="w-3 h-3 text-emerald-500" />
                          <span>
                            {q.textbookCitation.edition} • {q.textbookCitation.unit} (
                            {q.textbookCitation.pageNumber})
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Upgrade Banner when free limit is reached on the active chapter */}
      {targetChapterAtFreeLimit && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-slate-900 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Crown className="w-4 h-4" />
              የቻፕተር ነፃ ገደብ ተሞልቷል (5 / 5 Used)
            </div>
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              በ"{targetChapter}" ውስጥ ያሉትን 5 ነፃ ጥያቄዎች ተጠቅመዋል
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              ከአምስት በተጨማሪ ያልተገደቡ የቤት ስራ ጥያቄዎችን ለመጠቀም Premium አባል መሆን አለብዎት ({premiumPrice} ETB/ወር)።
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs sm:text-sm font-extrabold shadow-lg shrink-0 flex items-center gap-2 transition"
          >
            <Crown className="w-4 h-4" />
            Premium አባል ይሁኑ ({premiumPrice} ETB/ወር)
          </button>
        </div>
      )}

      <SubscriptionPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        product="premium"
        singlePriceETB={premiumPrice}
        targetItemTitle={`ያልተገደበ የቤት ስራ (ከ${FREE_HOMEWORK_LIMIT_PER_CHAPTER} በላይ ጥያቄዎች በቻፕተር)`}
      />
    </div>
  );
};

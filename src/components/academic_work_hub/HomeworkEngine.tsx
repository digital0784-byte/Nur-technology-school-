import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { CURRICULUM_HOMEWORK_BANK } from '../../data/academicWorkHubData';
import { HomeworkQuestion } from '../../types/academicWorkHub';
import { AcademicWorkHubService } from '../../services/academicWorkHubService';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookMarked,
  Award,
  RefreshCw,
  Calculator,
  Compass,
  Lightbulb,
} from 'lucide-react';

export const HomeworkEngine: React.FC = () => {
  const { activeGrade, currentUser, updateUserXP } = useAuth();
  const { t } = useLanguage();

  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [activeHintLevels, setActiveHintLevels] = useState<Record<string, number>>({});
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [evaluations, setEvaluations] = useState<
    Record<string, { isCorrect: boolean; message: string; score: number }>
  >(() => {
    const saved = AcademicWorkHubService.getHomeworkAnswers(currentUser.id);
    const initial: Record<string, any> = {};
    Object.keys(saved).forEach((k) => {
      initial[k] = {
        isCorrect: saved[k].isCorrect,
        message: saved[k].isCorrect ? 'ትክክለኛ መልስ! (Correct Answer)' : 'እንደገና ይሞክሩ (Incorrect)',
        score: saved[k].score || 15,
      };
    });
    return initial;
  });

  const [aiGenerating, setAiGenerating] = useState(false);
  const [extraAiQuestions, setExtraAiQuestions] = useState<HomeworkQuestion[]>([]);

  // Filter questions based on selected grade and subject
  const allQuestions = [...CURRICULUM_HOMEWORK_BANK, ...extraAiQuestions];
  const filteredQuestions = allQuestions.filter((q) => {
    const gradeMatch = q.grade === activeGrade || activeGrade === 10; // show all grade 10 or current
    const subjectMatch = selectedSubject === 'All' || q.subject.toLowerCase() === selectedSubject.toLowerCase();
    return gradeMatch && subjectMatch;
  });

  const handleRevealHint = (qId: string) => {
    setActiveHintLevels((prev) => {
      const current = prev[qId] || 0;
      return { ...prev, [qId]: Math.min(current + 1, 3) };
    });
  };

  const handleEvaluateAnswer = (q: HomeworkQuestion, chosenAnswer?: string | number) => {
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
    setAiGenerating(true);
    try {
      const res = await fetch('/api/ai/exam-gen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: activeGrade,
          subject: selectedSubject === 'All' ? 'Mathematics' : selectedSubject,
          count: 2,
          chapter: 'FDRE MoE Curriculum Standard 2019 E.C.',
          difficulty: 'standard',
          language: 'am',
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.questions)) {
        const generated: HomeworkQuestion[] = data.questions.map((item: any, i: number) => ({
          id: `ai-hw-${Date.now()}-${i}`,
          grade: activeGrade,
          subject: selectedSubject === 'All' ? 'Mathematics' : selectedSubject,
          unit: 'MoE Core Competency',
          chapter: item.competenceTopic || 'General Chapter',
          topic: item.competenceTopic || 'AI Generated Homework Practice',
          type: 'mcq',
          prompt: item.question,
          options: item.options,
          correctOptionIndex: item.correctIndex ?? 0,
          sampleSolution: item.explanation,
          stepByStepDerivation: [
            'ደረጃ 1: የጥያቄውን መረጃ በጥንቃቄ መለየት',
            'ደረጃ 2: ተዛማጅ የሆነውን የMoE ቀመር ማስታወስ',
            'ደረጃ 3: ' + item.explanation,
          ],
          textbookCitation: {
            grade: activeGrade,
            subject: selectedSubject === 'All' ? 'Mathematics' : selectedSubject,
            unit: 'MoE Standard 2019 E.C.',
            pageNumber: 'Continuous Exercise',
            edition: 'MoE New Curriculum 2019 E.C.',
          },
          hints: {
            level1Nudge: 'ጥያቄውን በጥንቃቄ በማንበብ ምን እንደተሰጠና ምን እንደሚፈለግ ለዩ።',
            level2FormulaClue: 'ከአዲሱ የኢትዮጵያ ስርዓተ-ትምህርት ጋር የተያያዘውን ቀመር ይጠቀሙ።',
            level3Setup: item.explanation.substring(0, 80) + '...',
          },
          points: 15,
        }));
        setExtraAiQuestions((prev) => [...generated, ...prev]);
        updateUserXP(40);
      }
    } catch {
      // ignore
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Filter Controls */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            100% Free & Open Access • የክፍል {activeGrade} የቤት ስራ ሞተር
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            የአዲሱ ስርዓተ-ትምህርት የቤት ስራ እና ልምምድ (Homework Engine)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            በኢትዮጵያ አዲሱ ስርዓተ-ትምህርት (2019 E.C.) መሰረት የተዘጋጁ ጽንሰ-ሃሳባዊ፣ ስሌታዊ እና አጭር መልስ ጥያቄዎች ከቅጽበታዊ ማረሚያ እና የመጽሐፍ ገጽ ጥቅስ ጋር።
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGenerateAIHomework}
            disabled={aiGenerating}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${aiGenerating ? 'animate-spin' : ''}`} />
            {aiGenerating ? 'በማመንጨት ላይ...' : '+ አዲስ AI የቤት ስራ ጨምር'}
          </button>
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology'].map((subj) => (
          <button
            key={subj}
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

      {/* Question Cards Grid */}
      <div className="space-y-5">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500">
            <BookOpen className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <p className="font-bold">በዚህ መስፈርት የተዘጋጀ የቤት ስራ የለም።</p>
            <p className="text-xs text-slate-400 mt-1">እባክዎ ሌላ የትምህርት አይነት ይምረጡ ወይም አዲስ AI ጥያቄ ያመንጩ።</p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const evalResult = evaluations[q.id];
            const hintLevel = activeHintLevels[q.id] || 0;

            return (
              <div
                key={q.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-500/30 transition"
              >
                {/* Question Header & Citation */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-black">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                        Grade {q.grade} • {q.subject}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {q.unit} → {q.chapter}
                      </h4>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700">
                    <BookMarked className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{q.textbookCitation.pageNumber}</span>
                  </div>
                </div>

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
                        btnStyle = 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => {
                            setUserInputs((prev) => ({ ...prev, [q.id]: String(optIdx) }));
                            handleEvaluateAnswer(q, optIdx);
                          }}
                          className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {evalResult && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
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
                        onChange={(e) => setUserInputs((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEvaluateAnswer(q)}
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
                      onChange={(e) => setUserInputs((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleEvaluateAnswer(q)}
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
                      onClick={() => handleRevealHint(q.id)}
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
                      <span>{q.textbookCitation.edition} • {q.textbookCitation.unit} ({q.textbookCitation.pageNumber})</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

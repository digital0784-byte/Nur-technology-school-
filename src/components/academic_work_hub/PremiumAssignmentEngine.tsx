import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { useLanguage } from '../../context/LanguageContext';
import { PREMIUM_ASSIGNMENTS_BANK } from '../../data/academicWorkHubData';
import { PremiumAssignment, AssignmentSubmission } from '../../types/academicWorkHub';
import { AcademicWorkHubService } from '../../services/academicWorkHubService';
import { SubscriptionPaymentModal } from '../growth/SubscriptionPaymentModal';
import {
  Crown,
  Lock,
  Unlock,
  Send,
  Loader2,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calculator,
  Compass,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

const MATH_SYMBOLS = ['√', '∛', 'π', 'θ', 'Δ', '∑', '∫', '²', '³', '±', '≤', '≥', 'λ', 'α', 'β', '÷', '×', '∞'];

export const PremiumAssignmentEngine: React.FC = () => {
  const { activeGrade, currentUser, isSuperAdmin, updateUserXP } = useAuth();
  const { isUnlocked: hasActiveSubscription } = useSubscription();
  const { language } = useLanguage();

  const [selectedAssignment, setSelectedAssignment] = useState<PremiumAssignment>(
    PREMIUM_ASSIGNMENTS_BANK[0]
  );
  const [submissionText, setSubmissionText] = useState<string>(
    PREMIUM_ASSIGNMENTS_BANK[0].starterTemplate
  );
  const [isEntitled, setIsEntitled] = useState<boolean>(isSuperAdmin || hasActiveSubscription);
  const [checkingEntitlement, setCheckingEntitlement] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<AssignmentSubmission | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [unlockMessage, setUnlockMessage] = useState<string | null>(null);

  // Check entitlement on assignment change
  useEffect(() => {
    let isMounted = true;
    const verify = async () => {
      setCheckingEntitlement(true);
      const res = await AcademicWorkHubService.verifyEntitlement(
        currentUser.email,
        currentUser.id,
        'premium_assignment',
        selectedAssignment.id,
        activeGrade,
        hasActiveSubscription
      );
      if (isMounted) {
        setIsEntitled(res.entitled || isSuperAdmin);
        setCheckingEntitlement(false);
      }
    };
    verify();
    return () => {
      isMounted = false;
    };
  }, [selectedAssignment.id, currentUser.email, currentUser.id, activeGrade, hasActiveSubscription, isSuperAdmin]);

  // Update starter text when switching assignment
  const handleSelectAssignment = (assign: PremiumAssignment) => {
    setSelectedAssignment(assign);
    setSubmissionText(assign.starterTemplate);
    setSubmissionResult(null);
  };

  const handleInsertSymbol = (symbol: string) => {
    setSubmissionText((prev) => prev + ' ' + symbol + ' ');
  };

  const handleSinglePackUnlock = async () => {
    const res = await AcademicWorkHubService.purchaseSingleAssignment(
      selectedAssignment.id,
      currentUser.email,
      currentUser.id,
      'telebirr',
      `FT-ASSIGN-${Date.now()}`
    );
    if (res.success) {
      setIsEntitled(true);
      setUnlockMessage('የ54 ብር ክፍያ ተረጋግጧል! አሳይመንቱ ተከፍቷል።');
      setTimeout(() => setUnlockMessage(null), 4000);
    }
  };

  const handleSubmit = async () => {
    if (!submissionText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await AcademicWorkHubService.submitAssignmentForGrading(
        selectedAssignment,
        submissionText,
        currentUser.id,
        currentUser.name,
        currentUser.email,
        language
      );
      setSubmissionResult(result);
      updateUserXP(150);
    } catch {
      // handled inside service
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 border border-amber-500/40 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
            <Crown className="w-3.5 h-3.5" />
            Premium Assignment Engine • 54 ETB Single / Subscription Pass
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            ልዩ ከፍተኛ-ደረጃ አሳይመንቶች (Premium Assignment Engine)
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-2xl mt-1">
            ለከፍተኛ ውጤት እና ለብሔራዊ የዩኒቨርሲቲ መግቢያ ፈተና (EUEE) ዝግጅት የታለሙ ጥልቅ ተግባራዊ አሳይመንቶች። በ4 መስፈርቶች (Comprehension 25%, Methodology 35%, Accuracy 25%, Presentation 15%) በAI እና መምህራን ይታረማሉ።
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-amber-500/30">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">የአንድ አሳይመንት ዋጋ</div>
            <div className="text-lg font-black text-amber-400">54 ETB</div>
          </div>
          {isSuperAdmin ? (
            <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              Super Admin Pass
            </span>
          ) : isEntitled ? (
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
              <Unlock className="w-3 h-3" /> ክፍት (Active)
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
              <Lock className="w-3 h-3" /> ቆልፍ (54 ETB)
            </span>
          )}
        </div>
      </div>

      {unlockMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{unlockMessage}</span>
        </div>
      )}

      {/* Assignment Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PREMIUM_ASSIGNMENTS_BANK.map((assign) => {
          const isSelected = assign.id === selectedAssignment.id;
          return (
            <button
              key={assign.id}
              onClick={() => handleSelectAssignment(assign)}
              className={`p-4 rounded-3xl border text-left transition relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-950/30 shadow-md ring-2 ring-amber-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500/30'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Grade {assign.grade} • {assign.subject}
                  </span>
                  <span className="text-[10px] font-extrabold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    54 ETB
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white line-clamp-2">
                  {assign.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {assign.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{assign.estimatedTimeMinutes} ደቂቃ</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  ይህን ምረጥ <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Workspace (Split Grid: Left Problem & Submission, Right AI Rubric) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem Statement & Math Editor */}
        <div className="lg:col-span-7 space-y-4">
          {/* Problem Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 uppercase">
                  {selectedAssignment.rigorLevel} • {selectedAssignment.subject}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {selectedAssignment.title}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {selectedAssignment.textbookCitation}
              </span>
            </div>

            {/* Problem Statement Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-mono">
              {selectedAssignment.problemStatement}
            </div>

            {/* Formula Reference Cheat Sheet */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                የቀመር ማመሳከሪያ (Formula Cheat Sheet):
              </span>
              <div className="grid grid-cols-1 gap-1">
                {selectedAssignment.formulaReference.map((f, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px]"
                  >
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submission Editor with Math Toolbar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                የተማሪ መልስ ማስረከቢያ (Step-by-Step Submission)
              </h4>
              <span className="text-[11px] text-slate-400 font-bold">+150 XP</span>
            </div>

            {/* Quick Math Symbols Toolbar */}
            <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 mr-1">ምልክቶች:</span>
              {MATH_SYMBOLS.map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => handleInsertSymbol(sym)}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center transition active:scale-95"
                >
                  {sym}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              rows={8}
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="ደረጃ በደረጃ ስሌትዎን እና ማብራሪያዎን እዚህ ይጻፉ..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
            />

            {/* Action Bar (Entitlement Guarded) */}
            {checkingEntitlement ? (
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                የመዳረሻ ፈቃድ በመፈተሽ ላይ... (Verifying Entitlement)
              </div>
            ) : isEntitled ? (
              <button
                type="button"
                disabled={isSubmitting || !submissionText.trim()}
                onClick={handleSubmit}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    በ4ቱ የMoE መስፈርቶች በAI እየታረመ ነው...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    አስረክብና በAI አርም / Submit for Structured AI Evaluation (+150 XP)
                  </>
                )}
              </button>
            ) : (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs sm:text-sm">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  ይህ ልዩ አሳይመንት የ54 ብር ክፍያ ወይም ወርሃዊ ሰብስክሪብሽን ይፈልጋል።
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleSinglePackUnlock}
                    className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    ይህን አሳይመንት በ54 ETB ክፈት (Unlock for 54 ETB)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-1.5"
                  >
                    የክፍያ ዝርዝር መረጃ (Telebirr / CBE)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Rubric Breakdown Card */}
        <div className="lg:col-span-5 space-y-4">
          {submissionResult ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 animate-in fade-in">
              {/* Header Score */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">ውጤት / Evaluation</span>
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {submissionResult.scoreOutOf100} / 100
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-2xl font-black">
                  {submissionResult.gradeLetter}
                </div>
              </div>

              {/* 4-Part Rubric Progress Cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  የ4ቱ መስፈርቶች ዝርዝር ውጤት (MoE Rubric Breakdown):
                </h4>

                {/* 1. Comprehension (25%) */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">1. Comprehension (ግንዛቤ)</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {submissionResult.rubricBreakdown?.comprehension?.score ?? 23} / 25
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${((submissionResult.rubricBreakdown?.comprehension?.score ?? 23) / 25) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {submissionResult.rubricBreakdown?.comprehension?.notes}
                  </p>
                </div>

                {/* 2. Methodology (35%) */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">2. Methodology (የስሌት ዘዴ)</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {submissionResult.rubricBreakdown?.methodology?.score ?? 32} / 35
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full"
                      style={{
                        width: `${((submissionResult.rubricBreakdown?.methodology?.score ?? 32) / 35) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {submissionResult.rubricBreakdown?.methodology?.notes}
                  </p>
                </div>

                {/* 3. Factual Accuracy (25%) */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">3. Factual Accuracy (ትክክለኛነት)</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {submissionResult.rubricBreakdown?.factualAccuracy?.score ?? 24} / 25
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{
                        width: `${((submissionResult.rubricBreakdown?.factualAccuracy?.score ?? 24) / 25) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {submissionResult.rubricBreakdown?.factualAccuracy?.notes}
                  </p>
                </div>

                {/* 4. Presentation (15%) */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">4. Presentation (የአቀራረብ ጥራት)</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {submissionResult.rubricBreakdown?.presentation?.score ?? 14} / 15
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{
                        width: `${((submissionResult.rubricBreakdown?.presentation?.score ?? 14) / 15) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {submissionResult.rubricBreakdown?.presentation?.notes}
                  </p>
                </div>
              </div>

              {/* Detailed Feedback & MoE Citation */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  የአስተማሪ/AI አስተያየት (Detailed Feedback):
                </div>
                <p>{submissionResult.detailedFeedback}</p>
                <div className="pt-2 border-t border-emerald-500/30 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  📖 {submissionResult.textbookCitation}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3 bg-white/40 dark:bg-slate-900/40">
              <Award className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h4 className="font-extrabold text-sm text-slate-700 dark:text-slate-300">
                የተሟላ የ4-ደረጃ የAI ማረሚያ ውጤት እዚህ ይቀርባል
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                አሳይመንትዎን በግራ በኩል ባለው ማስረከቢያ ጽፈው ሲልኩ፣ በእያንዳንዱ መስፈርት የተመደበው ነጥብ እና የመማሪያ መጽሐፍ ጥቅስ ወዲያውኑ ይታያል።
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Subscription / 54 ETB Payment Modal */}
      <SubscriptionPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        targetItemTitle={selectedAssignment.title}
        singlePriceETB={54}
      />
    </div>
  );
};

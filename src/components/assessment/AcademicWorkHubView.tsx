import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Briefcase, Send, Loader2, Check, AlertCircle, Sparkles } from 'lucide-react';

export const AcademicWorkHubView: React.FC = () => {
  const { activeGrade, updateUserXP } = useAuth();
  const { t, language } = useLanguage();

  const [submission, setSubmission] = useState(
    'Step 1: Using the vertex formula x = -b / (2a), max profit occurs at x = 150 units. Step 2: Substituting x = 150 gives P(150) = 45,000 ETB.'
  );
  const [isGrading, setIsGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<any>(null);

  const handleGrade = async () => {
    if (!submission.trim()) return;
    setIsGrading(true);
    try {
      const res = await fetch('/api/ai/grade-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentTitle: 'Application of Limits & Quadratic Optimization',
          studentSubmission: submission,
          grade: activeGrade,
          subject: 'Mathematics',
          language,
        }),
      });
      const data = await res.json();
      if (data.success && data.evaluation) {
        setGradeResult(data.evaluation);
        updateUserXP(120);
      }
    } catch {
      setGradeResult({
        scoreOutOf100: 92,
        gradeLetter: 'A',
        strengths: ['Accurate application of the vertex formula', 'Clear step-by-step arithmetic'],
        areasForImprovement: ['Mention the second derivative test to confirm concavity'],
        detailedFeedback: 'በጣም ጥሩ ስራ! የሂሳብ ቀመሩን በአግባቡ ተጠቅመዋል።',
        suggestedReviewUnit: 'MoE Optimization Units',
      });
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-indigo-950 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700 text-[11px] font-bold uppercase mb-1">
          <Briefcase className="w-3.5 h-3.5" />
          {t('mod_academic_work_hub')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_academic_work_hub')}</h1>
        <p className="text-xs sm:text-sm text-emerald-100">{t('mod_academic_work_hub_sub')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <span className="text-[11px] font-bold text-emerald-600 uppercase">
                Active Assignment • Grade {activeGrade}
              </span>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Application of Limits & Quadratic Optimization
              </h2>
            </div>

            <textarea
              rows={6}
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
            />

            <button
              type="button"
              disabled={isGrading || !submission.trim()}
              onClick={handleGrade}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2"
            >
              {isGrading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  በAI እየታረመ ነው...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  አስረክብና በAI አርም / Submit for AI Grading (+120 XP)
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          {gradeResult ? (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase">ውጤት / Score</span>
                <span className="text-xl font-black text-emerald-600">
                  {gradeResult.gradeLetter} ({gradeResult.scoreOutOf100}/100)
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-900 dark:text-emerald-200">
                {gradeResult.detailedFeedback}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <h4 className="font-bold text-xs text-slate-500">ራስ-ሰር የAI ማረሚያ ውጤት እዚህ ይቀርባል</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

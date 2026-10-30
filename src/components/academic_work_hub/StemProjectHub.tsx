import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { STEM_PROJECTS_BANK } from '../../data/academicWorkHubData';
import { StemProject, StemProjectSubmission } from '../../types/academicWorkHub';
import { AcademicWorkHubService } from '../../services/academicWorkHubService';
import {
  Compass,
  Zap,
  Sprout,
  Droplets,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Send,
  Award,
  Sparkles,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';

export const StemProjectHub: React.FC = () => {
  const { currentUser, activeGrade, updateUserXP } = useAuth();

  const [selectedProject, setSelectedProject] = useState<StemProject>(STEM_PROJECTS_BANK[0]);
  const [submissions, setSubmissions] = useState<Record<string, StemProjectSubmission>>(() =>
    AcademicWorkHubService.getStemSubmissions(currentUser.id)
  );

  const [phaseContent, setPhaseContent] = useState<string>('');
  const [completedChecklist, setCompletedChecklist] = useState<string[]>([]);
  const [submittingPhase, setSubmittingPhase] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const currentSubmission = submissions[selectedProject.id];
  const activePhaseNumber = currentSubmission
    ? (Math.min(currentSubmission.currentPhase, 3) as 1 | 2 | 3)
    : 1;
  const isProjectCompleted = Boolean(currentSubmission?.isCompleted);

  const activePhase = selectedProject.phases[activePhaseNumber - 1];

  const handleToggleChecklistItem = (item: string) => {
    setCompletedChecklist((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSelectProject = (proj: StemProject) => {
    setSelectedProject(proj);
    setPhaseContent('');
    setCompletedChecklist([]);
  };

  const handleSubmitPhase = () => {
    if (!phaseContent.trim() && !activePhase.placeholderText) return;
    setSubmittingPhase(true);

    const submissionData = phaseContent.trim() || activePhase.placeholderText;

    const updated = AcademicWorkHubService.submitStemProjectPhase(
      selectedProject.id,
      selectedProject.title,
      activePhaseNumber,
      submissionData,
      completedChecklist,
      currentUser.id,
      currentUser.name,
      currentUser.email,
      activeGrade,
      selectedProject.badgeName
    );

    setSubmissions((prev) => ({ ...prev, [selectedProject.id]: updated }));
    setSubmittingPhase(false);
    setPhaseContent('');
    setCompletedChecklist([]);

    const xpGained = activePhaseNumber === 3 ? 300 : 100;
    updateUserXP(xpGained);

    const toastMsg =
      activePhaseNumber === 3
        ? `እንኳን ደስ አለዎት! ፕሮጀክቱን በተሳካ ሁኔታ አጠናቀው የ"${selectedProject.badgeName}" ባጅ አግኝተዋል። (+300 XP)`
        : `ደረጃ ${activePhaseNumber} በተሳካ ሁኔታ ተጠናቋል! ወደ ቀጣዩ ደረጃ አልፈዋል። (+100 XP)`;
    setSuccessToast(toastMsg);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  const getProjectIcon = (iconName: string) => {
    if (iconName === 'Zap') return <Zap className="w-5 h-5 text-amber-400" />;
    if (iconName === 'Sprout') return <Sprout className="w-5 h-5 text-emerald-400" />;
    return <Droplets className="w-5 h-5 text-cyan-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 border border-teal-500/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-500/30">
            <Compass className="w-3.5 h-3.5" />
            Practical STEM Project Hub • 100% Free & Open
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            የተግባር ሳይንስና ኢንጂነሪንግ ፕሮጀክቶች (Practical STEM Projects)
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl mt-1">
            ከኢትዮጵያ ነባራዊ ሁኔታዎች (ህዳሴ ግድብ፣ የደጋማ አካባቢዎች የአፈር አሲዳማነት፣ የገጠር ንጹህ ውሃ ማጣሪያ) ጋር የተሳሰሩ ባለ 3-ደረጃ እውነተኛ የምርምር ፕሮጀክቶች።
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-teal-500/30">
          <Award className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">የተገኙ ባጆች</div>
            <div className="text-sm font-black text-white">
              {Object.values(submissions).filter((s) => s.isCompleted).length} / {STEM_PROJECTS_BANK.length} ፕሮጀክቶች
            </div>
          </div>
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Project Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STEM_PROJECTS_BANK.map((proj) => {
          const isSelected = proj.id === selectedProject.id;
          const sub = submissions[proj.id];
          const isDone = Boolean(sub?.isCompleted);
          const currentP = sub ? sub.currentPhase : 1;

          return (
            <button
              key={proj.id}
              onClick={() => handleSelectProject(proj)}
              className={`p-5 rounded-3xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-950/30 shadow-md ring-2 ring-teal-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-500/30'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                    {getProjectIcon(proj.badgeIcon)}
                  </div>
                  {isDone ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> የተጠናቀቀ
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-400 text-[10px] font-bold">
                      ደረጃ {currentP} / 3
                    </span>
                  )}
                </div>

                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white line-clamp-2">
                  {proj.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {proj.ethiopianContext}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-semibold">{proj.estimatedDuration}</span>
                <span className="font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                  ይመልከቱ <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Project Workspace */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Project Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              {selectedProject.theme} • Grade {selectedProject.grade}
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {selectedProject.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {selectedProject.summary}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 shrink-0">
            <Award className="w-8 h-8 text-amber-500" />
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">የሚበረከት የክብር ባጅ</div>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                {selectedProject.badgeName}
              </div>
            </div>
          </div>
        </div>

        {/* 3-Phase Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {selectedProject.phases.map((phase) => {
            const isCompletedPhase = currentSubmission && currentSubmission.currentPhase > phase.phaseNumber;
            const isCurrentPhase = activePhaseNumber === phase.phaseNumber && !isProjectCompleted;

            return (
              <div
                key={phase.phaseNumber}
                className={`p-4 rounded-2xl border transition ${
                  isCompletedPhase
                    ? 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : isCurrentPhase
                    ? 'border-teal-500 bg-teal-500/10 ring-2 ring-teal-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 opacity-70'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {isCompletedPhase ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isCurrentPhase ? (
                    <span className="w-4 h-4 rounded-full bg-teal-500 text-white flex items-center justify-center text-[10px] font-bold">
                      {phase.phaseNumber}
                    </span>
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {phase.titleAmharic}
                  </h5>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {phase.objective}
                </p>
              </div>
            );
          })}
        </div>

        {/* Active Phase Details & Work Area */}
        {isProjectCompleted ? (
          <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-amber-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 mx-auto flex items-center justify-center">
              <Award className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                ፕሮጀክቱ በስኬት ተጠናቋል!
              </span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                {selectedProject.badgeName}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                ሁሉንም 3 ደረጃዎች አጠናቀዋል። የምርምር ውጤትዎ በተማሪ ፖርትፎሊዮ ውስጥ ተመዝግቧል።
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-in fade-in">
            {/* Phase Instructions & Deliverables */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400 uppercase">
                  የደረጃ {activePhaseNumber} ግብ እና መስፈርቶች (Objective & Deliverables)
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  ደረጃ {activePhaseNumber} ከ 3
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                {activePhase.objective}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  የሚጠበቁ ቁልፍ ውጤቶች (Deliverables):
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  {activePhase.deliverables.map((del, i) => (
                    <li key={i}>{del}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                የደረጃው ማረጋገጫ ዝርዝር (Phase Checklist):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activePhase.checklistItems.map((chk, i) => {
                  const isChecked = completedChecklist.includes(chk);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleToggleChecklistItem(chk)}
                      className={`p-3 rounded-xl border text-left text-xs transition flex items-center gap-2.5 ${
                        isChecked
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span>{chk}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Submission Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  {activePhase.studentInputPrompt}
                </label>
                <button
                  type="button"
                  onClick={() => setPhaseContent(activePhase.placeholderText)}
                  className="text-[11px] font-bold text-teal-600 hover:underline"
                >
                  የሙከራ ናሙና ጫን (Load Sample Data)
                </button>
              </div>

              <textarea
                rows={6}
                value={phaseContent}
                onChange={(e) => setPhaseContent(e.target.value)}
                placeholder={activePhase.placeholderText}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 leading-relaxed font-mono"
              />
            </div>

            {/* Submit Phase Button */}
            <button
              type="button"
              disabled={submittingPhase}
              onClick={handleSubmitPhase}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {activePhaseNumber === 3
                ? 'የመጨረሻውን ሳይንሳዊ ድምዳሜ አስረክብና ባጅ ተቀበል (Complete Project +300 XP)'
                : `ደረጃ ${activePhaseNumber} ን አስረክብና ወደ ቀጣዩ ደረጃ እለፍ (+100 XP)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

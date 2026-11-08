import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  CalendarDays,
  Clock,
  Sparkles,
  Flame,
  Target,
  Award,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Sliders,
  Bell,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface StudyMilestone {
  id: string;
  dayNumber: number;
  subject: string;
  topicTitle: string;
  allocatedMinutes: number;
  xpReward: number;
  isCompleted: boolean;
  priorityLevel: 'HIGH_WEAKNESS' | 'MEDIUM' | 'REVIEW';
  moeUnitRef: string;
}

export const AiStudyPlannerHub: React.FC = () => {
  const { language } = useLanguage();
  const { currentUser, updateUserXP } = useAuth();

  // Algorithmic Timetable Generation Parameters
  const [daysUntilEuee, setDaysUntilEuee] = useState<number>(45);
  const [dailyStudyHours, setDailyStudyHours] = useState<number>(2.5);
  const [targetMatricScore, setTargetMatricScore] = useState<number>(550);
  const [selectedStream, setSelectedStream] = useState<'NATURAL' | 'SOCIAL'>('NATURAL');
  const [identifiedWeaknesses, setIdentifiedWeaknesses] = useState<string[]>([
    'Polynomial Functions & Zeroes',
    'Electromagnetism & Induction',
    'Chemical Equilibrium Kc',
    'Cellular Respiration & Krebs',
  ]);

  // Timetable Milestones State
  const [milestones, setMilestones] = useState<StudyMilestone[]>(() => [
    {
      id: 'm-1',
      dayNumber: 1,
      subject: 'Mathematics',
      topicTitle: 'Polynomial Long & Synthetic Division, Factor Theorem',
      allocatedMinutes: 45,
      xpReward: 50,
      isCompleted: true,
      priorityLevel: 'HIGH_WEAKNESS',
      moeUnitRef: 'Grade 10 Math Unit 2',
    },
    {
      id: 'm-2',
      dayNumber: 1,
      subject: 'Physics',
      topicTitle: 'Faraday Law of Induction & Lenz Law Opposing Sign',
      allocatedMinutes: 50,
      xpReward: 50,
      isCompleted: true,
      priorityLevel: 'HIGH_WEAKNESS',
      moeUnitRef: 'Grade 10 Physics Unit 5',
    },
    {
      id: 'm-3',
      dayNumber: 2,
      subject: 'Chemistry',
      topicTitle: 'Le Chatelier Principle & Kc Equilibrium Shift Calculations',
      allocatedMinutes: 60,
      xpReward: 60,
      isCompleted: false,
      priorityLevel: 'HIGH_WEAKNESS',
      moeUnitRef: 'Grade 11 Chemistry Unit 4',
    },
    {
      id: 'm-4',
      dayNumber: 2,
      subject: 'Biology',
      topicTitle: 'Mitochondrial Respiration, Glycolysis & Krebs Cycle',
      allocatedMinutes: 45,
      xpReward: 50,
      isCompleted: false,
      priorityLevel: 'HIGH_WEAKNESS',
      moeUnitRef: 'Grade 11 Biology Unit 2',
    },
    {
      id: 'm-5',
      dayNumber: 3,
      subject: 'Mathematics',
      topicTitle: 'Riemann Sums Partition Limit & Fundamental Theorem',
      allocatedMinutes: 50,
      xpReward: 50,
      isCompleted: false,
      priorityLevel: 'MEDIUM',
      moeUnitRef: 'Grade 12 Math Unit 5',
    },
    {
      id: 'm-6',
      dayNumber: 3,
      subject: 'English',
      topicTitle: 'Reading Comprehension, Context Clues & Conditional Sentences',
      allocatedMinutes: 40,
      xpReward: 40,
      isCompleted: false,
      priorityLevel: 'REVIEW',
      moeUnitRef: 'National EUEE Grammar Matrix',
    },
  ]);

  const [reminderAlertActive, setReminderAlertActive] = useState(true);
  const [rebalanceToast, setRebalanceToast] = useState(false);

  // Toggle milestone completion
  const handleToggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const willComplete = !m.isCompleted;
          if (willComplete) {
            updateUserXP(m.xpReward);
          }
          return { ...m, isCompleted: willComplete };
        }
        return m;
      })
    );
  };

  // Algorithmic Timetable Auto-Adjust (when a student misses a milestone)
  const handleAutoRebalance = () => {
    setMilestones((prev) => {
      const incomplete = prev.filter((m) => !m.isCompleted);
      const completed = prev.filter((m) => m.isCompleted);
      // Re-allocate remaining daily study minutes evenly
      const redistributedMinutes = Math.round((dailyStudyHours * 60) / Math.max(1, incomplete.length));
      const adjusted = incomplete.map((m, idx) => ({
        ...m,
        dayNumber: completed.length > 0 ? Math.max(...completed.map((c) => c.dayNumber)) + Math.floor(idx / 2) + 1 : idx + 1,
        allocatedMinutes: redistributedMinutes,
      }));
      return [...completed, ...adjusted];
    });

    setRebalanceToast(true);
    setTimeout(() => setRebalanceToast(false), 4000);
  };

  const completedCount = milestones.filter((m) => m.isCompleted).length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  return (
    <div className="space-y-6 text-white animate-in fade-in">
      {/* 1. Algorithmic Plan Banner & Countdown Status */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            AI Algorithmic Study Timetable & Countdown
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            የኢትዮጵያ ዩኒቨርሲቲ መግቢያ ፈተና (EUEE) ዝግጅት ፕሮግራም
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            በተማሪው የደካማ ርዕሶች ግምገማ (Radar Diagnostic Review) እና በቀሪ ቀናት ላይ ተመስርቶ በየቀኑ በራስ-ሰር የሚስተካከል ብልህ የጥናት ሰሌዳ።
          </p>
        </div>

        {/* Live EUEE Countdown Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/40 text-center min-w-[100px]">
            <div className="text-2xl font-black text-amber-300 font-mono">
              {daysUntilEuee}
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block mt-0.5">
              ቀናት ቀርተዋል (Days Left)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-purple-500/40 text-center min-w-[100px]">
            <div className="text-2xl font-black text-purple-300 font-mono">
              {targetMatricScore}
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block mt-0.5">
              ግብ ውጤት (Target /600)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/40 text-center min-w-[100px]">
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {progressPercent}%
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block mt-0.5">
              የእቅድ አፈፃፀም (Progress)
            </span>
          </div>
        </div>
      </div>

      {/* Rebalance Toast */}
      {rebalanceToast && (
        <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          የጥናት ሰሌዳው በተሳካ ሁኔታ ተስተካክሏል! ያመለጧቸው ርዕሶች ወደሚቀጥሉት ቀናት ተከፋፍለዋል።
        </div>
      )}

      {/* 2. Interactive Algorithmic Customizer Controls */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            Timetable Dynamic Optimization Parameters
          </h4>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setReminderAlertActive(!reminderAlertActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                reminderAlertActive
                  ? 'bg-purple-950 border-purple-500 text-purple-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              {reminderAlertActive ? 'Daily Alerts: ON' : 'Daily Alerts: OFF'}
            </button>

            <button
              onClick={handleAutoRebalance}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Auto-Rebalance Missed Milestones
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="flex justify-between font-bold mb-1">
              <span className="text-slate-300">Days Remaining until EUEE:</span>
              <span className="text-amber-400 font-mono">{daysUntilEuee} Days</span>
            </div>
            <input
              type="range"
              min={10}
              max={180}
              step={5}
              value={daysUntilEuee}
              onChange={(e) => setDaysUntilEuee(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between font-bold mb-1">
              <span className="text-slate-300">Daily Available Study Hours:</span>
              <span className="text-purple-400 font-mono">{dailyStudyHours} hrs/day</span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              step={0.5}
              value={dailyStudyHours}
              onChange={(e) => setDailyStudyHours(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          <div>
            <div className="flex justify-between font-bold mb-1">
              <span className="text-slate-300">Target Matric Score (/600):</span>
              <span className="text-emerald-400 font-mono">{targetMatricScore} / 600</span>
            </div>
            <input
              type="range"
              min={350}
              max={600}
              step={10}
              value={targetMatricScore}
              onChange={(e) => setTargetMatricScore(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Daily Milestones Timetable List */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-purple-400" />
            Scheduled Diagnostic Study Milestones
          </h4>
          <span className="text-xs text-slate-400 font-mono">
            {completedCount} of {milestones.length} completed
          </span>
        </div>

        <div className="space-y-3">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                milestone.isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/40 opacity-80'
                  : milestone.priorityLevel === 'HIGH_WEAKNESS'
                  ? 'bg-slate-950 border-purple-500/50 ring-1 ring-purple-500/20'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleMilestone(milestone.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition ${
                    milestone.isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-600 hover:border-purple-400 text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded">
                      Day {milestone.dayNumber}
                    </span>
                    <span className="text-xs font-bold text-purple-400">{milestone.subject}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      • {milestone.moeUnitRef}
                    </span>
                    {milestone.priorityLevel === 'HIGH_WEAKNESS' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Radar Weakness
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-xs font-semibold ${
                      milestone.isCompleted ? 'line-through text-slate-500' : 'text-white'
                    }`}
                  >
                    {milestone.topicTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <div className="text-right text-xs">
                  <span className="text-slate-400 font-mono flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {milestone.allocatedMinutes} mins
                  </span>
                  <span className="text-emerald-400 font-bold font-mono">+{milestone.xpReward} XP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

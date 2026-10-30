import React, { useState } from 'react';
import { AdaptiveStudyPlan, DailyStudyTask } from '../../types/premium';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  Sparkles,
  Target,
  BookOpen,
  Filter,
} from 'lucide-react';

interface StudyPlannerProps {
  initialPlan: AdaptiveStudyPlan;
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({ initialPlan }) => {
  const { language } = useLanguage();
  const { updateUserXP } = useAuth();
  const [tasks, setTasks] = useState<DailyStudyTask[]>(initialPlan.tasks);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [streakCount, setStreakCount] = useState(initialPlan.currentStreak);

  // Toggle task completion
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const willComplete = !t.isCompleted;
          if (willComplete) {
            updateUserXP(t.xpReward);
          }
          return { ...t, isCompleted: willComplete };
        }
        return t;
      })
    );
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const filteredTasks = tasks.filter((t) => {
    if (selectedSubjectFilter === 'all') return true;
    return t.subject === selectedSubjectFilter;
  });

  return (
    <div className="space-y-4 p-4 text-white">
      {/* Hero Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            AI ብልህ የጥናት እቅድ አውጪ (Adaptive 30-Day Master Schedule)
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            የ 30 ቀናት የብሔራዊ ፈተና ዝግጅት ፕሮግራም
          </h3>
          <p className="text-xs text-slate-300 max-w-lg">
            በየቀኑ የተመደቡ የትምህርት ክፍሎችን በማጠናቀቅ የጥናት ርዝመትዎን (Streak) ያሳድጉ እና የ XP ነጥቦችን ያግኙ።
          </p>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center min-w-[85px]">
            <div className="flex items-center justify-center gap-1 text-amber-400 font-black text-xl">
              <Flame className="w-5 h-5 fill-current" />
              {streakCount}
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">ቀናት Streak</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center min-w-[85px]">
            <div className="flex items-center justify-center gap-1 text-emerald-400 font-black text-xl">
              <Target className="w-5 h-5" />
              {progressPercent}%
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">ዕድገት</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center min-w-[85px]">
            <div className="flex items-center justify-center gap-1 text-purple-400 font-black text-xl">
              <Award className="w-5 h-5" />
              {initialPlan.targetScore}
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">ግብ ውጤት</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-300 font-semibold">የትምህርት ዓይነት ምረጥ:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
          {['all', 'mathematics', 'physics', 'chemistry', 'biology'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubjectFilter(sub)}
              className={`px-3 py-1 rounded-lg font-semibold transition capitalize ${
                selectedSubjectFilter === sub
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sub === 'all' ? 'ሁሉም (All)' : sub}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => handleToggleTask(task.id)}
            className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 ${
              task.isCompleted
                ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50 text-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleTask(task.id);
                }}
                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition shrink-0 mt-0.5 ${
                  task.isCompleted
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                    : 'border-slate-600 hover:border-slate-400 bg-slate-800'
                }`}
              >
                {task.isCompleted && <CheckCircle2 className="w-4 h-4" />}
              </button>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.2 rounded bg-indigo-950 border border-indigo-500/30 text-indigo-300 font-mono text-[10px] font-bold">
                    DAY {task.dayNumber}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{task.unit}</span>
                  {task.priority === 'Critical' && (
                    <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 text-[9px] font-bold uppercase">
                      ወሳኝ
                    </span>
                  )}
                </div>
                <h4
                  className={`text-sm font-bold ${
                    task.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                  }`}
                >
                  {task.title[language] || task.title.am}
                </h4>
              </div>
            </div>

            {/* Right rewards */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-slate-400 hidden sm:flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {task.durationMinutes} min
              </span>

              <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono">
                +{task.xpReward} XP
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

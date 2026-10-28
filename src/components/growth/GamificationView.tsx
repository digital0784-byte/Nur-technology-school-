import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Flame, CheckCircle } from 'lucide-react';

export const GamificationView: React.FC = () => {
  const { currentUser, activeGrade } = useAuth();
  const { t } = useLanguage();

  const badges = [
    { title: 'አቢሲኒያ ምሁር (Abyssinia Scholar)', desc: 'Completed first 10 MoE curriculum lessons.', icon: '🎖️', unlocked: true },
    { title: 'የህዳሴ መሀንዲስ (GERD Engineer)', desc: 'Mastered all physics kinematics and electrical work units.', icon: '⚡', unlocked: true },
    { title: 'የካልኩለስ አርበኛ (Calculus Master)', desc: 'Solved 15 university entrance calculus problems with NUR AI.', icon: '📐', unlocked: currentUser.xp >= 3000 },
    { title: 'የፈጣን ማስታወስ አሸናፊ (Spaced Recall Champion)', desc: 'Reviewed 50 flashcards over 7 continuous streak days.', icon: '🔥', unlocked: currentUser.streakDays >= 7 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-[11px] font-bold uppercase mb-1">
          <Flame className="w-3.5 h-3.5" />
          {t('mod_gamification')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_gamification')}</h1>
        <p className="text-xs sm:text-sm text-amber-100">{t('mod_gamification_sub')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">ጠቅላላ የXP ነጥብ</span>
          <div className="text-2xl font-black text-amber-500">⚡ {currentUser.xp} XP</div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">ተከታታይ ቀናት (Streak)</span>
          <div className="text-2xl font-black text-emerald-500">🔥 {currentUser.streakDays} Days</div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">ያለቁ ትምህርቶች</span>
          <div className="text-2xl font-black text-indigo-500">📚 {currentUser.completedLessonsCount}</div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
          የተማሪ የክብር ባጆችና ሜዳሊያዎች (Achievement Badges)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {badges.map((b, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                b.unlocked ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-800' : 'opacity-40 border-slate-200'
              }`}
            >
              <div className="text-3xl shrink-0">{b.icon}</div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {b.title}
                  {b.unlocked && <CheckCircle className="w-3.5 h-3.5 text-amber-500" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

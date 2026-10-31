import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Flame,
  Award,
  Zap,
  Shield,
  Clock,
  CheckCircle2,
  Lock,
  BookOpen,
  Layers,
  HelpCircle,
  GraduationCap,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface RankTier {
  id: string;
  minLevel: number;
  maxLevel: number;
  titleEn: string;
  titleAm: string;
  icon: string;
  color: string;
  bgGradient: string;
  borderClass: string;
  perks: string[];
}

const SCHOLAR_RANKS: RankTier[] = [
  {
    id: 'bronze',
    minLevel: 1,
    maxLevel: 5,
    titleEn: 'Bronze Scholar',
    titleAm: 'ጀማሪ ተማሪ',
    icon: '🥉',
    color: 'text-amber-700',
    bgGradient: 'from-amber-100 to-amber-50 dark:from-amber-950/40 dark:to-slate-900',
    borderClass: 'border-amber-300 dark:border-amber-800',
    perks: ['የክፍል 9-12 የትምህርት መጽሐፍት መዳረሻ', 'መሰረታዊ የመልመጃ ጥያቄዎች', 'ዕለታዊ የጽናት ነጥቦች'],
  },
  {
    id: 'silver',
    minLevel: 6,
    maxLevel: 10,
    titleEn: 'Silver Scholar',
    titleAm: 'ታታሪ ተማሪ',
    icon: '🥈',
    color: 'text-slate-400',
    bgGradient: 'from-slate-100 to-slate-50 dark:from-slate-800/60 dark:to-slate-900',
    borderClass: 'border-slate-300 dark:border-slate-700',
    perks: ['የNUR AI ረዳት ፈጣን ምላሽ', 'የምዕራፍ ማጠቃለያ ፍላሽካርዶች', 'የጽናት ጋሻ (Streak Freeze) በሳምንት 1 ጊዜ'],
  },
  {
    id: 'gold',
    minLevel: 11,
    maxLevel: 20,
    titleEn: 'Gold Scholar',
    titleAm: 'ጎበዝ ተማሪ',
    icon: '🥇',
    color: 'text-amber-500',
    bgGradient: 'from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-slate-900',
    borderClass: 'border-amber-400 dark:border-amber-700',
    perks: ['ብሔራዊ የEUEE ሞዴል ፈተናዎች ማብራሪያ', 'የላቦራቶሪ ቨርቹዋል ሲሙሌሽን', 'ልዩ የትምህርት አርበኛ ሜዳሊያ'],
  },
  {
    id: 'diamond',
    minLevel: 21,
    maxLevel: 999,
    titleEn: 'Diamond Master',
    titleAm: 'የአንደኛ ደረጃ ምሁር',
    icon: '💎',
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-slate-900',
    borderClass: 'border-cyan-400 dark:border-cyan-700',
    perks: ['ሙሉ የዩኒቨርስቲ መግቢያ ጥናት ካምፕ', 'የአካዳሚክ ፕሮጀክት ጥናት ግምገማ', 'የላቀ AI ሞዴል ቅድሚያ ድጋፍ'],
  },
];

export const GamificationView: React.FC = () => {
  const {
    currentUser,
    updateUserXP,
    toggleStreakFreeze,
    activateGracePeriod,
    unlockBadge,
  } = useAuth();
  const { t } = useLanguage();

  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Level Calculation: 200 XP per level
  const xpPerLevel = 200;
  const currentLevel = Math.max(1, Math.floor(currentUser.xp / xpPerLevel) + 1);
  const xpInCurrentLevel = currentUser.xp % xpPerLevel;
  const progressToNextLevel = Math.min(100, Math.round((xpInCurrentLevel / xpPerLevel) * 100));
  const xpRemaining = xpPerLevel - xpInCurrentLevel;

  // Determine current Rank Tier
  const currentRank =
    SCHOLAR_RANKS.find((r) => currentLevel >= r.minLevel && currentLevel <= r.maxLevel) ||
    SCHOLAR_RANKS[SCHOLAR_RANKS.length - 1];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 4 Specified Achievement Badges
  const badges = [
    {
      id: 'badge-fast-learner',
      key: 'fast_learner',
      icon: '⚡',
      titleEn: 'Fast Learner',
      titleAm: 'ፈጣን ተማሪ',
      descEn: 'Pass 3 chapter quizzes in a single day.',
      descAm: 'በአንድ ቀን ውስጥ 3 የምዕራፍ ፈተናዎችን በስኬት ማጠናቀቅ።',
      progress: currentUser.dailyQuizzesPassed || 2,
      maxProgress: 3,
      unit: 'ፈተናዎች',
      unlocked:
        Boolean(currentUser.unlockedBadges?.includes('fast_learner')) ||
        (currentUser.dailyQuizzesPassed || 0) >= 3,
      rewardXP: 100,
    },
    {
      id: 'badge-math-prodigy',
      key: 'math_prodigy',
      icon: '🎯',
      titleEn: 'Math Prodigy',
      titleAm: 'የሂሳብ ሊቅ',
      descEn: 'Master all Grade 10 Mathematics units according to MoE standards.',
      descAm: 'የክፍል 10 ሂሳብ ሁሉንም ምዕራፎች በሙሉ ብቃት ማጠናቀቅ።',
      progress: 5,
      maxProgress: 5,
      unit: 'ምዕራፎች',
      unlocked: true,
      rewardXP: 150,
    },
    {
      id: 'badge-lab-explorer',
      key: 'lab_explorer',
      icon: '🔬',
      titleEn: 'Lab Explorer',
      titleAm: 'የሳይንስ ላብ አሳሽ',
      descEn: 'Successfully conduct 5 virtual STEM experiments.',
      descAm: '5 የተግባር የሳይንስና ቴክኖሎጂ ላቦራቶሪ ሙከራዎችን ማካሄድ።',
      progress: currentUser.stemExperimentsCompleted || 4,
      maxProgress: 5,
      unit: 'ሙከራዎች',
      unlocked:
        Boolean(currentUser.unlockedBadges?.includes('lab_explorer')) ||
        (currentUser.stemExperimentsCompleted || 0) >= 5,
      rewardXP: 120,
    },
    {
      id: 'badge-euee-contender',
      key: 'euee_contender',
      icon: '🏆',
      titleEn: 'EUEE Contender',
      titleAm: 'የመግቢያ ፈተና አርበኛ',
      descEn: 'Score 85% or higher on the official Grade 12 EUEE Model Exam section.',
      descAm: 'በክፍል 12 የዩኒቨርስቲ መግቢያ ሞዴል ፈተና 85% እና ከዚያ በላይ ማምጣት።',
      progress: currentUser.eueeHighScore || 82,
      maxProgress: 100,
      unit: '% ነጥብ',
      unlocked:
        Boolean(currentUser.unlockedBadges?.includes('euee_contender')) ||
        (currentUser.eueeHighScore || 0) >= 85,
      rewardXP: 250,
    },
  ];

  const filteredBadges = badges.filter((b) => {
    if (filter === 'unlocked') return b.unlocked;
    if (filter === 'locked') return !b.unlocked;
    return true;
  });

  // Action Simulator Handlers
  const handleSimulateLesson = () => {
    updateUserXP(20);
    showToast('📖 ሙሉ ትምህርት አንብበዋል! +20 XP ተጨምሯል (Lesson Completed: +20 XP)');
  };

  const handleSimulateFlashcard = () => {
    updateUserXP(15);
    showToast('🎴 የፍላሽካርድ ስብስብ አጠናቀዋል! +15 XP ተጨምሯል (Flashcard Set Completed: +15 XP)');
  };

  const handleSimulateQuiz = () => {
    updateUserXP(50);
    unlockBadge('fast_learner');
    showToast('💯 የምዕራፍ ፈተና በ100% አልፈዋል! +50 XP & Fast Learner ባጅ ተከፍቷል!');
  };

  const handleSimulateEUEE = () => {
    updateUserXP(100);
    unlockBadge('euee_contender');
    showToast('🏆 የEUEE ሞዴል ክፍል በከፍተኛ ውጤት አልፈዋል! +100 XP & EUEE Contender ተከፍቷል!');
  };

  const handleSimulateLab = () => {
    updateUserXP(30);
    unlockBadge('lab_explorer');
    showToast('🔬 5ኛውን የላብ ሙከራ አጠናቀዋል! +30 XP & Lab Explorer ባጅ ተከፍቷል!');
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-spin" />
          <p className="text-xs sm:text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-700 via-orange-700 to-amber-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-300" />
              {t('mod_gamification')} • የተማሪ ማበረታቻና ባጆች
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              የዕድገት ደረጃ፣ የXP ነጥቦች እና የክብር ባጆች
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 max-w-2xl leading-relaxed">
              የትምህርት ጥረታችሁን በXP ነጥቦች ያሳድጉ፤ የዕለት ጽናትን (Daily Streak) ይጠብቁ፤
              ከጀማሪ እስከ አልማዝ ደረጃ ምሁር (Diamond Master) በማደግ የኢትዮጵያ ዩኒቨርስቲ መግቢያን ያሸንፉ!
            </p>
          </div>

          {/* Current Rank Card */}
          <div className="shrink-0 p-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 flex items-center gap-4">
            <div className="text-4xl p-2 rounded-xl bg-white/10 shadow-inner">
              {currentRank.icon}
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-amber-200 tracking-wider">
                የአሁኑ የክብር ማዕረግ
              </div>
              <div className="text-base sm:text-lg font-black text-white">
                {currentRank.titleAm}
              </div>
              <div className="text-xs text-amber-300 font-medium">
                {currentRank.titleEn} (Level {currentLevel})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* XP Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              ጠቅላላ የXP ነጥብ (Experience Points)
            </span>
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-2 text-3xl font-black text-amber-500 flex items-baseline gap-1.5">
            {currentUser.xp.toLocaleString()} <span className="text-sm font-bold text-slate-400">XP</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>ደረጃ {currentLevel} (Level {currentLevel})</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              +{xpInCurrentLevel} / {xpPerLevel} XP
            </span>
          </div>
          <div className="mt-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressToNextLevel}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            ወደሚቀጥለው ደረጃ {xpRemaining} XP ይቀራል
          </p>
        </div>

        {/* Streak Counter & Freeze Hub */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              ተከታታይ የጥናት ቀናት (Daily Streak)
            </span>
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div className="mt-2 text-3xl font-black text-orange-500 flex items-baseline gap-1.5">
            {currentUser.streakDays} <span className="text-sm font-bold text-slate-400">ቀናት / Days</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
              <Shield className="w-3.5 h-3.5" />
              {currentUser.streakFreezeActive ? 'የጽናት ጋሻ ነቅቷል (Shield Active)' : 'ጋሻ ይገኛል (Freeze Ready)'}
            </span>
            <button
              type="button"
              onClick={toggleStreakFreeze}
              className="text-[11px] font-bold text-amber-600 hover:text-amber-700 hover:underline"
            >
              {currentUser.streakFreezeActive ? 'አጥፋ' : 'ጋሻውን አግብር'}
            </button>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 leading-tight">
            የኢንተርኔት ወይም መብራት መቋረጥ ቢገጥምዎት የጽናት ቀንዎ እንዳይጠፋ ይጠብቃል።
          </p>
        </div>

        {/* Grace Period & Badges Counter */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              የክብር ባጆችና ማስተካከያ (Badges & Grace)
            </span>
            <Award className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="mt-2 text-3xl font-black text-indigo-600 dark:text-indigo-400 flex items-baseline gap-1.5">
            {badges.filter((b) => b.unlocked).length} / {badges.length}{' '}
            <span className="text-sm font-bold text-slate-400">የተከፈቱ ባጆች</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              <Clock className="w-3.5 h-3.5" />
              24-ሰዓት የማስተካከያ ዕድል (Grace Period)
            </span>
            <button
              type="button"
              onClick={() => {
                activateGracePeriod();
                showToast('✨ የ24-ሰዓት Grace Period ተጠቅመዋል! የጽናት ቀንዎ ተመልሷል (+1 Streak Day)');
              }}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              አድስ / Restore
            </button>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 leading-tight">
            ያመለጣችሁን ቀን በፈጣን የ2-ደቂቃ ክለሳ የጽናት ቀናችሁን ማስቀጠል ትችላላችሁ።
          </p>
        </div>
      </div>

      {/* Official XP Calculation Rules & Live Simulator Bar */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-md space-y-4 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              የXP ነጥቦች አሰራርና ማስመዘገቢያ (Official MoE XP Calculations)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            ከስር ያሉትን አዝራሮች በመጫን ወዲያውኑ XP ያግኙና ደረጃዎን ያሳድጉ
          </span>
        </div>

        {/* 4 Official XP Mechanics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black text-emerald-400">+20 XP</span>
              </div>
              <div className="text-xs font-bold text-slate-200">ሙሉ ትምህርት ማንበብ</div>
              <p className="text-[11px] text-slate-400">Reading a full lesson unit topic.</p>
            </div>
            <button
              type="button"
              onClick={handleSimulateLesson}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              ተማርኩ (+20 XP)
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Layers className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-black text-violet-400">+15 XP</span>
              </div>
              <div className="text-xs font-bold text-slate-200">የፍላሽካርድ ስብስብ ማጠናቀቅ</div>
              <p className="text-[11px] text-slate-400">Completing a full flashcard set.</p>
            </div>
            <button
              type="button"
              onClick={handleSimulateFlashcard}
              className="w-full py-2 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              ካርዶችን ገልብጥ (+15 XP)
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black text-amber-400">+50 XP</span>
              </div>
              <div className="text-xs font-bold text-slate-200">ፈተና በ100% ውጤት ማለፍ</div>
              <p className="text-[11px] text-slate-400">Passing a chapter quiz with 100% score.</p>
            </div>
            <button
              type="button"
              onClick={handleSimulateQuiz}
              className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              100% ፈተና አጠናቅቅ (+50 XP)
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <GraduationCap className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-black text-rose-400">+100 XP</span>
              </div>
              <div className="text-xs font-bold text-slate-200">የEUEE ሞዴል ክፍል ማለፍ</div>
              <p className="text-[11px] text-slate-400">Passing an EUEE entrance exam section.</p>
            </div>
            <button
              type="button"
              onClick={handleSimulateEUEE}
              className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              EUEE ፈተና አልፍ (+100 XP)
            </button>
          </div>
        </div>
      </div>

      {/* Level Progression Ranks Ladder (የዕድገት ደረጃዎች) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              የደረጃ ዕድገት ማዕረጎች (Level Progression Ranks)
            </h3>
            <p className="text-xs text-slate-500">
              በXP ነጥቦች አማካኝነት ከደረጃ 1 ጀምሮ እስከ ከፍተኛው የአልማዝ ምሁር ማዕረግ ያድጉ
            </p>
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
            Level {currentLevel} • {currentUser.xp} XP
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SCHOLAR_RANKS.map((tier) => {
            const isCurrent = currentRank.id === tier.id;
            const isCompleted = currentLevel > tier.maxLevel;
            const isLocked = currentLevel < tier.minLevel;

            return (
              <div
                key={tier.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 bg-gradient-to-b ${tier.bgGradient} ${
                  isCurrent
                    ? `${tier.borderClass} ring-2 ring-amber-500 shadow-md`
                    : isCompleted
                    ? 'border-emerald-300 dark:border-emerald-800'
                    : 'border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{tier.icon}</span>
                    {isCurrent ? (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                        የአሁኑ ደረጃ
                      </span>
                    ) : isCompleted ? (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> አልቋል
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> ዝግ ነው
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {tier.maxLevel >= 999
                        ? `Level ${tier.minLevel}+`
                        : `Level ${tier.minLevel} - ${tier.maxLevel}`}
                    </div>
                    <div className="text-base font-black text-slate-900 dark:text-white">
                      {tier.titleAm}
                    </div>
                    <div className={`text-xs font-bold ${tier.color}`}>
                      {tier.titleEn}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-slate-200/60 dark:border-slate-700/60 pt-3">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    ልዩ ጥቅሞች (Perks):
                  </div>
                  <ul className="space-y-1">
                    {tier.perks.map((p, idx) => (
                      <li key={idx} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Badges Section (የክብር ባጆች) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              የተማሪ የክብር ባጆችና ሜዳሊያዎች (Mastery Achievement Badges)
            </h3>
            <p className="text-xs text-slate-500">
              በፈተና፣ በሂሳብ ብቃት፣ በላብ ሙከራ እና በEUEE ውጤት የሚሸለሙ 4 ታላላቅ ባጆች
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-center">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              ሁሉም ({badges.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unlocked')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                filter === 'unlocked'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              የተከፈቱ ({badges.filter((b) => b.unlocked).length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('locked')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                filter === 'locked'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              በሂደት ላይ ({badges.filter((b) => !b.unlocked).length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBadges.map((b) => {
            const pct = Math.min(100, Math.round((b.progress / b.maxProgress) * 100));

            return (
              <div
                key={b.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                  b.unlocked
                    ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-800/80 shadow-md'
                    : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`text-4xl p-3 rounded-2xl shrink-0 ${
                      b.unlocked
                        ? 'bg-amber-100 dark:bg-amber-950/60 shadow-inner'
                        : 'bg-slate-100 dark:bg-slate-800 grayscale opacity-60'
                    }`}
                  >
                    {b.icon}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{b.titleAm}</span>
                        <span className="text-xs font-normal text-slate-400">({b.titleEn})</span>
                      </div>
                      {b.unlocked ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ተከፍቷል
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[11px] font-bold">
                          <Lock className="w-3 h-3" /> በሂደት ላይ
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {b.descAm}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {b.descEn}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">የማጠናቀቂያ ሂደት (Progress):</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {b.progress} / {b.maxProgress} {b.unit} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        b.unlocked ? 'bg-amber-500' : 'bg-slate-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      🎁 ሽልማት: +{b.rewardXP} XP
                    </span>
                    {!b.unlocked && b.key === 'lab_explorer' && (
                      <button
                        type="button"
                        onClick={handleSimulateLab}
                        className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        ላብ ሙከራ አድርግ <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                    {!b.unlocked && b.key === 'fast_learner' && (
                      <button
                        type="button"
                        onClick={handleSimulateQuiz}
                        className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        ፈተና ፈትን <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

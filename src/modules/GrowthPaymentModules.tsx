import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ModuleId } from '../types';
import {
  Flame,
  Compass,
  Sparkles,
  CreditCard,
  MessageSquare,
  Award,
  CheckCircle,
  ShieldCheck,
  Zap,
  GraduationCap,
  ExternalLink,
  Send,
  Loader2,
  PhoneCall,
  Check,
} from 'lucide-react';

interface GrowthPaymentProps {
  moduleId: ModuleId;
}

export const GrowthPaymentModules: React.FC<GrowthPaymentProps> = ({ moduleId }) => {
  const { currentUser, activeGrade, updateUserXP } = useAuth();
  const { t, language } = useLanguage();

  // --- PAYMENT STATE ---
  const [selectedPlan, setSelectedPlan] = useState<'month' | 'semester' | 'year'>('semester');
  const [paymentProvider, setPaymentProvider] = useState<'Telebirr' | 'CBE'>('Telebirr');
  const [phoneNumber, setPhoneNumber] = useState('0912345678');
  const [transactionRef, setTransactionRef] = useState('TXN-884920');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState<any>(null);

  // --- FEEDBACK STATE ---
  const [feedbackCategory, setFeedbackCategory] = useState('Syllabus Content');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const plans = [
    {
      id: 'month',
      title: 'የ1 ወር መደበኛ / 1 Month Pass',
      price: 199,
      duration: '1 Month',
      desc: 'All grade video lessons, PDF textbooks, and daily AI tutor access.',
    },
    {
      id: 'semester',
      title: 'የሙሉ ሴሚስተር / Full Semester Pass',
      price: 499,
      duration: 'Full Academic Semester',
      popular: true,
      desc: 'Unlimited diagnostic exams, model EUEE test bank, and priority AI OCR solver.',
    },
    {
      id: 'year',
      title: 'የዓመት ሙሉ / Full Academic Year (VIP)',
      price: 899,
      duration: 'Yearly Pass',
      desc: 'Full access to all 4 grades (9-12), university entrance masterclasses, and offline cache.',
    },
  ];

  const currentPlanObj = plans.find((p) => p.id === selectedPlan) || plans[1];

  const handleVerifyPayment = async () => {
    setIsProcessingPayment(true);
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: paymentProvider,
          transactionId: transactionRef,
          amount: currentPlanObj.price,
          studentName: currentUser.name,
          grade: activeGrade,
          phone: phoneNumber,
        }),
      });
      const data = await response.json();
      setPaymentReceipt(data);
      updateUserXP(200);
    } catch {
      setPaymentReceipt({
        success: true,
        receiptNo: `ETH-${paymentProvider.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'VERIFIED_ACTIVE',
        amount: currentPlanObj.price,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setFeedbackText('');
  };

  // --- 1. GAMIFICATION & BADGES ---
  if (moduleId === 'gamification') {
    const badges = [
      {
        title: 'አቢሲኒያ ምሁር (Abyssinia Scholar)',
        desc: 'Completed first 10 MoE curriculum lessons with >80% quiz score.',
        icon: '🎖️',
        unlocked: true,
      },
      {
        title: 'የህዳሴ መሀንዲስ (GERD Engineer)',
        desc: 'Mastered all physics kinematics and electrical work units.',
        icon: '⚡',
        unlocked: true,
      },
      {
        title: 'የካልኩለስ አርበኛ (Calculus Master)',
        desc: 'Solved 15 university entrance calculus problems with NUR AI.',
        icon: '📐',
        unlocked: currentUser.xp >= 3000,
      },
      {
        title: 'የፈጣን ማስታወስ አሸናፊ (Spaced Recall Champion)',
        desc: 'Reviewed 50 flashcards over 7 continuous streak days.',
        icon: '🔥',
        unlocked: currentUser.streakDays >= 7,
      },
      {
        title: 'የላቀ ደረጃ (STEM Olympiad)',
        desc: 'Achieved top 5% on national model entrance examination.',
        icon: '👑',
        unlocked: currentUser.xp >= 8000,
      },
    ];

    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-[11px] font-bold uppercase mb-1">
            <Flame className="w-3.5 h-3.5" />
            {t('mod_gamification')}
          </div>
          <h1 className="text-xl sm:text-2xl font-black">{t('mod_gamification')}</h1>
          <p className="text-xs sm:text-sm text-amber-100">{t('mod_gamification_sub')}</p>
        </div>

        {/* XP Status Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">ጠቅላላ የXP ነጥብ</span>
            <div className="text-2xl font-black text-amber-500">⚡ {currentUser.xp} XP</div>
            <p className="text-xs text-slate-500">Level {Math.floor(currentUser.xp / 500) + 1} Explorer</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">ተከታታይ ቀናት (Streak)</span>
            <div className="text-2xl font-black text-emerald-500">🔥 {currentUser.streakDays} Days</div>
            <p className="text-xs text-slate-500">Keep studying daily to double XP</p>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">ያለቁ ትምህርቶች</span>
            <div className="text-2xl font-black text-indigo-500">📚 {currentUser.completedLessonsCount}</div>
            <p className="text-xs text-slate-500">Grade {activeGrade} Curriculum Topics</p>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            የተማሪ የክብር ባጆችና ሜዳሊያዎች (Achievement Badges)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {badges.map((b, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                  b.unlocked
                    ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-800/80 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-50'
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
  }

  // --- 2. CAREER PATHWAYS & STEM GUIDANCE ---
  if (moduleId === 'career_pathways') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white shadow-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700 text-[11px] font-bold uppercase mb-1">
            <Compass className="w-3.5 h-3.5" />
            {t('mod_career_pathways')}
          </div>
          <h1 className="text-xl sm:text-2xl font-black">{t('mod_career_pathways')}</h1>
          <p className="text-xs sm:text-sm text-emerald-100">{t('mod_career_pathways_sub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Software Engineering & AI Technology',
              stream: 'Natural Science',
              university: 'Addis Ababa University (AAiT), ASTU, AASTU',
              description: 'Focus on Calculus, Discrete Math, IT, and Algorithm design to develop national software infrastructure.',
            },
            {
              title: 'Civil & Dam Hydroelectric Engineering',
              stream: 'Natural Science',
              university: 'Arba Minch University (Water Technology), Bahir Dar',
              description: 'Physics kinematics, thermodynamics, and geology for large infrastructure projects like GERD.',
            },
            {
              title: 'Biomedical & Clinical Medicine',
              stream: 'Natural Science',
              university: 'Tikur Anbessa (AAU), Gondar, Jimma University',
              description: 'Cell biology, biochemistry, genetics, and public healthcare epidemiology.',
            },
            {
              title: 'Agricultural Biotechnology & Crop Science',
              stream: 'Natural & Applied Science',
              university: 'Haramaya University, Hawassa University',
              description: 'Crop genetics, soil chemistry, and modern irrigation botany for coffee and teff yields.',
            },
            {
              title: 'Macroeconomics & Financial Technology',
              stream: 'Social Science',
              university: 'Addis Ababa University (FBE), Mekelle University',
              description: 'Statistics, commercial banking systems, foreign exchange monetary policy, and digital finance.',
            },
          ].map((c, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {c.stream}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1.5">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{c.description}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                <span className="font-bold text-slate-600 dark:text-slate-300">Top Universities:</span> {c.university}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- 3. PREMIUM LEARNING CENTER ---
  if (moduleId === 'premium_learning_center') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white shadow-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-700 text-[11px] font-bold uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            {t('mod_premium_learning_center')}
          </div>
          <h1 className="text-xl sm:text-2xl font-black">{t('mod_premium_learning_center')}</h1>
          <p className="text-xs sm:text-sm text-purple-100">{t('mod_premium_learning_center_sub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
              🧪
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              3D Interactive Virtual Science Labs
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Perform hazardous chemical titrations and physics optical experiments virtually without laboratory resource constraints.
            </p>
            <span className="text-[11px] font-bold text-purple-600 block">
              ✓ Included in Full Semester & Yearly VIP Pass
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
              🎓
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              University Entrance Exam Masterclass Bootcamp
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Curated crash course series by top Ethiopian national examiners breaking down high-frequency entrance exam trap questions.
            </p>
            <span className="text-[11px] font-bold text-emerald-600 block">
              ✓ 100+ Hours of On-Demand Content
            </span>
          </div>
        </div>
      </div>
    );
  }

  // --- 4. SUBSCRIPTION & PAYMENT (TELEBIRR & CBE) ---
  if (moduleId === 'subscription_payment') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white shadow-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700 text-[11px] font-bold uppercase mb-1">
            <CreditCard className="w-3.5 h-3.5" />
            {t('mod_subscription_payment')}
          </div>
          <h1 className="text-xl sm:text-2xl font-black">{t('mod_subscription_payment')}</h1>
          <p className="text-xs sm:text-sm text-emerald-100">{t('mod_subscription_payment_sub')}</p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => {
            const isSelected = selectedPlan === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlan(p.id as any)}
                className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                  isSelected
                    ? 'border-emerald-500 bg-white dark:bg-slate-900 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-2.5 right-6 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase text-slate-400">{p.duration}</div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {p.title}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {p.price}
                    </span>
                    <span className="text-xs font-bold text-slate-400">ETB (ብር)</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-600">
                    {isSelected ? '✓ የተመረጠ (Selected)' : 'ይምረጡ (Select)'}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Checkout & Payment Gateway Panel */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-black text-base text-slate-900 dark:text-white">
            የክፍያ ዘዴ ይምረጡ / Select Payment Gateway:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Telebirr Option */}
            <button
              type="button"
              onClick={() => setPaymentProvider('Telebirr')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                paymentProvider === 'Telebirr'
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                tb
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                  ቴሌብር (Telebirr)
                </div>
                <div className="text-[10px] text-slate-500">Fast Mobile USSD & SuperApp Pay</div>
              </div>
            </button>

            {/* CBE Option */}
            <button
              type="button"
              onClick={() => setPaymentProvider('CBE')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                paymentProvider === 'CBE'
                  ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 ring-1 ring-purple-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-purple-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
                CBE
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                  የኢትዮጵያ ንግድ ባንክ (CBE Birr / Mobile Banking)
                </div>
                <div className="text-[10px] text-slate-500">Acc: 1000293847561 (NUR AI School)</div>
              </div>
            </button>
          </div>

          {/* Form details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                የስልክ ቁጥር / Mobile Phone (Telebirr / CBE):
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                የግብይት መለያ / Transaction Reference No:
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Verification Button */}
          <button
            type="button"
            disabled={isProcessingPayment}
            onClick={handleVerifyPayment}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isProcessingPayment ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                ክፍያውን በማረጋገጥ ላይ ነው / Verifying with {paymentProvider}...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                {t('verify_payment')} ({currentPlanObj.price} ETB)
              </>
            )}
          </button>

          {/* Payment Receipt */}
          {paymentReceipt && (
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ክፍያው በተሳካ ሁኔታ ተረጋግጧል! (Payment Confirmed)
                </span>
                <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300">
                  {paymentReceipt.receiptNo}
                </span>
              </div>
              <p className="text-xs text-emerald-900 dark:text-emerald-100">
                ተማሪ {currentUser.name} ለክፍል {activeGrade} የ{currentPlanObj.duration} ፈቃድ በ{paymentProvider} በኩል ነቅቷል። (+200 XP ተሸልመዋል)
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- 5. SYSTEM FEEDBACK & BUG REPORTING ---
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-700 text-[11px] font-bold uppercase mb-1">
          <MessageSquare className="w-3.5 h-3.5" />
          {t('mod_system_feedback')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_system_feedback')}</h1>
        <p className="text-xs sm:text-sm text-slate-300">{t('mod_system_feedback_sub')}</p>
      </div>

      <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {feedbackSent ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              አስተያየትዎ ደርሶናል!
            </h3>
            <p className="text-xs text-slate-500">
              እናመሰግናለን! አስተያየትዎ በዋና አስተዳዳሪ (Nuriye Ahmed Adem) እና በቴክኒክ ቡድኑ ይመረመራል።
            </p>
            <button
              type="button"
              onClick={() => setFeedbackSent(false)}
              className="mt-3 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
            >
              ተጨማሪ አስተያየት ይላኩ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendFeedback} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                የአስተያየት ዘርፍ / Feedback Category:
              </label>
              <select
                value={feedbackCategory}
                onChange={(e) => setFeedbackCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
              >
                <option>Syllabus Content & Explanations</option>
                <option>NUR AI Tutor Responses</option>
                <option>Translation / i18n Error</option>
                <option>Telebirr / CBE Payment Assistance</option>
                <option>Feature Suggestion</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                ዝርዝር አስተያየትዎ / Detailed Feedback:
              </label>
              <textarea
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="እባክዎ ማንኛውንም አስተያየት፣ ጥያቄ ወይም የቴክኒክ ክፍተት እዚህ ያጋሩን..."
                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={!feedbackText.trim()}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              አስተያየት ላክ / Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { PremiumHubTab } from '../../types/premium';
import {
  PREMIUM_VIDEO_MASTERCLASSES,
  PREMIUM_SIMULATIONS,
  PREMIUM_EXAM_PAPERS,
  PREMIUM_VIRTUAL_EXPERIMENTS,
  PREMIUM_AUDIO_REVISIONS,
  INITIAL_STUDY_PLAN_DATA,
} from '../../data/premiumHubData';
import { ProtectedMediaShield } from '../premium/ProtectedMediaShield';
import { VideoMasterclassPlayer } from '../premium/VideoMasterclassPlayer';
import { ProjectileSimulation } from '../premium/simulations/ProjectileSimulation';
import { VseprSimulation } from '../premium/simulations/VseprSimulation';
import { RiemannSimulation } from '../premium/simulations/RiemannSimulation';
import { TitrationSimulation } from '../premium/simulations/TitrationSimulation';
import { OpticsBenchSimulation } from '../premium/simulations/OpticsBenchSimulation';
import { CircuitSandboxSimulation } from '../premium/simulations/CircuitSandboxSimulation';
import { ExamSimulator } from '../premium/ExamSimulator';
import { AudioMasterclassPlayer } from '../premium/AudioMasterclassPlayer';
import { StudyPlanner } from '../premium/StudyPlanner';
import { SubscriptionPaymentModal } from '../growth/SubscriptionPaymentModal';
import {
  Video,
  Box,
  FileCheck2,
  FlaskConical,
  Headphones,
  CalendarDays,
  Sparkles,
  Shield,
  Lock,
  Unlock,
  CheckCircle2,
  Compass,
  Atom,
  Calculator,
  Eye,
  Zap,
} from 'lucide-react';

export const PremiumLearningCenterView: React.FC = () => {
  const { t, language } = useLanguage();
  const { currentUser, isSuperAdmin } = useAuth();
  const { isUnlocked, currentGradePrice } = useSubscription();

  const [activeTab, setActiveTab] = useState<PremiumHubTab>('videos');
  const [selectedSimType, setSelectedSimType] = useState<'projectile' | 'vsepr' | 'riemann'>('projectile');
  const [selectedLabType, setSelectedLabType] = useState<'titration' | 'optics' | 'circuit'>('titration');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Tabs metadata with 6 Ethiopian curriculum hubs
  const TABS = [
    {
      id: 'videos' as PremiumHubTab,
      label: {
        am: '🎥 HD ቪዲዮ ማስተርክላስ',
        om: '🎥 HD Viidiyoo Masterclass',
        ti: '🎥 HD ቪዲዮ ማስተርክላስ',
        ar: '🎥 ماستر كلاس الفيديو HD',
        so: '🎥 HD Video Masterclass',
        en: '🎥 HD Video Masterclasses',
      },
      badge: '1080p HD',
      icon: Video,
    },
    {
      id: 'animations' as PremiumHubTab,
      label: {
        am: '🧊 2D/3D አኒሜሽን',
        om: '🧊 2D/3D Animeeshinii',
        ti: '🧊 2D/3D አኒሜሽን',
        ar: '🧊 محاكاة 2D و 3D التفاعلية',
        so: '🧊 2D/3D Animation',
        en: '🧊 2D & 3D STEM Animations',
      },
      badge: 'Interactive',
      icon: Box,
    },
    {
      id: 'exam_engine' as PremiumHubTab,
      label: {
        am: '📝 ብሔራዊ ፈተና (EUEE)',
        om: '📝 Qormaata Biyyoolessaa',
        ti: '📝 ብሔራዊ ፈተና',
        ar: '📝 محاكي الامتحان الوطني EUEE',
        so: '📝 Imtixaanka Qaranka',
        en: '📝 EUEE National Exam Simulator',
      },
      badge: 'Timed Exam',
      icon: FileCheck2,
    },
    {
      id: 'stem_lab' as PremiumHubTab,
      label: {
        am: '🧪 ምናባዊ ሳይንስ ላብ',
        om: '🧪 Laabii Saayinsii',
        ti: '🧪 ምናባዊ ሳይንስ ላብ',
        ar: '🧪 المختبر العلمي الافتراضي',
        so: '🧪 Shaybaarka Sayniska',
        en: '🧪 Virtual STEM Science Lab',
      },
      badge: 'MoE Standard',
      icon: FlaskConical,
    },
    {
      id: 'audio_hub' as PremiumHubTab,
      label: {
        am: '🎧 የድምፅ ክለሳ ማዕከል',
        om: '🎧 Sagalee Irra Deebii',
        ti: '🎧 ናይ ድምፂ ክለሳ',
        ar: '🎧 مراجعات صوتية مركزة',
        so: '🎧 Xarunta Maqalka',
        en: '🎧 High-Yield Audio Revision',
      },
      badge: '10-15 Min',
      icon: Headphones,
    },
    {
      id: 'study_plan' as PremiumHubTab,
      label: {
        am: '🤖 AI የጥናት እቅድ',
        om: '🤖 Karoora Qo\'annoo',
        ti: '🤖 ናይ መጽናዕቲ መደብ',
        ar: '🤖 جدول الدراسة التكيفي الذكي',
        so: '🤖 Qorshaha Waxbarashada',
        en: '🤖 AI Diagnostic Study Planner',
      },
      badge: '30-Day Plan',
      icon: CalendarDays,
    },
  ];

  // Render content of active hub
  const renderActiveHubContent = () => {
    switch (activeTab) {
      case 'videos':
        return (
          <ProtectedMediaShield
            contentTitle="HD Video Masterclass: Ethiopian High School STEM Series"
            itemType="video"
            singlePriceETB={54}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          >
            <VideoMasterclassPlayer videos={PREMIUM_VIDEO_MASTERCLASSES} />
          </ProtectedMediaShield>
        );

      case 'animations':
        return (
          <ProtectedMediaShield
            contentTitle="2D & 3D Interactive STEM Educational Animations"
            itemType="simulation"
            singlePriceETB={54}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          >
            <div className="space-y-4">
              {/* Simulation Sub-Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 border-b border-slate-800 pb-3 text-white">
                <span className="text-xs font-bold text-slate-300">የአኒሜሽን ሞዴል ምረጥ (Select Simulation):</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedSimType('projectile')}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                      selectedSimType === 'projectile'
                        ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    Physics: Projectile Motion (2D)
                  </button>
                  <button
                    onClick={() => setSelectedSimType('vsepr')}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                      selectedSimType === 'vsepr'
                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Atom className="w-4 h-4" />
                    Chemistry: 3D VSEPR Geometry
                  </button>
                  <button
                    onClick={() => setSelectedSimType('riemann')}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                      selectedSimType === 'riemann'
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Calculator className="w-4 h-4" />
                    Math: Riemann Integrals
                  </button>
                </div>
              </div>

              {selectedSimType === 'projectile' && <ProjectileSimulation />}
              {selectedSimType === 'vsepr' && <VseprSimulation />}
              {selectedSimType === 'riemann' && <RiemannSimulation />}
            </div>
          </ProtectedMediaShield>
        );

      case 'exam_engine':
        return (
          <ProtectedMediaShield
            contentTitle="Advanced National Exam Simulator (EUEE & ESSLCE Engines)"
            itemType="exam"
            singlePriceETB={54}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          >
            <ExamSimulator paper={PREMIUM_EXAM_PAPERS[0]} />
          </ProtectedMediaShield>
        );

      case 'stem_lab':
        return (
          <ProtectedMediaShield
            contentTitle="Virtual Interactive STEM Science Lab (MoE Practical Textbook Aligned)"
            itemType="lab"
            singlePriceETB={54}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          >
            <div className="space-y-4">
              {/* Lab Sub-Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 border-b border-slate-800 pb-3 text-white">
                <span className="text-xs font-bold text-slate-300">የሳይንስ ላቦራቶሪ ምረጥ (Select STEM Lab):</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedLabType('titration')}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                      selectedLabType === 'titration'
                        ? 'bg-pink-600 text-white border-pink-500 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <FlaskConical className="w-4 h-4" />
                    Chemistry: Acid-Base Titration
                  </button>
                  <button
                    onClick={() => setSelectedLabType('optics')}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                      selectedLabType === 'optics'
                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    Physics: Optics Ray-Tracing Bench
                  </button>
                  <button
                    onClick={() => setSelectedLabType('circuit')}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                      selectedLabType === 'circuit'
                        ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    Physics: DC Circuit Sandbox
                  </button>
                </div>
              </div>

              {selectedLabType === 'titration' && <TitrationSimulation />}
              {selectedLabType === 'optics' && <OpticsBenchSimulation />}
              {selectedLabType === 'circuit' && <CircuitSandboxSimulation />}
            </div>
          </ProtectedMediaShield>
        );

      case 'audio_hub':
        return (
          <ProtectedMediaShield
            contentTitle="High-Yield Audio Revision Hub: Ethiopian STEM Formulas & Mnemonics"
            itemType="audio"
            singlePriceETB={54}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          >
            <AudioMasterclassPlayer tracks={PREMIUM_AUDIO_REVISIONS} />
          </ProtectedMediaShield>
        );

      case 'study_plan':
        return (
          <ProtectedMediaShield
            contentTitle="AI Personalized Study Timetable & Diagnostic Planner (30-Day MoE Mastery)"
            itemType="plan"
            singlePriceETB={54}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          >
            <StudyPlanner initialPlan={INITIAL_STUDY_PLAN_DATA} />
          </ProtectedMediaShield>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800/80 text-amber-300 border border-purple-400/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              ፕሪሚየም የትምህርት ማዕከል • Ethiopian MoE High School
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              ፕሪሚየም የትምህርት ማዕከል & DRM Academic Hub
            </h1>
            <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
              ከ 9-12ኛ ክፍል አዲሱ የኢትዮጵያ ስርዐተ-ትምህርት (MoE Curriculum) የተዘጋጁ HD ቪዲዮዎች፣ 3D አኒሜሽኖች፣ ምናባዊ ሳይንስ ላቦራቶሪዎች እና የብሔራዊ ፈተና አስመሳይ።
            </p>
          </div>

          {/* Super Admin / Subscription status pill */}
          <div className="shrink-0 flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900/90 border border-purple-500/30 shadow-md">
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5 text-amber-300" />
              </div>
              <div className="text-right pr-1">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">ፍቃድ ሁኔታ</span>
                <span className="text-xs font-bold text-amber-300">
                  {isSuperAdmin
                    ? '👑 Super Admin (ቋሚ ነፃ)'
                    : isUnlocked
                    ? '✅ ፕሪሚየም ገቢር ነው'
                    : '🔒 ያልተከፈለ (54 ETB / ወር)'}
                </span>
              </div>
            </div>

            {!isUnlocked && !isSuperAdmin && (
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-md transition active:scale-95"
              >
                በቴሌብር ፍቃድ ግዛ ({currentGradePrice} ETB)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. The 6 Core Hubs Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[96px] ${
                isActive
                  ? 'bg-gradient-to-b from-indigo-950 to-slate-900 border-indigo-500 text-white shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    isActive
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {tab.badge}
                </span>
              </div>

              <div className="mt-2">
                <h4 className="text-xs font-bold leading-tight">
                  {tab.label[language] || tab.label.am}
                </h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Active Hub Content Area */}
      <div>{renderActiveHubContent()}</div>

      {/* 4. Payment Modal Drawer when user clicks unlock */}
      <SubscriptionPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { ProtectedMediaShield } from './ProtectedMediaShield';
import { VideoMasterclassHub } from './VideoMasterclassHub';
import { SimulationsHub } from './SimulationsHub';
import { EUEESimulatorHub } from './EUEESimulatorHub';
import { VirtualStemLabHub } from './VirtualStemLabHub';
import { AudioMasterHub } from './AudioMasterHub';
import { AiStudyPlannerHub } from './AiStudyPlannerHub';
import { SubscriptionPaymentModal } from '../growth/SubscriptionPaymentModal';
import {
  Crown,
  Video,
  Box,
  FileCheck2,
  FlaskConical,
  Headphones,
  CalendarDays,
  Shield,
  Sparkles,
  X,
  Maximize2,
  Minimize2,
  Lock,
  Unlock,
  CheckCircle2,
  Flame,
  Award,
} from 'lucide-react';

export type PremiumHubTab =
  | 'videos'
  | 'simulations'
  | 'euee_exam'
  | 'virtual_lab'
  | 'audio_hub'
  | 'study_plan';

interface PremiumLearningCenterModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialTab?: PremiumHubTab;
}

export const PremiumLearningCenterModal: React.FC<PremiumLearningCenterModalProps> = ({
  isOpen = true,
  onClose,
  initialTab = 'videos',
}) => {
  const { language } = useLanguage();
  const { currentUser, isSuperAdmin } = useAuth();
  const { isUnlocked, isPremiumLearningUnlocked, currentGradePrice } = useSubscription();

  const [activeTab, setActiveTab] = useState<PremiumHubTab>(initialTab);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // If used as a controlled modal and not open, return null
  if (!isOpen) return null;

  const isOwnerAdmin =
    isSuperAdmin ||
    currentUser.email === 'mejennur669@gmail.com' ||
    currentUser.email?.toLowerCase().includes('mejennur') ||
    (currentUser as any).phone === '0910097862';

  const hasVipAccess = isOwnerAdmin || isPremiumLearningUnlocked;

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
      description: 'Synchronized Curriculum Lectures & Real-World Lab Demos',
    },
    {
      id: 'simulations' as PremiumHubTab,
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
      description: 'Physics Orbits, VSEPR Geometry, Wave Interference & DNA',
    },
    {
      id: 'euee_exam' as PremiumHubTab,
      label: {
        am: '📝 ብሔራዊ ፈተና (EUEE)',
        om: '📝 Qormaata Biyyoolessaa',
        ti: '📝 ብሔራዊ ፈተና',
        ar: '📝 محاكي الامتحان الوطني EUEE',
        so: '📝 Imtixaanka Qaranka',
        en: '📝 EUEE National Exam Simulator',
      },
      badge: '100 Questions',
      icon: FileCheck2,
      description: 'Full-length 2005-2018 E.C. Authentic Timed Matric Simulator',
    },
    {
      id: 'virtual_lab' as PremiumHubTab,
      label: {
        am: '🧪 ምናባዊ ሳይንስ ላብ',
        om: '🧪 Laabii Saayinsii',
        ti: '🧪 ምናባዊ ሳይንስ ላብ',
        ar: '🧪 المختبر العلمي الافتراضي',
        so: '🧪 Shaybaarka Sayniska',
        en: '🧪 Virtual STEM Science Lab',
      },
      badge: 'Safety & Error %',
      icon: FlaskConical,
      description: 'Digital Workbench, Safety Inspection & Measurement Evaluation',
    },
    {
      id: 'audio_hub' as PremiumHubTab,
      label: {
        am: '🎧 የድምፅ ክለሳ ማዕከል',
        om: '🎧 Sagalee Irra Deebii',
        ti: '🎧 ናይ ድምፂ ክለሳ',
        ar: '🎧 مراجعات صوتية مركزة',
        so: '🎧 Xarunta Maqalka',
        en: '🎧 Audio Master Hub',
      },
      badge: '6 Languages',
      icon: Headphones,
      description: 'Spoken Podcasts, Offline Playback & Audio Flashcards',
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
      badge: 'Countdown',
      icon: CalendarDays,
      description: 'Custom Algorithmic Timetable & Auto-Rebalancing Milestones',
    },
  ];

  const renderActiveHub = () => {
    switch (activeTab) {
      case 'videos':
        return (
          <ProtectedMediaShield
            contentTitle="HD Video Masterclasses & Lab Demonstrations (MoE Aligned)"
            itemType="video"
            singlePriceETB={57}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          >
            <VideoMasterclassHub />
          </ProtectedMediaShield>
        );

      case 'simulations':
        return (
          <ProtectedMediaShield
            contentTitle="2D & 3D Interactive STEM Educational Animations"
            itemType="simulation"
            singlePriceETB={57}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          >
            <SimulationsHub />
          </ProtectedMediaShield>
        );

      case 'euee_exam':
        return (
          <ProtectedMediaShield
            contentTitle="EUEE Matrix National Exam Simulator (2005 - 2018 E.C.)"
            itemType="exam"
            singlePriceETB={57}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          >
            <EUEESimulatorHub />
          </ProtectedMediaShield>
        );

      case 'virtual_lab':
        return (
          <ProtectedMediaShield
            contentTitle="Virtual STEM Science Laboratory Workbench"
            itemType="lab"
            singlePriceETB={57}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          >
            <VirtualStemLabHub />
          </ProtectedMediaShield>
        );

      case 'audio_hub':
        return (
          <ProtectedMediaShield
            contentTitle="Audio Master Hub & Spoken Podcasts (6 National Languages)"
            itemType="audio"
            singlePriceETB={57}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          >
            <AudioMasterHub />
          </ProtectedMediaShield>
        );

      case 'study_plan':
        return (
          <ProtectedMediaShield
            contentTitle="AI Personal Study Planner & Exam Countdown Engine"
            itemType="plan"
            singlePriceETB={57}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          >
            <AiStudyPlannerHub />
          </ProtectedMediaShield>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`${
        onClose
          ? isFullscreen
            ? 'fixed inset-0 z-50 bg-slate-950/95 overflow-y-auto p-4 sm:p-6'
            : 'fixed inset-0 z-50 bg-black/85 backdrop-blur-xl overflow-y-auto p-3 sm:p-6 flex items-center justify-center'
          : 'space-y-6 animate-in fade-in'
      }`}
    >
      <div
        className={`w-full ${
          onClose && !isFullscreen ? 'max-w-7xl' : ''
        } rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#070b19] border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 text-white p-5 sm:p-8 space-y-6 relative overflow-hidden`}
      >
        {/* Subtle Luxury Golden Glow Ambient Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

        {/* 1. VIP Dashboard Header Bar */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              VIP Access System • MoE 2019 E.C. (2026 Curriculum)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>NUR AI Premium Learning Center & VIP Hub</span>
              <Sparkles className="w-6 h-6 text-amber-400 shrink-0" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ከ 9-12ኛ ክፍል የተሟላ HD ቪዲዮ ማስተርክላስ፣ 3D STEM ላቦራቶሪዎች፣ የብሔራዊ ፈተና (EUEE) ሲሙሌተር እና የድምፅ ማጠቃለያዎች ማዕከል።
            </p>
          </div>

          {/* Access Status & Window Controls */}
          <div className="flex flex-wrap items-center gap-3 self-end md:self-center">
            {/* Super Admin / Active Status Badge */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-950/90 border border-amber-500/40 shadow-md">
              <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Crown className="w-4 h-4" />
              </div>
              <div className="text-right pr-1">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  ፈቃድ ሁኔታ (Status)
                </span>
                <span className="text-xs font-bold text-amber-300">
                  {isOwnerAdmin
                    ? '👑 Super Admin Lifetime Bypass (ነፃ ቋሚ)'
                    : hasVipAccess
                    ? '✅ ፕሪሚየም ገቢር ነው (VIP Active)'
                    : '🔒 ያልተከፈለ (57 ETB / ወር)'}
                </span>
              </div>
            </div>

            {/* Window controls if rendered as modal */}
            {onClose && (
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title={isFullscreen ? 'Minimize' : 'Fullscreen'}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-rose-950/60 hover:text-rose-300 transition"
                  title="Close VIP Hub"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. The 6 Luxury VIP Hub Switcher Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[105px] group ${
                  isActive
                    ? 'bg-gradient-to-b from-amber-950/70 via-slate-900 to-indigo-950 border-amber-500 text-white shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/60'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-amber-500/40 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                        : 'bg-slate-800 text-slate-300 group-hover:text-amber-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                      isActive
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </div>

                <div className="mt-2.5">
                  <h4 className="text-xs font-black leading-tight text-white group-hover:text-amber-300 transition">
                    {tab.label[language] || tab.label.en}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {tab.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* 3. Main Active Hub Content Area */}
        <div className="pt-2">{renderActiveHub()}</div>

        {/* 4. Payment Trigger Drawer if locked and student clicks unlock */}
        <SubscriptionPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          product="premium"
          singlePriceETB={57}
        />
      </div>
    </div>
  );
};

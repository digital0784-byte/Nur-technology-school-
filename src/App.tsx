import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProgressProvider } from './context/ProgressContext';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import { ModuleId } from './types';

// Shell & Navigation Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TabBar } from './components/TabBar';
import { WelcomeModal } from './components/WelcomeModal';
import { ProfileModal } from './components/ProfileModal';
import { StudentNotificationCenterModal } from './components/notifications/StudentNotificationCenterModal';
import { StudentNotificationCenterView } from './components/notifications/StudentNotificationCenterView';
import { AdminNotificationCenter } from './components/admin/AdminNotificationCenter';
import { PaywallGate } from './components/common/PaywallGate';
import { OfflineIndicator } from './components/common/OfflineIndicator';

// 📚 Category 1: Core Learning & Books
import { LessonView } from './components/learning/LessonView';
import { EthiopianCurriculumEngineView } from './components/learning/EthiopianCurriculumEngineView';
import { TextbookView } from './components/learning/TextbookView';
import { SupplementaryBooksView } from './components/learning/SupplementaryBooksView';
import { VideoLearningView } from './components/learning/VideoLearningView';

// 📝 Category 2: Exams & Assessment
import { AIQuizExamEngineView } from './components/assessment/AIQuizExamEngineView';
import { ObjectivesExamView } from './components/assessment/ObjectivesExamView';
import { QuizView } from './components/assessment/QuizView';
import { FlashcardView } from './components/assessment/FlashcardView';
import { AcademicWorkHubView } from './components/assessment/AcademicWorkHubView';
import { EntranceExamPrepView } from './components/entrance/EntranceExamPrepView';

// 🤖 Category 3: AI & Smart Tools
import { EthiopianAITutorView } from './components/student/EthiopianAITutorView';
import { PhotoVoiceTutorView } from './components/student/PhotoVoiceTutorView';
import { SmartSearchModal } from './components/student/SmartSearchModal';
import { StudentLearningReviewView } from './components/student/StudentLearningReviewView';
import { StudentPortalDashboard } from './components/student/StudentPortalDashboard';

// 🌟 Category 4: Growth, Premium & Payment
import { GamificationView } from './components/growth/GamificationView';
import { CareerPathwaysView } from './components/growth/CareerPathwaysView';
import { PremiumLearningCenterView } from './components/growth/PremiumLearningCenterView';
import { SubscriptionPaymentView } from './components/growth/SubscriptionPaymentView';
import { SystemFeedbackView } from './components/growth/SystemFeedbackView';

// 🛡️ Category 5: Administration & Security
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { SecurityFortressView } from './components/admin/SecurityFortressView';
import { SystemIntegrationView } from './components/admin/SystemIntegrationView';

const ADMIN_ONLY_MODULES: ModuleId[] = [
  'admin_dashboard',
  'admin_notifications',
  'security_fortress',
  'system_integration',
];

function MainAppShell() {
  const { isAuthenticated, authLoading, activeGrade, isSuperAdmin } = useAuth();
  const { isUnlocked, approvePayment } = useSubscription();
  const [currentModule, setCurrentModule] = useState<ModuleId>('student_app');
  const [historyStack, setHistoryStack] = useState<ModuleId[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [tutorContext, setTutorContext] = useState<{ subject: string; topic: string } | null>(null);
  const [downloadBlockedNotice, setDownloadBlockedNotice] = useState<string | null>(null);

  useEffect(() => {
    let noticeTimer: ReturnType<typeof setTimeout> | null = null;
    const notifyDownloadBlocked = (msg: string) => {
      setDownloadBlockedNotice(msg);
      if (noticeTimer) clearTimeout(noticeTimer);
      noticeTimer = setTimeout(() => setDownloadBlockedNotice(null), 3200);
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const key = e.key?.toLowerCase();
      // Block Ctrl/Cmd + S (Save Page), Ctrl/Cmd + P (Print / Save as PDF), Ctrl/Cmd + U (View Source)
      if ((e.ctrlKey || e.metaKey) && (key === 's' || key === 'p' || key === 'u')) {
        e.preventDefault();
        e.stopPropagation();
        notifyDownloadBlocked('🔒 ከሲስተሙ ማንኛውንም ነገር ማውረድ ወይም ማስቀመጥ ተከልክሏል! (Downloads & Saving Disabled)');
      }
    };

    const handleGlobalContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      // Allow context menu inside text inputs/textareas for typing/paste, block everywhere else
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) {
        return;
      }
      e.preventDefault();
      notifyDownloadBlocked('🔒 ከሲስተሙ ማንኛውንም ፋይል፣ ፎቶ ወይም ጽሑፍ ማውረድ ተከልክሏል! (Downloads Disabled)');
    };

    const handleGlobalDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'img' || tag === 'a' || tag === 'video' || tag === 'audio' || tag === 'canvas') {
        e.preventDefault();
      }
    };

    const handleGlobalDragOver = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('[data-allow-student-photo-drop="true"]')) return;
      if (!isSuperAdmin && e.dataTransfer?.types?.includes('Files')) {
        e.preventDefault();
      }
    };

    const handleGlobalDrop = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('[data-allow-student-photo-drop="true"]')) return;
      if (!isSuperAdmin && (e.dataTransfer?.types?.includes('Files') || (e.dataTransfer?.files && e.dataTransfer.files.length > 0))) {
        e.preventDefault();
        e.stopPropagation();
        notifyDownloadBlocked('🔒 ወደ ሲስተሙ ፋይል ማስገባት የሚችለው Super Admin ብቻ ነው! (Only Super Admin can upload files)');
      }
    };

    const handleGlobalFileInputGuard = (e: Event) => {
      if (isSuperAdmin) return;
      const target = e.target as HTMLInputElement | null;
      if (target && target.tagName?.toLowerCase() === 'input' && target.type === 'file') {
        if (target.dataset?.allowStudentPhotoUpload === 'true') return;
        target.value = '';
        e.preventDefault();
        e.stopPropagation();
        notifyDownloadBlocked('🔒 ወደ ሲስተሙ ፋይል ማስገባት የሚችለው Super Admin ብቻ ነው! (Only Super Admin can upload files)');
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, true);
    window.addEventListener('contextmenu', handleGlobalContextMenu, true);
    window.addEventListener('dragstart', handleGlobalDragStart, true);
    window.addEventListener('dragover', handleGlobalDragOver, true);
    window.addEventListener('drop', handleGlobalDrop, true);
    document.addEventListener('click', handleGlobalFileInputGuard, true);
    document.addEventListener('change', handleGlobalFileInputGuard, true);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown, true);
      window.removeEventListener('contextmenu', handleGlobalContextMenu, true);
      window.removeEventListener('dragstart', handleGlobalDragStart, true);
      window.removeEventListener('dragover', handleGlobalDragOver, true);
      window.removeEventListener('drop', handleGlobalDrop, true);
      document.removeEventListener('click', handleGlobalFileInputGuard, true);
      document.removeEventListener('change', handleGlobalFileInputGuard, true);
      if (noticeTimer) clearTimeout(noticeTimer);
    };
  }, [isSuperAdmin]);

  useEffect(() => {
    if (!isSuperAdmin && ADMIN_ONLY_MODULES.includes(currentModule)) {
      setCurrentModule('student_app');
    }
  }, [isSuperAdmin, currentModule]);

  const handleSelectModule = (newModule: ModuleId) => {
    if (ADMIN_ONLY_MODULES.includes(newModule) && !isSuperAdmin) {
      return;
    }
    if (newModule !== currentModule) {
      setHistoryStack((prev) => [...prev, currentModule]);
      setCurrentModule(newModule);
    }
  };

  const handleGoBack = () => {
    if (historyStack.length > 0) {
      const prev = historyStack[historyStack.length - 1];
      setHistoryStack((h) => h.slice(0, h.length - 1));
      setCurrentModule(prev);
    }
  };

  const handleNavigateToAiTutor = (context: { subject: string; topic: string }) => {
    setTutorContext(context);
    handleSelectModule('ai_tutor');
  };

  // Render exactly one of the 24 modules
  const renderActiveModuleView = () => {
    switch (currentModule) {
      // Category 1: 📚 ዋና መማሪያ እና መጽሐፍት
      case 'lesson':
        return <LessonView onAskAi={handleNavigateToAiTutor} />;
      case 'curriculum_engine':
        return <EthiopianCurriculumEngineView />;
      case 'textbook':
        return <TextbookView />;
      case 'supplementary':
        return <SupplementaryBooksView />;
      case 'video_learning':
        return <VideoLearningView />;

      // Category 2: 📝 ፈተና እና ምዘና
      case 'assessment_engine':
        return <AIQuizExamEngineView />;
      case 'entrance_prep':
        return <EntranceExamPrepView />;
      case 'objectives_exam':
        return <ObjectivesExamView />;
      case 'quiz':
        return <QuizView />;
      case 'flashcards':
        return <FlashcardView />;
      case 'academic_work_hub':
        return <AcademicWorkHubView />;

      // Category 3: 🤖 AI እና ስማርት ረዳቶች
      case 'ai_tutor':
        return <EthiopianAITutorView initialContext={tutorContext} />;
      case 'photo_voice_tutor':
        return <PhotoVoiceTutorView />;
      case 'smart_search':
        return <SmartSearchModal />;
      case 'student_review':
        return <StudentLearningReviewView />;
      case 'student_app':
        return <StudentPortalDashboard onNavigateModule={handleSelectModule} />;

      // Category 4: 🌟 እድገት፣ ማዕከልና ክፍያ
      case 'gamification':
        return <GamificationView />;
      case 'career_pathways':
        return <CareerPathwaysView />;
      case 'premium_learning_center':
        return <PremiumLearningCenterView />;
      case 'subscription_payment':
        return <SubscriptionPaymentView />;
      case 'system_feedback':
        return <SystemFeedbackView />;
      case 'student_notifications':
        return <StudentNotificationCenterView onNavigateModule={handleSelectModule} />;

      // Category 5: 🛡️ አስተዳደርና ደህንነት (Super Admin Only)
      case 'admin_dashboard':
        return isSuperAdmin ? <AdminDashboardView /> : <StudentPortalDashboard onNavigateModule={handleSelectModule} />;
      case 'admin_notifications':
        return isSuperAdmin ? (
          <AdminNotificationCenter onApprovePayment={approvePayment} onNavigateTab={(tab) => handleSelectModule(tab as ModuleId)} />
        ) : (
          <StudentPortalDashboard onNavigateModule={handleSelectModule} />
        );
      case 'security_fortress':
        return isSuperAdmin ? <SecurityFortressView /> : <StudentPortalDashboard onNavigateModule={handleSelectModule} />;
      case 'system_integration':
        return isSuperAdmin ? <SystemIntegrationView /> : <StudentPortalDashboard onNavigateModule={handleSelectModule} />;

      default:
        return <StudentPortalDashboard onNavigateModule={handleSelectModule} />;
    }
  };

  const renderModuleWithGate = () => {
    const activeView = renderActiveModuleView();
    // All users must pay upfront based on their grade level.
    // Until checked by admin, the system shows PENDING.
    // Admin modules have their own strict Super Admin access gates.
    const isEntranceGradeAllowed = activeGrade === 11 || activeGrade === 12;
    const isExemptFromPaywall =
      currentModule === 'subscription_payment' ||
      currentModule === 'system_feedback' ||
      currentModule === 'student_notifications' ||
      currentModule === 'photo_voice_tutor' ||
      currentModule === 'premium_learning_center' ||
      currentModule === 'academic_work_hub' ||
      currentModule === 'admin_dashboard' ||
      currentModule === 'admin_notifications' ||
      currentModule === 'security_fortress' ||
      currentModule === 'system_integration' ||
      (currentModule === 'entrance_prep' && !isEntranceGradeAllowed);

    if (!isUnlocked && !isExemptFromPaywall) {
      return (
        <PaywallGate moduleTitle={currentModule}>
          {activeView}
        </PaywallGate>
      );
    }
    return activeView;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 text-sm">
        በመጫን ላይ... / Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Header with Language dropdown & Back button */}
      <Header
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        canGoBack={historyStack.length > 0}
        onGoBack={handleGoBack}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenNotificationCenter={() => setIsNotificationCenterOpen(true)}
        onNavigateModule={handleSelectModule}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* 24 Modules Grouped Vertically + Mobile Floating Overlay Drawer */}
        <Sidebar
          currentModule={currentModule}
          onSelectModule={handleSelectModule}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          canGoBack={historyStack.length > 0}
          onGoBack={handleGoBack}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <TabBar currentModule={currentModule} onSelectModule={handleSelectModule} />
          {renderModuleWithGate()}
        </main>
      </div>

      {/* Sign-in / Register gate: shown until the user is signed in */}
      <WelcomeModal isOpen={!isAuthenticated} onClose={() => {}} />

      {/* Profile & Logout */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Student Notification Center */}
      <StudentNotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        onNavigateModule={handleSelectModule}
      />

      {/* Global Offline/Online Status Indicator */}
      <OfflineIndicator />

      {/* Global Download-Blocked Notice Toast */}
      {downloadBlockedNotice && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[120] px-4 py-2.5 rounded-2xl bg-rose-950/95 text-rose-100 border border-rose-500/70 shadow-2xl text-xs font-bold backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          {downloadBlockedNotice}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ProgressProvider>
          <SubscriptionProvider>
            <MainAppShell />
          </SubscriptionProvider>
        </ProgressProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

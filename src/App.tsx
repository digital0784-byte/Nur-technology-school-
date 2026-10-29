import React, { useState } from 'react';
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
import { PaywallGate } from './components/common/PaywallGate';

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

function MainAppShell() {
  const { isAuthenticated, authLoading } = useAuth();
  const { isUnlocked } = useSubscription();
  const [currentModule, setCurrentModule] = useState<ModuleId>('student_app');
  const [historyStack, setHistoryStack] = useState<ModuleId[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [tutorContext, setTutorContext] = useState<{ subject: string; topic: string } | null>(null);

  const handleSelectModule = (newModule: ModuleId) => {
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

      // Category 5: 🛡️ አስተዳደርና ደህንነት
      case 'admin_dashboard':
        return <AdminDashboardView />;
      case 'security_fortress':
        return <SecurityFortressView />;
      case 'system_integration':
        return <SystemIntegrationView />;

      default:
        return <StudentPortalDashboard onNavigateModule={handleSelectModule} />;
    }
  };

  const renderModuleWithGate = () => {
    const activeView = renderActiveModuleView();
    // All users must pay upfront based on their grade level.
    // Until checked by admin, the system shows PENDING.
    if (!isUnlocked && currentModule !== 'subscription_payment' && currentModule !== 'system_feedback') {
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

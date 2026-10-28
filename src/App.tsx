import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ModuleId } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WelcomeModal } from './components/WelcomeModal';
import { ProfileModal } from './components/ProfileModal';
import { CoreLearningModules } from './modules/CoreLearningModules';
import { ExamsAssessmentModules } from './modules/ExamsAssessmentModules';
import { AiSmartToolsModules } from './modules/AiSmartToolsModules';
import { GrowthPaymentModules } from './modules/GrowthPaymentModules';
import { AdminSecurityModules } from './modules/AdminSecurityModules';

function MainLayout() {
  const { hasCompletedOnboarding } = useAuth();
  const [currentModule, setCurrentModule] = useState<ModuleId>('student_app');
  const [historyStack, setHistoryStack] = useState<ModuleId[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(!hasCompletedOnboarding);
  const [tutorContext, setTutorContext] = useState<{ subject: string; topic: string } | null>(null);

  // Navigate to module and push to history stack
  const handleSelectModule = (newModule: ModuleId) => {
    if (newModule !== currentModule) {
      setHistoryStack((prev) => [...prev, currentModule]);
      setCurrentModule(newModule);
    }
  };

  // Global "ወደ ኋላ" (Back Arrow) handler
  const handleGoBack = () => {
    if (historyStack.length > 0) {
      const prevModule = historyStack[historyStack.length - 1];
      setHistoryStack((prev) => prev.slice(0, prev.length - 1));
      setCurrentModule(prevModule);
    }
  };

  const handleNavigateToAiTutor = (context: { subject: string; topic: string }) => {
    setTutorContext(context);
    handleSelectModule('ai_tutor');
  };

  // Determine which category component to render
  const renderCurrentModule = () => {
    // Category 1: Core Learning & Books
    if (
      currentModule === 'lesson' ||
      currentModule === 'curriculum_engine' ||
      currentModule === 'textbook' ||
      currentModule === 'supplementary' ||
      currentModule === 'video_learning'
    ) {
      return (
        <CoreLearningModules
          moduleId={currentModule}
          onNavigateToAiTutor={handleNavigateToAiTutor}
        />
      );
    }

    // Category 2: Exams & Assessment
    if (
      currentModule === 'assessment_engine' ||
      currentModule === 'entrance_prep' ||
      currentModule === 'objectives_exam' ||
      currentModule === 'quiz' ||
      currentModule === 'flashcards' ||
      currentModule === 'academic_work_hub'
    ) {
      return <ExamsAssessmentModules moduleId={currentModule} />;
    }

    // Category 3: AI & Smart Tools
    if (
      currentModule === 'ai_tutor' ||
      currentModule === 'photo_voice_tutor' ||
      currentModule === 'smart_search' ||
      currentModule === 'student_review' ||
      currentModule === 'student_app'
    ) {
      return (
        <AiSmartToolsModules
          moduleId={currentModule}
          onNavigateModule={handleSelectModule}
          initialChatContext={tutorContext}
        />
      );
    }

    // Category 4: Growth, Premium & Payment
    if (
      currentModule === 'gamification' ||
      currentModule === 'career_pathways' ||
      currentModule === 'premium_learning_center' ||
      currentModule === 'subscription_payment' ||
      currentModule === 'system_feedback'
    ) {
      return <GrowthPaymentModules moduleId={currentModule} />;
    }

    // Category 5: Administration & Security (Admin Only)
    return <AdminSecurityModules moduleId={currentModule} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Global Top Header Navigation */}
      <Header
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        canGoBack={historyStack.length > 0}
        onGoBack={handleGoBack}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Vertical Left Sidebar with 24 Modules & Mobile Overlay Drawer */}
        <Sidebar
          currentModule={currentModule}
          onSelectModule={handleSelectModule}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          canGoBack={historyStack.length > 0}
          onGoBack={handleGoBack}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderCurrentModule()}
        </main>
      </div>

      {/* Initial Welcome & Grade Selection Modal */}
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
      />

      {/* Profile & Role Switcher Modal */}
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
        <MainLayout />
      </AuthProvider>
    </LanguageProvider>
  );
}

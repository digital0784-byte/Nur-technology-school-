import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ModuleCategory, ModuleId } from '../types';
import {
  BookOpen,
  GitFork,
  FileText,
  BookmarkCheck,
  Video,
  FileCheck2,
  GraduationCap,
  Target,
  HelpCircle,
  Layers,
  Briefcase,
  Bot,
  Camera,
  Search,
  LineChart,
  Home,
  Flame,
  Compass,
  Sparkles,
  CreditCard,
  MessageSquare,
  ShieldAlert,
  KeyRound,
  Activity,
  X,
  Lock,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

interface SidebarProps {
  currentModule: ModuleId;
  onSelectModule: (module: ModuleId) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  canGoBack: boolean;
  onGoBack: () => void;
}

interface ModuleConfig {
  id: ModuleId;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

interface CategoryGroup {
  key: ModuleCategory;
  categoryLabelKey: string;
  modules: ModuleConfig[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    key: 'core_learning',
    categoryLabelKey: 'category_core_learning',
    modules: [
      { id: 'lesson', icon: BookOpen },
      { id: 'curriculum_engine', icon: GitFork },
      { id: 'textbook', icon: FileText },
      { id: 'supplementary', icon: BookmarkCheck },
      { id: 'video_learning', icon: Video },
    ],
  },
  {
    key: 'exams_assessment',
    categoryLabelKey: 'category_exams_assessment',
    modules: [
      { id: 'assessment_engine', icon: FileCheck2 },
      { id: 'entrance_prep', icon: GraduationCap },
      { id: 'objectives_exam', icon: Target },
      { id: 'quiz', icon: HelpCircle },
      { id: 'flashcards', icon: Layers },
      { id: 'academic_work_hub', icon: Briefcase },
    ],
  },
  {
    key: 'ai_smart_tools',
    categoryLabelKey: 'category_ai_smart_tools',
    modules: [
      { id: 'ai_tutor', icon: Bot },
      { id: 'photo_voice_tutor', icon: Camera },
      { id: 'smart_search', icon: Search },
      { id: 'student_review', icon: LineChart },
      { id: 'student_app', icon: Home },
    ],
  },
  {
    key: 'growth_payment',
    categoryLabelKey: 'category_growth_payment',
    modules: [
      { id: 'gamification', icon: Flame },
      { id: 'career_pathways', icon: Compass },
      { id: 'premium_learning_center', icon: Sparkles },
      { id: 'subscription_payment', icon: CreditCard },
      { id: 'system_feedback', icon: MessageSquare },
    ],
  },
  {
    key: 'admin_security',
    categoryLabelKey: 'category_admin_security',
    modules: [
      { id: 'admin_dashboard', icon: ShieldAlert, adminOnly: true },
      { id: 'security_fortress', icon: KeyRound, adminOnly: true },
      { id: 'system_integration', icon: Activity, adminOnly: true },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  isMobileOpen,
  onCloseMobile,
  canGoBack,
  onGoBack,
}) => {
  const { t, isRtl } = useLanguage();
  const { isSuperAdmin, activeGrade } = useAuth();
  const [searchFilter, setSearchFilter] = useState('');

  const handleModuleClick = (moduleId: ModuleId) => {
    onSelectModule(moduleId);
    onCloseMobile();
  };

  const filteredCategories = CATEGORY_GROUPS.map((cat) => {
    // If user is not Super Admin, hide Category 5 (Admin Only) or admin modules
    const modulesAllowed = isSuperAdmin
      ? cat.modules
      : cat.modules.filter((m) => !m.adminOnly);

    if (!searchFilter.trim()) {
      return { ...cat, modules: modulesAllowed };
    }

    const term = searchFilter.toLowerCase();
    const filteredModules = modulesAllowed.filter((mod) => {
      const title = t(`mod_${mod.id}`).toLowerCase();
      const sub = t(`mod_${mod.id}_sub`).toLowerCase();
      return title.includes(term) || sub.includes(term);
    });

    return { ...cat, modules: filteredModules };
  }).filter((cat) => cat.modules.length > 0);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Mobile Header / Quick Controls */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {canGoBack && (
            <button
              type="button"
              onClick={onGoBack}
              className="p-1.5 rounded-lg text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800"
              title={t('back_button')}
            >
              {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            </button>
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            24 {t('units')} & ሞጁሎች
          </span>
        </div>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label={t('close')}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Module Search Bar */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={t('search_modules_placeholder')}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all"
          />
          {searchFilter && (
            <button
              type="button"
              onClick={() => setSearchFilter('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Vertical Categories & 24 Modules List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {filteredCategories.map((group) => (
          <div key={group.key} className="space-y-1">
            <div className="px-2 py-1 text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>{t(group.categoryLabelKey)}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-400">
                {group.modules.length}
              </span>
            </div>

            <div className="space-y-0.5">
              {group.modules.map((mod) => {
                const IconComponent = mod.icon;
                const isActive = currentModule === mod.id;
                const isLockedForStudent = mod.adminOnly && !isSuperAdmin;

                return (
                  <button
                    key={mod.id}
                    type="button"
                    disabled={isLockedForStudent}
                    onClick={() => handleModuleClick(mod.id)}
                    className={`w-full group flex items-start gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                        : isLockedForStudent
                        ? 'opacity-40 cursor-not-allowed text-slate-400'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-medium truncate">
                          {t(`mod_${mod.id}`)}
                        </span>
                        {mod.adminOnly && (
                          <span
                            className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                              isActive
                                ? 'bg-amber-400/30 text-amber-200'
                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            }`}
                          >
                            Admin
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-[10px] truncate leading-tight ${
                          isActive
                            ? 'text-emerald-100'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {t(`mod_${mod.id}_sub`)}
                      </div>
                    </div>

                    {isLockedForStudent && <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer Info */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
        <span>MoE 2019 E.C. (2026)</span>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Grade {activeGrade}</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: normal flex layout */}
      <aside className="hidden md:block w-72 lg:w-80 shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Floating Overlay Drawer with Semi-transparent dark backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop with bg-black/60 backdrop-blur-xs */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Floating Drawer */}
          <div
            className={`fixed inset-y-0 ${
              isRtl ? 'right-0' : 'left-0'
            } w-80 max-w-[85vw] shadow-2xl z-50 animate-in ${
              isRtl ? 'slide-in-from-right' : 'slide-in-from-left'
            } duration-200`}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

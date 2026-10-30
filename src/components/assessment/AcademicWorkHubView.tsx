import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AcademicWorkHubTab } from '../../types/academicWorkHub';
import { HomeworkEngine } from '../academic_work_hub/HomeworkEngine';
import { PremiumAssignmentEngine } from '../academic_work_hub/PremiumAssignmentEngine';
import { StemProjectHub } from '../academic_work_hub/StemProjectHub';
import { StudentPortfolioEngine } from '../academic_work_hub/StudentPortfolioEngine';
import {
  Briefcase,
  BookOpen,
  Crown,
  Compass,
  FileText,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const AcademicWorkHubView: React.FC = () => {
  const { activeGrade, setActiveGrade, isSuperAdmin, currentUser } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<AcademicWorkHubTab>('homework');

  const tabs: { id: AcademicWorkHubTab; labelAm: string; labelEn: string; icon: any; badge?: string }[] = [
    {
      id: 'homework',
      labelAm: 'የቤት ስራ ሞተር',
      labelEn: 'Homework Engine',
      icon: BookOpen,
      badge: 'Free',
    },
    {
      id: 'premium_assignment',
      labelAm: 'ልዩ አሳይመንቶች',
      labelEn: 'Premium Assignments',
      icon: Crown,
      badge: '54 ETB',
    },
    {
      id: 'stem_project',
      labelAm: 'የተግባር STEM ፕሮጀክቶች',
      labelEn: 'Practical STEM Projects',
      icon: Compass,
      badge: 'Real-World',
    },
    {
      id: 'portfolio',
      labelAm: 'የተማሪ ፖርትፎሊዮ',
      labelEn: 'Student Portfolio',
      icon: FileText,
      badge: 'PDF Report',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto pb-12">
      {/* Platform Header with Grade Switcher */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
            <Briefcase className="w-3.5 h-3.5" />
            FDRE MoE Curriculum Standard 2019 E.C. (2026)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            የቤት ስራ፣ አሳይመንት እና የተግባር ፕሮጀክት ማዕከል
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
            ለኢትዮጵያ የሁለተኛ ደረጃ ተማሪዎች (Grades 9-12) የተዘጋጀ የተሟላ የትምህርት ስራዎች ማዕከል — ራሱ ሲስተሙ (NUR AI Engine) እንደ ዋና መምህር ሆኖ ጥያቄዎችን የሚያመነጭ፣ በደረጃ በደረጃ የሚያርም እና ፈጣን የውጤት ሪፖርት የሚሰጥ።
          </p>
        </div>

        {/* Grade Level Selector */}
        <div className="bg-slate-900/90 p-3 rounded-2xl border border-emerald-500/30 shrink-0 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            የክፍል ደረጃ (Select Grade):
          </div>
          <div className="flex items-center gap-1.5">
            {[9, 10, 11, 12].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setActiveGrade(g as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  activeGrade === g
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Grade {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Engine Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition flex items-center gap-2.5 shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.labelAm}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${
                    isActive
                      ? 'bg-emerald-800 text-emerald-200'
                      : tab.id === 'premium_assignment'
                      ? 'bg-amber-500/15 text-amber-500'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Rendering */}
      <div>
        {activeTab === 'homework' && <HomeworkEngine />}
        {activeTab === 'premium_assignment' && <PremiumAssignmentEngine />}
        {activeTab === 'stem_project' && <StemProjectHub />}
        {activeTab === 'portfolio' && <StudentPortfolioEngine />}
      </div>
    </div>
  );
};

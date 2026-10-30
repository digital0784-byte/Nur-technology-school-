import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AcademicWorkHubService } from '../../services/academicWorkHubService';
import { StudentAcademicPortfolio } from '../../types/academicWorkHub';
import {
  FileText,
  Printer,
  Download,
  Award,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Sparkles,
  ShieldCheck,
  User,
  Calendar,
} from 'lucide-react';

export const StudentPortfolioEngine: React.FC = () => {
  const { currentUser, activeGrade } = useAuth();
  const [portfolio, setPortfolio] = useState<StudentAcademicPortfolio>(() =>
    AcademicWorkHubService.getStudentPortfolio(
      currentUser.id,
      currentUser.name,
      currentUser.email,
      activeGrade
    )
  );

  useEffect(() => {
    setPortfolio(
      AcademicWorkHubService.getStudentPortfolio(
        currentUser.id,
        currentUser.name,
        currentUser.email,
        activeGrade
      )
    );
  }, [currentUser.id, currentUser.name, currentUser.email, activeGrade]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Print Action */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2 border border-indigo-500/30">
            <FileText className="w-3.5 h-3.5" />
            Official Academic Portfolio • የተማሪ የውጤት ማህደር
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            የተማሪ የትምህርት አፈጻጸም ፖርትፎሊዮ (Student Portfolio)
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100/90 max-w-2xl mt-1">
            በቤት ስራ፣ በልዩ አሳይመንቶች እና በተግባር ሳይንስ ፕሮጀክቶች የተገኙ ውጤቶች፣ የአስተማሪ አስተያየቶች እና ይፋዊ ሊታተም የሚችል የትምህርት ማረጋገጫ ሪፖርት።
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition"
        >
          <Printer className="w-4 h-4" />
          ይፋዊ የውጤት ሰነድ አትም (Print / Download PDF)
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">የተሰሩ የቤት ስራዎች</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {portfolio.completedHomeworkCount}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {portfolio.homeworkTotalScore} XP የተሰበሰበ
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">የታረሙ ልዩ አሳይመንቶች</span>
          <div className="text-2xl font-black text-amber-500">
            {portfolio.completedAssignmentsCount}
          </div>
          <span className="text-[11px] text-slate-500">
            አማካይ: {portfolio.assignmentAverageScore}%
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">የተጠናቀቁ STEM ፕሮጀክቶች</span>
          <div className="text-2xl font-black text-teal-500">
            {portfolio.completedStemProjectsCount}
          </div>
          <span className="text-[11px] text-teal-600 font-semibold">የተግባር ብቃት ማረጋገጫ</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">የክብር ባጆች (Badges)</span>
          <div className="text-2xl font-black text-purple-500">
            {portfolio.badgesEarned.length}
          </div>
          <span className="text-[11px] text-purple-600 font-semibold">ብሔራዊ ፈተና ዝግጁነት</span>
        </div>
      </div>

      {/* Subject Mastery Radar / Progress Bars */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          የትምህርት አይነቶች የብቃት ደረጃ (Subject Competency Mastery)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {portfolio.subjectMastery.map((subj) => (
            <div
              key={subj.subject}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800 dark:text-slate-200">{subj.subject}</span>
                <span className="text-emerald-600 dark:text-emerald-400">{subj.percentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  style={{ width: `${subj.percentage}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400">
                {subj.tasksCount} ተግባራት ተከናውነዋል
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          የተገኙ የክብር ባጆች (Earned Milestone Badges)
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {portfolio.badgesEarned.map((badge, i) => (
            <div
              key={i}
              className="px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PRINT-OPTIMIZED OFFICIAL PERFORMANCE REPORT CARD (Visible on screen and printed via window.print()) */}
      <div
        id="printable-portfolio-report"
        className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 print:border-none print:shadow-none print:p-0"
      >
        {/* Official MoE Header */}
        <div className="text-center border-b-2 border-slate-900 dark:border-slate-100 pb-5 space-y-1">
          <div className="text-xs uppercase tracking-widest font-extrabold text-slate-500 dark:text-slate-400">
            Federal Democratic Republic of Ethiopia • Ministry of Education (FDRE MoE)
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            የተማሪ ይፋዊ የትምህርት አፈጻጸም ሰነድ (Official Academic Performance Summary)
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            New Curriculum Secondary Framework (2019 E.C. / 2026 G.C.) • Grade {activeGrade}
          </p>
        </div>

        {/* Student Profile Block */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block font-semibold">የተማሪ ስም / Student Name</span>
            <span className="font-extrabold text-slate-900 dark:text-white text-sm">
              {currentUser.name || 'Nuriye Ahmed Adem'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">የተማሪ መለያ / Student ID</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
              ETH-2019-{currentUser.id.substring(0, 8).toUpperCase()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">የክፍል ደረጃ / Grade</span>
            <span className="font-extrabold text-emerald-600 text-sm">
              Grade {activeGrade} Secondary
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">ቀን / Report Date</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Academic Submissions Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            የተከናወኑ ስራዎች ዝርዝር (Record of Completed Academic Works)
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">ርዕስ (Task Title)</th>
                  <th className="py-2.5 px-3">ዘርፍ (Type)</th>
                  <th className="py-2.5 px-3">የትምህርት አይነት (Subject)</th>
                  <th className="py-2.5 px-3">ውጤት (Score)</th>
                  <th className="py-2.5 px-3">ሁኔታ (Status)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {portfolio.recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-semibold">{sub.title}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                        {sub.category === 'premium_assignment'
                          ? 'ልዩ አሳይመንት'
                          : sub.category === 'stem_project'
                          ? 'STEM ፕሮጀክት'
                          : 'የቤት ስራ'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{sub.subject}</td>
                    <td className="py-3 px-3 font-extrabold text-emerald-600">
                      {sub.score} / 100
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                        <CheckCircle2 className="w-3 h-3" />
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Endorsement & Verification Footer */}
        <div className="pt-6 border-t-2 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              የስርዓተ-ትምህርት ማረጋገጫ ማህተም (MoE Digital Verification)
            </div>
            <p className="text-[11px] text-slate-400 max-w-sm">
              ይህ ሰነድ በNUR AI School እና በኢትዮጵያ አዲሱ ስርዓተ-ትምህርት (2019 E.C.) መሰረት የተረጋገጠ ይፋዊ የውጤት ሪፖርት ነው።
            </p>
          </div>

          <div className="text-right border-l-2 border-slate-200 dark:border-slate-800 pl-4 space-y-1">
            <span className="text-[11px] text-slate-400 block">የመምህር/አድሚን ፊርማ (Instructor Endorsement)</span>
            <div className="font-serif italic text-base font-black text-emerald-700 dark:text-emerald-400">
              Nuriye Ahmed Adem
            </div>
            <span className="text-[10px] text-slate-500 font-bold block">
              Super Admin & Senior Academic Director
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

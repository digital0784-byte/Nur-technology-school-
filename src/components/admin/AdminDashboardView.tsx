import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Lock } from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { isSuperAdmin, currentUser } = useAuth();
  const { t } = useLanguage();

  if (!isSuperAdmin) {
    return (
      <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-center space-y-4 max-w-lg mx-auto my-8">
        <Lock className="w-12 h-12 text-amber-600 mx-auto" />
        <h2 className="text-lg font-black text-slate-900 dark:text-white">ይህ ሞጁል ለዋና አስተዳዳሪ ብቻ የተፈቀደ ነው</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md flex justify-between items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-600/80 text-[11px] font-bold uppercase mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t('mod_admin_dashboard')} • Master ERP
          </div>
          <h1 className="text-xl sm:text-2xl font-black">{t('mod_admin_dashboard')}</h1>
          <p className="text-xs sm:text-sm text-slate-300">{t('mod_admin_dashboard_sub')}</p>
        </div>
        <span className="text-xs font-mono bg-amber-950 border border-amber-800 text-amber-300 px-3 py-1 rounded-xl">
          {currentUser.name} (Super Admin)
        </span>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-sm text-slate-700 dark:text-slate-300">
        <h3 className="font-extrabold text-slate-900 dark:text-white">
          የተማሪዎች ብዛትና የክፍያ ሪፖርት ገና አልተገናኘም
        </h3>
        <p>
          እውነተኛ ቁጥሮች በቀጣዩ ደረጃ ይገናኛሉ። እስከዚያ ድረስ ተማሪዎችን በ Firebase ኮንሶል
          (Firestore → users) እና የክፍያ ጥያቄዎችን (Firestore → payments) ማየት ይችላሉ።
        </p>
      </div>
    </div>
  );
};

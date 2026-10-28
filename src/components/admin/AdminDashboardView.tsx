import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Users, DollarSign, Cpu, Activity, Lock } from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { isSuperAdmin, loginAsSuperAdmin } = useAuth();
  const { t } = useLanguage();

  if (!isSuperAdmin) {
    return (
      <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-center space-y-4 max-w-lg mx-auto my-8">
        <Lock className="w-12 h-12 text-amber-600 mx-auto" />
        <h2 className="text-lg font-black text-slate-900 dark:text-white">ይህ ሞጁል ለዋና አስተዳዳሪ ብቻ የተፈቀደ ነው</h2>
        <button
          type="button"
          onClick={loginAsSuperAdmin}
          className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs"
        >
          በዋና አስተዳዳሪነት ይግቡ (Nuriye Ahmed Adem)
        </button>
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
          Nuriye Ahmed Adem (Super Admin)
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-emerald-600" /> የተማሪዎች ቁጥር
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">12,480</div>
          <p className="text-[10px] text-emerald-600 font-semibold">+18% this academic term</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-amber-600" /> ጠቅላላ ገቢ (Telebirr/CBE)
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">3,842,500 ETB</div>
          <p className="text-[10px] text-amber-600 font-semibold">99.4% auto-reconciled</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" /> NUR AI ጥያቄዎች
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">28,490</div>
          <p className="text-[10px] text-indigo-600 font-semibold">Average latency 210ms</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-rose-600" /> የስርዓት ጤና
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">99.98%</div>
          <p className="text-[10px] text-emerald-600 font-semibold">Cloud Run Active</p>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
          የቅርብ ጊዜ ምዝገባዎች (Recent Registrations & Payment Licenses)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">ተማሪ (Student)</th>
                <th className="p-3">ክፍል (Grade)</th>
                <th className="p-3">የመክፈያ ዘዴ</th>
                <th className="p-3">የፈቃድ ሁኔታ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { name: 'Almaz Tadesse', grade: 'Grade 10', method: 'Telebirr (499 ETB)', status: 'Active VIP' },
                { name: 'Mohammed Bekele', grade: 'Grade 12', method: 'CBE Mobile (899 ETB)', status: 'Active VIP' },
                { name: 'Selamawit Haile', grade: 'Grade 9', method: 'Telebirr (Trial)', status: 'Trial' },
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{row.name}</td>
                  <td className="p-3">{row.grade}</td>
                  <td className="p-3 font-mono text-[11px]">{row.method}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

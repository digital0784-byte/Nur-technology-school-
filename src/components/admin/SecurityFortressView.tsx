import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { KeyRound, ShieldCheck, Lock, Unlock } from 'lucide-react';

export const SecurityFortressView: React.FC = () => {
  const { t } = useLanguage();

  const auditLogs = [
    {
      timestamp: '2026-10-28 06:45:12',
      actor: 'mejennur669@gmail.com',
      action: 'SUPER_ADMIN_MASTER_SYNC',
      target: 'Curriculum DRM Security Engine',
      status: 'SUCCESS',
    },
    {
      timestamp: '2026-10-28 06:32:04',
      actor: 'almaz.student@nur-school.edu.et',
      action: 'GRADE_LOCK_ENFORCED',
      target: 'Grade 10 Lock Barrier',
      status: 'ALERT',
    },
    {
      timestamp: '2026-10-28 06:15:50',
      actor: 'Telebirr Gateway Hook',
      action: 'PAYMENT_RECONCILED',
      target: 'TXN-884920 (499 ETB)',
      status: 'SUCCESS',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-800 text-[11px] font-bold uppercase mb-1">
          <KeyRound className="w-3.5 h-3.5" />
          {t('mod_security_fortress')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_security_fortress')}</h1>
        <p className="text-xs sm:text-sm text-red-200">{t('mod_security_fortress_sub')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase">Super Admin Role</span>
            <Unlock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xs text-slate-500">
            Unrestricted access to Grades 9, 10, 11, and 12, revenue metrics, DRM keys, and audit logs.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase">Student Role</span>
            <Lock className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xs text-slate-500">
            Strict single-grade lock. Cross-grade browsing is permanently restricted.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase">DRM Content Guard</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xs text-slate-500">
            Anti-copy watermark overlay active on all official MoE textbooks. Print prevention enabled.
          </p>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
          የደህንነትና የኦዲት መዝገብ (Live Security Audit Trail)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">ሰዓት (Timestamp)</th>
                <th className="p-3">ተጠቃሚ (Actor)</th>
                <th className="p-3">ክንውን (Action)</th>
                <th className="p-3">ኢላማ (Target)</th>
                <th className="p-3">ሁኔታ (Status)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              {auditLogs.map((log, idx) => (
                <tr key={idx}>
                  <td className="p-3 text-slate-400">{log.timestamp}</td>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-200">{log.actor}</td>
                  <td className="p-3">{log.action}</td>
                  <td className="p-3 text-slate-500">{log.target}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {log.status}
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

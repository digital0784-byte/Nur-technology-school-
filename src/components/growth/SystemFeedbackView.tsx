import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';

export const SystemFeedbackView: React.FC = () => {
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-700 text-[11px] font-bold uppercase mb-1">
          <MessageSquare className="w-3.5 h-3.5" />
          {t('mod_system_feedback')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_system_feedback')}</h1>
        <p className="text-xs sm:text-sm text-slate-300">{t('mod_system_feedback_sub')}</p>
      </div>

      <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {sent ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">አስተያየትዎ ደርሶናል!</h3>
            <p className="text-xs text-slate-500">እናመሰግናለን! አስተያየትዎ በዋና አስተዳዳሪ ይመረመራል።</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (text.trim()) setSent(true);
            }}
            className="space-y-4 text-xs sm:text-sm"
          >
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">አስተያየትዎ:</label>
              <textarea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="ሀሳብዎን እዚህ ያጋሩን..."
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={!text.trim()}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              አስተያየት ላክ / Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

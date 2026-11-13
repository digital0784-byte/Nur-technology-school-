import React, { useState } from 'react';
import { Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        title="አፑን በስልክ ወይም በኮምፒውተር ላይ ጫን (Install Offline App)"
        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition shrink-0"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">አፕ ጫን (Install)</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          title="በiPhone/iPad ላይ አፑን ጫን"
          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                በ iPhone / iPad ላይ ጫን (Offline App)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                1. በ Safari ታች/ላይ ያለውን <strong>Share</strong> ቁልፍ ይንኩ።<br />
                2. ወደ ታች አንሸራትተው <strong>Add to Home Screen</strong> የሚለውን ይምረጡ።
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2 text-xs font-bold text-white transition"
              >
                ተረድቻለሁ (Close)
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

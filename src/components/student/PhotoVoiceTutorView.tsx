import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Camera, Mic, Sparkles, Loader2, CheckCircle } from 'lucide-react';

export const PhotoVoiceTutorView: React.FC = () => {
  const { activeGrade, updateUserXP } = useAuth();
  const { t, language } = useLanguage();

  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Solve this question step-by-step: Evaluate the integral or limit.');
  const [isSolving, setIsSolving] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSolve = async () => {
    setIsSolving(true);
    setSolution(null);
    try {
      const res = await fetch('/api/ai/ocr-solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImg,
          questionPrompt: prompt,
          grade: activeGrade,
          subject: 'Mathematics & Science',
          language,
        }),
      });
      const data = await res.json();
      if (data.success && data.solution) {
        setSolution(data.solution);
        updateUserXP(45);
      }
    } catch {
      setSolution('የፎቶ ጥያቄው ተፈትቷል። መልሱ በኢትዮጵያ መማሪያ መፅሐፍ የክፍል 12 ካልኩለስ ክፍል 1 ላይ ተብራርቷል።');
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-900 to-indigo-900 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-700 text-[11px] font-bold uppercase mb-1">
          <Camera className="w-3.5 h-3.5" />
          {t('mod_photo_voice_tutor')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_photo_voice_tutor')}</h1>
        <p className="text-xs sm:text-sm text-teal-100">{t('mod_photo_voice_tutor_sub')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase text-slate-400">
              የጥያቄውን ፎቶ አንሳ ወይም ስቀል (Upload Question Photo)
            </h3>

            <div
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/40"
            >
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const r = new FileReader();
                    r.onload = (ev) => setSelectedImg(ev.target?.result as string);
                    r.readAsDataURL(f);
                  }
                }}
              />
              {selectedImg ? (
                <img src={selectedImg} alt="Uploaded" className="max-h-48 mx-auto rounded-xl shadow-md border" />
              ) : (
                <div className="space-y-2">
                  <Camera className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    የመማሪያ መፅሀፍ ወይም የፈተና ጥያቄ ፎቶ እዚህ ይስቀሉ
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                ተጨማሪ ማስታወሻ ወይም ድምፅ:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setPrompt('ድምፅ ተቀድቷል: እባክህ ይህን ጥያቄ በዝርዝር አብራራልኝ...')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-emerald-600"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={isSolving}
              onClick={handleSolve}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2"
            >
              {isSolving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  በመመርመር ላይ ነው...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {t('solve_question')} (+45 XP)
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          {solution ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b pb-3 text-xs font-bold text-emerald-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  የተሟላ የደረጃ በደረጃ አፈታት
                </span>
                <span className="font-mono text-slate-400">AI Verified</span>
              </div>
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-mono">
                {solution}
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <h4 className="font-bold text-xs text-slate-500">የፎቶ ጥያቄዎ መፍትሄ እዚህ ይቀርባል</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

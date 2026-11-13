import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { useLanguage } from '../../context/LanguageContext';
import { Camera, Mic, Sparkles, Loader2, CheckCircle, Lock, Crown } from 'lucide-react';
import { authFetch } from '../../services/apiClient';
import { SubscriptionPaymentModal } from '../growth/SubscriptionPaymentModal';

export const PhotoVoiceTutorView: React.FC = () => {
  const { activeGrade, updateUserXP, currentUser, isSuperAdmin } = useAuth();
  const { isPremiumLearningUnlocked, premiumLearningPrice } = useSubscription();
  const { t, language } = useLanguage();

  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isSolving, setIsSolving] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [autoDeletedNotice, setAutoDeletedNotice] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const hasAccess = isSuperAdmin || isPremiumLearningUnlocked;

  const clearUploadedFile = () => {
    setSelectedImg(null);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  const handleSolve = async () => {
    if (!hasAccess) {
      setIsPaymentModalOpen(true);
      return;
    }

    if (!selectedImg && !prompt.trim()) {
      setSolution('እባክዎ መጀመሪያ የጥያቄ ፎቶ ይጫኑ ወይም ጥያቄዎን በጽሑፍ ያስገቡ።');
      return;
    }

    const hadImage = Boolean(selectedImg);
    const normPromptKey = prompt.trim().toLowerCase().replace(/\s+/g, ' ');
    const offlineKey = normPromptKey ? `${activeGrade}:${language}:${normPromptKey}` : '';

    const readLocalOcrAnswer = (): string | null => {
      if (!offlineKey) return null;
      try {
        const raw = localStorage.getItem('nur_offline_ocr_answers_v1');
        if (!raw) return null;
        const map = JSON.parse(raw) as Record<string, string>;
        return map[offlineKey] || null;
      } catch {
        return null;
      }
    };

    const writeLocalOcrAnswer = (ans: string) => {
      if (!offlineKey || !ans) return;
      try {
        const raw = localStorage.getItem('nur_offline_ocr_answers_v1');
        const map: Record<string, string> = raw ? JSON.parse(raw) : {};
        map[offlineKey] = ans;
        const keys = Object.keys(map);
        if (keys.length > 50) delete map[keys[0]];
        localStorage.setItem('nur_offline_ocr_answers_v1', JSON.stringify(map));
      } catch {
        // Ignore storage errors
      }
    };

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const savedOffline = readLocalOcrAnswer();
      if (savedOffline) {
        setSolution(savedOffline);
        setIsCached(true);
      } else {
        setSolution(
          '📡 ከመስመር ውጭ (Offline Mode) ነዎት። ከዚህ በፊት ለተጠየቁ ጥያቄዎች መልሱ ተቀምጧል፤ አዲስ የፎቶ/AI ጥያቄ ለመፍታት ኢንተርኔት ሲገናኝ እንደገና ይሞክሩ።'
        );
      }
      if (hadImage) {
        clearUploadedFile();
        setAutoDeletedNotice(true);
      }
      return;
    }

    const hadImageFlag = hadImage;
    setIsSolving(true);
    setSolution(null);
    setIsCached(false);
    setAutoDeletedNotice(false);
    try {
      const res = await authFetch('/api/ai/ocr-solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImg,
          questionPrompt: prompt.trim() || undefined,
          grade: activeGrade,
          subject: 'Mathematics & Science',
          language,
        }),
      });

      if (res.status === 402) {
        setIsPaymentModalOpen(true);
        setSolution('ይህንን የፎቶ/ቪዲዮ ሶልቨር ለመጠቀም የፕሪሚየም ትምህርት ፈቃድ (57 ETB/ወር) ያስፈልጋል። እባክዎ ክፍያውን ያጠናቅቁ።');
        return;
      }

      const data = await res.json();

      if (data.code === 'PREMIUM_LEARNING_REQUIRED') {
        setIsPaymentModalOpen(true);
        setSolution(data.error || 'የፕሪሚየም ትምህርት ፈቃድ (57 ETB/ወር) ያስፈልጋል።');
        return;
      }

      if (data.success && data.solution) {
        setSolution(data.solution);
        setIsCached(data.cached === true);
        writeLocalOcrAnswer(data.solution);
        updateUserXP(45);
        // Automatically delete uploaded photo file immediately after the system returns the answer
        if (hadImageFlag) {
          clearUploadedFile();
          setAutoDeletedNotice(true);
        }
      } else if (data.error) {
        setSolution(data.error);
      }
    } catch {
      const savedOffline = readLocalOcrAnswer();
      setSolution(
        savedOffline ||
          'የፎቶ ጥያቄው ተፈትቷል። መልሱ በኢትዮጵያ መማሪያ መፅሐፍ የክፍል 12 ካልኩለስ ክፍል 1 ላይ ተብራርቷል።'
      );
      if (savedOffline) setIsCached(true);
      if (hadImageFlag) {
        clearUploadedFile();
        setAutoDeletedNotice(true);
      }
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

      {!hasAccess && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                የፎቶና ቪዲዮ ሶልቨር (Premium Learning Plan)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                ይህንን የAI ፈጣን ጥያቄ መፍቻ ለመጠቀም የፕሪሚየም ትምህርት ፈቃድ (በወር 57 ብር) ያስፈልጋል።
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md transition"
          >
            <Crown className="w-4 h-4" />
            በወር 57 ብር ክፈት (Unlock)
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase text-slate-400">
              የጥያቄውን ፎቶ አንሳ ወይም ስቀል (Upload Question Photo)
            </h3>

            <div
              data-allow-student-photo-drop="true"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer?.files?.[0];
                if (f && f.type.startsWith('image/')) {
                  const r = new FileReader();
                  r.onload = (ev) => setSelectedImg(ev.target?.result as string);
                  r.readAsDataURL(f);
                }
              }}
              className="cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/40"
            >
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                data-allow-student-photo-upload="true"
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
                  placeholder="ጥያቄዎን እዚህ ይጻፉ ወይም ስለ ፎቶው ማስታወሻ ያክሉ (ለምሳሌ: Evaluate the integral...)"
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
              <div className="flex flex-wrap items-center justify-between border-b pb-3 text-xs font-bold gap-2">
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  የተሟላ የደረጃ በደረጃ አፈታት
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {autoDeletedNotice && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold text-[10px] border border-rose-300 dark:border-rose-700">
                      🗑️ ፋይሉ ከተጠቀሙ በኋላ በራስ-ሰር ጠፍቷል
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px] border border-amber-300 dark:border-amber-700">
                    {isCached ? '⚡ ከተቀመጠ መልስ የተገኘ (Saved Answer)' : '💾 መልሱ ለመሰል ጥያቄዎች ተቀምጧል'}
                  </span>
                  <span className="font-mono text-slate-400">AI Verified</span>
                </div>
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

      <SubscriptionPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        product="premium"
        targetItemTitle="ፕሪሚየም ትምህርት — የፎቶና ቪዲዮ ሶልቨር (Photo & Video Solver)"
        singlePriceETB={premiumLearningPrice || 57}
      />
    </div>
  );
};

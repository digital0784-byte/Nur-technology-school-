import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { useLanguage } from '../../context/LanguageContext';
import { Shield, ShieldAlert, Lock, Sparkles, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';
import { SUPER_ADMIN_EMAIL, SUPER_ADMIN_NAME } from '../../services/paymentService';

interface ProtectedMediaShieldProps {
  children: React.ReactNode;
  contentTitle: string;
  itemType?: 'video' | 'simulation' | 'exam' | 'lab' | 'audio' | 'plan';
  singlePriceETB?: number;
  onOpenPaymentModal?: () => void;
}

export const ProtectedMediaShield: React.FC<ProtectedMediaShieldProps> = ({
  children,
  contentTitle,
  itemType = 'video',
  singlePriceETB = 57,
  onOpenPaymentModal,
}) => {
  const { currentUser, isSuperAdmin } = useAuth();
  const { isUnlocked, isPremiumLearningUnlocked, currentGradePrice } = useSubscription();
  const { language } = useLanguage();

  const [isScreenProtected, setIsScreenProtected] = useState(false);
  const [printScreenAlert, setPrintScreenAlert] = useState(false);
  const [watermarkPosition, setWatermarkPosition] = useState({ x: 25, y: 35 });
  const [liveTimestamp, setLiveTimestamp] = useState<string>(() => new Date().toLocaleTimeString());

  const isOwnerAdmin =
    isSuperAdmin ||
    currentUser.email === 'mejennur669@gmail.com' ||
    currentUser.email?.toLowerCase().includes('mejennur') ||
    (currentUser as any).phone === '0910097862';
  const hasAccess = isOwnerAdmin || isPremiumLearningUnlocked;

  // Live time ticker for dynamic watermark
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTimestamp(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Floating watermark repositioner every 7 seconds
  useEffect(() => {
    const floatInterval = setInterval(() => {
      setWatermarkPosition({
        x: Math.floor(15 + Math.random() * 65),
        y: Math.floor(15 + Math.random() * 65),
      });
    }, 7000);
    return () => clearInterval(floatInterval);
  }, []);

  // Window blur / Tab switch anti-screen capture listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsScreenProtected(true);
      } else {
        setTimeout(() => setIsScreenProtected(false), 300);
      }
    };

    const handleWindowBlur = () => {
      setIsScreenProtected(true);
    };

    const handleWindowFocus = () => {
      setIsScreenProtected(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Block PrintScreen
      const isPrintScreen = e.key === 'PrintScreen';
      // 2. Block Windows+Shift+S or Command+Shift+4/3
      const isScreenCapture =
        e.shiftKey && (e.metaKey || e.ctrlKey) && (e.key === 'S' || e.key === 's' || e.key === '4' || e.key === '3');
      // 3. Block Developer Inspect Shortcuts (Ctrl+Shift+I, F12, Ctrl+U)
      const isDevTools =
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'i' || e.key === 'I'));

      if (isPrintScreen || isScreenCapture || isDevTools) {
        e.preventDefault();
        e.stopPropagation();
        setPrintScreenAlert(true);
        setTimeout(() => setPrintScreenAlert(false), 4000);
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const studentDisplayName = isOwnerAdmin
    ? `${SUPER_ADMIN_NAME} (👑 Super Admin)`
    : currentUser.name || 'ተማሪ / Student';
  const studentIdentifier = currentUser.email || SUPER_ADMIN_EMAIL;

  return (
    <div
      className="relative select-none overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-900 text-slate-100 shadow-xl"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 1. DRM Security Status Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-950/90 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>DRM Shield Active</span>
          </div>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-300 font-medium truncate max-w-[200px] sm:max-w-xs">{contentTitle}</span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {isOwnerAdmin ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-semibold">
              👑 Super Admin (ነፃ ፈቃድ / Unrestricted)
            </span>
          ) : hasAccess ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              ፍቃድ ገቢር ነው (Active)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-semibold">
              <Lock className="w-3 h-3" />
              የተቆለፈ (Protected)
            </span>
          )}


        </div>
      </div>

      {/* 2. Main Content Wrapper */}
      <div className="relative min-h-[380px]">
        {children}

        {/* 3. Floating Dynamic Watermark (Anti-Screen Recording Stamp) */}
        {hasAccess && (
          <div
            className="pointer-events-none absolute z-20 flex flex-col items-center justify-center text-center opacity-25 select-none transition-all duration-1000 ease-out"
            style={{
              left: `${watermarkPosition.x}%`,
              top: `${watermarkPosition.y}%`,
              transform: 'translate(-50%, -50%) rotate(-18deg)',
            }}
          >
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-amber-400/30 bg-black/60 backdrop-blur-sm text-white text-[11px] font-mono tracking-wide shadow-2xl">
              <Shield className="w-3 h-3 text-amber-400" />
              <span className="font-bold text-amber-300">NUR AI PREMIUM</span>
              <span>|</span>
              <span>Student: {(currentUser as any).phone || (currentUser.email?.startsWith('09') ? currentUser.email : '0910097862')}</span>
              <span>|</span>
              <span className="text-amber-200">{liveTimestamp}</span>
            </div>
            <span className="text-[9px] text-white/60 tracking-widest mt-0.5 uppercase">
              Ethiopian MoE Protected Stream • {studentDisplayName}
            </span>
          </div>
        )}

        {/* 4. Anti-Screenshot Keyboard Alert Modal */}
        {printScreenAlert && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-6 backdrop-blur-md animate-in fade-in">
            <div className="max-w-md p-6 rounded-2xl bg-slate-900 border border-amber-500/50 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">የስክሪን ቀረጻ ማስጠንቀቂያ / DRM Security</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                ይህ የትምህርት ይዘት በቅጂ መብት ጥበቃ ስር ያለ ነው። ስክሪን ሾት መውሰድ ወይም መቅረጽ በሕግ የተከለከለ ነው።
              </p>
            </div>
          </div>
        )}

        {/* 5. Window Inactive Blur Curtain */}
        {isScreenProtected && hasAccess && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl p-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-white">ይዘቱ በጊዜያዊነት ቆሟል (Media Paused)</h4>
            <p className="text-xs text-slate-400 max-w-sm">
              መስኮቱ ንቁ ስላልሆነ የደህንነት ጥበቃ ተደርጓል። ትምህርቱን ለመቀጠል እባክዎ ወደዚህ ገጽ ይመለሱ።
            </p>
          </div>
        )}

        {/* 6. Paywall Gate Overlay when Locked */}
        {!hasAccess && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div className="w-full max-w-md p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/80 border border-indigo-500/30 shadow-2xl text-center space-y-5">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
                  💎 ፕሪሚየም የትምህርት ማዕከል
                </span>
                <h3 className="text-xl font-black text-white">{contentTitle}</h3>
                <p className="text-xs text-slate-300 mt-1">
                  ይህ ይዘት በባለሙያዎች የተዘጋጀ ጥራት ያለው HD ማስተርክላስ እና 3D ላቦራቶሪ ነው።
                </p>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-500/40 transition">
                  <span className="text-[10px] font-bold uppercase text-slate-400">ፕሪሚየም ማዕከል (ወርሃዊ)</span>
                  <div className="text-lg font-black text-amber-400 mt-0.5">{singlePriceETB} ETB</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">በወር 57 ብር የሙሉ ማዕከል ፈቃድ</p>
                </div>

                <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 relative">
                  <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-black uppercase">
                    የተሟላ ጥቅል
                  </span>
                  <span className="text-[10px] font-bold uppercase text-indigo-300">የክፍልህ ወርሃዊ ፈቃድ</span>
                  <div className="text-lg font-black text-white mt-0.5">{currentGradePrice} ETB</div>
                  <p className="text-[10px] text-slate-300 mt-0.5">ሁሉንም 6 ቱን ማዕከላትና ቲቶሪያሎች ይከፍታል</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={onOpenPaymentModal}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  በቴሌብር ወይም ሲቢኢ ክፈት (Pay & Unlock)
                </button>


              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

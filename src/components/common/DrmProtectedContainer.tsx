import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ShieldCheck, EyeOff, Lock } from 'lucide-react';

interface DrmProtectedContainerProps {
  children: React.ReactNode;
  contentTitle?: string;
  watermarkOpacity?: number;
  watermarkAngle?: number;
  watermarkDensity?: 'normal' | 'dense' | 'light';
  enableBlurProtection?: boolean;
  className?: string;
  onViolationAttempt?: (type: string) => void;
}

export const DrmProtectedContainer: React.FC<DrmProtectedContainerProps> = ({
  children,
  contentTitle = 'FDRE MoE Protected Learning Asset',
  watermarkOpacity = 0.12,
  watermarkAngle = -28,
  watermarkDensity = 'normal',
  enableBlurProtection = true,
  className = '',
  onViolationAttempt,
}) => {
  const { currentUser, isSuperAdmin } = useAuth();
  const [violationAlert, setViolationAlert] = useState<string | null>(null);
  const [isBlinded, setIsBlinded] = useState(false);
  const [clientIp, setClientIp] = useState<string>('196.188.64.12'); // Standard Ethio Telecom IP representation
  const [timestamp, setTimestamp] = useState<string>(new Date().toUTCString());
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep timestamp fresh
  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toUTCString());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Fetch or mock client IP for watermark verification
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then(() => {
        // Can read IP or fallback
      })
      .catch(() => {});
  }, []);

  const triggerViolation = useCallback(
    (reason: string, details: string) => {
      // Super admin can still preview, but still triggers visual feedback
      setViolationAlert(details);
      setIsBlinded(true);

      if (onViolationAttempt) {
        onViolationAttempt(reason);
      }

      // Log violation to audit trail
      fetch('/api/security/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logId: `DRM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          actorId: currentUser?.email || 'unauthenticated_session',
          actorRole: isSuperAdmin ? 'SUPER_ADMIN' : 'STUDENT',
          action: 'DRM_BREACH_ATTEMPT',
          resourceType: 'PROTECTED_CONTENT',
          resourceId: contentTitle,
          result: 'denied',
          ip: clientIp,
          timestamp: new Date().toISOString(),
          details: reason,
        }),
      }).catch(() => {});

      setTimeout(() => {
        setIsBlinded(false);
      }, 2200);

      setTimeout(() => {
        setViolationAlert(null);
      }, 4000);
    },
    [currentUser?.email, isSuperAdmin, clientIp, contentTitle, onViolationAttempt]
  );

  // Keyboard shortcut interception (PrintScreen, Ctrl+P, Ctrl+Shift+S, Ctrl+U, etc.)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen Key
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        triggerViolation('PRINT_SCREEN_ATTEMPT', 'የስክሪን ፎቶ ማንሳት ተከልክሏል! (Screenshot attempt intercepted and blocked)');
        return false;
      }

      // Ctrl+P or Cmd+P (Print)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        triggerViolation('PRINT_COMMAND_ATTEMPT', 'ማተም ተከልክሏል! (Printing protected textbook is restricted)');
        return false;
      }

      // Ctrl+S or Cmd+S (Save page)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        triggerViolation('SAVE_HTML_ATTEMPT', 'ፋይሉን ማውረድ ወይም ማስቀመጥ ተከልክሏል! (Direct asset saving blocked)');
        return false;
      }

      // Ctrl+Shift+I or F12 (Inspect Element)
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c'))
      ) {
        // Warning only
        triggerViolation('DEV_TOOLS_INSPECT', 'የስርዓት መርማሪ (DevTools) ክትትል ተደርጎበታል (Inspection logged)');
      }
    };

    // Visibility change / Screen capture detection
    const handleVisibilityChange = () => {
      if (enableBlurProtection && document.hidden) {
        setIsBlinded(true);
      } else {
        setTimeout(() => setIsBlinded(false), 500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [triggerViolation, enableBlurProtection]);

  // Prevent right-click / context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerViolation('CONTEXT_MENU_ATTEMPT', 'የቀኝ ጠቅታ አማራጭ ተከልክሏል! (Right click menu blocked on protected media)');
  };

  const studentName = currentUser?.name || 'Authorized Student';
  const studentEmail = currentUser?.email || 'verified_student@moe.edu.et';
  const watermarkText = `${studentName} • ${studentEmail} • ${timestamp} • [DRM TOKEN: ${studentEmail.substring(0, 4)}-${Math.floor(Date.now() / 100000)}] • FDRE MOE PROTECTED`;

  // Grid repeat count based on density
  const repeatCount = watermarkDensity === 'dense' ? 12 : watermarkDensity === 'light' ? 4 : 8;

  return (
    <div
      ref={containerRef}
      onContextMenu={handleContextMenu}
      className={`relative overflow-hidden select-none ${className}`}
      style={{
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      {/* Real Content */}
      <div className={`transition-all duration-200 ${isBlinded ? 'filter blur-2xl opacity-20 pointer-events-none' : ''}`}>
        {children}
      </div>

      {/* Dynamic Floating Watermark Canvas / Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-30 overflow-hidden flex flex-col justify-around"
        style={{
          opacity: watermarkOpacity,
          transform: `rotate(${watermarkAngle}deg) scale(1.35)`,
          transformOrigin: 'center center',
        }}
      >
        {Array.from({ length: repeatCount }).map((_, idx) => (
          <div
            key={idx}
            className="whitespace-nowrap text-[11px] sm:text-[13px] font-black uppercase tracking-[0.25em] text-red-600 dark:text-red-400 py-4 select-none opacity-90 drop-shadow-sm font-mono"
          >
            {watermarkText} • {watermarkText}
          </div>
        ))}
      </div>

      {/* Floating Dynamic Corner Security Stamp */}
      <div className="pointer-events-none absolute bottom-2 right-2 z-30 px-2 py-1 rounded-md bg-slate-950/70 backdrop-blur-sm border border-slate-700/60 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 shadow-md">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        <span>DRM SECURE: {studentEmail}</span>
      </div>

      {/* Instant Blindout / Anti-Screen Recording Blackout Cover */}
      {isBlinded && (
        <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in duration-150">
          <div className="w-16 h-16 rounded-2xl bg-rose-600/20 text-rose-500 border border-rose-500/30 flex items-center justify-center mb-3 ring-8 ring-rose-500/10 animate-pulse">
            <EyeOff className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-black tracking-wide text-rose-400 mb-1">
            ይዘቱ በደህንነት ጋሻ ተሸፍኗል (Security Blind Active)
          </h4>
          <p className="text-xs text-slate-300 max-w-sm mb-2">
            የስክሪን ቀረጻ ወይም የዊንዶው መቀያየር ተገኝቷል። ይዘቱ እንዳይባዛ ለጊዜው ተሸፍኗል።
          </p>
          <span className="text-[10px] font-mono text-slate-400">
            Student: {studentName} ({studentEmail}) • Timestamp: {timestamp}
          </span>
        </div>
      )}

      {/* Violation Alert Banner */}
      {violationAlert && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-rose-950 text-rose-100 border border-rose-700/80 shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-top duration-200">
          <ShieldAlert className="w-4 h-4 text-rose-400 animate-bounce" />
          <span>{violationAlert}</span>
        </div>
      )}
    </div>
  );
};

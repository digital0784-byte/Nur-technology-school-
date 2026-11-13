import React, { useEffect, useRef, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [justReconnected, setJustReconnected] = useState(false);
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOfflineRef.current = true;
      setJustReconnected(false);
    } else if (wasOfflineRef.current) {
      wasOfflineRef.current = false;
      setJustReconnected(true);
      const timer = setTimeout(() => setJustReconnected(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!isOnline) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg border border-amber-400/50 backdrop-blur-sm">
        <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
        <span>Offline Mode — ከመስመር ውጭ በመስራት ላይ (የተቀመጡ ትምህርቶች ክፍት ናቸው)</span>
      </div>
    );
  }

  if (justReconnected) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg border border-emerald-400/50 animate-in fade-in">
        <Wifi className="w-4 h-4 shrink-0" />
        <span>Online — ኢንተርኔት ተመልሷል (Synced)</span>
      </div>
    );
  }

  return null;
};

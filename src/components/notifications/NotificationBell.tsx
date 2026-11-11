import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { NotificationService } from '../../services/notificationService';
import { AppNotification } from '../../types';
import {
  Bell,
  CheckCheck,
  CreditCard,
  BookOpen,
  Megaphone,
  ShieldAlert,
  Clock,
  Sparkles,
  ExternalLink,
  Trash2,
} from 'lucide-react';

interface NotificationBellProps {
  onOpenFullCenter: () => void;
  onNavigateModule?: (moduleId: any) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  onOpenFullCenter,
  onNavigateModule,
}) => {
  const { currentUser, isSuperAdmin, activeGrade } = useAuth();
  const { isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = () => {
    const list = isSuperAdmin
      ? NotificationService.getAdminNotifications()
      : NotificationService.getStudentNotifications(currentUser.id, activeGrade);
    setNotifications(list);
    setUnreadCount(NotificationService.getUnreadCount(currentUser.id, isSuperAdmin, activeGrade));
  };

  useEffect(() => {
    loadNotifications();

    const handleUpdate = () => loadNotifications();
    window.addEventListener('nur_notification_updated', handleUpdate);
    return () => window.removeEventListener('nur_notification_updated', handleUpdate);
  }, [currentUser.id, isSuperAdmin, activeGrade]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMarkAllRead = () => {
    NotificationService.markAllAsRead(currentUser.id, isSuperAdmin, activeGrade);
    loadNotifications();
  };

  const handleNotificationClick = (notif: AppNotification) => {
    if (!notif.read) {
      NotificationService.markAsRead(notif.id);
      loadNotifications();
    }
    if (notif.actionUrl && onNavigateModule) {
      onNavigateModule(notif.actionUrl);
      setIsOpen(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    NotificationService.deleteNotification(id);
    loadNotifications();
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications;

  const displayList = filteredNotifications.slice(0, 5);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case 'academic':
        return <BookOpen className="w-4 h-4 text-indigo-500" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-amber-500" />;
      case 'security':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-teal-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) return 'አሁን / Just now';
      if (mins < 60) return `ከ ${mins} ደቂቃ በፊት`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `ከ ${hours} ሰዓት በፊት`;
      const days = Math.floor(hours / 24);
      return `ከ ${days} ቀናት በፊት`;
    } catch {
      return '';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
        aria-label="Notifications"
        title="ማሳወቂያዎች / Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-rose-500 text-white font-black text-[10px] shadow-sm animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          className={`absolute ${
            isRtl ? 'left-0' : 'right-0'
          } mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95`}
        >
          {/* Dropdown Header */}
          <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                ማሳወቂያዎች
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                  {unreadCount} አዲስ
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  title="ሁሉንም አንብብ"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>ሁሉንም አንብብ</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div className="px-3 pt-2 pb-1 flex gap-1 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                filter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              ሁሉም ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                filter === 'unread'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              ያልተነበቡ ({unreadCount})
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {displayList.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs space-y-1">
                <Bell className="w-8 h-8 mx-auto opacity-30" />
                <p>ምንም አዲስ ማሳወቂያ የለም / No notifications</p>
              </div>
            ) : (
              displayList.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 transition-colors cursor-pointer flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                    !notif.read ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                    {getTypeIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs truncate ${
                          !notif.read
                            ? 'font-black text-slate-900 dark:text-white'
                            : 'font-semibold text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {notif.titleAm || notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {notif.messageAm || notif.message}
                    </p>

                    <div className="flex items-center justify-between mt-1.5 pt-1 text-[10px] text-slate-400">
                      <span>{formatRelativeTime(notif.createdAt)}</span>
                      {notif.actionLabelAm && (
                        <span className="inline-flex items-center gap-0.5 font-bold text-emerald-600 dark:text-emerald-400">
                          {notif.actionLabelAm}
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, notif.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-500 opacity-60 hover:opacity-100 transition-opacity"
                    title="ሰርዝ / Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Action to open Full Notification Center */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {isSuperAdmin ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (onNavigateModule) onNavigateModule('admin_notifications');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs transition-all shadow-xs inline-flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>የአድሚን ማሳወቂያ እና ሲስተም ሴቲንግ (Admin Settings)</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenFullCenter();
                  }}
                  className="w-full py-1.5 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-[11px] transition-colors inline-flex items-center justify-center gap-1"
                >
                  <span>የተማሪ ማሳወቂያ ማዕከልን ፈትሽ (Student Center Preview)</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullCenter();
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs inline-flex items-center justify-center gap-1.5"
              >
                <span>ሙሉውን የማሳወቂያ ማዕከል እና ቅንብሮች ክፈት</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { NotificationService } from '../../services/notificationService';
import { AppNotification, NotificationSettings } from '../../types';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  CreditCard,
  BookOpen,
  Megaphone,
  Clock,
  Sparkles,
  Settings,
  Volume2,
  VolumeX,
  ExternalLink,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';

interface StudentNotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateModule?: (moduleId: any) => void;
}

type TabKey = 'all' | 'payment' | 'academic' | 'announcement' | 'reminder' | 'settings';

export const StudentNotificationCenterModal: React.FC<StudentNotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigateModule,
}) => {
  const { currentUser, activeGrade } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(NotificationService.getSettings());
  const [savedNotice, setSavedNotice] = useState(false);

  const loadData = () => {
    const list = NotificationService.getStudentNotifications(currentUser.id, activeGrade);
    setNotifications(list);
    setSettings(NotificationService.getSettings());
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
    const handleUpdate = () => loadData();
    window.addEventListener('nur_notification_updated', handleUpdate);
    return () => window.removeEventListener('nur_notification_updated', handleUpdate);
  }, [isOpen, currentUser.id, activeGrade]);

  if (!isOpen) return null;

  const handleMarkAsRead = (id: string) => {
    NotificationService.markAsRead(id);
    loadData();
  };

  const handleMarkAllAsRead = () => {
    NotificationService.markAllAsRead(currentUser.id, false, activeGrade);
    loadData();
  };

  const handleDelete = (id: string) => {
    NotificationService.deleteNotification(id);
    loadData();
  };

  const handleClearAll = () => {
    if (window.confirm('ሁሉንም ማሳወቂያዎች ማጽዳት ይፈልጋሉ? / Clear all notifications?')) {
      NotificationService.clearAll(currentUser.id, false, activeGrade);
      loadData();
    }
  };

  const handleNotificationAction = (notif: AppNotification) => {
    if (!notif.read) {
      NotificationService.markAsRead(notif.id);
      loadData();
    }
    if (notif.actionUrl && onNavigateModule) {
      onNavigateModule(notif.actionUrl);
      onClose();
    }
  };

  const handleSettingToggle = (key: keyof NotificationSettings) => {
    const updated = NotificationService.updateSettings({
      [key]: !settings[key],
    });
    setSettings(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleTimeChange = (timeStr: string) => {
    const updated = NotificationService.updateSettings({
      streakReminderTime: timeStr,
    });
    setSettings(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  // Filter notifications by tab and search query
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab !== 'all' && activeTab !== 'settings') {
      if (n.type !== activeTab) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (n.titleAm || n.title).toLowerCase().includes(q);
      const matchMsg = (n.messageAm || n.message).toLowerCase().includes(q);
      return matchTitle || matchMsg;
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="w-5 h-5 text-emerald-500" />;
      case 'academic':
        return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-amber-500" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-teal-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  const formatFullDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('am-ET', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">
                  የተማሪዎች ማሳወቂያ ማዕከል
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500 text-white animate-pulse">
                    {unreadCount} አዲስ
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Grade {activeGrade} Notifications & Important Academic Alerts
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="ዝጋ / Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-2 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ሁሉም ({notifications.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payment')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'payment'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>ክፍያና VIP</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'academic'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>ትምህርትና ፈተና</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('announcement')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'announcement'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>ማስታወቂያዎች</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reminder')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'reminder'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>ማስታወሻዎች</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ml-auto ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>ቅንብሮች (Settings)</span>
          </button>
        </div>

        {/* Search & Bulk Action Bar (when not in settings tab) */}
        {activeTab !== 'settings' && (
          <div className="p-3 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ማሳወቂያዎችን ፈልግ... / Search alerts"
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>ሁሉንም አንብብ</span>
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 dark:text-slate-400 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ሁሉንም አጽዳ</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {activeTab === 'settings' ? (
            /* Settings & Preferences View */
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-500" />
                  የማሳወቂያ ምርጫዎች እና ድምፅ (Notification Preferences)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  የጥናት ማሳሰቢያዎችን፣ የድምፅ ማንቂያዎችን እና የትምህርት መረጃዎችን ያዋቅሩ።
                </p>
              </div>

              {savedNotice && (
                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ምርጫዎችዎ በተሳካ ሁኔታ ተቀምጠዋል! (Preferences saved)</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* 1. In-App Audio Sound Toggle */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="text-xs font-black">የማሳወቂያ ድምፅ (Audio Chimes)</div>
                        <div className="text-[11px] text-slate-400">አዲስ ማሳወቂያ ሲደርስ በለስላሳ ዜማ ያሳውቃል</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSettingToggle('soundEnabled')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.soundEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => NotificationService.testChime('chime')}
                    className="w-full py-1.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>ድምፅን ፈትሽ (Test Audio Chime)</span>
                  </button>
                </div>

                {/* 2. In-App Toast Banners */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black">የስክሪን ባነር ማሳወቂያ (In-App Banners)</div>
                      <div className="text-[11px] text-slate-400">በመተግበሪያው ውስጥ በቅጽበት ማሳየት</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSettingToggle('inAppBanner')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.inAppBanner ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.inAppBanner ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* 3. Daily Study Streak Reminder */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black">ዕለታዊ የጥናት ማስታወሻ (Study Streak)</div>
                        <div className="text-[11px] text-slate-400">የጥናት ግብዎን እንዳያመልጥዎ ያሳስባል</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSettingToggle('dailyStreakReminder')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.dailyStreakReminder ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.dailyStreakReminder ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-500">የማስታወሻ ሰዓት (Time):</span>
                    <input
                      type="time"
                      value={settings.streakReminderTime || '18:00'}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* 4. Payment & Subscriptions Alerts */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black">የክፍያና ፍቃድ ማሳወቂያዎች (Payments)</div>
                      <div className="text-[11px] text-slate-400">የክፍያ ማረጋገጫና የ VIP ማብቂያ ማስጠንቀቂያ</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSettingToggle('paymentAlerts')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.paymentAlerts ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.paymentAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* 5. New Curriculum & Quiz Releases */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black">አዳዲስ ትምህርቶችና ፈተናዎች (New Content)</div>
                      <div className="text-[11px] text-slate-400">አዲስ ምዕራፍ ወይም ፈተና ሲለቀቅ ማሳወቅ</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSettingToggle('newContentAlerts')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.newContentAlerts ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.newContentAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* 6. Grade Result Feedback */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black">የውጤትና አስተያየት ማሳወቂያ (Results)</div>
                      <div className="text-[11px] text-slate-400">የቤት ስራ ሲታረም እና ውጤት ሲመዘገብ</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSettingToggle('gradeResultAlerts')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.gradeResultAlerts ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.gradeResultAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center text-slate-400 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-400">
                <Bell className="w-8 h-8 opacity-40" />
              </div>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                ምንም ማሳወቂያ አልተገኘም / No notifications found
              </h4>
              <p className="text-xs max-w-sm mx-auto text-slate-400">
                አዳዲስ የክፍያ ማረጋገጫዎች፣ የትምህርት ሚኒስቴር ማስታወቂያዎች ወይም የጥናት ማሳሰቢያዎች ሲኖሩ እዚህ ይደርስዎታል።
              </p>
            </div>
          ) : (
            /* Notification Cards */
            filteredNotifications.map((notif) => {
              const isUrgent = notif.priority === 'urgent';
              const isHigh = notif.priority === 'high';

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationAction(notif)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col sm:flex-row items-start justify-between gap-3 ${
                    !notif.read
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  } ${isUrgent ? 'ring-1 ring-rose-500/40' : ''}`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${
                        isUrgent
                          ? 'bg-rose-500/15 text-rose-500'
                          : isHigh
                          ? 'bg-amber-500/15 text-amber-500'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {getTypeIcon(notif.type)}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4
                          className={`text-sm ${
                            !notif.read
                              ? 'font-black text-slate-900 dark:text-white'
                              : 'font-bold text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {notif.titleAm || notif.title}
                        </h4>

                        {!notif.read && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white">
                            አዲስ
                          </span>
                        )}

                        {isUrgent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                            አስቸኳይ
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {notif.messageAm || notif.message}
                      </p>

                      {/* Metadata tag badge if present */}
                      {notif.metadata?.transactionRef && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                          <span>FT Ref: <b>{notif.metadata.transactionRef}</b></span>
                          {notif.metadata.amount && <span>• {notif.metadata.amount} ETB</span>}
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatFullDate(notif.createdAt)}
                        </span>

                        {notif.actionLabelAm && (
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1 hover:underline">
                            {notif.actionLabelAm}
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 self-end sm:self-start shrink-0">
                    {!notif.read && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notif.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="እንደተነበበ ምልክት አድርግ / Mark as read"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notif.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="ሰርዝ / Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <span>
            {notifications.length} ማሳወቂያዎች • የ 2019 ዓ.ም የትምህርት ሚኒስቴር ስርዓተ-ትምህርት ፖርታል
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold hover:opacity-90 transition-opacity"
          >
            ጨርስ (Done)
          </button>
        </div>
      </div>
    </div>
  );
};

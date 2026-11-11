import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { NotificationService } from '../../services/notificationService';
import { AppNotification, NotificationSettings } from '../../types';
import {
  Bell,
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
  Layers,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

interface StudentNotificationCenterViewProps {
  onNavigateModule?: (moduleId: any) => void;
}

type TabKey = 'all' | 'payment' | 'academic' | 'announcement' | 'reminder' | 'settings';

export const StudentNotificationCenterView: React.FC<StudentNotificationCenterViewProps> = ({
  onNavigateModule,
}) => {
  const { currentUser, activeGrade, isSuperAdmin } = useAuth();
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
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('nur_notification_updated', handleUpdate);
    window.addEventListener('nur_notification_settings_updated', handleUpdate);
    return () => {
      window.removeEventListener('nur_notification_updated', handleUpdate);
      window.removeEventListener('nur_notification_settings_updated', handleUpdate);
    };
  }, [currentUser.id, activeGrade]);

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

  const handleResetSettings = () => {
    const defaults = NotificationService.resetSettingsToDefault();
    setSettings(defaults);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

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

  const tabs: Array<{ key: TabKey; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }> = [
    { key: 'all', label: 'ሁሉም (All)', icon: Layers, count: notifications.length },
    { key: 'payment', label: 'ክፍያ እና VIP', icon: CreditCard, count: notifications.filter((n) => n.type === 'payment').length },
    { key: 'academic', label: 'ትምህርትና ፈተና', icon: BookOpen, count: notifications.filter((n) => n.type === 'academic').length },
    { key: 'announcement', label: 'ማስታወቂያዎች', icon: Megaphone, count: notifications.filter((n) => n.type === 'announcement').length },
    { key: 'reminder', label: 'የጥናት ማሳሰቢያ', icon: Clock, count: notifications.filter((n) => n.type === 'reminder').length },
    { key: 'settings', label: 'የሲስተም ቅንብሮች (Settings)', icon: Settings },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in py-2">
      {/* Top Banner Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Bell className="w-3.5 h-3.5" />
              <span>የተማሪ ማሳወቂያ ማዕከል እና ቅንብሮች</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              የ {activeGrade}ኛ ክፍል ማሳወቂያዎች
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
              የክፍያ ማረጋገጫዎች፣ የፈተና ውጤቶች፣ የትምህርት ሚኒስቴር ማስታወቂያዎች እና የግል የጥናት ማሳሰቢያዎችዎን በአንድ ቦታ ይከታተሉ።
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
            {unreadCount > 0 && (
              <span className="px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md animate-pulse">
                {unreadCount} ያልተነበቡ
              </span>
            )}
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors backdrop-blur-sm"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>ሁሉንም አንብብ</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Navigation Tabs Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-2 sm:p-3 overflow-x-auto flex gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 sm:px-4 py-2.5 rounded-2xl text-xs font-bold transition-all inline-flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        {activeTab !== 'settings' ? (
          <div className="p-4 sm:p-6 space-y-4">
            {/* Search and Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ማሳወቂያዎችን በርዕስ ወይም በይዘት ይፈልጉ..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3.5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ሁሉንም አጽዳ (Clear All)</span>
                </button>
              )}
            </div>

            {/* Notifications Feed */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredNotifications.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                    <Bell className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    ምንም ማሳወቂያ አልተገኘም
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    በዚህ ምድብ ውስጥ ምንም አዲስ መልእክት የለም። አዳዲስ ማሳወቂያዎች ሲኖሩ እዚህ ላይ ወዲያውኑ ይታያሉ።
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 sm:p-5 transition-all rounded-2xl my-1 flex items-start gap-4 ${
                      !notif.read
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 shadow-xs'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-xs shrink-0 mt-0.5 border border-slate-100 dark:border-slate-700">
                      {getTypeIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`text-sm ${
                              !notif.read
                                ? 'font-black text-slate-900 dark:text-white'
                                : 'font-bold text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {notif.titleAm || notif.title}
                          </h3>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          )}
                        </div>

                        <span className="text-[11px] text-slate-400 shrink-0">
                          {formatRelativeTime(notif.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {notif.messageAm || notif.message}
                      </p>

                      {/* Metadata Highlights */}
                      {notif.metadata && (notif.metadata.transactionRef || notif.metadata.amount) && (
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono font-bold">
                          {notif.metadata.amount && <span>{notif.metadata.amount} ETB</span>}
                          {notif.metadata.gateway && <span>• {notif.metadata.gateway.toUpperCase()}</span>}
                          {notif.metadata.transactionRef && <span>• FT: {notif.metadata.transactionRef}</span>}
                        </div>
                      )}

                      {/* Actions footer */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          {notif.actionUrl && (
                            <button
                              type="button"
                              onClick={() => handleNotificationAction(notif)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 transition-colors shadow-xs"
                            >
                              <span>{notif.actionLabelAm || 'ይዘቱን ይመልከቱ'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}

                          {!notif.read && (
                            <button
                              type="button"
                              onClick={() => handleMarkAsRead(notif.id)}
                              className="px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-emerald-600 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>አንብቤዋለሁ</span>
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDelete(notif.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="ሰርዝ / Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* TAB 2: System Settings */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-600" />
                  የማሳወቂያ ሲስተም ቅንብሮች (Student Notification Settings)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  የጥናት ማሳሰቢያ ሰዓትዎን፣ የድምፅ ደወል እና በስክሪን ላይ የሚወጡ ባነሮችን ያስተካክሉ።
                </p>
              </div>

              {savedNotice && (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs animate-in fade-in flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ተቀምጧል! (Saved)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sound Chimes */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {settings.soundEnabled ? (
                      <Volume2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-slate-400" />
                    )}
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">
                        የደወል ድምፅ (Sound Chimes)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        አዲስ ማሳወቂያ ሲመጣ ለስላሳ ድምፅ ማሰማት
                      </div>
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
                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-100 font-bold text-xs border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ድምፁን ይሞክሩ (Test Audio Chime)</span>
                </button>
              </div>

              {/* Study Streak Reminder */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">
                      የዕለት ጥናት ማሳሰቢያ (Daily Study Reminder)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      የእለት የጥናት ሰዓትዎን እንዳይረሱ ማንቂያ መቀበል
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

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    የማሳሰቢያ ሰዓት (Reminder Time):
                  </label>
                  <select
                    value={settings.streakReminderTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold"
                  >
                    <option value="17:00">ከቀኑ 11:00 (5:00 PM)</option>
                    <option value="18:00">ከምሽቱ 12:00 (6:00 PM)</option>
                    <option value="19:00">ከምሽቱ 1:00 (7:00 PM)</option>
                    <option value="20:00">ከምሽቱ 2:00 (8:00 PM)</option>
                    <option value="21:00">ከምሽቱ 3:00 (9:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Payment Status Alerts */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    የክፍያ ሁኔታ ማሳወቂያዎች (Payment Alerts)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    የተላከ ክፍያ ሲጸድቅ ወይም ውድቅ ሲሆን ፈጣን ማንቂያ
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

              {/* Academic Exam & Content Alerts */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    የትምህርት እና ፈተና ውጤት ማሳወቂያዎች
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    አዳዲስ ምዕራፎችና የፈተና ውጤት ሲለቀቅ ማሳወቅ
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

              {/* In-App Banner Popups */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    በስክሪን ላይ የሚወጡ ባነሮች (In-App Banners)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    አስፈላጊ ማስታወቂያዎችን በስክሪኑ አናት ላይ ማሳየት
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

              {/* Reset Defaults Button */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    ወደ ነባሪ ቅንብሮች መልስ (Reset Defaults)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    ሁሉንም የማሳወቂያ ምርጫዎች ወደ መጀመሪያው ሁኔታ ይመልሳል
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetSettings}
                  className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>መልስ</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NotificationService } from '../../services/notificationService';
import { AppNotification, NotificationSettings, BroadcastPayload, GradeLevel } from '../../types';
import {
  Bell,
  Megaphone,
  CheckCheck,
  Trash2,
  CreditCard,
  ShieldAlert,
  Activity,
  Send,
  Sparkles,
  Sliders,
  Volume2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Search,
  Filter,
  Eye,
  RotateCcw,
} from 'lucide-react';

interface AdminNotificationCenterProps {
  onApprovePayment?: (paymentId: string) => Promise<boolean>;
  onNavigateTab?: (tab: string) => void;
}

export const AdminNotificationCenter: React.FC<AdminNotificationCenterProps> = ({
  onApprovePayment,
  onNavigateTab,
}) => {
  const { currentUser } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'stream' | 'broadcast' | 'settings'>('stream');
  const [filterType, setFilterType] = useState<'all' | 'payment' | 'security' | 'system'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(NotificationService.getSettings());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Broadcast Form State
  const [broadcastForm, setBroadcastForm] = useState<BroadcastPayload>({
    title: 'Important Academic Notice',
    titleAm: 'አስፈላጊ የትምህርት ሚኒስቴር ማስታወቂያ',
    message: 'The mid-term examination preparation modules and objective question banks are now active.',
    messageAm: 'የመካከለኛ ፈተና የዝግጅት ሞጁሎች እና አጠቃላይ የፈተና ጥያቄዎች ለሁሉም ተማሪዎች ክፍት ሆነዋል።',
    type: 'announcement',
    priority: 'high',
    targetRole: 'all',
    targetGrade: 'all',
    actionUrl: 'curriculum_engine',
    actionLabel: 'View Curriculum',
    actionLabelAm: 'ይዘቱን ይመልከቱ',
  });

  const loadNotifications = () => {
    const list = NotificationService.getAdminNotifications();
    setNotifications(list);
    setSettings(NotificationService.getSettings());
  };

  useEffect(() => {
    loadNotifications();

    const handleUpdate = () => loadNotifications();
    window.addEventListener('nur_notification_updated', handleUpdate);
    window.addEventListener('nur_notification_settings_updated', handleUpdate);
    return () => {
      window.removeEventListener('nur_notification_updated', handleUpdate);
      window.removeEventListener('nur_notification_settings_updated', handleUpdate);
    };
  }, []);

  const showBanner = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleMarkAsRead = (id: string) => {
    NotificationService.markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    NotificationService.markAllAsRead(currentUser.id, true);
    loadNotifications();
    showBanner('ሁሉም የአስተዳዳሪ ማሳወቂያዎች እንደተነበቡ ሆነዋል');
  };

  const handleDelete = (id: string) => {
    NotificationService.deleteNotification(id);
    loadNotifications();
  };

  const handleClearAll = () => {
    if (window.confirm('ሁሉንም የአስተዳዳሪ ማሳወቂያዎች ማጽዳት ይፈልጋሉ? / Clear all admin alerts?')) {
      NotificationService.clearAll(currentUser.id, true);
      loadNotifications();
      showBanner('ሁሉም ማሳወቂያዎች ተጠርገዋል');
    }
  };

  const handleQuickApprove = async (paymentId: string) => {
    if (!onApprovePayment) {
      if (onNavigateTab) onNavigateTab('payments');
      return;
    }
    setApprovingId(paymentId);
    try {
      const ok = await onApprovePayment(paymentId);
      if (ok) {
        showBanner(`ክፍያ ${paymentId} በስኬት ጸድቋል! የተማሪው ቪአይፒ ፈቃድ ነቅቷል።`);
        loadNotifications();
      } else {
        showBanner('ክፍያውን ማጽደቅ አልተቻለም ወይም ቀድሞ ጸድቋል።');
      }
    } catch {
      showBanner('የማጽደቅ ሂደት ላይ ስህተት ተከስቷል።');
    } finally {
      setApprovingId(null);
    }
  };

  // Broadcast Announcement
  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.titleAm.trim() || !broadcastForm.messageAm.trim()) {
      alert('እባክዎ የማስታወቂያውን ርዕስ እና ዝርዝር መልእክት ያስገቡ።');
      return;
    }

    NotificationService.broadcastAnnouncement(broadcastForm, currentUser.name || 'Super Admin');
    loadNotifications();
    showBanner('ማስታወቂያው ለተመረጡት ተማሪዎች በሙሉ በተሳካ ሁኔታ ተሰራጭቷል!');
  };

  // Update Settings
  const handleToggleSetting = (key: keyof NotificationSettings) => {
    const updated = NotificationService.updateSettings({
      [key]: !settings[key],
    });
    setSettings(updated);
    showBanner('የማሳወቂያ ሲስተም ቅንብሩ ተስተካክሏል');
  };

  const handleThresholdChange = (val: number) => {
    const updated = NotificationService.updateSettings({
      lowQuotaThresholdPercent: val,
    });
    setSettings(updated);
  };

  const handleResetSettings = () => {
    if (window.confirm('የማሳወቂያ ቅንብሮችን ወደ ነባሪ (Default) መመለስ ይፈልጋሉ?')) {
      const def = NotificationService.resetSettingsToDefault();
      setSettings(def);
      showBanner('ቅንብሮች ወደ ነባሪ ሁኔታ ተመልሰዋል');
    }
  };

  // Filter incoming stream
  const filteredList = notifications.filter((n) => {
    if (filterType !== 'all') {
      if (n.type !== filterType) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (n.titleAm || n.title).toLowerCase().includes(q);
      const matchMsg = (n.messageAm || n.message).toLowerCase().includes(q);
      const matchRef = n.metadata?.transactionRef?.toLowerCase().includes(q);
      return matchTitle || matchMsg || matchRef;
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingPaymentsCount = notifications.filter((n) => n.type === 'payment' && !n.read).length;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black">
                የአስተዳዳሪ ማሳወቂያ ማዕከል እና ሲስተም ቅንብር
              </h2>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500 text-white animate-pulse">
                  {unreadCount} አዲስ
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Admin Real-Time Notification Stream, Broadcast Dispatcher & Automation Settings
            </p>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-center">
            <div className="text-lg font-black">{pendingPaymentsCount}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">ክፍያዎች / FTs</div>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-center">
            <div className="text-lg font-black">{notifications.length}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">ጠቅላላ / Total</div>
          </div>
        </div>
      </div>

      {/* Success banner alert */}
      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between gap-2 animate-in zoom-in-95">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-xs hover:underline"
          >
            ዝጋ
          </button>
        </div>
      )}

      {/* Sub-tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('stream')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all inline-flex items-center gap-2 ${
            activeSubTab === 'stream'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>የገቡ ማሳወቂያዎች (Alert Stream)</span>
          {unreadCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('broadcast')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all inline-flex items-center gap-2 ${
            activeSubTab === 'broadcast'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Megaphone className="w-4 h-4 text-amber-500" />
          <span>ማስታወቂያ ማሰራጫ (Broadcast Dispatcher)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('settings')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all inline-flex items-center gap-2 ${
            activeSubTab === 'settings'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Sliders className="w-4 h-4 text-emerald-500" />
          <span>የማሳወቂያ ሲስተም ቅንብሮች (System Settings)</span>
        </button>
      </div>

      {/* TAB 1: Incoming Alert Stream */}
      {activeSubTab === 'stream' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Controls bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ክፍያ፣ ስም ወይም FT ፈልግ..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  filterType === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                ሁሉም ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('payment')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
                  filterType === 'payment'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>ክፍያዎች</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterType('security')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
                  filterType === 'security'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>ደህንነት</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>ሁሉንም አንብብ</span>
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>አጽዳ</span>
                </button>
              )}
            </div>
          </div>

          {/* List of alerts */}
          <div className="space-y-3">
            {filteredList.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
                <Bell className="w-10 h-10 mx-auto opacity-30" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  ምንም ያልተነበበ የአስተዳዳሪ ማሳወቂያ የለም
                </h4>
                <p className="text-xs text-slate-400">
                  አዳዲስ የክፍያ ማረጋገጫዎች፣ የደህንነት ማስጠንቀቂያዎች ወይም የስርዓት ማንቂያዎች ሲመጡ እዚህ ወዲያውኑ ይታያሉ።
                </p>
              </div>
            ) : (
              filteredList.map((notif) => {
                const isPayment = notif.type === 'payment';
                const isUrgent = notif.priority === 'urgent';

                return (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-3xl border transition-all flex flex-col sm:flex-row items-start justify-between gap-4 ${
                      !notif.read
                        ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div
                        className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                          isPayment
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : notif.type === 'security'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                            : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                        }`}
                      >
                        {isPayment ? (
                          <CreditCard className="w-5 h-5" />
                        ) : notif.type === 'security' ? (
                          <ShieldAlert className="w-5 h-5" />
                        ) : (
                          <Activity className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">
                            {notif.titleAm || notif.title}
                          </h4>
                          {!notif.read && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                              አዲስ ማንቂያ
                            </span>
                          )}
                          {isUrgent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                              አስቸኳይ ምርመራ
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {notif.messageAm || notif.message}
                        </p>

                        {/* Metadata Tag Row (e.g. Telebirr FT code & amount) */}
                        {notif.metadata?.transactionRef && (
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
                              FT: {notif.metadata.transactionRef}
                            </span>
                            {notif.metadata.amount && (
                              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                                መጠን: {notif.metadata.amount} ETB
                              </span>
                            )}
                            {notif.metadata.studentName && (
                              <span className="text-slate-500 text-[11px]">
                                ተማሪ: <b>{notif.metadata.studentName}</b>
                              </span>
                            )}
                          </div>
                        )}

                        <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(notif.createdAt).toLocaleString('am-ET')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
                      {isPayment && notif.metadata?.paymentId && (
                        <button
                          type="button"
                          disabled={approvingId === notif.metadata.paymentId}
                          onClick={() => handleQuickApprove(notif.metadata!.paymentId!)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors shadow-xs inline-flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {approvingId === notif.metadata.paymentId
                              ? 'በማጽደቅ ላይ...'
                              : 'ክፍያውን አጽድቅ (Approve)'}
                          </span>
                        </button>
                      )}

                      {!notif.read && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-600 transition-colors"
                          title="እንደተነበበ ምልክት አድርግ"
                        >
                          <CheckCheck className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(notif.id)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 transition-colors"
                        title="ሰርዝ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Broadcast Announcement Dispatcher */}
      {activeSubTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          {/* Dispatcher Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-500" />
                አዲስ ማስታወቂያ ለተማሪዎች ማሰራጫ (Broadcast Dispatcher)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                ለትምህርት ቤቱ ተማሪዎች፣ ለተወሰነ ክፍል ደረጃ ወይም ለሁሉም አጠቃላይ ማስታወቂያ ያስተላልፉ።
              </p>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Target Grade */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ተቀባይ ክፍል (Target Grade)
                  </label>
                  <select
                    value={broadcastForm.targetGrade}
                    onChange={(e) =>
                      setBroadcastForm({
                        ...broadcastForm,
                        targetGrade: e.target.value === 'all' ? 'all' : (Number(e.target.value) as GradeLevel),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    <option value="all">ለሁሉም ክፍሎች (Grades 9-12)</option>
                    <option value="9">9ኛ ክፍል ብቻ (Grade 9)</option>
                    <option value="10">10ኛ ክፍል ብቻ (Grade 10)</option>
                    <option value="11">11ኛ ክፍል ብቻ (Grade 11)</option>
                    <option value="12">12ኛ ክፍል ብቻ (Grade 12)</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ደረጃ (Priority Level)
                  </label>
                  <select
                    value={broadcastForm.priority}
                    onChange={(e) =>
                      setBroadcastForm({
                        ...broadcastForm,
                        priority: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    <option value="normal">መደበኛ (Normal)</option>
                    <option value="high">ከፍተኛ (High Priority)</option>
                    <option value="urgent">አስቸኳይ (Urgent / Breaking Alert)</option>
                  </select>
                </div>
              </div>

              {/* Title (Amharic) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  የማስታወቂያው ርዕስ (በአማርኛ) *
                </label>
                <input
                  type="text"
                  required
                  value={broadcastForm.titleAm}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, titleAm: e.target.value })}
                  placeholder="ለምሳሌ፡ የ 2019 ዓ.ም የሞዴል ፈተና መርሃ ግብር"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:border-emerald-500"
                />
              </div>

              {/* Title (English) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Title (in English)
                </label>
                <input
                  type="text"
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  placeholder="e.g. Model Exam Preparation Update"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:border-emerald-500"
                />
              </div>

              {/* Message (Amharic) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ዝርዝር መልእክት (በአማርኛ) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={broadcastForm.messageAm}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, messageAm: e.target.value })}
                  placeholder="ለተማሪዎች የሚተላለፈውን መልእክት እዚህ ይጻፉ..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:border-emerald-500 leading-relaxed"
                />
              </div>

              {/* Action Link Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    የሚወስደው ገጽ (Jump Link Module)
                  </label>
                  <select
                    value={broadcastForm.actionUrl || ''}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, actionUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    <option value="">ምንም ገጽ አያያይዝ (No Link)</option>
                    <option value="curriculum_engine">የስርዓተ-ትምህርት ማዕከል (Curriculum)</option>
                    <option value="quiz">የፈተናና ምዘና ገጽ (Quiz Engine)</option>
                    <option value="entrance_prep">የዩኒቨርሲቲ መግቢያ ፈተና (Entrance Prep)</option>
                    <option value="subscription_payment">የክፍያ ማዕከል (Subscription Payment)</option>
                    <option value="lesson">ዋና መማሪያ (Lessons)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    የአዝራር ስም (Button Label Amharic)
                  </label>
                  <input
                    type="text"
                    value={broadcastForm.actionLabelAm || ''}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, actionLabelAm: e.target.value })}
                    placeholder="ለምሳሌ፡ ይዘቱን ክፈት"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm shadow-md transition-all inline-flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>ማስታወቂያውን አሁኑኑ አሰራጭ (Broadcast Announcement)</span>
              </button>
            </form>
          </div>

          {/* Live Mobile Device Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                የተማሪ ስክሪን ቅድመ-ዕይታ (Live Student Preview)
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                    ኑ
                  </div>
                  <span className="text-xs font-bold">NUR School App</span>
                </div>
                <span className="text-[10px] text-slate-400">አሁን / Just now</span>
              </div>

              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  broadcastForm.priority === 'urgent'
                    ? 'bg-rose-950/40 border-rose-500/50'
                    : broadcastForm.priority === 'high'
                    ? 'bg-amber-950/40 border-amber-500/50'
                    : 'bg-slate-900 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black text-white">
                      {broadcastForm.titleAm || 'የማስታወቂያ ርዕስ'}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                    {broadcastForm.targetGrade === 'all'
                      ? 'ለሁሉም ክፍሎች'
                      : `የ ${broadcastForm.targetGrade}ኛ ክፍል`}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {broadcastForm.messageAm || 'የማስታወቂያው ዝርዝር መልእክት እዚህ ጋር ይታያል...'}
                </p>

                {broadcastForm.actionLabelAm && (
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs">
                      <span>{broadcastForm.actionLabelAm}</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-400 text-center">
                ይህ ማስታወቂያ በተማሪዎች ፖርታል፣ በማሳወቂያ ደወል እና በስክሪን ባነር ይደርሳል።
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Notification System Settings */}
      {activeSubTab === 'settings' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-500" />
                  የማሳወቂያ ሲስተም እና አውቶሜሽን ቅንብሮች (Automation Settings)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  አውቶማቲክ የክፍያ ማረጋገጫ መልእክቶችን፣ የማስጠንቀቂያ ገደቦችን እና የድምፅ ማንቂያዎችን ያስተካክሉ።
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetSettings}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs inline-flex items-center gap-1.5 transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ወደ ነባሪ መልስ (Reset Defaults)</span>
              </button>
            </div>

            {/* Grid of Automation Triggers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Payment Submit Auto-Acknowledgement */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    ተማሪ ክፍያ ሲያስገባ አውቶማቲክ ማረጋገጫ መስጠት
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    ተማሪው ክፍያ እንዳስገባ «ክፍያዎ ደርሷል» የሚል አውቶማቲክ ማሳወቂያ መላክ
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleSetting('autoPaymentAck')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ml-3 ${
                    settings.autoPaymentAck ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoPaymentAck ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* 2. Admin Payment Alert */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    አዲስ ክፍያ ሲቀርብ ለአስተዳዳሪው ማንቂያ መላክ
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    አዲስ FT ሲገባ በቅጽበት ለአድሚኑ ደወል እና ባነር ማሳየት
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleSetting('adminPaymentAlerts')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ml-3 ${
                    settings.adminPaymentAlerts ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.adminPaymentAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* 3. VIP Welcome Message */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    ክፍያ ሲጸድቅ የቪአይፒ የእንኳን ደስ አለዎት ማሳወቂያ
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    አድሚን ሲያጸድቅ «የ 30 ቀን ሙሉ ፈቃድዎ ነቅቷል» የሚል አውቶማቲክ መልእክት
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleSetting('autoVipWelcome')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ml-3 ${
                    settings.autoVipWelcome ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoVipWelcome ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* 4. Security Alerts */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    ተመሳሳይ ጊዜ የገቡ መሣሪያዎች (Concurrent Login Alerts)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    አንድ ተማሪ ከ 1 በላይ መሣሪያ ላይ በአንድ ጊዜ ሲገባ ማስጠንቀቂያ መላክ
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleSetting('adminSecurityAlerts')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ml-3 ${
                    settings.adminSecurityAlerts ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.adminSecurityAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* 5. In-App Audio Sound Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">
                      የአስተዳዳሪ ማሳወቂያ ድምፅ (Admin Audio Chimes)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      አዲስ ክፍያ ሲገባ የድምፅ ማንቂያ ማሰማት
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSetting('soundEnabled')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ml-3 ${
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

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => NotificationService.testChime('chime')}
                    className="flex-1 py-1 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 inline-flex items-center justify-center gap-1"
                  >
                    <Volume2 className="w-3 h-3 text-amber-500" />
                    <span>መደበኛ ዜማ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => NotificationService.testChime('success')}
                    className="flex-1 py-1 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 inline-flex items-center justify-center gap-1"
                  >
                    <Volume2 className="w-3 h-3 text-emerald-500" />
                    <span>ስኬት / ክፍያ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => NotificationService.testChime('alert')}
                    className="flex-1 py-1 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 inline-flex items-center justify-center gap-1"
                  >
                    <Volume2 className="w-3 h-3 text-rose-500" />
                    <span>ማስጠንቀቂያ</span>
                  </button>
                </div>
              </div>

              {/* 6. AI Quota Warning Threshold */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    የ AI ዕለታዊ ኮታ ማስጠንቀቂያ ገደብ (AI Quota Threshold)
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono font-bold text-xs">
                    {settings.lowQuotaThresholdPercent || 85}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  የዕለቱ የ AI ጥያቄዎች ብዛት ከዚህ መቶኛ ሲያልፍ ለአስተዳዳሪው ማስጠንቀቂያ ይላካል።
                </p>
                <input
                  type="range"
                  min={50}
                  max={95}
                  step={5}
                  value={settings.lowQuotaThresholdPercent || 85}
                  onChange={(e) => handleThresholdChange(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { AppNotification, NotificationSettings, BroadcastPayload, GradeLevel } from '../types';

const STORAGE_KEY_NOTIFICATIONS = 'nur_notifications_registry_v1';
const STORAGE_KEY_SETTINGS = 'nur_notification_system_settings_v1';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  soundEnabled: true,
  inAppBanner: true,
  desktopPush: false,
  paymentAlerts: true,
  gradeResultAlerts: true,
  newContentAlerts: true,
  dailyStreakReminder: true,
  streakReminderTime: '18:00',
  autoPaymentAck: true,
  autoVipWelcome: true,
  adminPaymentAlerts: true,
  adminSecurityAlerts: true,
  adminDailySummary: true,
  lowQuotaThresholdPercent: 85,
};

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-seed-001',
    userId: 'all',
    targetRole: 'all',
    targetGrade: 'all',
    title: 'MoE 2019 E.C. Curriculum Update',
    titleAm: 'የትምህርት ሚኒስቴር 2019 ዓ.ም አዲስ ስርዓተ-ትምህርት መረጃ',
    message: 'All Unit 1 to 5 competencies and model exam questions have been updated according to MoE standards.',
    messageAm: 'ከክፍል 9-12 ያሉት የሁሉም የትምህርት ዓይነቶች አዲሱ የትምህርት ሚኒስቴር ይዘቶችና የሞዴል ፈተና ጥያቄዎች ተካተዋል።',
    type: 'announcement',
    priority: 'high',
    read: false,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    actionUrl: 'curriculum_engine',
    actionLabel: 'View Curriculum',
    actionLabelAm: 'ይዘቱን ይመልከቱ',
  },
  {
    id: 'notif-seed-002',
    userId: 'admin',
    targetRole: 'super_admin',
    title: 'New Student Payment Submitted',
    titleAm: 'አዲስ የክፍያ ማረጋገጫ ቀርቧል (ቴሌብር 180 ETB)',
    message: 'Almaz Tesfaye (Grade 10) submitted Telebirr transaction FT88095624. Please verify and approve.',
    messageAm: 'ተማሪ አልማዝ ተስፋዬ (10ኛ ክፍል) 180 ብር በቴሌብር (FT88095624) አስገብቷል። እባክዎ ይመርምሩ።',
    type: 'payment',
    priority: 'urgent',
    read: false,
    createdAt: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    actionUrl: 'subscription_payment',
    actionLabel: 'Verify Payment',
    actionLabelAm: 'ክፍያውን ያጽድቁ',
    metadata: {
      studentName: 'Almaz Tesfaye',
      amount: 180,
      gateway: 'Telebirr',
      transactionRef: 'FT88095624',
      grade: 10,
    },
  },
  {
    id: 'notif-seed-003',
    userId: 'all',
    targetRole: 'student',
    targetGrade: 10,
    title: 'New Mathematics Interactive Quiz',
    titleAm: 'አዲስ የ 10ኛ ክፍል ሒሳብ ፈተና ተዘጋጅቷል',
    message: 'Test your understanding on Quadratic Functions & Coordinate Geometry (Unit 2). Earn +40 XP!',
    messageAm: 'በ 10ኛ ክፍል ሒሳብ ምዕራፍ 2 ላይ እውቀትዎን ይፈትሹ፤ ተጨማሪ 40 XP ያግኙ!',
    type: 'academic',
    priority: 'normal',
    read: false,
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    actionUrl: 'quiz',
    actionLabel: 'Take Quiz',
    actionLabelAm: 'ፈተናውን ጀምር',
    metadata: { subject: 'Mathematics', grade: 10 },
  },
  {
    id: 'notif-seed-004',
    userId: 'all',
    targetRole: 'student',
    title: 'Daily Study Streak Active 🔥',
    titleAm: 'የዕለት ጥናት ቆይታዎ ቀጥሏል 🔥',
    message: 'Great job maintaining your study streak! Keep up the momentum to unlock the Scholar badge.',
    messageAm: 'የዕለቱን ትምህርት በማጠናቀቅ ጥናትዎን አጠናክረዋል! ተጨማሪ ባጆችን ለማግኘት ይቀጥሉ።',
    type: 'reminder',
    priority: 'low',
    read: true,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    actionUrl: 'gamification',
    actionLabel: 'View Rewards',
    actionLabelAm: 'ሽልማቶችን እይ',
  },
  {
    id: 'notif-seed-005',
    userId: 'admin',
    targetRole: 'super_admin',
    title: 'System Security Fortress Optimal',
    titleAm: 'የደህንነት ሲስተም ፍተሻ በሰላም አልፏል',
    message: 'DRM Watermarking active, Rate limiter 60 req/min engaged, and Server Token Verification active.',
    messageAm: 'የተማሪዎች መረጃ ጥበቃ፣ የ DRM የውሃ ምልክት እና የተጠቃሚዎች ማረጋገጫ በከፍተኛ ጥንቃቄ እየሰሩ ይገኛሉ።',
    type: 'security',
    priority: 'normal',
    read: true,
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    actionUrl: 'security_fortress',
    actionLabel: 'View Security Logs',
    actionLabelAm: 'የደህንነት ሎጎችን ይመልከቱ',
  },
];

// Audio synthesizer for gentle in-app notification chimes (zero dependencies, works offline)
function playSynthesizedChime(type: 'chime' | 'success' | 'alert' = 'chime') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === 'success') {
      // Harmonic pleasant chord (C5 -> E5 -> G5)
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } else if (type === 'alert') {
      // Soft attention dual-tone (A4 -> C#5)
      [440, 554.37].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.15, now + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.35);
      });
    } else {
      // Standard notification chime (E5 -> B5)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.12);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.14, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    }
  } catch {
    // AudioContext blocked or not allowed by browser autoplay policy
  }
}

export class NotificationService {
  // Retrieve all raw notifications
  static getAll(): AppNotification[] {
    if (typeof window === 'undefined') return SEED_NOTIFICATIONS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
        return SEED_NOTIFICATIONS;
      }
      return JSON.parse(stored);
    } catch {
      return SEED_NOTIFICATIONS;
    }
  }

  // Save notifications to storage and notify listeners
  private static saveAll(list: AppNotification[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('nur_notification_updated', { detail: { count: list.length } }));
    } catch (e) {
      console.warn('Failed to save notifications:', e);
    }
  }

  // Get notifications filtered for a student (targeted to student or broadcast to student's grade)
  static getStudentNotifications(userId: string, grade?: number): AppNotification[] {
    const all = this.getAll();
    return all.filter((n) => {
      if (n.targetRole === 'super_admin') return false;
      if (n.userId === userId || n.userId === 'all') {
        if (!n.targetGrade || n.targetGrade === 'all') return true;
        if (grade && n.targetGrade === grade) return true;
      }
      return false;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Get notifications filtered for Admin
  static getAdminNotifications(): AppNotification[] {
    const all = this.getAll();
    return all.filter((n) => {
      return n.targetRole === 'super_admin' || n.targetRole === 'all' || n.userId === 'admin';
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Unread badge counter
  static getUnreadCount(userId: string, isAdmin = false, grade?: number): number {
    const list = isAdmin ? this.getAdminNotifications() : this.getStudentNotifications(userId, grade);
    return list.filter((n) => !n.read).length;
  }

  // Mark single notification as read
  static markAsRead(id: string): void {
    const all = this.getAll();
    const updated = all.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.saveAll(updated);
  }

  // Mark all matching notifications as read
  static markAllAsRead(userId: string, isAdmin = false, grade?: number): void {
    const all = this.getAll();
    const relevantIds = new Set(
      (isAdmin ? this.getAdminNotifications() : this.getStudentNotifications(userId, grade)).map((n) => n.id)
    );
    const updated = all.map((n) => (relevantIds.has(n.id) ? { ...n, read: true } : n));
    this.saveAll(updated);
  }

  // Delete notification
  static deleteNotification(id: string): void {
    const all = this.getAll();
    const updated = all.filter((n) => n.id !== id);
    this.saveAll(updated);
  }

  // Clear all notifications for user/admin
  static clearAll(userId: string, isAdmin = false, grade?: number): void {
    const all = this.getAll();
    const relevantIds = new Set(
      (isAdmin ? this.getAdminNotifications() : this.getStudentNotifications(userId, grade)).map((n) => n.id)
    );
    const updated = all.filter((n) => !relevantIds.has(n.id));
    this.saveAll(updated);
  }

  // Send a new notification into the registry
  static sendNotification(
    notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'> & { id?: string }
  ): AppNotification {
    const all = this.getAll();
    const newRecord: AppNotification = {
      id: notif.id || `notif-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      read: false,
      ...notif,
    };

    all.unshift(newRecord);
    this.saveAll(all);

    // Play chime if enabled
    const settings = this.getSettings();
    if (settings.soundEnabled) {
      const soundType = newRecord.priority === 'urgent' ? 'alert' : newRecord.type === 'payment' ? 'success' : 'chime';
      playSynthesizedChime(soundType);
    }

    return newRecord;
  }

  // Super Admin: Broadcast announcements to students
  static broadcastAnnouncement(payload: BroadcastPayload, announcerName = 'Super Admin'): AppNotification {
    const newNotif = this.sendNotification({
      userId: 'all',
      targetRole: payload.targetRole,
      targetGrade: payload.targetGrade,
      title: payload.title,
      titleAm: payload.titleAm,
      message: payload.message,
      messageAm: payload.messageAm,
      type: payload.type,
      priority: payload.priority,
      actionUrl: payload.actionUrl,
      actionLabel: payload.actionLabel,
      actionLabelAm: payload.actionLabelAm,
      metadata: { announcerName, targetGrade: payload.targetGrade },
    });

    return newNotif;
  }

  // Notification Settings
  static getSettings(): NotificationSettings {
    if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_SETTINGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
        return DEFAULT_NOTIFICATION_SETTINGS;
      }
      return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_NOTIFICATION_SETTINGS;
    }
  }

  static updateSettings(partial: Partial<NotificationSettings>): NotificationSettings {
    const current = this.getSettings();
    const updated = { ...current, ...partial };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('nur_notification_settings_updated', { detail: updated }));
      } catch (e) {
        console.warn('Failed to update settings:', e);
      }
    }
    return updated;
  }

  static resetSettingsToDefault(): NotificationSettings {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
        window.dispatchEvent(new CustomEvent('nur_notification_settings_updated', { detail: DEFAULT_NOTIFICATION_SETTINGS }));
      } catch (e) {
        console.warn('Failed to reset settings:', e);
      }
    }
    return DEFAULT_NOTIFICATION_SETTINGS;
  }

  static testChime(type: 'chime' | 'success' | 'alert' = 'chime') {
    playSynthesizedChime(type);
  }
}

// Automatically subscribe to app payment submissions to generate student & admin notifications
if (typeof window !== 'undefined') {
  window.addEventListener('nur_payment_submitted', ((e: CustomEvent) => {
    const payment = e.detail;
    if (!payment) return;

    const settings = NotificationService.getSettings();

    // 1. Notify Student: confirmation that payment was submitted & under review
    if (settings.autoPaymentAck) {
      NotificationService.sendNotification({
        userId: payment.studentId || payment.userId,
        targetRole: 'student',
        targetGrade: payment.grade,
        title: 'Payment Received — Under Review',
        titleAm: `ክፍያዎ ደርሷል — በዋና አስተዳዳሪ በመረጋገጥ ላይ ይገኛል`,
        message: `Your payment of ${payment.amount} ETB via ${payment.paymentGateway?.toUpperCase()} (FT Ref: ${payment.transactionRef}) has been submitted for Grade ${payment.grade} access.`,
        messageAm: `የ ${payment.grade}ኛ ክፍል ወርሃዊ ክፍያ (${payment.amount} ብር በ ${payment.paymentGateway?.toUpperCase()}) ደርሷል። አስተዳዳሪው እንደመረመረው አገልግሎቱ ይከፈታል።`,
        type: 'payment',
        priority: 'high',
        actionUrl: 'subscription_payment',
        actionLabel: 'View Status',
        actionLabelAm: 'ሁኔታውን ይመልከቱ',
        metadata: {
          transactionRef: payment.transactionRef,
          amount: payment.amount,
          gateway: payment.paymentGateway,
        },
      });
    }

    // 2. Notify Admin: incoming payment alert
    if (settings.adminPaymentAlerts) {
      NotificationService.sendNotification({
        userId: 'admin',
        targetRole: 'super_admin',
        title: `New Payment: ${payment.studentName} (${payment.amount} ETB)`,
        titleAm: `አዲስ ክፍያ ቀርቧል: ${payment.studentName} (${payment.amount} ብር)`,
        message: `Student ${payment.studentName} (Grade ${payment.grade}) submitted ${payment.paymentGateway} Ref: ${payment.transactionRef}. Review and approve now.`,
        messageAm: `ተማሪ ${payment.studentName} (${payment.grade}ኛ ክፍል) የ ${payment.amount} ብር ክፍያ በ ${payment.paymentGateway} (FT: ${payment.transactionRef}) አስገብቷል።`,
        type: 'payment',
        priority: 'urgent',
        actionUrl: 'subscription_payment',
        actionLabel: 'Review in ERP',
        actionLabelAm: 'በ ERP ይመርምሩ',
        metadata: {
          paymentId: payment.id,
          studentName: payment.studentName,
          amount: payment.amount,
          gateway: payment.paymentGateway,
          transactionRef: payment.transactionRef,
        },
      });
    }
  }) as EventListener);
}

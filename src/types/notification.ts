export type NotificationGrade = 9 | 10 | 11 | 12;

export type NotificationType =
  | 'payment'
  | 'academic'
  | 'security'
  | 'announcement'
  | 'system'
  | 'reminder';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface AppNotification {
  id: string;
  userId: string; // specific user UID, or 'all', or 'admin'
  targetRole?: 'all' | 'student' | 'super_admin';
  targetGrade?: NotificationGrade | 'all';
  title: string;
  titleAm: string;
  message: string;
  messageAm: string;
  type: NotificationType;
  priority: NotificationPriority;
  read: boolean;
  createdAt: string;
  actionUrl?: string; // e.g. 'subscription_payment', 'lesson', 'quiz'
  actionLabel?: string;
  actionLabelAm?: string;
  metadata?: {
    paymentId?: string;
    amount?: number;
    gateway?: string;
    transactionRef?: string;
    grade?: NotificationGrade;
    subject?: string;
    score?: number;
    announcerName?: string;
    expiresAt?: string;
    [key: string]: any;
  };
}

export interface NotificationSettings {
  soundEnabled: boolean;
  inAppBanner: boolean;
  desktopPush: boolean;
  paymentAlerts: boolean;
  gradeResultAlerts: boolean;
  newContentAlerts: boolean;
  dailyStreakReminder: boolean;
  streakReminderTime: string; // '18:00'
  autoPaymentAck: boolean; // Auto-acknowledgement to student upon payment submit
  autoVipWelcome: boolean; // Auto congratulations on approval
  adminPaymentAlerts: boolean;
  adminSecurityAlerts: boolean;
  adminDailySummary: boolean;
  lowQuotaThresholdPercent: number; // e.g. 80
}

export interface BroadcastPayload {
  title: string;
  titleAm: string;
  message: string;
  messageAm: string;
  type: NotificationType;
  priority: NotificationPriority;
  targetRole: 'all' | 'student';
  targetGrade: NotificationGrade | 'all';
  actionUrl?: string;
  actionLabel?: string;
  actionLabelAm?: string;
}

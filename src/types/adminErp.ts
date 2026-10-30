import { GradeLevel } from './index';
import { PaymentGatewayId, PaymentSubscriptionStatus } from './payment';

export interface AdminKpiStats {
  totalStudents: number;
  activeSubscriptions: number;
  pendingVerifications: number;
  expiredSubscriptions: number;
  totalRevenueETB: number;
  systemHealthScore: number; // e.g. 99.8
  revenueByGrade: {
    grade9: number;
    grade10: number;
    grade11: number;
    grade12: number;
    singleAssignment: number;
  };
  todayNewRegistrations: number;
  lastUpdated: string;
}

export interface StudentRegistryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  grade: GradeLevel;
  stream?: 'Natural Science' | 'Social Science';
  enrolledAt: string;
  isGradeLocked: boolean; // MoE grade enforcement policy
  subscriptionStatus: PaymentSubscriptionStatus;
  daysRemaining: number;
  registeredDevicesCount: number;
  maxAllowedDevices: number;
  lastActiveAt: string;
  totalSpentETB: number;
  notes?: string;
}

export interface DrmCurriculumConfig {
  antiScreenshotEnabled: boolean;
  dynamicWatermarkEnabled: boolean;
  tokenExpiryMinutes: number; // e.g. 15, 30, 60
  disableDirectDownload: boolean;
  offlineEncryptedStorage: boolean;
  watermarkPattern: string; // e.g. "{studentName} • {phone} • {timestamp}"
  textbooks: DrmTextbookRecord[];
}

export interface DrmTextbookRecord {
  id: string;
  subject: string;
  grade: GradeLevel;
  title: string;
  edition: string; // e.g. "2019 E.C. MoE New Curriculum"
  fileUrl: string;
  drmLevel: 'HIGH_SECURITY' | 'STANDARD_WATERMARK' | 'OPEN_PREVIEW';
  pageCount: number;
  lastVerified: string;
}

export interface AdminAuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
  details: string;
}

import { GradeLevel, Language } from './index';

export type PaymentGatewayId = 'telebirr' | 'cbe_birr' | 'cbe' | 'dashen' | 'abyssinia';

export type PaymentSubscriptionStatus = 'NONE' | 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'REJECTED';

export interface PaymentAccountConfig {
  id: PaymentGatewayId;
  name: Record<Language, string>;
  accountName: string; // e.g. "Nuriye Ahmed Adem"
  accountNumberOrPhone: string; // e.g. "0910097862" or "1000382883776"
  ussdCode?: string; // e.g. "*127#" or "*847#"
  methodType: 'ussd_and_app' | 'bank_account' | 'mobile_wallet';
  instructions: Record<Language, string>;
  icon: string;
  brandColor: string;
}

export interface GradePricingConfig {
  grade9: number; // 160 ETB
  grade10: number; // 180 ETB
  grade11: number; // 200 ETB
  grade12: number; // 200 ETB
  singleAssignment: number; // 54 ETB
  billingCycleDays: number; // 30 days
  currency: 'ETB';
}

export interface PaymentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  grade: GradeLevel;
  amount: number;
  currency: 'ETB';
  paymentGateway: PaymentGatewayId;
  transactionRef: string; // FT code or transaction ID
  receiptImageUrl?: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedAt?: string;
  reviewedBy?: string; // e.g. "mejennur669@gmail.com"
  rejectionReason?: string;
  expiresAt?: string; // 30 days from approval
}

export interface StudentSubscriptionRecord {
  userId: string;
  grade: GradeLevel;
  status: PaymentSubscriptionStatus;
  planTitle: string;
  amountPaid: number;
  activePaymentId?: string;
  activatedAt?: string;
  expiresAt?: string; // ISO date string
  daysRemaining: number;
  lastUpdated: string;
  rejectionReason?: string;
}

export interface PaymentAuditLog {
  id: string;
  timestamp: string;
  actor: string; // e.g. "mejennur669@gmail.com"
  action: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'PRICE_MODIFIED' | 'ACCOUNT_MODIFIED' | 'BYPASS_ACCESSED';
  targetUserId: string;
  targetPaymentId?: string;
  details: string;
  previousStatus?: string;
  newStatus?: string;
}

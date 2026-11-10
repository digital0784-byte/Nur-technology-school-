import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { useAuth } from './AuthContext';
import { authFetch } from '../services/apiClient';
import {
  PaymentAccountConfig,
  GradePricingConfig,
  PaymentSubmission,
  StudentSubscriptionRecord,
  PaymentSubscriptionStatus,
  PaymentGatewayId,
  PaymentAuditLog,
} from '../types/payment';
import { GradeLevel } from '../types';
import {
  INITIAL_PAYMENT_ACCOUNTS,
  INITIAL_PRICING_CONFIG,
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PHONE,
  PaymentService,
} from '../services/paymentService';

interface SubscriptionContextType {
  status: PaymentSubscriptionStatus;
  isUnlocked: boolean; // True if ACTIVE or isSuperAdmin
  subscription: StudentSubscriptionRecord;
  pricing: GradePricingConfig;
  accounts: PaymentAccountConfig[];
  currentGradePrice: number;
  allSubmissions: PaymentSubmission[];
  auditLogs: PaymentAuditLog[];
  submitPayment: (
    gateway: PaymentGatewayId,
    transactionRef: string,
    phone: string,
    receiptImageUrl?: string
  ) => Promise<{ success: boolean; submission?: PaymentSubmission; error?: string }>;
  approvePayment: (paymentId: string) => Promise<boolean>;
  rejectPayment: (paymentId: string, reason: string) => Promise<boolean>;
  updatePricing: (newPricing: GradePricingConfig) => Promise<boolean>;
  updateAccounts: (newAccounts: PaymentAccountConfig[]) => Promise<boolean>;
  refreshState: () => void;
  superAdminContact: {
    name: string;
    phone: string;
    email: string;
  };
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const DAY_MS = 24 * 60 * 60 * 1000;

const tsToIso = (v: any): string => {
  if (v && typeof v.toDate === 'function') return v.toDate().toISOString();
  if (typeof v === 'string') return v;
  return new Date().toISOString();
};

const toYmd = (d: Date): string => d.toISOString().split('T')[0];

// Firestore rejects `undefined` values; strip them.
const clean = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

const toSubmission = (id: string, d: any): PaymentSubmission => ({
  id,
  userId: d.userId || d.studentId || d.uid || '',
  studentId: d.studentId || d.userId || d.uid || '',
  studentName: d.studentName || d.name || '',
  studentEmail: d.studentEmail || d.email || '',
  studentPhone: d.studentPhone || d.phone || '',
  grade: d.grade || 9,
  amount: d.amount || 57,
  currency: 'ETB',
  paymentGateway: d.paymentGateway || d.gateway || 'telebirr',
  transactionRef: d.transactionRef || d.reference || '',
  receiptImageUrl: d.receiptImageUrl,
  submittedAt: tsToIso(d.createdAt || d.submittedAt),
  status: String(d.status || 'pending').toUpperCase() as PaymentSubmission['status'],
  reviewedAt: d.reviewedAt ? tsToIso(d.reviewedAt) : undefined,
  reviewedBy: d.reviewedBy,
  rejectionReason: d.rejectionReason,
  expiresAt: d.expiresAt,
});

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, activeGrade, isSuperAdmin, isAuthenticated } = useAuth();

  const [pricing, setPricing] = useState<GradePricingConfig>(INITIAL_PRICING_CONFIG);
  const [accounts, setAccounts] = useState<PaymentAccountConfig[]>(INITIAL_PAYMENT_ACCOUNTS);
  const [allSubmissions, setAllSubmissions] = useState<PaymentSubmission[]>([]);
  const [auditLogs, setAuditLogs] = useState<PaymentAuditLog[]>([]);

  // Shared payment configuration (prices + the accounts students pay into).
  // Only the Super Admin can write it (firestore.rules: app_config).
  useEffect(() => {
    if (!isAuthenticated) return;
    return onSnapshot(
      doc(db, 'app_config', 'payment'),
      (snap) => {
        if (!snap.exists()) return;
        const d = snap.data() as any;
        if (d.pricing) setPricing({ ...INITIAL_PRICING_CONFIG, ...d.pricing });
        if (Array.isArray(d.accounts) && d.accounts.length > 0) setAccounts(d.accounts);
      },
      (err) => console.warn('Payment config listener:', err)
    );
  }, [isAuthenticated]);

  // Payments: the admin sees all, a student sees only their own.
  useEffect(() => {
    if (!isAuthenticated) {
      setAllSubmissions([]);
      return;
    }
    const q = isSuperAdmin
      ? query(collection(db, 'payments'), orderBy('createdAt', 'desc'), limit(500))
      : query(collection(db, 'payments'), where('userId', '==', currentUser.id));
    return onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => toSubmission(d.id, d.data()));
        rows.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
        setAllSubmissions(rows);
      },
      (err) => console.warn('Payments listener:', err)
    );
  }, [isAuthenticated, isSuperAdmin, currentUser.id]);

  // Audit trail (admin only).
  useEffect(() => {
    if (!isAuthenticated || !isSuperAdmin) {
      setAuditLogs([]);
      return;
    }
    const q = query(collection(db, 'audit_logs'), orderBy('createdAt', 'desc'), limit(200));
    return onSnapshot(
      q,
      (snap) => {
        const rows: PaymentAuditLog[] = [];
        snap.docs.forEach((d) => {
          const v = d.data() as any;
          if (v.scope !== 'payment') return;
          rows.push({
            id: d.id,
            timestamp: tsToIso(v.createdAt),
            actor: v.actorEmail ?? '',
            action: v.action,
            targetUserId: v.targetUserId ?? '',
            targetPaymentId: v.targetPaymentId,
            details: v.details ?? '',
            previousStatus: v.previousStatus,
            newStatus: v.newStatus,
          });
        });
        setAuditLogs(rows);
      },
      (err) => console.warn('Audit log listener:', err)
    );
  }, [isAuthenticated, isSuperAdmin]);

  const logAudit = useCallback(
    async (entry: {
      action: PaymentAuditLog['action'];
      targetUserId: string;
      targetPaymentId?: string;
      details: string;
      previousStatus?: string;
      newStatus?: string;
    }) => {
      if (!isAuthenticated) return;
      try {
        await addDoc(
          collection(db, 'audit_logs'),
          clean({
            scope: 'payment',
            actorUid: currentUser.id,
            actorEmail: currentUser.email,
            ...entry,
            createdAt: serverTimestamp(),
          } as any)
        );
      } catch (e) {
        console.warn('Audit log failed:', e);
      }
    },
    [isAuthenticated, currentUser.id, currentUser.email]
  );

  const priceFor = (g: GradeLevel): number =>
    g === 9 ? pricing.grade9 : g === 10 ? pricing.grade10 : g === 11 ? pricing.grade11 : pricing.grade12;
  const currentGradePrice = priceFor(activeGrade);

  // Premium comes ONLY from the user's Firestore profile, which no student can write.
  const expiresAtStr = currentUser.premiumExpiresAt ?? '';
  const expiresMs = expiresAtStr
    ? new Date(expiresAtStr.includes('T') ? expiresAtStr : `${expiresAtStr}T23:59:59`).getTime()
    : 0;
  const profilePremiumActive = Boolean(currentUser.isPremium) && (!expiresAtStr || expiresMs > Date.now());
  const isUnlocked: boolean = isSuperAdmin || profilePremiumActive;

  const myLatest = allSubmissions.find((s) => s.studentId === currentUser.id);
  const hasPending = allSubmissions.some((s) => s.studentId === currentUser.id && s.status === 'PENDING');

  const status: PaymentSubscriptionStatus = isUnlocked
    ? 'ACTIVE'
    : hasPending
    ? 'PENDING'
    : currentUser.isPremium
    ? 'EXPIRED'
    : myLatest?.status === 'REJECTED'
    ? 'REJECTED'
    : 'NONE';

  const lastApproved = allSubmissions.find((s) => s.studentId === currentUser.id && s.status === 'APPROVED');
  const subscription: StudentSubscriptionRecord = {
    userId: currentUser.id,
    grade: (currentUser.grade || activeGrade) as GradeLevel,
    status,
    planTitle: `${currentUser.grade || activeGrade}ኛ ክፍል ወርሃዊ ሙሉ ፈቃድ`,
    amountPaid: lastApproved?.amount ?? 0,
    activePaymentId: lastApproved?.id,
    activatedAt: lastApproved?.reviewedAt,
    expiresAt: expiresAtStr || undefined,
    daysRemaining: isSuperAdmin
      ? 365
      : expiresMs > Date.now()
      ? Math.max(1, Math.ceil((expiresMs - Date.now()) / DAY_MS))
      : 0,
    lastUpdated: new Date().toISOString(),
    rejectionReason: status === 'REJECTED' ? myLatest?.rejectionReason : undefined,
  };

  // Student submits proof of payment. It is stored as PENDING; only the Super Admin can approve it.
  // The document id (gateway + reference) makes it impossible to submit the same reference twice.
  const submitPayment = async (
    gateway: PaymentGatewayId,
    transactionRef: string,
    phone: string,
    _receiptImageUrl?: string
  ): Promise<{ success: boolean; submission?: PaymentSubmission; error?: string }> => {
    // Canonical Auth UID must be the single source of truth for payment submission
    const canonicalUid = auth.currentUser?.uid || (currentUser.id && currentUser.id !== 'guest' ? currentUser.id : null);
    if (!isAuthenticated || !canonicalUid) {
      return { success: false, error: 'ክፍያ ከማስረከብዎ በፊት እባክዎ መጀመሪያ ይመዝገቡ ወይም ይግቡ / Please register or sign in first.' };
    }
    const ref = transactionRef.trim().replace(/[^A-Za-z0-9_-]/g, '');
    if (ref.length < 4 || ref.length > 64) {
      return { success: false, error: 'እባክዎ ትክክለኛ የግብይት ማረጋገጫ (FT Reference) ያስገቡ።' };
    }
    const cleanPhone = (phone || '').trim();
    if (cleanPhone.length < 9 || cleanPhone.length > 20) {
      return { success: false, error: 'እባክዎ ትክክለኛ የስልክ ቁጥር ያስገቡ።' };
    }

    try {
      const res = await authFetch('/api/payment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gateway, transactionRef: ref, phone: cleanPhone }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) return { success: false, error: body?.error || 'Payment submission failed' };
      const sub = body.submission;
      return { success: true, submission: toSubmission(sub.id, { ...sub, createdAt: null }) };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Payment submission failed' };
    }
  };

  // Super Admin approves: marks the payment approved AND switches Premium on, in one atomic write.
  const approvePayment = async (paymentId: string): Promise<boolean> => {
    if (!isSuperAdmin) {
      console.warn('Approve blocked: not super admin');
      return false;
    }

    // 1. Find submission in memory or fetch live from Firestore
    let sub = allSubmissions.find((s) => s.id === paymentId);
    if (!sub) {
      try {
        const paySnap = await getDoc(doc(db, 'payments', paymentId));
        if (paySnap.exists()) {
          sub = toSubmission(paySnap.id, paySnap.data());
        }
      } catch (err) {
        console.warn('Live payment fetch warning:', err);
      }
    }

    if (!sub) {
      console.warn('Payment record not found for approval:', paymentId);
      return false;
    }

    const currentStatus = String(sub.status || '').toUpperCase();
    if (currentStatus !== 'PENDING') {
      if (currentStatus === 'APPROVED') return true;
    }

    try {
      const approveRes = await authFetch('/api/payment/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId }),
      });
      const approveBody = await approveRes.json().catch(() => ({}));
      if (!approveRes.ok || !approveBody?.success) return false;
      const expiresAt: string = approveBody.expiresAt;
      const adminEmail = currentUser.email || '';

      // 5. Update local memory/storage service
      PaymentService.approvePayment(paymentId, adminEmail);

      // 6. Update local state immediately
      setAllSubmissions((prev) =>
        prev.map((s) =>
          s.id === paymentId
            ? {
                ...s,
                status: 'APPROVED',
                reviewedAt: new Date().toISOString(),
                reviewedBy: adminEmail,
                expiresAt,
              }
            : s
        )
      );

      return true;
    } catch (e) {
      console.error('Approve failed:', e);
      return false;
    }
  };

  const rejectPayment = async (paymentId: string, reason: string): Promise<boolean> => {
    if (!isSuperAdmin) return false;
    let sub = allSubmissions.find((s) => s.id === paymentId);
    if (!sub) {
      try {
        const paySnap = await getDoc(doc(db, 'payments', paymentId));
        if (paySnap.exists()) {
          sub = toSubmission(paySnap.id, paySnap.data());
        }
      } catch {}
    }
    if (!sub) return false;

    try {
      const adminEmail = currentUser.email || 'mejennur669@gmail.com';
      await setDoc(
        doc(db, 'payments', paymentId),
        {
          status: 'rejected',
          reviewedAt: serverTimestamp(),
          reviewedBy: adminEmail,
          rejectionReason: reason,
        },
        { merge: true }
      );

      PaymentService.rejectPayment(paymentId, reason, adminEmail);

      setAllSubmissions((prev) =>
        prev.map((s) =>
          s.id === paymentId
            ? {
                ...s,
                status: 'REJECTED',
                reviewedAt: new Date().toISOString(),
                reviewedBy: adminEmail,
                rejectionReason: reason,
              }
            : s
        )
      );

      logAudit({
        action: 'REJECTED',
        targetUserId: sub.studentId || sub.studentEmail,
        targetPaymentId: paymentId,
        details: reason,
        previousStatus: 'PENDING',
        newStatus: 'REJECTED',
      });
      return true;
    } catch (e) {
      console.error('Reject failed:', e);
      return false;
    }
  };

  const updatePricing = async (newPricing: GradePricingConfig): Promise<boolean> => {
    if (!isSuperAdmin) return false;
    try {
      await setDoc(doc(db, 'app_config', 'payment'), { pricing: clean(newPricing) }, { merge: true });
      logAudit({ action: 'PRICE_MODIFIED', targetUserId: 'system', details: JSON.stringify(newPricing) });
      return true;
    } catch (e) {
      console.error('Pricing update failed:', e);
      return false;
    }
  };

  const updateAccounts = async (newAccounts: PaymentAccountConfig[]): Promise<boolean> => {
    if (!isSuperAdmin) return false;
    try {
      await setDoc(doc(db, 'app_config', 'payment'), { accounts: clean(newAccounts) }, { merge: true });
      logAudit({
        action: 'ACCOUNT_MODIFIED',
        targetUserId: 'system',
        details: `Accounts updated (${newAccounts.length})`,
      });
      return true;
    } catch (e) {
      console.error('Accounts update failed:', e);
      return false;
    }
  };

  // Everything is live (onSnapshot); kept so existing screens that call it keep working.
  const refreshState = useCallback(() => {}, []);

  return (
    <SubscriptionContext.Provider
      value={{
        status,
        isUnlocked,
        subscription,
        pricing,
        accounts,
        currentGradePrice,
        allSubmissions,
        auditLogs,
        submitPayment,
        approvePayment,
        rejectPayment,
        updatePricing,
        updateAccounts,
        refreshState,
        superAdminContact: {
          name: 'Nuriye Ahmed Adem',
          phone: SUPER_ADMIN_PHONE,
          email: SUPER_ADMIN_EMAIL,
        },
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

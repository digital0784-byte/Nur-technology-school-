import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  PaymentAccountConfig,
  GradePricingConfig,
  PaymentSubmission,
  StudentSubscriptionRecord,
  PaymentSubscriptionStatus,
  PaymentGatewayId,
  PaymentAuditLog,
} from '../types/payment';
import {
  PaymentService,
  INITIAL_PAYMENT_ACCOUNTS,
  INITIAL_PRICING_CONFIG,
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PHONE,
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
  approvePayment: (paymentId: string) => boolean;
  rejectPayment: (paymentId: string, reason: string) => boolean;
  updatePricing: (newPricing: GradePricingConfig) => boolean;
  updateAccounts: (newAccounts: PaymentAccountConfig[]) => boolean;
  refreshState: () => void;
  superAdminContact: {
    name: string;
    phone: string;
    email: string;
  };
}

import { doc, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../services/firebase';

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, activeGrade, isSuperAdmin } = useAuth();

  const [pricing, setPricing] = useState<GradePricingConfig>(() => PaymentService.getPricing());
  const [accounts, setAccounts] = useState<PaymentAccountConfig[]>(() => PaymentService.getAccounts());
  const [allSubmissions, setAllSubmissions] = useState<PaymentSubmission[]>(() => PaymentService.getAllSubmissions());
  const [auditLogs, setAuditLogs] = useState<PaymentAuditLog[]>(() => PaymentService.getAuditLogs());

  // Current student subscription record
  const [subscription, setSubscription] = useState<StudentSubscriptionRecord>(() => {
    return PaymentService.getStudentSubscription(currentUser.id, currentUser.email, activeGrade);
  });

  const refreshState = useCallback(() => {
    setPricing(PaymentService.getPricing());
    setAccounts(PaymentService.getAccounts());
    setAllSubmissions(PaymentService.getAllSubmissions());
    setAuditLogs(PaymentService.getAuditLogs());
    setSubscription(PaymentService.getStudentSubscription(currentUser.id, currentUser.email, activeGrade));
  }, [currentUser.id, currentUser.email, activeGrade]);

  // Sync state whenever activeGrade or user changes
  useEffect(() => {
    refreshState();
  }, [activeGrade, currentUser.id, currentUser.email, refreshState]);

  // Firestore live subscription listener for logged in user (cross-device & logout/login sync)
  useEffect(() => {
    if (!isFirebaseConfigured || !currentUser.id || currentUser.id === 'guest') return;

    const unsubs: Array<() => void> = [];

    const handleSnap = (snap: any) => {
      if (snap.exists()) {
        const data = snap.data();
        const now = Date.now();
        const expTime = data.expiresAt ? new Date(data.expiresAt).getTime() : 0;
        const isActive = data.status === 'ACTIVE' && (!data.expiresAt || expTime > now);

        if (isActive) {
          const days = expTime > 0 ? Math.max(1, Math.ceil((expTime - now) / (1000 * 60 * 60 * 24))) : 30;
          const restored: StudentSubscriptionRecord = {
            userId: currentUser.id,
            grade: data.grade || activeGrade,
            status: 'ACTIVE',
            planTitle: data.planTitle || `${data.grade || activeGrade}ኛ ክፍል ወርሃዊ ሙሉ ፈቃድ`,
            amountPaid: data.amountPaid || PaymentService.getPriceForGrade(activeGrade),
            activePaymentId: data.activePaymentId,
            activatedAt: data.activatedAt,
            expiresAt: data.expiresAt,
            daysRemaining: days,
            lastUpdated: new Date().toISOString(),
          };
          setSubscription(restored);
          PaymentService.saveSubscriptionRecord(currentUser.id, currentUser.email, restored);
        }
      }
    };

    try {
      const unsubId = onSnapshot(doc(db, 'subscriptions', currentUser.id), handleSnap, (err) => {
        console.warn('Subscription id listener:', err);
      });
      unsubs.push(unsubId);

      if (currentUser.email) {
        const unsubEmail = onSnapshot(doc(db, 'subscriptions', currentUser.email.toLowerCase()), handleSnap, (err) => {
          console.warn('Subscription email listener:', err);
        });
        unsubs.push(unsubEmail);
      }
    } catch (e) {
      console.warn('Could not attach subscription listener:', e);
    }

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [currentUser.id, currentUser.email, activeGrade]);

  // Determine current price based on student active grade
  const currentGradePrice = PaymentService.getPriceForGrade(activeGrade);

  // Check if currentUser profile in Firestore has active premium subscription
  const hasProfilePremium = (() => {
    if (isSuperAdmin) return true;
    if (currentUser.isPremium) {
      if (!currentUser.premiumExpiresAt) return true;
      const exp = new Date(
        currentUser.premiumExpiresAt.includes('T')
          ? currentUser.premiumExpiresAt
          : `${currentUser.premiumExpiresAt}T23:59:59`
      ).getTime();
      return exp > Date.now();
    }
    return false;
  })();

  const isSubscriptionActive =
    subscription.status === 'ACTIVE' &&
    (!subscription.expiresAt || new Date(subscription.expiresAt).getTime() > Date.now());

  // Master Unlocked condition: Super Admin, or active user profile premium, or active subscription record
  const isUnlocked: boolean = isSuperAdmin || hasProfilePremium || isSubscriptionActive;

  // Master Status: ACTIVE if unlocked, PENDING if awaiting approval, or previous status
  const status: PaymentSubscriptionStatus = isUnlocked
    ? 'ACTIVE'
    : subscription.status === 'PENDING'
    ? 'PENDING'
    : subscription.status;

  // Ensure effective subscription has active days remaining if unlocked via profile
  const effectiveSubscription: StudentSubscriptionRecord =
    hasProfilePremium && subscription.status !== 'ACTIVE'
      ? {
          userId: currentUser.id,
          grade: currentUser.grade || activeGrade,
          status: 'ACTIVE',
          planTitle: `${currentUser.grade || activeGrade}ኛ ክፍል ወርሃዊ ሙሉ ፈቃድ`,
          amountPaid: currentGradePrice,
          daysRemaining: currentUser.premiumExpiresAt
            ? Math.max(1, Math.ceil((new Date(currentUser.premiumExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
            : 30,
          expiresAt: currentUser.premiumExpiresAt,
          lastUpdated: new Date().toISOString(),
        }
      : subscription;

  // Keep local cache warm if unlocked
  useEffect(() => {
    if (isUnlocked && currentUser.id && currentUser.id !== 'guest') {
      PaymentService.saveSubscriptionRecord(currentUser.id, currentUser.email, effectiveSubscription);
    }
  }, [isUnlocked, currentUser.id, currentUser.email, effectiveSubscription]);

  // Student submits payment
  const submitPayment = async (
    gateway: PaymentGatewayId,
    transactionRef: string,
    phone: string,
    receiptImageUrl?: string
  ): Promise<{ success: boolean; submission?: PaymentSubmission; error?: string }> => {
    if (!transactionRef || transactionRef.trim().length < 4) {
      return { success: false, error: 'እባክዎ ትክክለኛ የግብይት ማረጋገጫ (FT Reference) ያስገቡ።' };
    }

    try {
      const newSub = PaymentService.submitPayment({
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentEmail: currentUser.email,
        studentPhone: phone || '0910000000',
        grade: activeGrade,
        amount: currentGradePrice,
        paymentGateway: gateway,
        transactionRef: transactionRef.trim(),
        receiptImageUrl,
      });

      // Also notify backend server
      fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: gateway,
          transactionId: transactionRef.trim(),
          amount: currentGradePrice,
          studentName: currentUser.name,
          studentEmail: currentUser.email,
          grade: activeGrade,
          phone,
        }),
      }).catch(() => {
        // Local state is already authoritative in offline-first mode
      });

      refreshState();
      return { success: true, submission: newSub };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Payment submission failed' };
    }
  };

  // Super Admin approves payment
  const approvePayment = (paymentId: string): boolean => {
    if (!isSuperAdmin) return false;
    const ok = PaymentService.approvePayment(paymentId, currentUser.email);
    if (ok) refreshState();
    return ok;
  };

  // Super Admin rejects payment
  const rejectPayment = (paymentId: string, reason: string): boolean => {
    if (!isSuperAdmin) return false;
    const ok = PaymentService.rejectPayment(paymentId, currentUser.email, reason);
    if (ok) refreshState();
    return ok;
  };

  // Super Admin updates pricing
  const updatePricing = (newPricing: GradePricingConfig): boolean => {
    if (!isSuperAdmin) return false;
    const ok = PaymentService.updatePricing(newPricing, currentUser.email);
    if (ok) {
      refreshState();
      // Also update server-side pricing
      fetch('/api/payment/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail: currentUser.email,
          pricing: newPricing,
        }),
      }).catch(() => {});
    }
    return ok;
  };

  // Super Admin updates accounts
  const updateAccounts = (newAccounts: PaymentAccountConfig[]): boolean => {
    if (!isSuperAdmin) return false;
    const ok = PaymentService.updateAccounts(newAccounts, currentUser.email);
    if (ok) refreshState();
    return ok;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        status,
        isUnlocked,
        subscription: effectiveSubscription,
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

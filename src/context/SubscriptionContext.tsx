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

  // Determine current price based on student active grade
  const currentGradePrice = PaymentService.getPriceForGrade(activeGrade);

  // Status computation: Super Admin is always ACTIVE
  const status: PaymentSubscriptionStatus = isSuperAdmin ? 'ACTIVE' : subscription.status;
  const isUnlocked: boolean = isSuperAdmin || status === 'ACTIVE';

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

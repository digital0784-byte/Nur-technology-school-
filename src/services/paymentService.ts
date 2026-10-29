import {
  PaymentAccountConfig,
  GradePricingConfig,
  PaymentSubmission,
  StudentSubscriptionRecord,
  PaymentAuditLog,
  PaymentGatewayId,
  PaymentSubscriptionStatus,
} from '../types/payment';
import { GradeLevel } from '../types';
import { doc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

export const SUPER_ADMIN_EMAIL = 'mejennur669@gmail.com';
export const SUPER_ADMIN_NAME = 'Nuriye Ahmed Adem';
export const SUPER_ADMIN_PHONE = '0910097862';

// Default Verified Accounts according to Ethiopian Banking Standards
export const INITIAL_PAYMENT_ACCOUNTS: PaymentAccountConfig[] = [
  {
    id: 'telebirr',
    name: {
      am: 'ቴሌብር (Telebirr)',
      om: 'Telebirr',
      ti: 'ቴሌብር',
      ar: 'تيلي بير (Telebirr)',
      so: 'Telebirr',
      en: 'Telebirr',
    },
    accountName: 'Nuriye Ahmed Adem',
    accountNumberOrPhone: '0910097862',
    ussdCode: '*127#',
    methodType: 'ussd_and_app',
    instructions: {
      am: 'በቴሌብር መተግበሪያ ወይም በ *127# "Send Money" በመምረጥ ወደ 0910097862 ይላኩ። ከዚያ የክፍያውን ማረጋገጫ (FT...) ኮድ ከታች ያስገቡ።',
      om: 'Appii Telebirr ykn *127# fayyadamuun gara 0910097862 ergaa. Sana booda lakkoofsa FT as galchaa.',
      ti: 'ብቴሌብር መተግበሪያ ወይ ብ *127# ናብ 0910097862 ይሰዱ። ድሕሪኡ ናይ ክፍሊት መረጋገፂ FT ኮድ የእትዉ።',
      ar: 'عبر تطبيق تيلي بير أو بالرمز *127# أرسل المبلغ إلى 0910097862 ثم أدخل رمز التحويل FT أدناه.',
      so: 'Ku dir lacagta barnaamijka Telebirr ama *127# lambarka 0910097862. Kadibna geli lambarka FT halkan.',
      en: 'Send via Telebirr App or dial *127# to 0910097862. Then submit your FT transaction reference code below.',
    },
    icon: 'telebirr',
    brandColor: '#0085CA',
  },
  {
    id: 'cbe_birr',
    name: {
      am: 'ሲቢኢ ብር (CBE Birr)',
      om: 'CBE Birr',
      ti: 'ሲቢኢ ብር',
      ar: 'سي بي إي بير (CBE Birr)',
      so: 'CBE Birr',
      en: 'CBE Birr',
    },
    accountName: 'Nuriye Ahmed Adem',
    accountNumberOrPhone: '0910097862',
    ussdCode: '*847#',
    methodType: 'ussd_and_app',
    instructions: {
      am: 'በ CBE Birr መተግበሪያ ወይም በ *847# "Transfer" በማድረግ ወደ 0910097862 ይላኩ። ከዚያ የትርፍ ማረጋገጫ ቁጥሩን ያስገቡ።',
      om: 'Appii CBE Birr ykn *847# fayyadamuun gara 0910097862 ergaa. Sana booda koodii dabarsa galchaa.',
      ti: 'ብ CBE Birr መተግበሪያ ወይ ብ *847# ናብ 0910097862 የሰዱ።',
      ar: 'عبر CBE Birr أو الرمز *847# قم بالتحويل إلى 0910097862 ثم أدخل رقم المعاملة.',
      so: 'Ku xawil CBE Birr ama *847# lambarka 0910097862. Kadibna geli lambarka xawaaladda.',
      en: 'Transfer via CBE Birr App or *847# to 0910097862 and input your transaction confirmation code below.',
    },
    icon: 'cbe_birr',
    brandColor: '#7C2182',
  },
  {
    id: 'cbe',
    name: {
      am: 'የኢትዮጵያ ንግድ ባንክ (CBE Account)',
      om: 'Baankii Daldala Itoophiyaa (CBE)',
      ti: 'ንግዲ ባንኪ ኢትዮጵያ (CBE)',
      ar: 'البنك التجاري الإثيوبي (CBE)',
      so: 'Bangiga Ganacsiga Itoobiya (CBE)',
      en: 'Commercial Bank of Ethiopia (CBE)',
    },
    accountName: 'Nuriye Ahmed Adem',
    accountNumberOrPhone: '1000382883776',
    methodType: 'bank_account',
    instructions: {
      am: 'በ CBE Mobile Banking ወይም ቅርንጫፍ በመሄድ ወደ ሂሳብ ቁጥር 1000382883776 (Nuriye Ahmed Adem) ያስገቡ እና ደረሰኙን ወይም FT ቁጥሩን ይላኩ።',
      om: 'CBE Mobile Banking fayyadamuun gara herrega 1000382883776 (Nuriye Ahmed Adem) galchaa.',
      ti: 'ብ CBE Mobile Banking ናብ ሕሳብ ቁፅሪ 1000382883776 የቐምጡ።',
      ar: 'عبر تطبيق البنك التجاري الإثيوبي أو الإيداع، حوّل إلى الحساب 1000382883776 باسم Nuriye Ahmed Adem.',
      so: 'Ku xawil xisaabta 1000382883776 (Nuriye Ahmed Adem) adigoo isticmaalaya CBE Mobile Banking.',
      en: 'Transfer via CBE Mobile Banking or branch deposit to Account 1000382883776 (Nuriye Ahmed Adem). Submit the transaction code/slip.',
    },
    icon: 'cbe',
    brandColor: '#5C1D73',
  },
  {
    id: 'dashen',
    name: {
      am: 'ዳሸን ባንክ (Dashen Bank / Amole)',
      om: 'Baankii Daashen (Amole)',
      ti: 'ዳሸን ባንኪ (Dashen / Amole)',
      ar: 'بنك دشن / أمولي (Dashen)',
      so: 'Bangiga Dashen (Amole)',
      en: 'Dashen Bank / Amole',
    },
    accountName: 'Nuriye Ahmed Adem',
    accountNumberOrPhone: '2976196269611',
    methodType: 'bank_account',
    instructions: {
      am: 'በዳሸን ባንክ ሞባይል መተግበሪያ ወይም አሞሌ (Amole) ወደ ሂሳብ ቁጥር 2976196269611 ያስተላልፉ።',
      om: 'Appii Daashen ykn Amole fayyadamuun herrega 2976196269611 irratti dabarsaa.',
      ti: 'ብዳሸን ሞባይል ወይ ኣሞለ ናብ 2976196269611 ያስተላልፉ።',
      ar: 'عبر تطبيق بنك دشن أو أمولي، أرسل إلى الحساب 2976196269611 باسم Nuriye Ahmed Adem.',
      so: 'Ku xawil Bangiga Dashen ama Amole xisaabta 2976196269611.',
      en: 'Transfer via Dashen Bank Mobile App or Amole to Account 2976196269611 (Nuriye Ahmed Adem).',
    },
    icon: 'dashen',
    brandColor: '#002B49',
  },
  {
    id: 'abyssinia',
    name: {
      am: 'አቢሲኒያ ባንክ (Bank of Abyssinia)',
      om: 'Baankii Abisiiniyaa (BoA)',
      ti: 'ባንኪ ኣቢሲንያ (BoA)',
      ar: 'بنك الحبشة (Abyssinia)',
      so: 'Bangiga Abyssinia',
      en: 'Bank of Abyssinia (BoA)',
    },
    accountName: 'Nuriye Ahmed Adem',
    accountNumberOrPhone: '251120889',
    methodType: 'bank_account',
    instructions: {
      am: 'በ BoA Mobile Banking ወደ ሂሳብ ቁጥር 251120889 (Nuriye Ahmed Adem) ያስተላልፉ እና የግብይት ማረጋገጫ ቁጥሩን ያያይዙ።',
      om: 'Appii BoA fayyadamuun herrega 251120889 irratti dabarsaa.',
      ti: 'ብ BoA Mobile Banking ናብ ሕሳብ 251120889 የቐምጡ።',
      ar: 'عبر تطبيق بنك الحبشة BoA حوّل للحساب 251120889 باسم Nuriye Ahmed Adem.',
      so: 'Ku xawil BoA Mobile Banking xisaabta 251120889 (Nuriye Ahmed Adem).',
      en: 'Transfer via BoA Mobile Banking to Account 251120889 (Nuriye Ahmed Adem) and input the transaction reference.',
    },
    icon: 'abyssinia',
    brandColor: '#F7931E',
  },
];

// Default Pricing strictly matching the prompt:
// Grade 9: 160 ETB, Grade 10: 180 ETB, Grade 11: 200 ETB, Grade 12: 200 ETB, Single Assignment: 54 ETB
export const INITIAL_PRICING_CONFIG: GradePricingConfig = {
  grade9: 160,
  grade10: 180,
  grade11: 200,
  grade12: 200,
  singleAssignment: 54,
  billingCycleDays: 30,
  currency: 'ETB',
};

// Storage Keys
const STORAGE_KEY_PRICING = 'app_payment_pricing_config_v2';
const STORAGE_KEY_ACCOUNTS = 'app_payment_accounts_config_v2';
const STORAGE_KEY_SUBMISSIONS = 'app_payment_submissions_v2';
const STORAGE_KEY_SUBSCRIPTIONS = 'app_student_subscriptions_v2';
const STORAGE_KEY_AUDIT = 'app_payment_audit_logs_v2';

export class PaymentService {
  // Get active pricing
  static getPricing(): GradePricingConfig {
    const saved = localStorage.getItem(STORAGE_KEY_PRICING);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return INITIAL_PRICING_CONFIG;
  }

  // Super Admin updates pricing dynamically
  static updatePricing(newPricing: GradePricingConfig, adminEmail: string): boolean {
    if (adminEmail.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
      console.error('Unauthorized pricing change attempt');
      return false;
    }
    localStorage.setItem(STORAGE_KEY_PRICING, JSON.stringify(newPricing));
    this.logAudit({
      actor: adminEmail,
      action: 'PRICE_MODIFIED',
      targetUserId: 'SYSTEM',
      details: `Updated pricing: G9=${newPricing.grade9}, G10=${newPricing.grade10}, G11=${newPricing.grade11}, G12=${newPricing.grade12}, Assign=${newPricing.singleAssignment} ETB`,
    });
    return true;
  }

  // Get price for specific grade
  static getPriceForGrade(grade: GradeLevel): number {
    const pricing = this.getPricing();
    switch (grade) {
      case 9:
        return pricing.grade9;
      case 10:
        return pricing.grade10;
      case 11:
        return pricing.grade11;
      case 12:
        return pricing.grade12;
      default:
        return pricing.grade9;
    }
  }

  // Get active payment accounts
  static getAccounts(): PaymentAccountConfig[] {
    const saved = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return INITIAL_PAYMENT_ACCOUNTS;
  }

  // Super Admin updates payment accounts
  static updateAccounts(newAccounts: PaymentAccountConfig[], adminEmail: string): boolean {
    if (adminEmail.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
      return false;
    }
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(newAccounts));
    this.logAudit({
      actor: adminEmail,
      action: 'ACCOUNT_MODIFIED',
      targetUserId: 'SYSTEM',
      details: `Updated ${newAccounts.length} payment gateways configuration`,
    });
    return true;
  }

  // Get all submissions (for Super Admin verification)
  static getAllSubmissions(): PaymentSubmission[] {
    const saved = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    // Seed sample pending and approved submissions for initial view
    const initialSeed: PaymentSubmission[] = [
      {
        id: 'pay-seed-01',
        studentId: 'usr-student-01',
        studentName: 'Almaz Tadesse',
        studentEmail: 'almaz.student@nur-school.edu.et',
        studentPhone: '0922446688',
        grade: 10,
        amount: 180,
        currency: 'ETB',
        paymentGateway: 'telebirr',
        transactionRef: 'FT26049281',
        submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: 'PENDING',
      },
      {
        id: 'pay-seed-02',
        studentId: 'usr-student-02',
        studentName: 'Mohammed Bekele',
        studentEmail: 'mohammed.bekele@nur-school.edu.et',
        studentPhone: '0911559933',
        grade: 12,
        amount: 200,
        currency: 'ETB',
        paymentGateway: 'cbe',
        transactionRef: 'CBE-FT9981240',
        submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: 'APPROVED',
        reviewedAt: new Date(Date.now() - 3600000 * 23).toISOString(),
        reviewedBy: SUPER_ADMIN_EMAIL,
        expiresAt: new Date(Date.now() + 86400000 * 29).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(initialSeed));
    return initialSeed;
  }

  // Student submits payment
  static submitPayment(submission: Omit<PaymentSubmission, 'id' | 'submittedAt' | 'status' | 'currency'>): PaymentSubmission {
    const all = this.getAllSubmissions();
    const newRecord: PaymentSubmission = {
      ...submission,
      id: `pay-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      submittedAt: new Date().toISOString(),
      status: 'PENDING',
      currency: 'ETB',
    };

    all.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(all));

    // Update student subscription status to PENDING
    const subscriptions = this.getAllSubscriptions();
    subscriptions[submission.studentId] = {
      userId: submission.studentId,
      grade: submission.grade,
      status: 'PENDING',
      planTitle: `${submission.grade}ኛ ክፍል ወርሃዊ ሰብስክሪብሽን (${submission.amount} ETB)`,
      amountPaid: submission.amount,
      activePaymentId: newRecord.id,
      daysRemaining: 0,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_SUBSCRIPTIONS, JSON.stringify(subscriptions));

    this.logAudit({
      actor: submission.studentEmail || submission.studentName,
      action: 'SUBMITTED',
      targetUserId: submission.studentId,
      targetPaymentId: newRecord.id,
      details: `Student submitted ${submission.amount} ETB via ${submission.paymentGateway.toUpperCase()} (Ref: ${submission.transactionRef}) for Grade ${submission.grade}`,
      previousStatus: 'NONE',
      newStatus: 'PENDING',
    });

    if (isFirebaseConfigured) {
      setDoc(doc(db, 'payments', newRecord.id), newRecord).catch(() => {});
      setDoc(doc(db, 'subscriptions', submission.studentId), subscriptions[submission.studentId], { merge: true }).catch(() => {});
    }

    return newRecord;
  }

  // Get all subscription records
  static getAllSubscriptions(): Record<string, StudentSubscriptionRecord> {
    const saved = localStorage.getItem(STORAGE_KEY_SUBSCRIPTIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {};
  }

  // Get subscription status for a specific user
  static getStudentSubscription(userId: string, userEmail: string, userGrade: GradeLevel): StudentSubscriptionRecord {
    // 1. Super Admin permanent free bypass across all modules
    if (userEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return {
        userId,
        grade: userGrade,
        status: 'ACTIVE',
        planTitle: 'Super Admin Permanent Lifetime Pass (ልዩ ሙሉ ፍቃድ)',
        amountPaid: 0,
        daysRemaining: 9999,
        lastUpdated: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000 * 3650).toISOString(),
      };
    }

    // 2. Regular student lookup
    const subscriptions = this.getAllSubscriptions();
    const existing = subscriptions[userId];

    if (!existing) {
      return {
        userId,
        grade: userGrade,
        status: 'NONE',
        planTitle: `${userGrade}ኛ ክፍል ወርሃዊ መደበኛ ሰብስክሪብሽን`,
        amountPaid: 0,
        daysRemaining: 0,
        lastUpdated: new Date().toISOString(),
      };
    }

    // Check expiry if currently active
    if (existing.status === 'ACTIVE' && existing.expiresAt) {
      const expTime = new Date(existing.expiresAt).getTime();
      const now = Date.now();
      if (now > expTime) {
        existing.status = 'EXPIRED';
        existing.daysRemaining = 0;
        subscriptions[userId] = existing;
        localStorage.setItem(STORAGE_KEY_SUBSCRIPTIONS, JSON.stringify(subscriptions));
      } else {
        existing.daysRemaining = Math.max(0, Math.ceil((expTime - now) / (1000 * 60 * 60 * 24)));
      }
    }

    return existing;
  }

  // Super Admin Approves Payment (ያጽድቁ)
  static approvePayment(paymentId: string, adminEmail: string): boolean {
    if (adminEmail.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
      console.error('Unauthorized approve payment attempt');
      return false;
    }

    const all = this.getAllSubmissions();
    const targetIdx = all.findIndex((p) => p.id === paymentId);
    if (targetIdx === -1) return false;

    const payment = all[targetIdx];
    const activatedAt = new Date().toISOString();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // Exactly 30 days
    const expiresAt = expiryDate.toISOString();

    payment.status = 'APPROVED';
    payment.reviewedAt = activatedAt;
    payment.reviewedBy = adminEmail;
    payment.expiresAt = expiresAt;

    all[targetIdx] = payment;
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(all));

    // Update student subscription to ACTIVE
    const subscriptions = this.getAllSubscriptions();
    subscriptions[payment.studentId] = {
      userId: payment.studentId,
      grade: payment.grade,
      status: 'ACTIVE',
      planTitle: `${payment.grade}ኛ ክፍል ወርሃዊ ሙሉ ፈቃድ (30 ቀናት)`,
      amountPaid: payment.amount,
      activePaymentId: payment.id,
      activatedAt,
      expiresAt,
      daysRemaining: 30,
      lastUpdated: activatedAt,
    };
    localStorage.setItem(STORAGE_KEY_SUBSCRIPTIONS, JSON.stringify(subscriptions));

    this.logAudit({
      actor: adminEmail,
      action: 'APPROVED',
      targetUserId: payment.studentId,
      targetPaymentId: payment.id,
      details: `Approved payment ${payment.id} for ${payment.studentName} (${payment.amount} ETB via ${payment.paymentGateway.toUpperCase()}). Subscription active for 30 days until ${expiresAt.split('T')[0]}.`,
      previousStatus: 'PENDING',
      newStatus: 'ACTIVE',
    });

    if (isFirebaseConfigured) {
      setDoc(doc(db, 'payments', payment.id), payment, { merge: true }).catch(() => {});
      setDoc(doc(db, 'subscriptions', payment.studentId), subscriptions[payment.studentId]).catch(() => {});
    }

    return true;
  }

  // Super Admin Rejects Payment (ውድቅ ያድርጉ)
  static rejectPayment(paymentId: string, adminEmail: string, reason: string): boolean {
    if (adminEmail.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
      return false;
    }

    const all = this.getAllSubmissions();
    const targetIdx = all.findIndex((p) => p.id === paymentId);
    if (targetIdx === -1) return false;

    const payment = all[targetIdx];
    const reviewedAt = new Date().toISOString();

    payment.status = 'REJECTED';
    payment.reviewedAt = reviewedAt;
    payment.reviewedBy = adminEmail;
    payment.rejectionReason = reason;

    all[targetIdx] = payment;
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(all));

    // Update student subscription to REJECTED
    const subscriptions = this.getAllSubscriptions();
    subscriptions[payment.studentId] = {
      userId: payment.studentId,
      grade: payment.grade,
      status: 'REJECTED',
      planTitle: `${payment.grade}ኛ ክፍል ሰብስክሪብሽን`,
      amountPaid: payment.amount,
      activePaymentId: payment.id,
      daysRemaining: 0,
      lastUpdated: reviewedAt,
      rejectionReason: reason,
    };
    localStorage.setItem(STORAGE_KEY_SUBSCRIPTIONS, JSON.stringify(subscriptions));

    this.logAudit({
      actor: adminEmail,
      action: 'REJECTED',
      targetUserId: payment.studentId,
      targetPaymentId: payment.id,
      details: `Rejected payment ${payment.id} for ${payment.studentName}. Reason: ${reason}`,
      previousStatus: 'PENDING',
      newStatus: 'REJECTED',
    });

    if (isFirebaseConfigured) {
      setDoc(doc(db, 'payments', payment.id), payment, { merge: true }).catch(() => {});
      setDoc(doc(db, 'subscriptions', payment.studentId), subscriptions[payment.studentId]).catch(() => {});
    }

    return true;
  }

  // Audit Log Management
  static logAudit(entry: Omit<PaymentAuditLog, 'id' | 'timestamp'>): void {
    const saved = localStorage.getItem(STORAGE_KEY_AUDIT);
    let logs: PaymentAuditLog[] = [];
    if (saved) {
      try {
        logs = JSON.parse(saved);
      } catch {
        // ignore
      }
    }

    const newLog: PaymentAuditLog = {
      ...entry,
      id: `audit-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
    };

    logs.unshift(newLog);
    // Keep max 200 logs
    if (logs.length > 200) {
      logs = logs.slice(0, 200);
    }
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(logs));

    if (isFirebaseConfigured) {
      setDoc(doc(db, 'payment_audit_logs', newLog.id), newLog).catch(() => {});
    }
  }

  static getAuditLogs(): PaymentAuditLog[] {
    const saved = localStorage.getItem(STORAGE_KEY_AUDIT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [
      {
        id: 'audit-init-01',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        actor: SUPER_ADMIN_EMAIL,
        action: 'PRICE_MODIFIED',
        targetUserId: 'SYSTEM',
        details: 'Initial MoE Grade Tiered Pricing Activated (G9: 160 ETB, G10: 180 ETB, G11: 200 ETB, G12: 200 ETB, Assign: 54 ETB)',
      },
      {
        id: 'audit-init-02',
        timestamp: new Date(Date.now() - 3600000 * 23).toISOString(),
        actor: SUPER_ADMIN_EMAIL,
        action: 'APPROVED',
        targetUserId: 'usr-student-02',
        targetPaymentId: 'pay-seed-02',
        details: 'Approved 200 ETB CBE deposit for Mohammed Bekele (Grade 12)',
        previousStatus: 'PENDING',
        newStatus: 'ACTIVE',
      },
    ];
  }
}

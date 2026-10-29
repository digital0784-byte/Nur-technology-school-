import { doc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { UserProfile, PaymentTransaction, AuditLog, GradeLevel } from '../types';
import { PaymentService } from './paymentService';
import { PaymentGatewayId } from '../types/payment';

export class FirebaseService {
  private static STORAGE_PREFIX = 'nur_firebase_cache_';

  static async syncUserProfile(user: UserProfile): Promise<boolean> {
    try {
      localStorage.setItem(`${this.STORAGE_PREFIX}user_${user.id}`, JSON.stringify(user));
      if (isFirebaseConfigured) {
        // Asynchronously sync to Firestore without blocking UI
        setDoc(doc(db, 'users', user.id), {
          ...user,
          lastSyncedAt: new Date().toISOString(),
        }, { merge: true }).catch((err) => {
          console.warn('Firestore syncUserProfile notice:', err?.message || err);
        });
      }
      return true;
    } catch {
      return false;
    }
  }

  static async recordAuditLog(log: Omit<AuditLog, 'id'>): Promise<AuditLog> {
    const fullLog: AuditLog = {
      ...log,
      id: `aud-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    };
    try {
      const existing = JSON.parse(localStorage.getItem(`${this.STORAGE_PREFIX}audit_logs`) || '[]');
      existing.unshift(fullLog);
      localStorage.setItem(`${this.STORAGE_PREFIX}audit_logs`, JSON.stringify(existing.slice(0, 50)));

      if (isFirebaseConfigured) {
        setDoc(doc(db, 'audit_logs', fullLog.id), fullLog).catch((err) => {
          console.warn('Firestore recordAuditLog notice:', err?.message || err);
        });
      }
    } catch {
      // cache fallback
    }
    return fullLog;
  }

  static getAuditLogs(): AuditLog[] {
    try {
      return JSON.parse(localStorage.getItem(`${this.STORAGE_PREFIX}audit_logs`) || '[]');
    } catch {
      return [];
    }
  }

  static recordPayment(payment: PaymentTransaction) {
    try {
      const existing = JSON.parse(localStorage.getItem(`${this.STORAGE_PREFIX}payments`) || '[]');
      existing.unshift(payment);
      localStorage.setItem(`${this.STORAGE_PREFIX}payments`, JSON.stringify(existing));

      if (isFirebaseConfigured) {
        setDoc(doc(db, 'payments', payment.id), payment).catch((err) => {
          console.warn('Firestore recordPayment notice:', err?.message || err);
        });
      }
    } catch {
      // ignore
    }
  }

  static async submitPaymentRequest(params: {
    provider: 'Telebirr' | 'CBE' | string;
    transactionId: string;
    amount: number;
    phone: string;
    plan: string;
  }): Promise<string> {
    let studentId = 'usr-student-01';
    let studentName = 'ተማሪ (Student)';
    let studentEmail = 'student@nur-school.edu.et';
    let grade: GradeLevel = 10;

    const savedProfile = localStorage.getItem('app_user_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.id) studentId = parsed.id;
        if (parsed.name) studentName = parsed.name;
        if (parsed.email) studentEmail = parsed.email;
        if (parsed.grade) grade = parsed.grade;
      } catch {}
    }

    const gateway: PaymentGatewayId = params.provider.toLowerCase().includes('cbe') ? 'cbe' : 'telebirr';

    const submission = PaymentService.submitPayment({
      studentId,
      studentName,
      studentEmail,
      studentPhone: params.phone,
      grade,
      amount: params.amount,
      paymentGateway: gateway,
      transactionRef: params.transactionId,
    });

    if (isFirebaseConfigured) {
      setDoc(doc(db, 'payments', submission.id), submission).catch(() => {});
    }

    return submission.id;
  }
}

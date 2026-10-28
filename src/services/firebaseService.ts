import { UserProfile, GradeLevel, PaymentTransaction, AuditLog } from '../types';

export class FirebaseService {
  private static STORAGE_PREFIX = 'nur_firebase_cache_';

  static async syncUserProfile(user: UserProfile): Promise<boolean> {
    try {
      localStorage.setItem(`${this.STORAGE_PREFIX}user_${user.id}`, JSON.stringify(user));
      return true;
    } catch {
      return false;
    }
  }

  static async recordAuditLog(log: Omit<AuditLog, 'id'>): Promise<AuditLog> {
    const fullLog: AuditLog = {
      ...log,
      id: `aud-${Date.now()}`,
    };
    try {
      const existing = JSON.parse(localStorage.getItem(`${this.STORAGE_PREFIX}audit_logs`) || '[]');
      existing.unshift(fullLog);
      localStorage.setItem(`${this.STORAGE_PREFIX}audit_logs`, JSON.stringify(existing.slice(0, 50)));
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
    } catch {
      // ignore
    }
  }
}

import { doc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { UserProfile, PaymentTransaction, AuditLog } from '../types';

export class FirebaseService {
  static async syncUserProfile(user: UserProfile): Promise<boolean> {
    try {
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

  static async recordAuditLog(log: Partial<AuditLog>): Promise<AuditLog> {
    const id = log.logId || log.id || `aud-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const fullLog: AuditLog = {
      logId: id,
      id,
      actorId: log.actorId || 'system',
      actorRole: log.actorRole || 'STUDENT',
      action: log.action || 'GENERAL_ACTION',
      resourceType: log.resourceType || 'SYSTEM',
      resourceId: log.resourceId || 'CORE',
      result: log.result || 'success',
      ip: log.ip || '127.0.0.1',
      timestamp: log.timestamp || new Date().toISOString(),
      details: log.details || '',
    };
    try {
      if (isFirebaseConfigured) {
        setDoc(doc(db, 'audit_logs', id), fullLog).catch((err) => {
          console.warn('Firestore recordAuditLog notice:', err?.message || err);
        });
      }
    } catch {
      // cache fallback
    }
    return fullLog;
  }

  static getAuditLogs(): AuditLog[] {
    return [];
  }

  static recordPayment(payment: PaymentTransaction) {
    try {
      if (isFirebaseConfigured) {
        setDoc(doc(db, 'payments', payment.id), payment).catch((err) => {
          console.warn('Firestore recordPayment notice:', err?.message || err);
        });
      }
    } catch {
      // ignore
    }
  }
}

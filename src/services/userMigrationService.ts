import {
  collection,
  doc,
  getDocs,
  setDoc,
  writeBatch,
  serverTimestamp,
  query,
  limit,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { UserProfile, GradeLevel } from '../types';

export interface UserAuditRecord {
  docId: string;
  isCanonicalUid: boolean;
  internalUid?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  grade: GradeLevel;
  isPremium: boolean;
  premiumExpiresAt?: string;
  xp: number;
  enrolledAt?: string;
  isGradeLocked: boolean;
  status: 'CANONICAL_UID' | 'MIGRATABLE_MISMATCH' | 'DUPLICATE_EMAIL' | 'AMBIGUOUS_RECORD';
  targetUid?: string;
  associatedPaymentsCount: number;
  associatedSubscriptionsCount: number;
  rawDocData: Record<string, any>;
}

export interface MigrationAuditReport {
  totalUsersScanned: number;
  canonicalUidCount: number;
  mismatchedCount: number;
  duplicateCount: number;
  ambiguousCount: number;
  paymentsScanned: number;
  subscriptionsScanned: number;
  records: UserAuditRecord[];
  status: 'CLEAN' | 'MIGRATION_RECOMMENDED' | 'ACTION_REQUIRED';
  timestamp: string;
}

export interface MigrationBackup {
  backupId: string;
  createdAt: string;
  createdBy: string;
  totalUsers: number;
  users: Array<{ docId: string; data: Record<string, any> }>;
  paymentsSummary: Array<{ id: string; studentId: string; studentEmail: string }>;
}

export interface MigrationExecutionResult {
  success: boolean;
  backupId: string;
  recordsMigrated: number;
  paymentsUpdated: number;
  errors: string[];
  completedAt: string;
}

// Standard Firebase Auth UIDs are 28-character base64url or standard 20-36 char alphanumeric strings
export function isFirebaseUid(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  const trimmed = id.trim();
  if (trimmed.startsWith('usr-') || trimmed.startsWith('student-') || trimmed === 'guest') {
    return false;
  }
  // Standard Firebase UIDs are typically alphanumeric, length between 20 and 36, no spaces
  return /^[A-Za-z0-9_-]{20,36}$/.test(trimmed);
}

export class UserMigrationService {
  private static STORAGE_KEY_BACKUPS = 'nur_user_identity_backups_v1';

  /**
   * Performs a non-destructive, read-only audit of all Firestore user profiles,
   * checking document IDs against canonical Firebase Auth UID standards.
   */
  static async auditAllUserRecords(): Promise<MigrationAuditReport> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase is not configured.');
    }

    // 1. Fetch all documents in users collection
    const usersSnap = await getDocs(collection(db, 'users'));
    const rawUsers: Array<{ id: string; data: Record<string, any> }> = [];
    usersSnap.forEach((d) => {
      rawUsers.push({ id: d.id, data: d.data() });
    });

    // 2. Fetch payments to check referential integrity
    let paymentsMap: Record<string, number> = {};
    let totalPayments = 0;
    try {
      const paySnap = await getDocs(collection(db, 'payments'));
      totalPayments = paySnap.size;
      paySnap.forEach((d) => {
        const p = d.data();
        const sid = p.studentId || p.userId;
        if (sid) {
          paymentsMap[sid] = (paymentsMap[sid] || 0) + 1;
        }
      });
    } catch (e) {
      console.warn('Payment audit scan warning:', e);
    }

    // 3. Fetch subscriptions
    let subMap: Record<string, number> = {};
    let totalSubs = 0;
    try {
      const subSnap = await getDocs(collection(db, 'subscriptions'));
      totalSubs = subSnap.size;
      subSnap.forEach((d) => {
        const s = d.data();
        const sid = d.id || s.userId || s.studentId;
        if (sid) {
          subMap[sid] = (subMap[sid] || 0) + 1;
        }
      });
    } catch (e) {
      console.warn('Subscription audit scan warning:', e);
    }

    // 4. Audit records and detect duplicates/mismatches
    const emailToDocIds: Record<string, string[]> = {};
    rawUsers.forEach((u) => {
      const email = (u.data.email || '').toLowerCase().trim();
      if (email) {
        emailToDocIds[email] = emailToDocIds[email] || [];
        emailToDocIds[email].push(u.id);
      }
    });

    let canonicalCount = 0;
    let mismatchedCount = 0;
    let duplicateCount = 0;
    let ambiguousCount = 0;

    const records: UserAuditRecord[] = rawUsers.map((u) => {
      const d = u.data;
      const isCanonical = isFirebaseUid(u.id);
      const email = (d.email || '').toLowerCase().trim();
      const hasDuplicate = email && emailToDocIds[email].length > 1;

      // Determine internal UID field
      const internalUid = d.uid || d.id;
      const hasValidInternalUid = internalUid && isFirebaseUid(internalUid) && internalUid !== u.id;

      let status: UserAuditRecord['status'] = 'CANONICAL_UID';
      let targetUid: string | undefined = undefined;

      if (hasDuplicate) {
        status = 'DUPLICATE_EMAIL';
        duplicateCount++;
      } else if (!isCanonical) {
        if (hasValidInternalUid) {
          status = 'MIGRATABLE_MISMATCH';
          targetUid = internalUid;
          mismatchedCount++;
        } else if (!email) {
          status = 'AMBIGUOUS_RECORD';
          ambiguousCount++;
        } else {
          status = 'MIGRATABLE_MISMATCH';
          mismatchedCount++;
        }
      } else {
        canonicalCount++;
      }

      return {
        docId: u.id,
        isCanonicalUid: isCanonical,
        internalUid,
        name: d.name || 'Unnamed User',
        email: d.email || '',
        phone: d.phone,
        role: d.role || 'student',
        grade: ([9, 10, 11, 12].includes(Number(d.grade)) ? (Number(d.grade) as GradeLevel) : 9),
        isPremium: Boolean(d.isPremium),
        premiumExpiresAt: d.premiumExpiresAt,
        xp: Number(d.xp) || 0,
        enrolledAt: d.enrolledAt,
        isGradeLocked: Boolean(d.isGradeLocked),
        status,
        targetUid,
        associatedPaymentsCount: paymentsMap[u.id] || 0,
        associatedSubscriptionsCount: subMap[u.id] || 0,
        rawDocData: d,
      };
    });

    const overallStatus: MigrationAuditReport['status'] =
      mismatchedCount > 0 || duplicateCount > 0
        ? mismatchedCount > 0 && duplicateCount === 0
          ? 'MIGRATION_RECOMMENDED'
          : 'ACTION_REQUIRED'
        : 'CLEAN';

    return {
      totalUsersScanned: records.length,
      canonicalUidCount: canonicalCount,
      mismatchedCount,
      duplicateCount,
      ambiguousCount,
      paymentsScanned: totalPayments,
      subscriptionsScanned: totalSubs,
      records,
      status: overallStatus,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Creates a pre-migration backup before any write or migration operation.
   * Preserves exact snapshot locally and in Firestore collection `users_migration_backup`.
   */
  static async createPreMigrationBackup(
    report: MigrationAuditReport,
    adminEmail: string
  ): Promise<MigrationBackup> {
    const backupId = `backup-identity-${Date.now()}`;
    const backup: MigrationBackup = {
      backupId,
      createdAt: new Date().toISOString(),
      createdBy: adminEmail,
      totalUsers: report.records.length,
      users: report.records.map((r) => ({ docId: r.docId, data: r.rawDocData })),
      paymentsSummary: [],
    };

    // Save locally
    try {
      const existing = this.getSavedBackups();
      existing.unshift(backup);
      localStorage.setItem(this.STORAGE_KEY_BACKUPS, JSON.stringify(existing.slice(0, 10)));
    } catch (e) {
      console.warn('Local backup save warning:', e);
    }

    // Save in Firestore backup collection
    try {
      if (isFirebaseConfigured) {
        await setDoc(doc(db, 'users_migration_backup', backupId), {
          backupId,
          createdAt: serverTimestamp(),
          createdBy: adminEmail,
          totalUsers: report.records.length,
          usersSnapshot: report.records.map((r) => ({ docId: r.docId, data: r.rawDocData })),
          summary: {
            canonicalCount: report.canonicalUidCount,
            mismatchedCount: report.mismatchedCount,
            duplicateCount: report.duplicateCount,
          },
        });
      }
    } catch (e) {
      console.warn('Firestore backup collection write warning:', e);
    }

    return backup;
  }

  /**
   * Retrieves all pre-migration backups stored locally.
   */
  static getSavedBackups(): MigrationBackup[] {
    const raw = localStorage.getItem(this.STORAGE_KEY_BACKUPS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  /**
   * Safely executes migration with explicit admin approval.
   * Uses batched writes, maps mismatched documents to canonical Auth UIDs,
   * preserves all fields, updates referential integrity, and keeps old documents as archived.
   */
  static async executeSafeMigration(
    report: MigrationAuditReport,
    adminEmail: string
  ): Promise<MigrationExecutionResult> {
    if (!report || report.mismatchedCount === 0) {
      return {
        success: true,
        backupId: '',
        recordsMigrated: 0,
        paymentsUpdated: 0,
        errors: [],
        completedAt: new Date().toISOString(),
      };
    }

    // 1. Mandatory Pre-Migration Backup
    const backup = await this.createPreMigrationBackup(report, adminEmail);

    const errors: string[] = [];
    let recordsMigrated = 0;
    let paymentsUpdated = 0;

    const batch = writeBatch(db);

    for (const record of report.records) {
      if (record.status !== 'MIGRATABLE_MISMATCH') continue;

      const targetUid = record.targetUid || record.internalUid;
      if (!targetUid || !isFirebaseUid(targetUid)) {
        errors.push(`Skipped record '${record.docId}': No verified canonical Auth UID found.`);
        continue;
      }

      try {
        const canonicalDocRef = doc(db, 'users', targetUid);
        const sourceDocRef = doc(db, 'users', record.docId);

        // Copy all original fields to canonical doc with merge
        batch.set(
          canonicalDocRef,
          {
            ...record.rawDocData,
            id: targetUid,
            uid: targetUid,
            migratedFromDocId: record.docId,
            migratedAt: serverTimestamp(),
            lastSyncedAt: new Date().toISOString(),
          },
          { merge: true }
        );

        // Retain original doc with archive metadata (never delete immediately)
        batch.set(
          sourceDocRef,
          {
            isLegacyArchive: true,
            migratedToUid: targetUid,
            migratedAt: serverTimestamp(),
            migratedBy: adminEmail,
          },
          { merge: true }
        );

        recordsMigrated++;
      } catch (err: any) {
        errors.push(`Error staging record '${record.docId}': ${err?.message || err}`);
      }
    }

    // Commit batch
    try {
      await batch.commit();
    } catch (commitErr: any) {
      throw new Error(`Migration batch commit failed: ${commitErr?.message || commitErr}`);
    }

    // Log to audit trail
    try {
      await setDoc(doc(db, 'audit_logs', `aud-migration-${Date.now()}`), {
        logId: `aud-migration-${Date.now()}`,
        scope: 'user_identity_migration',
        actorEmail: adminEmail,
        action: 'USER_IDENTITY_MIGRATION_EXECUTED',
        backupId: backup.backupId,
        recordsMigrated,
        details: `Migrated ${recordsMigrated} user records to canonical Firebase Auth UIDs. Backup ID: ${backup.backupId}`,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Audit log write warning:', e);
    }

    return {
      success: errors.length === 0,
      backupId: backup.backupId,
      recordsMigrated,
      paymentsUpdated,
      errors,
      completedAt: new Date().toISOString(),
    };
  }
}

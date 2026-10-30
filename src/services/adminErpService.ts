import { AdminKpiStats, StudentRegistryRecord, DrmCurriculumConfig, DrmTextbookRecord, AdminAuditEntry } from '../types/adminErp';
import { GradeLevel } from '../types';
import { PaymentSubmission, GradePricingConfig } from '../types/payment';
import { PaymentService, SUPER_ADMIN_EMAIL, SUPER_ADMIN_NAME } from './paymentService';

const STORAGE_KEY_STUDENTS = 'nur_admin_student_registry_v1';
const STORAGE_KEY_DRM_CONFIG = 'nur_admin_drm_config_v1';
const STORAGE_KEY_ERP_AUDIT = 'nur_admin_erp_audit_v1';

// Initial realistic student seed representing Grades 9, 10, 11, 12 across Ethiopian high schools
const INITIAL_STUDENTS_SEED: StudentRegistryRecord[] = [
  {
    id: 'usr-student-01',
    name: 'Almaz Tadesse Gidey',
    email: 'almaz.student@nur-school.edu.et',
    phone: '0922446688',
    grade: 10,
    stream: 'Natural Science',
    enrolledAt: '2026-09-15',
    isGradeLocked: true,
    subscriptionStatus: 'PENDING',
    daysRemaining: 0,
    registeredDevicesCount: 1,
    maxAllowedDevices: 2,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    totalSpentETB: 180,
    notes: 'Grade 10 STEM track - Pending Telebirr FT verification',
  },
  {
    id: 'usr-student-02',
    name: 'Mohammed Bekele Ahmed',
    email: 'mohammed.bekele@nur-school.edu.et',
    phone: '0911559933',
    grade: 12,
    stream: 'Natural Science',
    enrolledAt: '2026-09-10',
    isGradeLocked: true,
    subscriptionStatus: 'ACTIVE',
    daysRemaining: 29,
    registeredDevicesCount: 2,
    maxAllowedDevices: 2,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    totalSpentETB: 400,
    notes: 'EUEE Exam Candidate - Active 30-day Pass via CBE',
  },
  {
    id: 'usr-student-03',
    name: 'Bethlehem Hailemariam',
    email: 'bethlehem.h@nur-school.edu.et',
    phone: '0933771122',
    grade: 11,
    stream: 'Natural Science',
    enrolledAt: '2026-09-20',
    isGradeLocked: true,
    subscriptionStatus: 'ACTIVE',
    daysRemaining: 18,
    registeredDevicesCount: 1,
    maxAllowedDevices: 2,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    totalSpentETB: 200,
    notes: 'Grade 11 Mathematics & Chemistry focus',
  },
  {
    id: 'usr-student-04',
    name: 'Yared Solomon Kebede',
    email: 'yared.solomon@nur-school.edu.et',
    phone: '0944883311',
    grade: 9,
    enrolledAt: '2026-10-01',
    isGradeLocked: true,
    subscriptionStatus: 'ACTIVE',
    daysRemaining: 22,
    registeredDevicesCount: 1,
    maxAllowedDevices: 2,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    totalSpentETB: 160,
    notes: 'Grade 9 Foundation - Telebirr payment verified',
  },
  {
    id: 'usr-student-05',
    name: 'Fasika Worku Mengesha',
    email: 'fasika.worku@nur-school.edu.et',
    phone: '0977224411',
    grade: 12,
    stream: 'Social Science',
    enrolledAt: '2026-09-18',
    isGradeLocked: true,
    subscriptionStatus: 'EXPIRED',
    daysRemaining: 0,
    registeredDevicesCount: 1,
    maxAllowedDevices: 2,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    totalSpentETB: 200,
    notes: 'Previous month active, renewal notification sent',
  },
  {
    id: 'usr-student-06',
    name: 'Abdurahman Jemal Seid',
    email: 'abdurahman.j@nur-school.edu.et',
    phone: '0912334455',
    grade: 10,
    stream: 'Natural Science',
    enrolledAt: '2026-10-05',
    isGradeLocked: true,
    subscriptionStatus: 'ACTIVE',
    daysRemaining: 26,
    registeredDevicesCount: 1,
    maxAllowedDevices: 2,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    totalSpentETB: 234, // 180 + 54 single assignment
    notes: 'Grade 10 + Purchased Single Assignment Pack',
  },
];

// Initial Ethiopian New Curriculum Textbook DRM catalog
const INITIAL_DRM_TEXTBOOKS: DrmTextbookRecord[] = [
  {
    id: 'moe-g10-math',
    subject: 'Mathematics',
    grade: 10,
    title: 'Grade 10 Mathematics Student Textbook (MoE New Curriculum)',
    edition: '2019 E.C. (New Syllabus)',
    fileUrl: 'https://moe.gov.et/curriculum/grade10/mathematics.pdf',
    drmLevel: 'HIGH_SECURITY',
    pageCount: 320,
    lastVerified: '2026-10-25',
  },
  {
    id: 'moe-g10-physics',
    subject: 'Physics',
    grade: 10,
    title: 'Grade 10 Physics Student Textbook',
    edition: '2019 E.C. (New Syllabus)',
    fileUrl: 'https://moe.gov.et/curriculum/grade10/physics.pdf',
    drmLevel: 'HIGH_SECURITY',
    pageCount: 284,
    lastVerified: '2026-10-25',
  },
  {
    id: 'moe-g10-chemistry',
    subject: 'Chemistry',
    grade: 10,
    title: 'Grade 10 Chemistry Student Textbook',
    edition: '2019 E.C. (New Syllabus)',
    fileUrl: 'https://moe.gov.et/curriculum/grade10/chemistry.pdf',
    drmLevel: 'HIGH_SECURITY',
    pageCount: 260,
    lastVerified: '2026-10-25',
  },
  {
    id: 'moe-g11-math-nat',
    subject: 'Mathematics',
    grade: 11,
    title: 'Grade 11 Mathematics (Natural Science)',
    edition: '2019 E.C. (New Syllabus)',
    fileUrl: 'https://moe.gov.et/curriculum/grade11/mathematics-natural.pdf',
    drmLevel: 'HIGH_SECURITY',
    pageCount: 348,
    lastVerified: '2026-10-24',
  },
  {
    id: 'moe-g12-math-nat',
    subject: 'Mathematics',
    grade: 12,
    title: 'Grade 12 Mathematics (EUEE Prep Edition)',
    edition: '2019 E.C. (New Syllabus)',
    fileUrl: 'https://moe.gov.et/curriculum/grade12/mathematics.pdf',
    drmLevel: 'HIGH_SECURITY',
    pageCount: 366,
    lastVerified: '2026-10-26',
  },
  {
    id: 'moe-g9-math',
    subject: 'Mathematics',
    grade: 9,
    title: 'Grade 9 Mathematics Student Textbook',
    edition: '2019 E.C. (New Syllabus)',
    fileUrl: 'https://moe.gov.et/curriculum/grade9/mathematics.pdf',
    drmLevel: 'STANDARD_WATERMARK',
    pageCount: 290,
    lastVerified: '2026-10-20',
  },
];

const INITIAL_DRM_CONFIG: DrmCurriculumConfig = {
  antiScreenshotEnabled: true,
  dynamicWatermarkEnabled: true,
  tokenExpiryMinutes: 30,
  disableDirectDownload: true,
  offlineEncryptedStorage: true,
  watermarkPattern: '{studentName} • {phone} • {timestamp} • MoE Ethiopia',
  textbooks: INITIAL_DRM_TEXTBOOKS,
};

export class AdminErpService {
  // 1. Fetch or initialize Student Registry
  static getStudents(): StudentRegistryRecord[] {
    const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(INITIAL_STUDENTS_SEED));
    return INITIAL_STUDENTS_SEED;
  }

  // 2. Save students list
  static saveStudents(students: StudentRegistryRecord[]): void {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  }

  // 3. Toggle Grade Lock for a student (strict MoE enforcement)
  static toggleGradeLock(studentId: string, adminEmail: string = SUPER_ADMIN_EMAIL): boolean {
    const students = this.getStudents();
    const idx = students.findIndex((s) => s.id === studentId);
    if (idx === -1) return false;

    students[idx].isGradeLocked = !students[idx].isGradeLocked;
    this.saveStudents(students);

    this.logAudit({
      actor: adminEmail,
      action: students[idx].isGradeLocked ? 'GRADE_LOCK_ENFORCED' : 'GRADE_LOCK_OVERRIDDEN',
      target: `${students[idx].name} (Grade ${students[idx].grade})`,
      status: 'ALERT',
      details: `Super Admin toggled grade lock to ${students[idx].isGradeLocked ? 'LOCKED' : 'UNLOCKED'} for student ${students[idx].email}`,
    });

    return true;
  }

  // 4. Grant manual 30-day scholarship pass
  static grantManualPass(studentId: string, days: number = 30, adminEmail: string = SUPER_ADMIN_EMAIL): boolean {
    const students = this.getStudents();
    const idx = students.findIndex((s) => s.id === studentId);
    if (idx === -1) return false;

    students[idx].subscriptionStatus = 'ACTIVE';
    students[idx].daysRemaining = days;
    this.saveStudents(students);

    // Also sync to Subscription storage
    const allSubs = PaymentService.getAllSubscriptions();
    const expiresAt = new Date(Date.now() + 86400000 * days).toISOString();
    allSubs[studentId] = {
      userId: studentId,
      grade: students[idx].grade,
      status: 'ACTIVE',
      planTitle: `${students[idx].grade}ኛ ክፍል ልዩ ነፃ የትምህርት ዕድል (Scholarship ${days} Days)`,
      amountPaid: 0,
      activatedAt: new Date().toISOString(),
      expiresAt,
      daysRemaining: days,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem('app_student_subscriptions_v2', JSON.stringify(allSubs));

    this.logAudit({
      actor: adminEmail,
      action: 'MANUAL_PASS_GRANTED',
      target: `${students[idx].name} (ID: ${studentId})`,
      status: 'SUCCESS',
      details: `Super Admin manually granted ${days}-day full access scholarship pass.`,
    });

    return true;
  }

  // 5. Reset registered devices count (prevents unauthorized account sharing)
  static resetDeviceLock(studentId: string, adminEmail: string = SUPER_ADMIN_EMAIL): boolean {
    const students = this.getStudents();
    const idx = students.findIndex((s) => s.id === studentId);
    if (idx === -1) return false;

    students[idx].registeredDevicesCount = 0;
    this.saveStudents(students);

    this.logAudit({
      actor: adminEmail,
      action: 'DEVICE_LOCK_RESET',
      target: `${students[idx].name} (${students[idx].email})`,
      status: 'WARNING',
      details: `Super Admin cleared all registered hardware device tokens for student.`,
    });

    return true;
  }

  // 6. Calculate real-time KPI metrics
  static computeKpis(submissions: PaymentSubmission[] = PaymentService.getAllSubmissions()): AdminKpiStats {
    const students = this.getStudents();
    const totalStudents = students.length;

    let activeSubs = 0;
    let pendingSubs = 0;
    let expiredSubs = 0;

    students.forEach((s) => {
      if (s.subscriptionStatus === 'ACTIVE') activeSubs++;
      else if (s.subscriptionStatus === 'PENDING') pendingSubs++;
      else if (s.subscriptionStatus === 'EXPIRED') expiredSubs++;
    });

    // Compute revenue from approved payments
    let revenueG9 = 0;
    let revenueG10 = 0;
    let revenueG11 = 0;
    let revenueG12 = 0;
    let revenueSingleAssign = 0;

    submissions.forEach((sub) => {
      if (sub.status === 'APPROVED') {
        if (sub.amount === 54) {
          revenueSingleAssign += 54;
        } else if (sub.grade === 9) {
          revenueG9 += sub.amount;
        } else if (sub.grade === 10) {
          revenueG10 += sub.amount;
        } else if (sub.grade === 11) {
          revenueG11 += sub.amount;
        } else if (sub.grade === 12) {
          revenueG12 += sub.amount;
        } else {
          revenueG10 += sub.amount;
        }
      }
    });

    // Count pending submissions from submission list
    const actualPendingVerifications = submissions.filter((s) => s.status === 'PENDING').length;

    const totalRevenueETB = revenueG9 + revenueG10 + revenueG11 + revenueG12 + revenueSingleAssign;

    return {
      totalStudents,
      activeSubscriptions: activeSubs,
      pendingVerifications: actualPendingVerifications || pendingSubs,
      expiredSubscriptions: expiredSubs,
      totalRevenueETB,
      systemHealthScore: 99.8,
      revenueByGrade: {
        grade9: revenueG9,
        grade10: revenueG10,
        grade11: revenueG11,
        grade12: revenueG12,
        singleAssignment: revenueSingleAssign,
      },
      todayNewRegistrations: 4,
      lastUpdated: new Date().toISOString(),
    };
  }

  // 7. DRM Curriculum Configuration
  static getDrmConfig(): DrmCurriculumConfig {
    const saved = localStorage.getItem(STORAGE_KEY_DRM_CONFIG);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEY_DRM_CONFIG, JSON.stringify(INITIAL_DRM_CONFIG));
    return INITIAL_DRM_CONFIG;
  }

  static saveDrmConfig(config: DrmCurriculumConfig, adminEmail: string = SUPER_ADMIN_EMAIL): void {
    localStorage.setItem(STORAGE_KEY_DRM_CONFIG, JSON.stringify(config));
    this.logAudit({
      actor: adminEmail,
      action: 'DRM_CONFIG_UPDATED',
      target: 'Curriculum DRM Engine',
      status: 'ALERT',
      details: `DRM policies updated: Anti-Screenshot=${config.antiScreenshotEnabled}, Watermarking=${config.dynamicWatermarkEnabled}, TokenWindow=${config.tokenExpiryMinutes}m, BlockDownload=${config.disableDirectDownload}`,
    });
  }

  static addTextbook(textbook: Omit<DrmTextbookRecord, 'id' | 'lastVerified'>, adminEmail: string = SUPER_ADMIN_EMAIL): DrmTextbookRecord {
    const config = this.getDrmConfig();
    const newBook: DrmTextbookRecord = {
      ...textbook,
      id: `textbook-${Date.now()}`,
      lastVerified: new Date().toISOString().split('T')[0],
    };
    config.textbooks.unshift(newBook);
    this.saveDrmConfig(config, adminEmail);
    return newBook;
  }

  // 8. Generate and Download CSV Financial Ledger
  static exportLedgerCsv(submissions: PaymentSubmission[] = PaymentService.getAllSubmissions()): void {
    const headers = [
      'Transaction ID',
      'Date & Time (UTC)',
      'Student Name',
      'Student Email',
      'Student Phone',
      'Grade Level',
      'Payment Gateway',
      'FT Reference Code',
      'Amount (ETB)',
      'Status',
      'Reviewed By',
      'Review Date',
      'Subscription Expiry Date',
      'Rejection Reason',
    ];

    const rows = submissions.map((sub) => [
      `"${sub.id}"`,
      `"${sub.submittedAt}"`,
      `"${(sub.studentName || '').replace(/"/g, '""')}"`,
      `"${(sub.studentEmail || '').replace(/"/g, '""')}"`,
      `"${(sub.studentPhone || '').replace(/"/g, '""')}"`,
      `"Grade ${sub.grade}"`,
      `"${(sub.paymentGateway || '').toUpperCase()}"`,
      `"${(sub.transactionRef || '').replace(/"/g, '""')}"`,
      sub.amount,
      `"${sub.status}"`,
      `"${(sub.reviewedBy || '').replace(/"/g, '""')}"`,
      `"${sub.reviewedAt || 'N/A'}"`,
      `"${sub.expiresAt ? sub.expiresAt.split('T')[0] : 'N/A'}"`,
      `"${(sub.rejectionReason || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `NUR_AI_School_Financial_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // 9. ERP Audit Logging
  static getAuditEntries(): AdminAuditEntry[] {
    const saved = localStorage.getItem(STORAGE_KEY_ERP_AUDIT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    const initialSeed: AdminAuditEntry[] = [
      {
        id: 'audit-01',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        actor: SUPER_ADMIN_EMAIL,
        action: 'PAYMENT_APPROVED',
        target: 'Mohammed Bekele (Grade 12)',
        status: 'SUCCESS',
        details: 'Approved 200 ETB via CBE (FT9981240). 30-day EUEE pass active.',
      },
      {
        id: 'audit-02',
        timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
        actor: SUPER_ADMIN_EMAIL,
        action: 'PRICE_VERIFIED',
        target: 'Grade 9-12 Pricing Engine',
        status: 'SUCCESS',
        details: 'Verified Grade 9 (160 ETB), G10 (180 ETB), G11 (200 ETB), G12 (200 ETB), Single (54 ETB).',
      },
      {
        id: 'audit-03',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        actor: 'Telebirr Gateway Webhook',
        action: 'PAYMENT_PENDING_INGESTED',
        target: 'Almaz Tadesse (FT26049281)',
        status: 'WARNING',
        details: 'Payment request 180 ETB queued for Super Admin manual authorization.',
      },
      {
        id: 'audit-04',
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        actor: 'System DRM Guard',
        action: 'SCREENSHOT_ATTEMPT_BLOCKED',
        target: 'Grade 10 Maths Chapter 1 DRM Viewer',
        status: 'ALERT',
        details: 'PrintScreen keystroke intercepted. Watermark overlay enforced.',
      },
    ];
    localStorage.setItem(STORAGE_KEY_ERP_AUDIT, JSON.stringify(initialSeed));
    return initialSeed;
  }

  static logAudit(entry: Omit<AdminAuditEntry, 'id' | 'timestamp'>): void {
    const list = this.getAuditEntries();
    const newEntry: AdminAuditEntry = {
      ...entry,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    list.unshift(newEntry);
    localStorage.setItem(STORAGE_KEY_ERP_AUDIT, JSON.stringify(list.slice(0, 100)));
  }
}

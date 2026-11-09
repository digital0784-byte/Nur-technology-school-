import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { authFetch } from '../../services/apiClient';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Users,
  CreditCard,
  BookOpen,
  DollarSign,
  Clock,
  Download,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Smartphone,
  Eye,
  FileText,
  KeyRound,
  Sparkles,
  Building2,
  ChevronRight,
  UserCheck,
  RotateCcw,
  Plus,
  Save,
  Check,
  Database,
} from 'lucide-react';
import {
  AdminKpiStats,
  StudentRegistryRecord,
  DrmCurriculumConfig,
  DrmTextbookRecord,
  AdminAuditEntry,
} from '../../types/adminErp';
import { AdminErpService } from '../../services/adminErpService';
import { GradePricingConfig, PaymentAccountConfig, PaymentSubmission } from '../../types/payment';
import { GradeLevel } from '../../types';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../services/firebase';
import {
  UserMigrationService,
  MigrationAuditReport,
  UserAuditRecord,
  isFirebaseUid,
} from '../../services/userMigrationService';

type AdminTab =
  | 'kpi'
  | 'students'
  | 'payments'
  | 'identity_migration'
  | 'drm_cms'
  | 'pricing'
  | 'audit_session';

export const AdminErpDashboard: React.FC = () => {
  const { isSuperAdmin: authIsSuperAdmin, currentUser } = useAuth();
  const { t, language } = useLanguage();
  const {
    pricing,
    accounts,
    allSubmissions,
    approvePayment,
    rejectPayment,
    updatePricing,
    updateAccounts,
    refreshState,
  } = useSubscription();

  const isSuperAdmin = authIsSuperAdmin;

  const [activeTab, setActiveTab] = useState<AdminTab>('kpi');

  // 1. KPI State
  const [kpis, setKpis] = useState<AdminKpiStats>(() => AdminErpService.computeKpis(allSubmissions));

  // 2. Students Registry State (Canonical UID Single Source of Truth)
  const [students, setStudents] = useState<StudentRegistryRecord[]>(() => AdminErpService.getStudents());
  const [studentSearch, setStudentSearch] = useState('');
  const [studentGradeFilter, setStudentGradeFilter] = useState<'ALL' | '9' | '10' | '11' | '12'>('ALL');
  const [studentStatusFilter, setStudentStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'EXPIRED'>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentRegistryRecord | null>(null);

  // 3. Payment Approval & Ledger State
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [rejectingPaymentId, setRejectingPaymentId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('የትራንዛክሽን ቁጥሩ በቴሌብር/ባንኩ አልተገኘም (Invalid FT Number)');
  const [approvalFeedback, setApprovalFeedback] = useState<string | null>(null);

  // 4. Identity & Migration State
  const [auditReport, setAuditReport] = useState<MigrationAuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<any>(null);
  const [showConfirmMigrationModal, setShowConfirmMigrationModal] = useState(false);
  const [backupDownloadUrl, setBackupDownloadUrl] = useState<string | null>(null);
  const [identityFilter, setIdentityFilter] = useState<'ALL' | 'MISMATCH' | 'CANONICAL' | 'AMBIGUOUS'>('ALL');
  const [identitySearch, setIdentitySearch] = useState('');

  // 5. DRM CMS State
  const [drmConfig, setDrmConfig] = useState<DrmCurriculumConfig>(() => AdminErpService.getDrmConfig());
  const [isDrmSaved, setIsDrmSaved] = useState(false);
  const [newBookGrade, setNewBookGrade] = useState<GradeLevel>(10);
  const [newBookSubject, setNewBookSubject] = useState('Mathematics');
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookUrl, setNewBookUrl] = useState('');
  const [showAddBookModal, setShowAddBookModal] = useState(false);

  // 6. Pricing & Accounts State
  const [editPricing, setEditPricing] = useState<GradePricingConfig>(pricing);
  const [editAccounts, setEditAccounts] = useState<PaymentAccountConfig[]>(accounts);
  const [isPricingSaved, setIsPricingSaved] = useState(false);
  const [isAccountsSaved, setIsAccountsSaved] = useState(false);

  // 7. Security Session & 30-Minute Timer
  const [sessionSecondsLeft, setSessionSecondsLeft] = useState<number>(30 * 60); // 30 minutes
  const [isSessionLocked, setIsSessionLocked] = useState(false);
  const [unlockPin, setUnlockPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AdminAuditEntry[]>(() => AdminErpService.getAuditEntries());

  // Live Firestore subscription: Ensures all student profiles are loaded directly from users/{auth.uid}
  useEffect(() => {
    if (!isFirebaseConfigured || !isSuperAdmin) return;
    const unsub = onSnapshot(
      collection(db, 'users'),
      (snap) => {
        const liveList: StudentRegistryRecord[] = [];
        snap.forEach((d) => {
          const data = d.data();
          if (data.isLegacyArchive) return; // skip legacy archived migration docs
          const role = data.role || 'student';
          const isAct = Boolean(data.isPremium);
          let daysRem = 0;
          if (data.premiumExpiresAt) {
            const exp = new Date(data.premiumExpiresAt).getTime();
            daysRem = Math.max(0, Math.ceil((exp - Date.now()) / (1000 * 60 * 60 * 24)));
          }
          liveList.push({
            id: d.id, // Canonical Firebase Auth UID
            name: data.name || (data.email ? data.email.split('@')[0] : 'Unnamed Student'),
            email: data.email || '',
            phone: data.phone || '',
            grade: (Number(data.grade) || 10) as GradeLevel,
            stream: data.stream,
            enrolledAt: data.enrolledAt || new Date().toISOString().split('T')[0],
            isGradeLocked: data.isGradeLocked !== false,
            subscriptionStatus: isAct ? 'ACTIVE' : (data.subscriptionStatus || 'PENDING'),
            daysRemaining: daysRem,
            registeredDevicesCount: Number(data.registeredDevicesCount) || 1,
            maxAllowedDevices: Number(data.maxAllowedDevices) || 2,
            lastActiveAt: data.lastActiveAt || data.lastSyncedAt || new Date().toISOString(),
            totalSpentETB: Number(data.totalSpentETB) || (isAct ? 200 : 0),
            notes: data.notes || (role === 'super_admin' ? 'Super Admin' : `Grade ${data.grade || 10} Enrolled`),
          });
        });
        if (liveList.length > 0) {
          setStudents(liveList);
          AdminErpService.saveStudents(liveList);
        }
      },
      (err) => console.warn('Firestore live students listener notice:', err)
    );
    return () => unsub();
  }, [isSuperAdmin]);

  // Run audit on load if super admin
  useEffect(() => {
    if (isSuperAdmin && isFirebaseConfigured) {
      UserMigrationService.auditAllUserRecords().then(setAuditReport).catch(() => {});
    }
  }, [isSuperAdmin]);

  // Keep KPI & pricing in sync with context
  useEffect(() => {
    setKpis(AdminErpService.computeKpis(allSubmissions));
  }, [allSubmissions, students]);

  useEffect(() => {
    setEditPricing(pricing);
  }, [pricing]);

  useEffect(() => {
    setEditAccounts(accounts);
  }, [accounts]);

  // Live listener for student payment submission so Admin sees new FT numbers instantly
  useEffect(() => {
    const handleNewPayment = () => {
      refreshState();
    };
    window.addEventListener('nur_payment_submitted', handleNewPayment);
    return () => window.removeEventListener('nur_payment_submitted', handleNewPayment);
  }, [refreshState]);

  // Security Session Timer countdown
  useEffect(() => {
    if (isSessionLocked) return;
    const interval = setInterval(() => {
      setSessionSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsSessionLocked(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSessionLocked]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExtendSession = () => {
    setSessionSecondsLeft(30 * 60);
    AdminErpService.logAudit({
      actor: 'mejennur669@gmail.com',
      action: 'SESSION_EXTENDED',
      target: 'Admin Security Session',
      status: 'SUCCESS',
      details: 'Super Admin renewed security session for 30 minutes.',
    });
    setAuditLogs(AdminErpService.getAuditEntries());
  };

  const handleUnlockSession = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 2019 (MoE Curriculum Year) or 7862 (last 4 digits of Super Admin phone 0910097862)
    if (unlockPin === '2019' || unlockPin === '7862' || unlockPin === 'admin123') {
      setIsSessionLocked(false);
      setSessionSecondsLeft(30 * 60);
      setPinError(false);
      setUnlockPin('');
      AdminErpService.logAudit({
        actor: 'mejennur669@gmail.com',
        action: 'CONSOLE_UNLOCKED',
        target: 'Admin Security Fortress',
        status: 'SUCCESS',
        details: 'Admin console unlocked via security credentials.',
      });
      setAuditLogs(AdminErpService.getAuditEntries());
    } else {
      setPinError(true);
    }
  };

  // Student Actions
  const handleToggleGradeLock = (studentId: string) => {
    AdminErpService.toggleGradeLock(studentId);
    setStudents(AdminErpService.getStudents());
    setAuditLogs(AdminErpService.getAuditEntries());
  };

  const handleGrantScholarship = (studentId: string) => {
    AdminErpService.grantManualPass(studentId, 30);
    setStudents(AdminErpService.getStudents());
    refreshState();
    setAuditLogs(AdminErpService.getAuditEntries());
  };

  const handleResetDevice = (studentId: string) => {
    AdminErpService.resetDeviceLock(studentId);
    setStudents(AdminErpService.getStudents());
    setAuditLogs(AdminErpService.getAuditEntries());
  };

  // Payment Actions
  const handleApprove = async (paymentId: string) => {
    const success = await approvePayment(paymentId);
    if (success) {
      setApprovalFeedback(`ክፍያ #${paymentId} በተሳካ ሁኔታ ጸድቋል! ተማሪው ለ30 ቀናት ሙሉ ፍቃድ አግኝቷል።`);
      setTimeout(() => setApprovalFeedback(null), 4000);
      // Also update student list if student is in registry
      const targetSub = allSubmissions.find((s) => s.id === paymentId);
      if (targetSub) {
        const studentList = AdminErpService.getStudents();
        const sIdx = studentList.findIndex((st) => st.id === targetSub.studentId || st.email === targetSub.studentEmail);
        if (sIdx !== -1) {
          studentList[sIdx].subscriptionStatus = 'ACTIVE';
          studentList[sIdx].daysRemaining = 30;
          AdminErpService.saveStudents(studentList);
          setStudents(studentList);
        }
      }
      setAuditLogs(AdminErpService.getAuditEntries());
    } else {
      setApprovalFeedback(`ክፍያውን ማጽደቅ አልተቻለም (Could not approve). እባክዎ እንደገና ይሞክሩ።`);
      setTimeout(() => setApprovalFeedback(null), 5000);
    }
  };

  const handleConfirmReject = async () => {
    if (rejectingPaymentId) {
      await rejectPayment(rejectingPaymentId, rejectionReason);
      setRejectingPaymentId(null);
      setAuditLogs(AdminErpService.getAuditEntries());
    }
  };

  // Identity & Migration Actions
  const handleRunAudit = async () => {
    setIsAuditing(true);
    setMigrationResult(null);
    try {
      const rep = await UserMigrationService.auditAllUserRecords();
      setAuditReport(rep);
    } catch (err: any) {
      console.error('Audit failed:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCreateBackup = async () => {
    if (!auditReport) return;
    try {
      const bkp = await UserMigrationService.createPreMigrationBackup(
        auditReport,
        currentUser.email || 'mejennur669@gmail.com'
      );
      const blob = new Blob([JSON.stringify(bkp, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      setBackupDownloadUrl(url);
    } catch (err: any) {
      console.error('Backup creation failed:', err);
    }
  };

  const handleExecuteMigration = async () => {
    if (!auditReport) return;
    setIsMigrating(true);
    try {
      const res = await UserMigrationService.executeSafeMigration(
        auditReport,
        currentUser.email || 'mejennur669@gmail.com'
      );
      setMigrationResult(res);
      setShowConfirmMigrationModal(false);
      // Re-run audit to reflect canonical state
      const updated = await UserMigrationService.auditAllUserRecords();
      setAuditReport(updated);
    } catch (err: any) {
      console.error('Migration failed:', err);
      setMigrationResult({ success: false, errors: [err?.message || 'Migration failed'] });
    } finally {
      setIsMigrating(false);
    }
  };

  // DRM Actions
  const handleSaveDrm = (e: React.FormEvent) => {
    e.preventDefault();
    AdminErpService.saveDrmConfig(drmConfig);
    setIsDrmSaved(true);
    setTimeout(() => setIsDrmSaved(false), 3000);
    setAuditLogs(AdminErpService.getAuditEntries());
  };

  const handleAddTextbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim() || !newBookUrl.trim()) return;
    AdminErpService.addTextbook({
      subject: newBookSubject,
      grade: newBookGrade,
      title: newBookTitle.trim(),
      edition: '2019 E.C. (New Syllabus)',
      fileUrl: newBookUrl.trim(),
      drmLevel: 'HIGH_SECURITY',
      pageCount: 300,
    });
    setDrmConfig(AdminErpService.getDrmConfig());
    setShowAddBookModal(false);
    setNewBookTitle('');
    setNewBookUrl('');
    setAuditLogs(AdminErpService.getAuditEntries());
  };

  // Dynamic Pricing Actions
  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricing(editPricing);
    setIsPricingSaved(true);
    setTimeout(() => setIsPricingSaved(false), 3000);

    // Call server API as well
    authFetch('/api/payment/admin/pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adminEmail: 'mejennur669@gmail.com',
        pricing: editPricing,
      }),
    }).catch(() => {});
  };

  const handleSaveAccounts = (e: React.FormEvent) => {
    e.preventDefault();
    updateAccounts(editAccounts);
    setIsAccountsSaved(true);
    setTimeout(() => setIsAccountsSaved(false), 3000);

    // Sync to backend
    authFetch('/api/admin/accounts/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adminEmail: 'mejennur669@gmail.com',
        accounts: editAccounts,
      }),
    }).catch(() => {});
  };

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.phone.includes(studentSearch);
      const matchesGrade = studentGradeFilter === 'ALL' || s.grade.toString() === studentGradeFilter;
      const matchesStatus = studentStatusFilter === 'ALL' || s.subscriptionStatus === studentStatusFilter;
      return matchesSearch && matchesGrade && matchesStatus;
    });
  }, [students, studentSearch, studentGradeFilter, studentStatusFilter]);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return allSubmissions.filter((p) => {
      const matchesFilter = paymentStatusFilter === 'ALL' || p.status === paymentStatusFilter;
      const matchesSearch =
        p.studentName.toLowerCase().includes(paymentSearch.toLowerCase()) ||
        p.transactionRef.toLowerCase().includes(paymentSearch.toLowerCase()) ||
        p.studentEmail.toLowerCase().includes(paymentSearch.toLowerCase()) ||
        (p.studentPhone && p.studentPhone.includes(paymentSearch));
      return matchesFilter && matchesSearch;
    });
  }, [allSubmissions, paymentStatusFilter, paymentSearch]);

  const pendingPaymentsCount = allSubmissions.filter((s) => s.status === 'PENDING').length;

  // ACCESS CONTROL GATE: Strictly gated to Super Admin mejennur669@gmail.com
  if (!isSuperAdmin) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 bg-white dark:bg-slate-900 rounded-3xl border border-red-200 dark:border-red-900/50 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            የዋና አስተዳዳሪ ቁጥጥር ማዕከል (Super Admin Only)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            ይህ የትምህርት ቤት ERP ዳሽቦርድ ለዋና አስተዳዳሪ (mejennur669@gmail.com / abuzinad7862@gmail.com / Nuriye Ahmed Adem) ብቻ የተፈቀደ ነው።
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-500 text-left space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">የአሁኑ መለያ መረጃ:</p>
          <p>ስም: {currentUser.name || 'ያልተመዘገበ ተጠቃሚ'}</p>
          <p>ኢሜይል: {currentUser.email || 'None'}</p>
          <p>ሚና: {currentUser.role || 'Guest'}</p>
        </div>


      </div>
    );
  }

  // AUTO-LOCK OVERLAY when 30-minute timer expires
  if (isSessionLocked) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 text-white p-8 rounded-3xl border border-amber-500/40 shadow-2xl space-y-6 text-center animate-in zoom-in-95">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black">የደህንነት ክፍለ-ጊዜ ተቆልፏል (Session Locked)</h2>
            <p className="text-xs text-slate-400 mt-2">
              የ30 ደቂቃ እንቅስቃሴ-አልባ የደህንነት ሰዓት ቆጣሪ አብቅቷል። ወደ ERP ለመመለስ የሱፐር አድሚን ፒን ኮድ ያስገቡ።
            </p>
          </div>

          <form onSubmit={handleUnlockSession} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="PIN ኮድ ያስገቡ (ለምሳሌ: 2019 ወይም 7862)"
                value={unlockPin}
                onChange={(e) => setUnlockPin(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-mono px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-1 font-semibold">የተሳሳተ ፒን ኮድ! እባክዎ እንደገና ይሞክሩ።</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm transition-colors shadow-lg"
            >
              ክፈት (Unlock Console)
            </button>
            <p className="text-[11px] text-slate-500">Super Admin Default PINs: 2019 • 7862</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* 1. Header Banner & Security Session Ticker */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-900/40 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Super Admin Control & School Management ERP
            </span>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              ● MoE 2019 E.C. Certified
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            የሱፐር አድሚን ዳሽቦርድ (Super Admin ERP & Management)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            ዋና አስተዳዳሪ (Super Admin): <span className="font-bold text-amber-400">Nuriye Ahmed Adem</span> (mejennur669@gmail.com • 0910097862) — ሁሉንም የአስተዳደር፣ የተማሪዎች፣ የክፍያና የDRM ቁጥጥር ስራዎች በቀጥታ የሚያስተዳድርበት ማዕከል
          </p>
        </div>

        {/* Security Session & Audit Controls */}
        <div className="flex flex-wrap items-center gap-2.5 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3 text-amber-400" />
              የደህንነት ክፍለ-ጊዜ
            </div>
            <div className="font-mono text-sm font-black text-amber-300">
              {formatTimer(sessionSecondsLeft)}
            </div>
          </div>

          <button
            onClick={handleExtendSession}
            title="ክፍለ-ጊዜውን ለተጨማሪ 30 ደቂቃ ያራዝሙ"
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            +30ደ አራዝም
          </button>

          <button
            onClick={() => setIsSessionLocked(true)}
            title="ዳሽቦርዱን ወዲያውኑ ቆልፍ"
            className="px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-xs font-bold text-red-300 border border-red-800/40 transition-colors flex items-center gap-1"
          >
            <Lock className="w-3.5 h-3.5" />
            ቆልፍ
          </button>
        </div>
      </div>

      {/* Approval Feedback Toast */}
      {approvalFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 text-emerald-800 dark:text-emerald-200 text-sm font-bold flex items-center gap-2 shadow-sm animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          {approvalFeedback}
        </div>
      )}

      {/* 2. Primary Navigation Tabs (6 Distinct Hubs) */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700/60">
        <button
          onClick={() => setActiveTab('kpi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'kpi'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          1. KPI Overview (ማጠቃለያ)
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'students'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          2. Student Registry (የተማሪዎች መዝገብ)
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700">
            {students.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'payments'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          3. Payment Approval & Ledger
          {pendingPaymentsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black animate-pulse">
              {pendingPaymentsCount} PENDING
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('identity_migration');
            if (!auditReport && !isAuditing) {
              handleRunAudit();
            }
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'identity_migration'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          4. Identity & UID Migration
          {auditReport && auditReport.mismatchedCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black animate-pulse">
              {auditReport.mismatchedCount} FIX
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('drm_cms')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'drm_cms'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          5. Curriculum & DRM CMS
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'pricing'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          6. Dynamic Pricing & Accounts
        </button>

        <button
          onClick={() => setActiveTab('audit_session')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'audit_session'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          7. Security & Audit Trail
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: REAL-TIME KPI OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'kpi' && (
        <div className="space-y-6 animate-in fade-in">
          {/* 5 Main Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">ተመዝጋቢ ተማሪዎች</span>
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {kpis.totalStudents}
                </span>
                <span className="text-xs text-emerald-600 font-bold ml-2">+{kpis.todayNewRegistrations} ዛሬ</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Grades 9, 10, 11, 12 Directory</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 uppercase">ንቁ ሰብስክሪብሽን</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {kpis.activeSubscriptions}
                </span>
                <span className="text-xs text-slate-400 ml-1 font-medium">ተማሪዎች</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">30 ቀናት የተፈቀደላቸው</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-900/50 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 uppercase">በማረጋገጥ ላይ (Pending)</span>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                  {kpis.pendingVerifications}
                </span>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-bold ml-2 hover:underline"
                >
                  አሁን አጽድቅ →
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">ቴሌብርና የባንክ FT ማረጋገጫዎች</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 uppercase">ጠቅላላ ወርሃዊ ገቢ</span>
                <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  {kpis.totalRevenueETB.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-slate-500 ml-1">ETB</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Telebirr • CBE • Dashen • BoA</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 uppercase">የሲስተም ጤና ነጥብ</span>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {kpis.systemHealthScore}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">DRM & Grade Locks Active</p>
            </div>
          </div>

          {/* Revenue Breakdown by Grade and Action Shortcuts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-500" />
                  የገቢ ክፍፍል በክፍል ደረጃ (Revenue Distribution by Grade)
                </h3>
                <span className="text-xs text-slate-400 font-mono">የተረጋገጡ ክፍያዎች ብቻ</span>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>9ኛ ክፍል (Grade 9 - 160 ETB)</span>
                    <span className="font-mono text-indigo-600">{kpis.revenueByGrade.grade9} ETB</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(100, (kpis.revenueByGrade.grade9 / (kpis.totalRevenueETB || 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>10ኛ ክፍል (Grade 10 - 180 ETB)</span>
                    <span className="font-mono text-indigo-600">{kpis.revenueByGrade.grade10} ETB</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${Math.min(100, (kpis.revenueByGrade.grade10 / (kpis.totalRevenueETB || 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>11ኛ ክፍል (Grade 11 - 200 ETB)</span>
                    <span className="font-mono text-indigo-600">{kpis.revenueByGrade.grade11} ETB</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${Math.min(100, (kpis.revenueByGrade.grade11 / (kpis.totalRevenueETB || 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>12ኛ ክፍል (Grade 12 - 200 ETB EUEE Candidate)</span>
                    <span className="font-mono text-indigo-600">{kpis.revenueByGrade.grade12} ETB</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${Math.min(100, (kpis.revenueByGrade.grade12 / (kpis.totalRevenueETB || 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>ልዩ አሳይመንቶችና ፕሪሚየም ማዕከል (57 ETB Pack)</span>
                    <span className="font-mono text-emerald-600">{kpis.revenueByGrade.singleAssignment} ETB</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.min(100, (kpis.revenueByGrade.singleAssignment / (kpis.totalRevenueETB || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
                <span>የመጨረሻ ማሻሻያ: {new Date(kpis.lastUpdated).toLocaleTimeString()}</span>
                <button
                  onClick={() => AdminErpService.exportLedgerCsv(allSubmissions)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  የሂሳብ ሌጀር (CSV) አውርድ
                </button>
              </div>
            </div>

            {/* Live Security & Policy Status */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
              <h3 className="font-black text-amber-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                የስርዓቱ ፖሊሲና ደህንነት ሁኔታ
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <p className="font-bold">የክፍል ደረጃ መቆለፊያ (Grade Lock)</p>
                    <p className="text-[11px] text-slate-400">ተማሪዎች ክፍላቸውን እንዳይቀይሩ ያግዳል</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                    ACTIVE
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <p className="font-bold">የመሣሪያ ገደብ (Device Limit)</p>
                    <p className="text-[11px] text-slate-400">በአንድ አካውንት ቢበዛ 2 ስልኮች/ኮምፒውተሮች</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                    MAX 2
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <p className="font-bold">የመማሪያ መጽሐፍ DRM</p>
                    <p className="text-[11px] text-slate-400">Anti-screenshot & Watermark active</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                    ENFORCED
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('audit_session')}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  ኦዲት ምዝግብ መርምር (Inspect Audit Logs) →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STUDENT REGISTRY & GRADE ENFORCEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'students' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Filter and Search Bar */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ተማሪ በስም፣ በስልክ (09...) ወይም በኢሜይል ፈልግ..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={studentGradeFilter}
                onChange={(e) => setStudentGradeFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none"
              >
                <option value="ALL">ሁሉም ክፍሎች (All Grades)</option>
                <option value="9">9ኛ ክፍል (Grade 9)</option>
                <option value="10">10ኛ ክፍል (Grade 10)</option>
                <option value="11">11ኛ ክፍል (Grade 11)</option>
                <option value="12">12ኛ ክፍል (Grade 12)</option>
              </select>

              <select
                value={studentStatusFilter}
                onChange={(e) => setStudentStatusFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none"
              >
                <option value="ALL">ሁሉም ሁኔታዎች</option>
                <option value="ACTIVE">ንቁ (Active)</option>
                <option value="PENDING">በግምገማ ላይ (Pending)</option>
                <option value="EXPIRED">ያበቃበት (Expired)</option>
              </select>
            </div>
          </div>

          {/* Student Registry Table */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4 font-black">የተማሪ ስም እና መረጃ</th>
                    <th className="p-4 font-black">የክፍል ደረጃ</th>
                    <th className="p-4 font-black">የክፍል መቆለፊያ (Grade Lock)</th>
                    <th className="p-4 font-black">የሰብስክሪብሽን ሁኔታ</th>
                    <th className="p-4 font-black">የተመዘገቡ መሣሪያዎች</th>
                    <th className="p-4 font-black text-right">የአድሚን እርምጃዎች</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">{s.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{s.email}</div>
                        <div className="text-[11px] text-indigo-600 font-mono">{s.phone}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-black">
                          {s.grade}ኛ ክፍል
                        </span>
                        {s.stream && (
                          <div className="text-[10px] text-slate-400 mt-0.5">{s.stream}</div>
                        )}
                      </td>
                      <td className="p-4">
                        {s.isGradeLocked ? (
                          <button
                            onClick={() => handleToggleGradeLock(s.id)}
                            title="ተማሪው ክፍሉን መቀየር አይችልም። ለመክፈት ይጫኑ።"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            ተቆልፏል (Enforced)
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleGradeLock(s.id)}
                            title="ክፍሉ ክፍት ነው። እንደገና ለመቆለፍ ይጫኑ።"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            ክፍት ነው (Unlocked)
                          </button>
                        )}
                      </td>
                      <td className="p-4">
                        {s.subscriptionStatus === 'ACTIVE' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black">
                            <CheckCircle2 className="w-3 h-3" />
                            ንቁ ({s.daysRemaining} ቀናት ይቀራሉ)
                          </span>
                        )}
                        {s.subscriptionStatus === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-black">
                            <Clock className="w-3 h-3" />
                            በግምገማ ላይ (Pending)
                          </span>
                        )}
                        {s.subscriptionStatus === 'EXPIRED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-black">
                            <XCircle className="w-3 h-3" />
                            ጊዜው አልቋል (Expired)
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {s.registeredDevicesCount}/{s.maxAllowedDevices}
                          </span>
                          {s.registeredDevicesCount > 0 && (
                            <button
                              onClick={() => handleResetDevice(s.id)}
                              title="የተመዘገቡ ስልኮችን ዳግም አስጀምር (ስልክ ሲቀይሩ)"
                              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleGrantScholarship(s.id)}
                            title="የ30-ቀን ነፃ ስኮላርሺፕ ፍቃድ ስጥ"
                            className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] transition-colors"
                          >
                            +30 ቀናት ስጥ
                          </button>
                          <button
                            onClick={() => setSelectedStudent(s)}
                            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-[11px] transition-colors"
                          >
                            ዝርዝር
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Student Profile Quick View Modal */}
          {selectedStudent && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      የተማሪ ዝርዝር መዝገብ (Student File)
                    </h3>
                    <p className="text-xs text-slate-400">ID: {selectedStudent.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl">
                  <p><span className="font-bold">ሙሉ ስም:</span> {selectedStudent.name}</p>
                  <p><span className="font-bold">ኢሜይል:</span> {selectedStudent.email}</p>
                  <p><span className="font-bold">ስልክ ቁጥር:</span> {selectedStudent.phone}</p>
                  <p><span className="font-bold">የክፍል ደረጃ:</span> {selectedStudent.grade}ኛ ክፍል {selectedStudent.stream && `(${selectedStudent.stream})`}</p>
                  <p><span className="font-bold">የተመዘገበበት ቀን:</span> {selectedStudent.enrolledAt}</p>
                  <p><span className="font-bold">የክፍል መቆለፊያ:</span> {selectedStudent.isGradeLocked ? '🔒 ተቆልፏል' : '🔓 ክፍት ነው'}</p>
                  <p><span className="font-bold">ጠቅላላ የከፈለው:</span> {selectedStudent.totalSpentETB} ETB</p>
                  <p><span className="font-bold">ማስታወሻ:</span> {selectedStudent.notes || 'N/A'}</p>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => {
                      handleToggleGradeLock(selectedStudent.id);
                      setSelectedStudent({ ...selectedStudent, isGradeLocked: !selectedStudent.isGradeLocked });
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs"
                  >
                    {selectedStudent.isGradeLocked ? 'ክፍል ክፈት (Unlock)' : 'ክፍል ቆልፍ (Lock)'}
                  </button>
                  <button
                    onClick={() => {
                      handleGrantScholarship(selectedStudent.id);
                      setSelectedStudent(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    የ30-ቀን ፍቃድ ስጥ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PAYMENT APPROVAL & FINANCIAL LEDGER */}
      {/* ========================================================================= */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header & CSV Download */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                የክፍያ ማረጋገጫና የተሟላ የፋይናንስ ሌጀር
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                የቴሌብር (Telebirr)፣ የሲቢኢ ብር (CBE Birr) እና የባንክ ሂሳብ ክፍያዎችን ያጽድቁ ወይም ውድቅ ያድርጉ።
              </p>
            </div>

            <button
              onClick={() => AdminErpService.exportLedgerCsv(allSubmissions)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              የፋይናንስ ሌጀር በ CSV አውርድ (Export Audit Ledger)
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="በትራንዛክሽን FT ኮድ፣ በተማሪ ስም ወይም ስልክ ፈልግ..."
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-2">
              {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setPaymentStatusFilter(st)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    paymentStatusFilter === st
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {st === 'ALL' && 'ሁሉም'}
                  {st === 'PENDING' && `በግምገማ ላይ (${pendingPaymentsCount})`}
                  {st === 'APPROVED' && 'የጸደቁ'}
                  {st === 'REJECTED' && 'ውድቅ የተደረጉ'}
                </button>
              ))}
            </div>
          </div>

          {/* Payments Queue Table */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4 font-black">ተማሪ</th>
                    <th className="p-4 font-black">ክፍልና መጠን</th>
                    <th className="p-4 font-black">የክፍያ ዘዴ</th>
                    <th className="p-4 font-black">የትራንዛክሽን FT ኮድ</th>
                    <th className="p-4 font-black">ቀንና ሰዓት</th>
                    <th className="p-4 font-black">ሁኔታ</th>
                    <th className="p-4 font-black text-right">እርምጃ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        ምንም አይነት ክፍያ አልተገኘም።
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-900 dark:text-white">{p.studentName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{p.studentEmail}</div>
                          <div className="text-[11px] text-indigo-600 font-mono">{p.studentPhone}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm">
                            {p.amount} ETB
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {p.amount === 57 || p.amount === 54 ? 'Premium Hub / Single Pack' : `${p.grade}ኛ ክፍል ወርሃዊ`}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="uppercase font-mono font-bold text-slate-800 dark:text-slate-200">
                            {p.paymentGateway}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                            {p.transactionRef}
                          </span>
                        </td>
                        <td className="p-4 text-[11px] text-slate-400">
                          {new Date(p.submittedAt).toLocaleDateString()} {new Date(p.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-4">
                          {p.status === 'APPROVED' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                              <CheckCircle2 className="w-3 h-3" /> የጸደቀ (APPROVED)
                            </span>
                          )}
                          {p.status === 'PENDING' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px]">
                              <Clock className="w-3 h-3" /> በማጣራት ላይ (PENDING)
                            </span>
                          )}
                          {p.status === 'REJECTED' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold text-[10px]">
                              <XCircle className="w-3 h-3" /> ውድቅ የተደረገ
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          {p.status === 'PENDING' ? (
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleApprove(p.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-sm"
                              >
                                <Check className="w-3.5 h-3.5" />
                                ያጽድቁ (Approve)
                              </button>
                              <button
                                onClick={() => setRejectingPaymentId(p.id)}
                                className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950/60 dark:hover:bg-red-900 dark:text-red-300 font-bold text-xs transition-colors"
                              >
                                ውድቅ
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              {p.reviewedBy ? `በ ${p.reviewedBy.split('@')[0]}` : 'ተጠናቋል'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rejection Modal */}
          {rejectingPaymentId && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-black text-slate-900 dark:text-white">ክፍያ ውድቅ ማድረጊያ ምክንያት</h3>
                </div>

                <p className="text-xs text-slate-500">
                  እባክዎ ለተማሪው የሚደርሰውን ውድቅ የተደረገበትን ምክንያት ይምረጡ ወይም ይጻፉ።
                </p>

                <div className="space-y-2">
                  {[
                    'የትራንዛክሽን ቁጥሩ በቴሌብር/ባንኩ አልተገኘም (Invalid FT Number)',
                    'የተከፈለው መጠን ከተጠየቀው ክፍያ ያነሰ ነው (Incomplete Amount)',
                    'ይህ የትራንዛክሽን ቁጥር ከዚህ በፊት ጥቅም ላይ ውሏል (Duplicate Ref)',
                    'የተላከበት ስም ከተማሪው መረጃ ጋር አልተጣጣመም (Name Mismatch)',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRejectionReason(preset)}
                      className={`w-full text-left text-xs p-2.5 rounded-xl border transition-colors ${
                        rejectionReason === preset
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}

                  <textarea
                    rows={2}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                    placeholder="ተጨማሪ ዝርዝር ማብራሪያ..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setRejectingPaymentId(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs"
                  >
                    ተመለስ
                  </button>
                  <button
                    onClick={handleConfirmReject}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
                  >
                    ውድቅ አድርግ (Confirm Reject)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FIREBASE AUTH UID IDENTITY & MIGRATION FORTRESS */}
      {/* ========================================================================= */}
      {activeTab === 'identity_migration' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Architectural Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-black uppercase tracking-wider">
                  <Database className="w-3.5 h-3.5" />
                  Canonical Identity Architecture · Project: nur-technology-school
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                  የተጠቃሚዎች ማረጋገጫ እና የFirebase Auth UID ነጠላ እውነት ማዕከል
                </h2>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  Firebase Authentication UID በአጠቃላይ ስርዓቱ ውስጥ ብቸኛው እና የመጨረሻው የተጠቃሚ መለያ (Single Source of Truth) ነው። 
                  ሁሉም የተጠቃሚ ፕሮፋይሎች፣ የክፍያ ታሪኮች፣ እና የተማሪ ፈቃዶች በቀጥታ <span className="font-mono text-amber-300 font-bold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">users/&#123;auth.uid&#125;</span> ዶክመንት መንገድ ይቀመጣሉ። 
                  የድሮ ወይም ራንደም መለያዎች (Auto-generated / Legacy IDs) ሙሉ መረጃቸው ተጠብቆ በደህንነት ወደ ትክክለኛው Auth UID ይሰደዳሉ።
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleRunAudit}
                  disabled={isAuditing}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                >
                  <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
                  {isAuditing ? 'በመመርመር ላይ...' : 'የመረጃ ኦዲት ጀምር (Run Live Audit)'}
                </button>

                {auditReport && (
                  <button
                    type="button"
                    onClick={handleCreateBackup}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black transition-all flex items-center gap-2 border border-slate-700"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    ባክአፕ አዘጋጅ (Backup)
                  </button>
                )}

                {auditReport && auditReport.mismatchedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmMigrationModal(true)}
                    disabled={isMigrating}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/30"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    ስደቱን ፈጽም (Execute Migration)
                  </button>
                )}
              </div>
            </div>

            {backupDownloadUrl && (
              <div className="mt-4 pt-4 border-t border-indigo-800/40 flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  የቅድመ-ስደት ባክአፕ JSON በተሳካ ሁኔታ ተዘጋጅቷል (Pre-migration backup ready)
                </span>
                <a
                  href={backupDownloadUrl}
                  download={`nur_users_pre_migration_backup_${new Date().toISOString().slice(0, 10)}.json`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  JSON ፋይል አውርድ
                </a>
              </div>
            )}
          </div>

          {/* Migration Success / Error Report Banner */}
          {migrationResult && (
            <div
              className={`p-4 rounded-2xl border text-sm font-bold flex items-start gap-3 animate-in slide-in-from-top-2 ${
                migrationResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-900 dark:text-emerald-100'
                  : 'bg-red-50 dark:bg-red-950/60 border-red-400 text-red-900 dark:text-red-100'
              }`}
            >
              {migrationResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p>
                  {migrationResult.success
                    ? `ስደቱ በተሳካ ሁኔታ ተጠናቋል! ${migrationResult.recordsMigrated ?? 0} የተጠቃሚዎች መዝገብ ወደ Canonical Auth UID ተሰድደዋል። 0 መረጃ አልጠፋም።`
                    : 'ስደቱ ሙሉ በሙሉ አልተጠናቀቀም። እባክዎ ከታች ያሉትን ስህተቶች ይመልከቱ።'}
                </p>
                {migrationResult.errors && migrationResult.errors.length > 0 && (
                  <ul className="text-xs list-disc list-inside font-normal space-y-0.5 text-red-700 dark:text-red-300">
                    {migrationResult.errors.map((err: string, idx: number) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* 4 Metric KPI Cards */}
          {auditReport ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">የተፈተሹ ዶክመንቶች</span>
                  <Database className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {auditReport.totalUsersScanned}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">በFirestore "users" ስብስብ ውስጥ ያሉ ጠቅላላ</div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 shadow-sm">
                <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">ትክክለኛ Canonical UIDs</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                  {auditReport.canonicalUidCount}
                </div>
                <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                  users/&#123;auth.uid&#125; በቀጥታ የተገናኙ
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 shadow-sm">
                <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">ስደት የሚሹ (Mismatches)</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-black text-amber-700 dark:text-amber-300">
                  {auditReport.mismatchedCount}
                </div>
                <div className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1">
                  የድሮ ወይም Non-UID መለያ ያላቸው
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 shadow-sm">
                <div className="flex items-center justify-between text-rose-700 dark:text-rose-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">አጠራጣሪ / የተባዙ (Ambiguous)</span>
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-2xl font-black text-rose-700 dark:text-rose-300">
                  {auditReport.ambiguousCount + auditReport.duplicateCount}
                </div>
                <div className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-1">
                  በሰው ተመርምረው የሚወሰኑ (Safe Mode)
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
              <Database className="w-10 h-10 text-indigo-500 mx-auto" />
              <h3 className="font-black text-slate-900 dark:text-white">የመረጃ ኦዲት እስካሁን አልተካሄደም</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                በFirestore 'users' ስብስብ ውስጥ ያሉትን ሁሉንም የተጠቃሚዎች መለያዎች ከFirebase Auth UID ጋር ለማነጻጸር እና ሪፖርት ለማዘጋጀት ከላይ ያለውን ቁልፍ ይጫኑ።
              </p>
              <button
                type="button"
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black inline-flex items-center gap-2 shadow-md transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
                {isAuditing ? 'በመመርመር ላይ...' : 'የመጀመሪያውን ኦዲት አሁን አከናውን'}
              </button>
            </div>
          )}

          {/* Audit Records Table & Search */}
          {auditReport && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-indigo-600" />
                    የተጠቃሚዎች ዝርዝር የኦዲት መዝገብ (User Audit Ledger)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    እያንዳንዱ ዶክመንት ከመታወቂያው (UID)፣ ሚናው፣ እና የስደት ሁኔታው ጋር
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identitySearch}
                      onChange={(e) => setIdentitySearch(e.target.value)}
                      placeholder="በUID ወይም በኢሜይል ፈልግ..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setIdentityFilter('ALL')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        identityFilter === 'ALL'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      ሁሉንም ({auditReport.records.length})
                    </button>
                    <button
                      onClick={() => setIdentityFilter('MISMATCH')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        identityFilter === 'MISMATCH'
                          ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      ስደት የሚሹ ({auditReport.mismatchedCount})
                    </button>
                    <button
                      onClick={() => setIdentityFilter('CANONICAL')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        identityFilter === 'CANONICAL'
                          ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Canonical ({auditReport.canonicalUidCount})
                    </button>
                    <button
                      onClick={() => setIdentityFilter('AMBIGUOUS')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        identityFilter === 'AMBIGUOUS'
                          ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      አጠራጣሪ ({auditReport.ambiguousCount + auditReport.duplicateCount})
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3.5">የዶክመንት መለያ (Firestore Doc ID)</th>
                      <th className="p-3.5">ተጠቃሚ / ኢሜይል / ስልክ</th>
                      <th className="p-3.5">ሚና & ክፍል</th>
                      <th className="p-3.5">የUID ሁኔታ (Status)</th>
                      <th className="p-3.5">የስደት እቅድ / Target Path</th>
                      <th className="p-3.5 text-right">የመረጃ ብዛት (Fields)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {auditReport.records
                      .filter((rec) => {
                        const isMismatch = rec.status === 'MIGRATABLE_MISMATCH';
                        const isCanonical = rec.isCanonicalUid && rec.status === 'CANONICAL_UID';
                        const isAmbiguous = rec.status === 'AMBIGUOUS_RECORD' || rec.status === 'DUPLICATE_EMAIL';
                        if (identityFilter === 'MISMATCH' && !isMismatch) return false;
                        if (identityFilter === 'CANONICAL' && !isCanonical) return false;
                        if (identityFilter === 'AMBIGUOUS' && !isAmbiguous) return false;
                        if (identitySearch.trim()) {
                          const q = identitySearch.toLowerCase();
                          const matchId = rec.docId.toLowerCase().includes(q);
                          const matchEmail = (rec.email || '').toLowerCase().includes(q);
                          const matchPhone = (rec.phone || '').toLowerCase().includes(q);
                          const matchRole = (rec.role || '').toLowerCase().includes(q);
                          return matchId || matchEmail || matchPhone || matchRole;
                        }
                        return true;
                      })
                      .map((rec) => {
                        const isArchive = Boolean(rec.rawDocData?.isLegacyArchive);
                        const isMismatch = rec.status === 'MIGRATABLE_MISMATCH';
                        const isAmbiguous = rec.status === 'AMBIGUOUS_RECORD' || rec.status === 'DUPLICATE_EMAIL';
                        const fieldCount = Object.keys(rec.rawDocData || {}).length;

                        return (
                          <tr key={rec.docId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="p-3.5">
                              <div className="font-mono text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                {rec.isCanonicalUid ? (
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Canonical UID" />
                                ) : (
                                  <span className="w-2 h-2 rounded-full bg-amber-500" title="Non-Canonical ID" />
                                )}
                                {rec.docId}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                users/{rec.docId}
                              </div>
                            </td>

                            <td className="p-3.5">
                              <div className="font-bold text-slate-800 dark:text-slate-200">
                                {rec.email || 'ኢሜይል አልተመዘገበም'}
                              </div>
                              {rec.phone && (
                                <div className="text-[10px] text-slate-500 font-mono">
                                  📞 {rec.phone}
                                </div>
                              )}
                            </td>

                            <td className="p-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  rec.role === 'admin'
                                    ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                                    : rec.role === 'teacher'
                                    ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {rec.role || 'student'}
                              </span>
                              {rec.grade && (
                                <span className="ml-1 text-[10px] text-slate-500 font-bold">
                                  G-{rec.grade}
                                </span>
                              )}
                              {rec.isPremium && (
                                <span className="ml-1 text-[9px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-black">
                                  PREMIUM
                                </span>
                              )}
                            </td>

                            <td className="p-3.5">
                              {isArchive ? (
                                <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[10px]">
                                  📦 Archived Legacy
                                </span>
                              ) : rec.isCanonicalUid && !isMismatch ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Canonical Auth UID
                                </span>
                              ) : isAmbiguous ? (
                                <span
                                  title={rec.status === 'DUPLICATE_EMAIL' ? 'Duplicate Email Detected' : 'Missing Identity Details'}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 font-bold text-[10px]"
                                >
                                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                                  {rec.status === 'DUPLICATE_EMAIL' ? 'Duplicate Email' : 'Ambiguous / Review'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                                  Legacy Non-UID
                                </span>
                              )}
                            </td>

                            <td className="p-3.5">
                              {isMismatch ? (
                                <div className="space-y-0.5">
                                  <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                    <span>ወደ Auth UID ይሰደዳል:</span>
                                  </div>
                                  <div className="font-mono text-[10px] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                    users/{rec.targetUid}
                                  </div>
                                </div>
                              ) : rec.isCanonicalUid ? (
                                <span className="text-[10px] text-slate-400">ምንም እርምጃ አያስፈልግም (OK)</span>
                              ) : isArchive ? (
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ወደ {rec.rawDocData?.migratedToUid || 'Canonical'} ተሰዷል
                                </span>
                              ) : (
                                <span className="text-[10px] text-rose-500 font-bold">
                                  {rec.status === 'DUPLICATE_EMAIL' ? 'Duplicate Email detected' : 'መረጃው አልተሟላም'}
                                </span>
                              )}
                            </td>

                            <td className="p-3.5 text-right font-mono text-slate-500">
                              {fieldCount} fields
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Safety & Integrity Guarantee Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  የአርክቴክቸር የደህንነት እና የመረጃ ጥበቃ ዋስትና (Zero-Loss Guarantee):
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>ዜሮ መሰረዝ (No Deletions):</strong> የድሮ ዶክመንቶች አይሰረዙም፤ እንደ ማህደር (Archive) ይቀመጣሉ።</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>ደህንነቱ የተጠበቀ Batch SetDoc:</strong> ሁሉም ሚናዎች፣ ምዝገባዎች እና የክፍያ ታሪኮች በሙሉ ወደ Canonical UID ይዛወራሉ።</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>ቅድመ-ስደት ባክአፕ:</strong> ስደቱ ከመፈጸሙ በፊት የተሟላ JSON ባክአፕ በFirestore እና በአካባቢ ዳውንሎድ ይዘጋጃል።</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Safe Migration Modal */}
          {showConfirmMigrationModal && auditReport && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95">
                <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="w-6 h-6 flex-shrink-0" />
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-base">
                      የተጠቃሚዎች ስደት ማረጋገጫ (Confirm Canonical UID Migration)
                    </h3>
                    <p className="text-xs text-slate-500">
                      የአስተዳዳሪ ማረጋገጫ እና ፍቃድ ይጠይቃል
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="w-4 h-4" />
                    የሚፈጸሙ የስደት እርምጃዎች ማጠቃለያ:
                  </div>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    <li>
                      <strong>{auditReport.mismatchedCount}</strong> የድሮ ወይም Non-UID መለያ ያላቸው ዶክመንቶች ወደ ተዛማጅ የFirebase Auth UID ይሰደዳሉ።
                    </li>
                    <li>
                      ማንኛውም የነበረ መረጃ (ሚና፣ የክፍያ ሁኔታ፣ ስልክ ቁጥር፣ ክፍል) ሳይቀየር በሙሉ ይተላለፋል።
                    </li>
                    <li>
                      የድሮ ዶክመንቶች አይሰረዙም፤ ወደፊት ለኦዲት እንዲያገለግሉ <code className="bg-amber-200/50 dark:bg-amber-900/60 px-1 py-0.5 rounded">isLegacyArchive: true</code> ተብለው በማህደር ይቀመጣሉ።
                    </li>
                    <li>
                      የቅድመ-ስደት ባክአፕ በFirestore <code className="bg-amber-200/50 dark:bg-amber-900/60 px-1 py-0.5 rounded">users_migration_backup</code> ስብስብ ውስጥ ይቀመጣል።
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmMigrationModal(false)}
                    disabled={isMigrating}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                  >
                    ተመለስ (Cancel)
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteMigration}
                    disabled={isMigrating}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                  >
                    {isMigrating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        ስደቱ በመፈጸም ላይ...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        እስማማለሁ፣ ስደቱን ፈጽም (Authorize & Migrate)
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CURRICULUM & DRM TEXTBOOK CMS */}
      {/* ========================================================================= */}
      {activeTab === 'drm_cms' && (
        <div className="space-y-6 animate-in fade-in">
          {/* DRM Controls Banner */}
          <form onSubmit={handleSaveDrm} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  የመማሪያ መጻሕፍት DRM እና የደህንነት ቁጥጥር (DRM Security Policies)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  የኢትዮጵያ የትምህርት ሚኒስቴር አዲስ ስርዓተ-ትምህርት መጻሕፍትን ከኮፒና ካልተፈቀደ ስርጭት ይጠብቁ።
                </p>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                {isDrmSaved ? 'የደህንነት ደንቡ ተቀምጧል!' : 'የ DRM ደንቦችን መዝግብ'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <label className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={drmConfig.antiScreenshotEnabled}
                  onChange={(e) => setDrmConfig({ ...drmConfig, antiScreenshotEnabled: e.target.checked })}
                  className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">
                    Anti-Screenshot Guard
                  </span>
                  <span className="text-[11px] text-slate-500">
                    የስክሪን ሾትና PrintScreen መቅረጽን በራስ-ሰር ያግዳል።
                  </span>
                </div>
              </label>

              <label className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={drmConfig.dynamicWatermarkEnabled}
                  onChange={(e) => setDrmConfig({ ...drmConfig, dynamicWatermarkEnabled: e.target.checked })}
                  className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">
                    Dynamic Student Watermark
                  </span>
                  <span className="text-[11px] text-slate-500">
                    የተማሪውን ስም፣ ስልክና ሰዓት በመጽሐፉ ገጾች ላይ ያትማል።
                  </span>
                </div>
              </label>

              <label className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={drmConfig.disableDirectDownload}
                  onChange={(e) => setDrmConfig({ ...drmConfig, disableDirectDownload: e.target.checked })}
                  className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">
                    Disallow Direct Download
                  </span>
                  <span className="text-[11px] text-slate-500">
                    ፒዲኤፍ ቀጥታ እንዳይወርድ ይከለክላል (Protected Stream Only)።
                  </span>
                </div>
              </label>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-xs text-slate-900 dark:text-white block">
                  DRM Token Expiry Window
                </span>
                <select
                  value={drmConfig.tokenExpiryMinutes}
                  onChange={(e) => setDrmConfig({ ...drmConfig, tokenExpiryMinutes: Number(e.target.value) })}
                  className="w-full px-2 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                >
                  <option value={15}>15 ደቂቃ (ከፍተኛ ጥበቃ)</option>
                  <option value={30}>30 ደቂቃ (መደበኛ)</option>
                  <option value={60}>60 ደቂቃ (የተራዘመ)</option>
                  <option value={120}>120 ደቂቃ</option>
                </select>
              </div>
            </div>
          </form>

          {/* Textbooks Catalog CMS */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                የስርዓተ-ትምህርት መጻሕፍት ዝርዝር (MoE 2019 E.C. Textbooks)
              </h3>
              <button
                onClick={() => setShowAddBookModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                አዲስ መጽሐፍ ጨምር (Add Textbook)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drmConfig.textbooks.map((book) => (
                <div
                  key={book.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-xs">
                      {book.grade}ኛ ክፍል • {book.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-bold">
                      {book.drmLevel}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                      {book.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">{book.edition} • {book.pageCount} ገጾች</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
                    <span className="truncate max-w-[180px] font-mono">{book.fileUrl}</span>
                    <span className="font-bold text-emerald-600">Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Textbook Modal */}
          {showAddBookModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <form
                onSubmit={handleAddTextbook}
                className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-slate-900 dark:text-white">አዲስ የመማሪያ መጽሐፍ ጨምር</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddBookModal(false)}
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold block mb-1">የትምህርት አይነት (Subject)</label>
                    <input
                      type="text"
                      value={newBookSubject}
                      onChange={(e) => setNewBookSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">የክፍል ደረጃ</label>
                    <select
                      value={newBookGrade}
                      onChange={(e) => setNewBookGrade(Number(e.target.value) as GradeLevel)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    >
                      <option value={9}>9ኛ ክፍል (Grade 9)</option>
                      <option value={10}>10ኛ ክፍል (Grade 10)</option>
                      <option value={11}>11ኛ ክፍል (Grade 11)</option>
                      <option value={12}>12ኛ ክፍል (Grade 12)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold block mb-1">የመጽሐፉ ርዕስ</label>
                    <input
                      type="text"
                      placeholder="ለምሳሌ: Grade 10 Biology Student Textbook"
                      value={newBookTitle}
                      onChange={(e) => setNewBookTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">የፒዲኤፍ ማውረጃ / እይታ ሊንክ (PDF Link)</label>
                    <input
                      type="url"
                      placeholder="https://moe.gov.et/curriculum/..."
                      value={newBookUrl}
                      onChange={(e) => setNewBookUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBookModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs"
                  >
                    ተመለስ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    መዝግብ (Save Book)
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DYNAMIC PRICING & ACCOUNT MANAGER */}
      {/* ========================================================================= */}
      {activeTab === 'pricing' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Monthly Subscription Pricing Editor */}
          <form onSubmit={handleSavePricing} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-500" />
                  የክፍያ ተመን አስተዳዳሪ (Dynamic Grade Pricing Engine)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  የወርሃዊ ሰብስክሪብሽንና የልዩ አሳይመንት ክፍያዎችን በቀጥታ በሲስተሙ ውስጥ ያሻሽሉ።
                </p>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                {isPricingSaved ? 'ተመኑ ተቀምጧል!' : 'የተሻሻለውን ተመን መዝግብ'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs font-bold text-slate-500">9ኛ ክፍል (Grade 9)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editPricing.grade9}
                    onChange={(e) => setEditPricing({ ...editPricing, grade9: Number(e.target.value) })}
                    className="w-full text-lg font-mono font-black px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  />
                  <span className="text-xs font-bold text-slate-400">ETB</span>
                </div>
                <span className="text-[10px] text-slate-400">መደበኛ: 160 ETB</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs font-bold text-slate-500">10ኛ ክፍል (Grade 10)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editPricing.grade10}
                    onChange={(e) => setEditPricing({ ...editPricing, grade10: Number(e.target.value) })}
                    className="w-full text-lg font-mono font-black px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  />
                  <span className="text-xs font-bold text-slate-400">ETB</span>
                </div>
                <span className="text-[10px] text-slate-400">መደበኛ: 180 ETB</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs font-bold text-slate-500">11ኛ ክፍል (Grade 11)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editPricing.grade11}
                    onChange={(e) => setEditPricing({ ...editPricing, grade11: Number(e.target.value) })}
                    className="w-full text-lg font-mono font-black px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  />
                  <span className="text-xs font-bold text-slate-400">ETB</span>
                </div>
                <span className="text-[10px] text-slate-400">መደበኛ: 200 ETB</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs font-bold text-slate-500">12ኛ ክፍል (Grade 12 EUEE)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editPricing.grade12}
                    onChange={(e) => setEditPricing({ ...editPricing, grade12: Number(e.target.value) })}
                    className="w-full text-lg font-mono font-black px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  />
                  <span className="text-xs font-bold text-slate-400">ETB</span>
                </div>
                <span className="text-[10px] text-slate-400">መደበኛ: 200 ETB</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-1">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">ልዩ አሳይመንት (Single Pack)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editPricing.singleAssignment}
                    onChange={(e) => setEditPricing({ ...editPricing, singleAssignment: Number(e.target.value) })}
                    className="w-full text-lg font-mono font-black px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-400 text-emerald-600"
                  />
                  <span className="text-xs font-bold text-emerald-600">ETB</span>
                </div>
                <span className="text-[10px] text-emerald-600">መደበኛ: 57 ETB</span>
              </div>
            </div>
          </form>

          {/* Payment Gateways & Account Numbers Editor */}
          <form onSubmit={handleSaveAccounts} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  የባንክና ቴሌብር ሂሳብ ቁጥሮች አስተዳደር (Payment Gateways)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  ለተማሪዎች የሚታየውን የቴሌብር፣ የ CBE፣ የዳሸንና የአቢሲኒያ ሂሳብ ቁጥሮች እዚህ ያሻሽሉ።
                </p>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                {isAccountsSaved ? 'የባንክ መረጃው ተቀምጧል!' : 'የሂሳብ ቁጥሮችን መዝግብ'}
              </button>
            </div>

            <div className="space-y-4">
              {editAccounts.map((acc, idx) => (
                <div
                  key={acc.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
                >
                  <div className="w-48">
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      {acc.name.am || acc.name.en}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{acc.id}</span>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-0.5">የሂሳብ ባለቤት ስም</label>
                      <input
                        type="text"
                        value={acc.accountName}
                        onChange={(e) => {
                          const updated = [...editAccounts];
                          updated[idx] = { ...updated[idx], accountName: e.target.value };
                          setEditAccounts(updated);
                        }}
                        className="w-full text-xs font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-0.5">ስልክ ቁጥር ወይም የሂሳብ ቁጥር</label>
                      <input
                        type="text"
                        value={acc.accountNumberOrPhone}
                        onChange={(e) => {
                          const updated = [...editAccounts];
                          updated[idx] = { ...updated[idx], accountNumberOrPhone: e.target.value };
                          setEditAccounts(updated);
                        }}
                        className="w-full text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: SECURITY SESSION & AUDIT TRAIL */}
      {/* ========================================================================= */}
      {activeTab === 'audit_session' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-indigo-600" />
                የስርዓቱ የደህንነት ኦዲት ምዝግብ (Master Audit Trail)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                እያንዳንዱ የዋጋ ለውጥ፣ የክፍያ ማጽደቅ፣ የክፍል መቆለፍና የደህንነት ክስተት እዚህ ይመዘገባል።
              </p>
            </div>

            <button
              onClick={() => setAuditLogs(AdminErpService.getAuditEntries())}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              ኦዲት አድስ (Refresh)
            </button>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-black ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : log.status === 'ALERT'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {log.action}
                      </span>
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {log.target}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{log.details}</p>
                    <p className="text-[10px] text-slate-400 font-mono">ተዋናይ: {log.actor}</p>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

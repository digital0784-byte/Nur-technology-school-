import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DrmProtectedContainer } from '../common/DrmProtectedContainer';
import { AuditLog, DeviceSession, SecurityUser } from '../../types';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Lock,
  Unlock,
  Users,
  Smartphone,
  RefreshCw,
  Cpu,
  Activity,
  Download,
  Search,
  AlertCircle,
  Eye,
  Zap,
  FileText,
  CheckCircle2,
  XCircle,
  Sliders,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';

type FortressTab = 'rbac' | 'drm' | 'devices' | 'rate_limits' | 'audit_logs';

export const SecurityFortressView: React.FC = () => {
  const { currentUser, isSuperAdmin, activeGrade } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<FortressTab>('rbac');

  // RBAC Users State
  const [users, setUsers] = useState<SecurityUser[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<SecurityUser | null>(null);
  const [editRole, setEditRole] = useState<'super_admin' | 'admin' | 'teacher' | 'student'>('student');
  const [editGrade, setEditGrade] = useState<number>(10);
  const [editGradeLock, setEditGradeLock] = useState<boolean>(true);
  const [updatingUser, setUpdatingUser] = useState(false);
  const [userUpdateMessage, setUserUpdateMessage] = useState<string | null>(null);

  // DRM Studio Controls
  const [drmOpacity, setDrmOpacity] = useState<number>(0.15);
  const [drmAngle, setDrmAngle] = useState<number>(-28);
  const [drmDensity, setDrmDensity] = useState<'normal' | 'dense' | 'light'>('normal');
  const [enableBlurGuard, setEnableBlurGuard] = useState<boolean>(true);
  const [drmTestMessage, setDrmTestMessage] = useState<string | null>(null);

  // Device Sessions State
  const [deviceSessions, setDeviceSessions] = useState<DeviceSession[]>([]);
  const [deviceFilter, setDeviceFilter] = useState<'ALL' | 'ACTIVE' | 'FLAGGED_CONCURRENT' | 'REVOKED'>('ALL');
  const [deviceActionMsg, setDeviceActionMsg] = useState<string | null>(null);

  // Rate Limiting State
  const [rateLimitData, setRateLimitData] = useState<any>(null);
  const [simulatingRateLimit, setSimulatingRateLimit] = useState(false);
  const [rateLimitSimResult, setRateLimitSimResult] = useState<string | null>(null);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [resultFilter, setResultFilter] = useState('ALL');
  const [searchLogText, setSearchLogText] = useState('');

  // Fetch RBAC users
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/security/users');
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch security users:', err);
    }
  };

  // Fetch device sessions
  const fetchDevices = async () => {
    try {
      const res = await fetch('/api/security/devices');
      const data = await res.json();
      if (data.success && data.activeSessions) {
        setDeviceSessions(data.activeSessions);
      }
    } catch (err) {
      console.error('Failed to fetch devices:', err);
    }
  };

  // Fetch rate limits
  const fetchRateLimits = async () => {
    try {
      const res = await fetch('/api/security/rate-limits');
      const data = await res.json();
      if (data.success) {
        setRateLimitData(data);
      }
    } catch (err) {
      console.error('Failed to fetch rate limits:', err);
    }
  };

  // Fetch audit logs
  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const params = new URLSearchParams();
      if (actionFilter !== 'ALL') params.set('action', actionFilter);
      if (roleFilter !== 'ALL') params.set('actorRole', roleFilter);
      if (resultFilter !== 'ALL') params.set('result', resultFilter);

      const res = await fetch(`/api/security/audit-logs?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.logs) {
        setAuditLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Initial Load & polling refresh
  useEffect(() => {
    fetchUsers();
    fetchDevices();
    fetchRateLimits();
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    fetchAuditLogs();
  }, [actionFilter, roleFilter, resultFilter]);

  // Handle User Role / Grade Lock Update
  const handleUpdateUserRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;

    setUpdatingUser(true);
    setUserUpdateMessage(null);
    try {
      const res = await fetch('/api/security/users/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserForEdit.id,
          newRole: editRole,
          targetGrade: editGrade,
          isGradeLocked: editGradeLock,
          actorEmail: currentUser.email || 'mejennur669@gmail.com',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUserUpdateMessage(data.message);
        fetchUsers();
        fetchAuditLogs();
        setTimeout(() => {
          setSelectedUserForEdit(null);
          setUserUpdateMessage(null);
        }, 1800);
      } else {
        setUserUpdateMessage(`ስህተት፡ ${data.message || data.error}`);
      }
    } catch (err: any) {
      setUserUpdateMessage(`ስህተት፡ ${err?.message || 'Update failed'}`);
    } finally {
      setUpdatingUser(false);
    }
  };

  // Handle Revoke Device Session
  const handleRevokeDevice = async (deviceId: string) => {
    setDeviceActionMsg(null);
    try {
      const res = await fetch('/api/security/devices/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          revokedBy: currentUser.email || 'mejennur669@gmail.com',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDeviceActionMsg(`መሣሪያ ${deviceId} ተሰርዟል። (Device revoked successfully)`);
        fetchDevices();
        fetchAuditLogs();
        setTimeout(() => setDeviceActionMsg(null), 3000);
      }
    } catch (err) {
      setDeviceActionMsg('መሣሪያውን መሰረዝ አልተቻለም');
    }
  };

  // Handle Trust Device Session
  const handleTrustDevice = async (deviceId: string) => {
    try {
      const res = await fetch('/api/security/devices/trust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDevices();
      }
    } catch (err) {}
  };

  // Handle Simulate Rate Limit Burst
  const handleSimulateRateLimit = async () => {
    setSimulatingRateLimit(true);
    setRateLimitSimResult(null);
    try {
      const res = await fetch('/api/security/rate-limits/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientIp: '197.156.104.99',
          simulatedRequests: 68,
        }),
      });
      const data = await res.json();
      setRateLimitSimResult(data.message);
      fetchRateLimits();
      fetchAuditLogs();
    } catch (err: any) {
      setRateLimitSimResult(`Simulate error: ${err?.message}`);
    } finally {
      setSimulatingRateLimit(false);
    }
  };

  // Handle Unblock IP
  const handleUnblockIp = async (ip: string) => {
    try {
      await fetch('/api/security/rate-limits/unblock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientIp: ip }),
      });
      fetchRateLimits();
    } catch (err) {}
  };

  // Export Audit Logs as JSON
  const handleExportJson = () => {
    const jsonStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(auditLogs, null, 2))}`;
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', jsonStr);
    dlAnchor.setAttribute('download', `MoE_Audit_Trail_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchor.click();
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = userSearch.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    });
  }, [users, userSearch]);

  // Filtered devices
  const filteredDevices = useMemo(() => {
    if (deviceFilter === 'ALL') return deviceSessions;
    return deviceSessions.filter((d) => d.status === deviceFilter);
  }, [deviceSessions, deviceFilter]);

  // Filtered audit logs
  const displayAuditLogs = useMemo(() => {
    if (!searchLogText.trim()) return auditLogs;
    const q = searchLogText.toLowerCase();
    return auditLogs.filter(
      (l) =>
        l.logId.toLowerCase().includes(q) ||
        l.actorId.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.resourceId.toLowerCase().includes(q) ||
        (l.details && l.details.toLowerCase().includes(q))
    );
  }, [auditLogs, searchLogText]);

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto pb-12">
      {/* 1. Command Header Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Shield className="w-64 h-64 text-indigo-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              <span>የደህንነት ምሽግ እና ፍቃዶች • Security Fortress & RBAC Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              የደህንነት ምሽግና የባለብዙ ደረጃ ፍቃዶች ማዕከል
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              የኢትዮጵያ አዲሱ ስርአተ-ትምህርት (Grades 9-12) የባለብዙ ደረጃ ፈቃዶች (Multi-Tier RBAC)፣ የዲአርኤም ሚዲያ ጋሻ፣ የመሳሪያዎች መዝገብ እና የማይደለዝ የኦዲት መዝገብ።
            </p>
          </div>

          {/* Super Admin Status Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur border border-amber-500/40 text-amber-200 space-y-1.5 shadow-lg min-w-[280px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                የዋና አስተዳዳሪ ፈቃድ (Root Authority)
              </span>
              <Unlock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-bold text-sm text-white">Nuriye Ahmed Adem</div>
            <div className="font-mono text-xs text-amber-300">mejennur669@gmail.com</div>
            <div className="text-[10px] text-amber-300/80 pt-1 border-t border-amber-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Lifetime Root Access • Unrestricted Entitlements</span>
            </div>
          </div>
        </div>

        {/* Live System Pillars Micro-Badges */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="font-bold text-slate-200">Rate Limiter</div>
              <div className="text-[10px] text-slate-400 font-mono">60 req/min per IP</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="font-bold text-slate-200">DRM Media Shield</div>
              <div className="text-[10px] text-slate-400 font-mono">Floating Watermark</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="font-bold text-slate-200">Device Integrity</div>
              <div className="text-[10px] text-slate-400 font-mono">Concurrent Detection</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <div>
              <div className="font-bold text-slate-200">Audit Trail</div>
              <div className="text-[10px] text-slate-400 font-mono">Append-Only Store</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hub Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('rbac')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'rbac'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>1. ባለብዙ ደረጃ ፈቃዶች (Multi-Tier RBAC)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('drm')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'drm'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>2. DRM ሚዲያና ጽሑፍ ጋሻ (DRM Shield)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('devices')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'devices'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>3. የመሳሪያዎች መዝገብ (Device Guard)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rate_limits')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'rate_limits'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>4. የፍጥነት ገደብ (Rate Limiter)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit_logs')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'audit_logs'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>5. የማይደለዝ የኦዲት መዝገብ (Audit Trail)</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: MULTI-TIER RBAC ARCHITECTURE                            */}
      {/* ============================================================== */}
      {activeTab === 'rbac' && (
        <div className="space-y-6 animate-in fade-in">
          {/* 4 Role Tier Specification Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* SUPER_ADMIN */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-900/30 to-amber-950/70 border border-amber-600/40 text-slate-800 dark:text-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-[11px] uppercase tracking-wider">
                  Tier 1 • ROOT
                </span>
                <Unlock className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">SUPER_ADMIN</h3>
                <p className="text-[11px] text-amber-700 dark:text-amber-200/90 font-mono">
                  mejennur669@gmail.com
                </p>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li>ያለ ምንም ገደብ የሁሉንም ክፍሎች (9-12) መማሪያ መክፈት</li>
                <li>የክፍያ ማረጋገጫዎች፣ የገንዘብ ተመኖችና የባንክ ሂሳቦች ማስተዳደር</li>
                <li>የተማሪዎችን የክፍል መቆለፊያ (Grade Lock) መሻር</li>
                <li>የDRM ቁልፎችና የኦዲት መዝገቦችን ሙሉ በሙሉ መቆጣጠር</li>
              </ul>
            </div>

            {/* ADMIN */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold text-[11px] uppercase tracking-wider">
                  Tier 2 • ADMIN
                </span>
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">ADMIN</h3>
                <p className="text-[11px] text-slate-500 font-semibold">ትምህርት ቤት አስተዳዳሪ</p>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
                <li>የተማሪዎች ምዝገባ እና ዳታቤዝ ክትትል</li>
                <li>የክፍያ ደረሰኞች ማረጋገጫ (Payment Approval)</li>
                <li>የትምህርት ሚኒስቴር ይፋዊ የመማሪያ መጽሐፍት CMS</li>
                <li>የተማሪዎች መታወቂያ እና የመሳሪያ ቁጥጥር</li>
              </ul>
            </div>

            {/* SYSTEM AI TEACHER (ራሱ ሲስተሙ) */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px] uppercase tracking-wider">
                  Tier 3 • AI TEACHER
                </span>
                <Cpu className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">ራሱ ሲስተሙ (AI Teacher)</h3>
                <p className="text-[11px] text-slate-500 font-semibold">NUR AI Autonomous Teacher</p>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
                <li>ራሱ ሲስተሙ እንደ መምህር ሆኖ የቤት ስራና አሳይመንት ያመነጫል</li>
                <li>የተማሪዎችን ስራዎች በRubric እና በቀመር በራስ-ሰር ያርማል</li>
                <li>ደረጃ በደረጃ ፔዳጎጂካል ፍንጮችን (3-Level Hint Scaffolding) ይሰጣል</li>
                <li>የተለየ Teacher Board ሳያስፈልግ 24/7 ራሱ ያስተምራል</li>
              </ul>
            </div>

            {/* STUDENT */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-extrabold text-[11px] uppercase tracking-wider">
                  Tier 4 • STUDENT
                </span>
                <Lock className="w-4 h-4 text-rose-500" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">STUDENT</h3>
                <p className="text-[11px] text-slate-500 font-semibold">የተመዘገበ ተማሪ (Strict Lock)</p>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
                <li>ከተመዘገበበት የክፍል ደረጃ (9-12) መውጣት በጥብቅ የተከለከለ ነው</li>
                <li>የፈቀደውን ወርሃዊ ወይም ነጠላ ክፍያ ይዘት ብቻ መክፈት</li>
                <li>DRM የውሃ ማህተም ያለበት የመማሪያ መጽሐፍ ማንበብ</li>
                <li>የግል የፈተና ውጤትና የቤት ስራ ማየት</li>
              </ul>
            </div>
          </div>

          {/* Interactive Permission Matrix */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  የፈቃዶች ማትሪክስ (RBAC Permission Matrix)
                </h3>
                <p className="text-xs text-slate-500">
                  በተጠቃሚ ደረጃዎች እና በራሱ ሲስተሙ (AI Teacher) መካከል ያሉ የስርዓት ፈቃዶች ንጽጽር
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                FDRE MoE Security Standard v2.6
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">የስርዓት ፈቃድ (System Capability)</th>
                    <th className="p-3 text-center">SUPER_ADMIN</th>
                    <th className="p-3 text-center">ADMIN</th>
                    <th className="p-3 text-center">ራሱ ሲስተሙ (AI Teacher)</th>
                    <th className="p-3 text-center">STUDENT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    { cap: 'ሙሉ የክፍሎች (9-12) ነፃ መዳረሻ (All-Grade Access)', sa: true, ad: false, tc: false, st: false },
                    { cap: 'የክፍል ደረጃን በራስ ፍቃድ መቀየር (Grade Switching)', sa: true, ad: false, tc: false, st: false },
                    { cap: 'የተማሪዎችን የክፍል መቆለፊያ መሻር (Override Grade Lock)', sa: true, ad: true, tc: false, st: false },
                    { cap: 'የክፍያ ማረጋገጫና ፍቃድ መስጠት (Payment Verification)', sa: true, ad: true, tc: false, st: false },
                    { cap: 'የወርሃዊ ዋጋ ተመንና የባንክ ሂሳቦች ማስተካከል (Pricing/Accounts)', sa: true, ad: false, tc: false, st: false },
                    { cap: 'የቤት ስራና አሳይመንት መፍጠር (Create Assignments)', sa: true, ad: true, tc: true, st: false },
                    { cap: 'የተማሪዎች አሳይመንት ማረምና ውጤት መስጠት (Grade Submissions)', sa: true, ad: true, tc: true, st: false },
                    { cap: 'የመማሪያ መጽሐፍት ማውጫ ማስተዳደር (Textbook CMS)', sa: true, ad: true, tc: false, st: false },
                    { cap: 'የመሳሪያዎች መዝገብና Session ማቋረጥ (Device Session Revoke)', sa: true, ad: true, tc: false, st: false },
                    { cap: 'የማይደለዝ የኦዲት መዝገብ መመልከት (View Audit Logs)', sa: true, ad: true, tc: false, st: false },
                    { cap: 'በተፈቀደለት ክፍል ብቻ መማር (Locked Single Grade Learning)', sa: true, ad: true, tc: true, st: true },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{row.cap}</td>
                      <td className="p-3 text-center">
                        {row.sa ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {row.ad ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {row.tc ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {row.st ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Role Directory & Live Privilege Modifier */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  የተጠቃሚዎች ፈቃድና የደረጃ መዝገብ (User Privilege Directory)
                </h3>
                <p className="text-xs text-slate-500">
                  የተማሪዎችን እና አስተዳዳሪዎችን ደረጃ መቆጣጠር እና የክፍል መቆለፊያ መከታተያ
                </p>
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="ስም፣ ኢሜይል ወይም ደረጃ ይፈልጉ..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">ተጠቃሚ (User)</th>
                    <th className="p-3">ኢሜይል (Email)</th>
                    <th className="p-3">ደረጃ (Role)</th>
                    <th className="p-3">የክፍል ደረጃ (Grade)</th>
                    <th className="p-3">የክፍል መቆለፊያ (Grade Lock)</th>
                    <th className="p-3">መሣሪያዎች</th>
                    <th className="p-3 text-right">እርምጃ (Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((user) => {
                    const isUserSuperAdmin = user.email.toLowerCase() === 'mejennur669@gmail.com';
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-3">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">
                            {user.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{user.id}</span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                          {user.email}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              user.role === 'super_admin'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : user.role === 'admin'
                                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                                : user.role === 'teacher'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-700 dark:text-slate-300">
                          {user.grade}ኛ ክፍል
                        </td>
                        <td className="p-3">
                          {user.isGradeLocked ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                              <Lock className="w-3 h-3" /> የተቆለፈ (LOCKED)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              <Unlock className="w-3 h-3" /> ክፍት (BYPASS)
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-slate-500">
                          {user.activeDevicesCount} device(s)
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            disabled={isUserSuperAdmin}
                            onClick={() => {
                              setSelectedUserForEdit(user);
                              setEditRole(user.role);
                              setEditGrade(user.grade);
                              setEditGradeLock(user.isGradeLocked);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-bold text-[11px] disabled:opacity-40 transition"
                          >
                            {isUserSuperAdmin ? 'Root Locked' : 'ፈቃድ ቀይር'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Role Modal Dialog */}
          {selectedUserForEdit && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-indigo-600" />
                    የተጠቃሚ ፈቃድ ማስተካከያ (Modify RBAC)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelectedUserForEdit(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedUserForEdit.name}
                  </div>
                  <div className="font-mono text-slate-500">{selectedUserForEdit.email}</div>
                </div>

                <form onSubmit={handleUpdateUserRole} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      አዲስ የስርዓት ደረጃ (Target Role):
                    </label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                    >
                      <option value="student">STUDENT (የተማሪ ደረጃ)</option>
                      <option value="admin">ADMIN (የትምህርት ቤት አስተዳዳሪ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      የክፍል ደረጃ (Grade):
                    </label>
                    <select
                      value={editGrade}
                      onChange={(e) => setEditGrade(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                    >
                      <option value={9}>9ኛ ክፍል (Grade 9)</option>
                      <option value={10}>10ኛ ክፍል (Grade 10)</option>
                      <option value={11}>11ኛ ክፍል (Grade 11)</option>
                      <option value={12}>12ኛ ክፍል (Grade 12)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        የክፍል መቆለፊያ (Grade Lock)
                      </div>
                      <div className="text-[10px] text-slate-500">
                        ተጠቃሚው ከተመዘገበበት ክፍል ውጭ እንዳይቀይር ይከለክላል
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={editGradeLock}
                      onChange={(e) => setEditGradeLock(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                  </div>

                  {userUpdateMessage && (
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                      {userUpdateMessage}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUserForEdit(null)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                    >
                      ሰርዝ (Cancel)
                    </button>
                    <button
                      type="submit"
                      disabled={updatingUser}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md"
                    >
                      {updatingUser ? 'በማስቀመጥ ላይ...' : 'ለውጦችን አጽድቅ (Save)'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: DRM MEDIA & TEXT SHIELD STUDIO                          */}
      {/* ============================================================== */}
      {activeTab === 'drm' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Controls & Configuration Bar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  የዲአርኤም ሚዲያ እና ጽሑፍ ጥበቃ ስቱዲዮ (DRM Media & Text Shield Studio)
                </h3>
                <p className="text-xs text-slate-500">
                  ተለዋዋጭ ተንሳፋፊ የውሃ ማህተም (Dynamic Floating Watermark)፣ የስክሪን ፎቶ መከልከያ እና የጽሑፍ ኮፒ መቆለፊያ
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  DRM ACTIVE
                </span>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>የውሃ ማህተም ድምቀት (Opacity)</span>
                  <span className="font-mono text-indigo-600">{Math.round(drmOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.45"
                  step="0.02"
                  value={drmOpacity}
                  onChange={(e) => setDrmOpacity(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>የማዕዘን ዲግሪ (Rotation Angle)</span>
                  <span className="font-mono text-indigo-600">{drmAngle}°</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="-10"
                  step="1"
                  value={drmAngle}
                  onChange={(e) => setDrmAngle(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  የተደጋጋሚነት መጠን (Density)
                </label>
                <select
                  value={drmDensity}
                  onChange={(e) => setDrmDensity(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                >
                  <option value="light">ቀላል ድግግሞሽ (Light)</option>
                  <option value="normal">መደበኛ (Normal)</option>
                  <option value="dense">ከፍተኛ ድግግሞሽ (Dense)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  የስክሪን ቀረጻ መሸፈኛ (Blur Guard)
                </label>
                <button
                  type="button"
                  onClick={() => setEnableBlurGuard(!enableBlurGuard)}
                  className={`w-full py-2 rounded-xl font-bold text-xs transition ${
                    enableBlurGuard
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {enableBlurGuard ? '✓ በርቷል (Shield Active)' : '✕ ጠፍቷል (Disabled)'}
                </button>
              </div>
            </div>

            {/* Test Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'PrintScreen', keyCode: 44 }));
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                የስክሪን ሾት ሙከራ አስመስል (Simulate PrintScreen)
              </button>

              <button
                type="button"
                onClick={() => {
                  setDrmTestMessage('ጽሑፍ ኮፒ ማድረግ አልተቻለም፡ user-select: none በጥብቅ ተፈጽሟል። (Text selection is blocked)');
                  setTimeout(() => setDrmTestMessage(null), 3000);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Lock className="w-3.5 h-3.5" />
                የጽሑፍ ኮፒ ሙከራ (Test Copy Lock)
              </button>
            </div>

            {drmTestMessage && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 text-amber-800 dark:text-amber-200 text-xs font-bold animate-in fade-in">
                ⚠️ {drmTestMessage}
              </div>
            )}
          </div>

          {/* Interactive DRM Protected Canvas Preview */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-extrabold text-sm">
                  የተጠበቀ የመማሪያ ይዘት የቀጥታ እይታ (Live DRM Sandboxed Asset)
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Grade 10 Mathematics • MoE New Curriculum (2019 E.C.)
              </span>
            </div>

            {/* DrmProtectedContainer Wrapper */}
            <div className="rounded-2xl border-2 border-indigo-500/40 overflow-hidden shadow-2xl bg-white dark:bg-slate-950">
              <DrmProtectedContainer
                contentTitle="Grade 10 MoE Mathematics Unit 2 Polynomial Functions.pdf"
                watermarkOpacity={drmOpacity}
                watermarkAngle={drmAngle}
                watermarkDensity={drmDensity}
                enableBlurProtection={enableBlurGuard}
                className="p-6 sm:p-8"
              >
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                    <span className="text-xs font-bold uppercase text-indigo-600 tracking-wider">
                      Unit 2 • Polynomial Functions
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      2.1 Definition and Properties of Polynomial Functions
                    </h2>
                    <p className="text-xs text-slate-500 font-mono mt-1">
                      Official MoE Curriculum Textbook Page 68 • Section 2.1
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <h5 className="font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase">
                      Definition 2.1:
                    </h5>
                    <p className="text-sm font-serif italic text-slate-800 dark:text-slate-200 leading-relaxed">
                      "A polynomial function of degree n in variable x is a function of the form:
                      <br />
                      <span className="font-mono not-italic font-black text-base text-indigo-700 dark:text-indigo-300 block py-2">
                        P(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x + a₀
                      </span>
                      where aₙ ≠ 0, and each exponent n is a non-negative integer (n ∈ ℕ₀), with real coefficients aᵢ ∈ ℝ."
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <p>
                      <strong>ቁልፍ ህጎች (Key Properties):</strong>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 pl-2">
                      <li>The domain of every polynomial function is the set of all real numbers ℝ.</li>
                      <li>The graph of a polynomial function is always continuous with no breaks, holes, or gaps.</li>
                      <li>The graph has smooth turning points, with no sharp corners (cusps).</li>
                    </ol>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/60 text-xs text-amber-800 dark:text-amber-200">
                    💡 <strong>የኢትዮጵያ ምሳሌ (Contextual Application):</strong>
                    የታላቁ የኢትዮጵያ ህዳሴ ግድብ (GERD) የውሃ ፍሰት ስሌት እና የኮንክሪት መጠን ስሌት በPolynomial Functions ሞዴል ይደረጋል።
                  </div>
                </div>
              </DrmProtectedContainer>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: DEVICE REGISTRY & FRAUD GUARD                           */}
      {/* ============================================================== */}
      {activeTab === 'devices' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Overview & Concurrent Alarms Banner */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-600" />
                  የመሳሪያዎች መዝገብ እና የፈቃድ ቁጥጥር (Device Registry & Concurrent Guard)
                </h3>
                <p className="text-xs text-slate-500">
                  አንድ ተማሪ በአንድ ጊዜ በአንድ መሳሪያ ብቻ እንዲጠቀም ማስገደድ እና የተመሳሰሉ (Concurrent) ግልባጮችን መለየት
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchDevices}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  አድስ (Refresh)
                </button>
              </div>
            </div>

            {deviceActionMsg && (
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 text-indigo-700 dark:text-indigo-300 text-xs font-bold animate-in fade-in">
                {deviceActionMsg}
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex gap-2 pt-2">
              {(['ALL', 'ACTIVE', 'FLAGGED_CONCURRENT', 'REVOKED'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setDeviceFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    deviceFilter === f
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {f === 'ALL'
                    ? 'ሁሉም (All Devices)'
                    : f === 'ACTIVE'
                    ? 'ንቁ (Active)'
                    : f === 'FLAGGED_CONCURRENT'
                    ? '⚠️ የተደገመ (Concurrent Alert)'
                    : 'የተሰረዘ (Revoked)'}
                </button>
              ))}
            </div>
          </div>

          {/* Device Sessions Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">መሣሪያ (Device Name)</th>
                    <th className="p-3">ተማሪ (Student Email)</th>
                    <th className="p-3">IP አድራሻ (Client IP)</th>
                    <th className="p-3">የተመዘገበበት ሰዓት</th>
                    <th className="p-3">ሁኔታ (Status)</th>
                    <th className="p-3 text-right">እርምጃ (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredDevices.map((session) => (
                    <tr key={session.deviceId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {session.deviceName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {session.browser} • {session.os} ({session.deviceId})
                        </div>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        {session.studentEmail}
                      </td>
                      <td className="p-3 font-mono text-slate-500">{session.ip}</td>
                      <td className="p-3 text-[11px] text-slate-400">
                        {new Date(session.registeredAt).toLocaleString()}
                      </td>
                      <td className="p-3">
                        {session.status === 'ACTIVE' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            ACTIVE
                          </span>
                        ) : session.status === 'FLAGGED_CONCURRENT' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> CONCURRENT ALERT
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            REVOKED
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-1.5">
                        {session.status !== 'REVOKED' ? (
                          <button
                            type="button"
                            onClick={() => handleRevokeDevice(session.deviceId)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold text-[10px] transition"
                          >
                            አስወጣ (Revoke)
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleTrustDevice(session.deviceId)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] transition"
                          >
                            እንደገና ፈቅድ (Trust)
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: RATE LIMITING & PROXY PROTECTION                        */}
      {/* ============================================================== */}
      {activeTab === 'rate_limits' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-600" />
                  የጥያቄዎች ፍጥነት እና የደህንነት ጋሻ (Rate Limiting Engine)
                </h3>
                <p className="text-xs text-slate-500">
                  በአንድ ደቂቃ ውስጥ ከ60 ጥያቄዎች (60 req/min) በላይ እንዳይላክ የሚከላከል የመከላከያ ጋሻ
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchRateLimits}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  አድስ (Refresh)
                </button>
              </div>
            </div>

            {/* Policy Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-500">የጥያቄ ገደብ (Max Limit)</span>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                  60 req / min
                </div>
                <div className="text-[11px] text-slate-500">በእያንዳንዱ Client IP አድራሻ</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-500">የክትትል መስኮት (Window)</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">60 Seconds</div>
                <div className="text-[11px] text-slate-500">Sliding Window Algorithm</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-500">የቅጣት እርምጃ (Action)</span>
                <div className="text-2xl font-black text-rose-600 mt-1">HTTP 429</div>
                <div className="text-[11px] text-slate-500">Too Many Requests + 60s Cooldown</div>
              </div>
            </div>

            {/* Simulator Action Box */}
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-xs text-indigo-900 dark:text-indigo-200">
                  የፍጥነት ገደብ ሙከራ (Simulate Rapid API Burst):
                </h4>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
                  በአጭር ሰከንድ ውስጥ 65 ጥያቄዎችን በመላክ የHTTP 429 መከላከያ ጋሻ መስራቱን ይፈትሹ
                </p>
              </div>

              <button
                type="button"
                disabled={simulatingRateLimit}
                onClick={handleSimulateRateLimit}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <Zap className="w-3.5 h-3.5" />
                {simulatingRateLimit ? 'በመሞከር ላይ...' : '65 ጥያቄዎችን ላክ (Burst Test)'}
              </button>
            </div>

            {rateLimitSimResult && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 text-rose-800 dark:text-rose-200 text-xs font-bold animate-in fade-in">
                🛡️ {rateLimitSimResult}
              </div>
            )}
          </div>

          {/* Active Monitored IPs Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              በክትትል ስር ያሉ Client IPs (Monitored Active Addresses)
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Client IP አድራሻ</th>
                    <th className="p-3">ያለፉት 60 ሰከንድ ጥያቄዎች</th>
                    <th className="p-3">የመጠባበቂያ ሁኔታ (Status)</th>
                    <th className="p-3 text-right">እርምጃ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {rateLimitData?.activeMonitoredIps && rateLimitData.activeMonitoredIps.length > 0 ? (
                    rateLimitData.activeMonitoredIps.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {item.ip}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  item.recentRequests > 50
                                    ? 'bg-rose-500'
                                    : item.recentRequests > 30
                                    ? 'bg-amber-500'
                                    : 'bg-indigo-500'
                                }`}
                                style={{ width: `${Math.min(100, (item.recentRequests / 60) * 100)}%` }}
                              />
                            </div>
                            <span className="font-mono font-bold">{item.recentRequests} / 60</span>
                          </div>
                        </td>
                        <td className="p-3">
                          {item.isBlocked ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                              BLOCKED ({item.blockedRemainingSec}s remaining)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              NORMAL
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {item.isBlocked && (
                            <button
                              type="button"
                              onClick={() => handleUnblockIp(item.ip)}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-[10px]"
                            >
                              እገዳ አንሳ (Unblock)
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-400">
                        ምንም የታገደ ወይም ከፍተኛ ጥያቄ ያደረገ IP የለም (All clear)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: IMMUTABLE AUDIT TRAIL (audit_logs)                      */}
      {/* ============================================================== */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Audit Controls & Export Bar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  የማይደለዝ የደህንነት እና የክስተቶች መዝገብ (Immutable Audit Trail)
                </h3>
                <p className="text-xs text-slate-500">
                  በFirestore `audit_logs` ስብስብ ውስጥ በቋሚነት የሚቀመጥ እና የማይደለዝ (Append-Only) የደህንነት መዝገብ
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" />
                  JSON ላክ (Export)
                </button>
                <button
                  type="button"
                  onClick={fetchAuditLogs}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
                  አድስ
                </button>
              </div>
            </div>

            {/* Filter Controls Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  የክንውን አይነት (Action)
                </label>
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                >
                  <option value="ALL">ሁሉም ክንውኖች (All)</option>
                  <option value="PAYMENT">የክፍያ ክንውኖች (Payments)</option>
                  <option value="GRADE">የክፍል ደረጃ ክንውኖች (Grade)</option>
                  <option value="DRM">የDRM ክስተቶች (DRM Breaches)</option>
                  <option value="RATE_LIMIT">የፍጥነት ገደብ (Rate Limit)</option>
                  <option value="DEVICE">የመሳሪያዎች ክስተቶች (Devices)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  የፈጻሚው ደረጃ (Role)
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                >
                  <option value="ALL">ሁሉም ደረጃዎች (All Roles)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="TEACHER">TEACHER</option>
                  <option value="STUDENT">STUDENT</option>
                  <option value="SYSTEM">SYSTEM</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  ውጤት (Result)
                </label>
                <select
                  value={resultFilter}
                  onChange={(e) => setResultFilter(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                >
                  <option value="ALL">ሁሉም (Success & Denied)</option>
                  <option value="success">ተሳክቷል (Success)</option>
                  <option value="denied">ተከልክሏል (Denied)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  ጽሑፍ ፍለጋ (Search)
                </label>
                <input
                  type="text"
                  value={searchLogText}
                  onChange={(e) => setSearchLogText(e.target.value)}
                  placeholder="በመለያ ወይም Actor ፈልግ..."
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">ሰዓት (UTC Timestamp)</th>
                    <th className="p-3">ፈጻሚ (Actor)</th>
                    <th className="p-3">ደረጃ (Role)</th>
                    <th className="p-3">ክንውን (Action)</th>
                    <th className="p-3">ኢላማ (Target Resource)</th>
                    <th className="p-3">IP አድራሻ</th>
                    <th className="p-3">ውጤት (Result)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                  {displayAuditLogs.map((log) => (
                    <tr key={log.logId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3 text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                        <div className="text-[9px] text-slate-500">{log.logId}</div>
                      </td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 max-w-[160px] truncate">
                        {log.actorId}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                            log.actorRole === 'SUPER_ADMIN'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : log.actorRole === 'ADMIN'
                              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                              : log.actorRole === 'TEACHER'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {log.actorRole}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="p-3 text-slate-500 max-w-[200px] truncate">
                        {log.resourceId}
                        {log.details && (
                          <div className="text-[10px] text-slate-400 not-italic font-sans">
                            {log.details}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-slate-400">{log.ip}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.result === 'success'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {log.result.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

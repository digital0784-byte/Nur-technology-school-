import { Router, Request, Response, NextFunction } from 'express';
import { AuditLog, DeviceSession, SecurityUser } from '../types';

export const securityRouter = Router();

// ==========================================
// 1. IMMUTABLE AUDIT LOGS STORE (APPEND-ONLY)
// ==========================================
export const IMMUTABLE_AUDIT_LOGS: AuditLog[] = [
  {
    logId: 'AUD-20261028-001',
    actorId: 'mejennur669@gmail.com',
    actorRole: 'SUPER_ADMIN',
    action: 'SYSTEM_BOOTSTRAP',
    resourceType: 'SECURITY_CORE',
    resourceId: 'NUR_SEC_FORTRESS_V2',
    result: 'success',
    ip: '196.188.64.12',
    timestamp: '2026-10-28T04:12:00.000Z',
    details: 'Super Admin initialized multi-tier RBAC and DRM protection fortress',
  },
  {
    logId: 'AUD-20261028-002',
    actorId: 'admin.kebede@nur-school.edu.et',
    actorRole: 'ADMIN',
    action: 'PAYMENT_APPROVAL',
    resourceType: 'PAYMENT_TRANSACTION',
    resourceId: 'TXN-994821',
    result: 'success',
    ip: '196.189.12.88',
    timestamp: '2026-10-28T05:30:15.000Z',
    details: 'Approved 180 ETB payment for Grade 10 student (Almaz Tesfaye)',
  },
  {
    logId: 'AUD-20261028-003',
    actorId: 'student.yared@nur-school.edu.et',
    actorRole: 'STUDENT',
    action: 'GRADE_OVERRIDE_ATTEMPT',
    resourceType: 'GRADE_BARRIER',
    resourceId: 'Grade 12 Advanced Physics',
    result: 'denied',
    ip: '197.156.104.44',
    timestamp: '2026-10-28T06:14:22.000Z',
    details: 'Grade 10 locked student attempted to access Grade 12 unit without admin authorization',
  },
  {
    logId: 'AUD-20261028-004',
    actorId: 'student.meron@nur-school.edu.et',
    actorRole: 'STUDENT',
    action: 'DRM_BREACH_ATTEMPT',
    resourceType: 'PROTECTED_TEXTBOOK',
    resourceId: 'Grade 10 MoE Mathematics Unit 2.pdf',
    result: 'denied',
    ip: '196.188.77.20',
    timestamp: '2026-10-28T06:45:00.000Z',
    details: 'PrintScreen interception caught client-side capture. Dynamic watermark overlaid.',
  },
  {
    logId: 'AUD-20261028-005',
    actorId: '213.55.76.10',
    actorRole: 'SYSTEM',
    action: 'RATE_LIMIT_EXCEEDED',
    resourceType: 'AI_PROXY_ENDPOINT',
    resourceId: '/api/ai/tutor',
    result: 'denied',
    ip: '213.55.76.10',
    timestamp: '2026-10-28T07:10:43.000Z',
    details: 'Client fired 68 requests within 60 seconds (Limit: 60 req/min). Throttled with HTTP 429.',
  },
];

// ==========================================
// 2. DEVICE SESSIONS STORE & CONCURRENT LOGINS
// ==========================================
export const ACTIVE_DEVICE_SESSIONS: DeviceSession[] = [
  {
    deviceId: 'DEV-ETH-091001',
    studentId: 'mejennur669',
    studentEmail: 'mejennur669@gmail.com',
    deviceName: 'MacBook Pro M2 (Super Admin Workstation)',
    browser: 'Chrome 131.0',
    os: 'macOS Sonoma',
    ip: '196.188.64.12',
    registeredAt: '2026-10-25T08:00:00.000Z',
    lastActive: new Date().toISOString(),
    status: 'ACTIVE',
    isTrusted: true,
  },
  {
    deviceId: 'DEV-ETH-098811',
    studentId: 'usr-student-001',
    studentEmail: 'almaz.tesfaye@nur-school.edu.et',
    deviceName: 'Tecno Camon 20 Pro (Student Mobile)',
    browser: 'Chrome Mobile 129',
    os: 'Android 13',
    ip: '196.189.12.88',
    registeredAt: '2026-10-26T10:15:00.000Z',
    lastActive: new Date().toISOString(),
    status: 'ACTIVE',
    isTrusted: true,
  },
  {
    deviceId: 'DEV-ETH-098812',
    studentId: 'usr-student-001',
    studentEmail: 'almaz.tesfaye@nur-school.edu.et',
    deviceName: 'Windows 11 Desktop (Internet Cafe)',
    browser: 'Edge 128',
    os: 'Windows 11',
    ip: '197.156.104.99',
    registeredAt: '2026-10-28T06:50:00.000Z',
    lastActive: new Date().toISOString(),
    status: 'FLAGGED_CONCURRENT',
    isTrusted: false,
  },
  {
    deviceId: 'DEV-ETH-097722',
    studentId: 'usr-student-002',
    studentEmail: 'bekele.student@nur-school.edu.et',
    deviceName: 'Samsung Galaxy A54',
    browser: 'Samsung Internet 24.0',
    os: 'Android 14',
    ip: '196.188.90.15',
    registeredAt: '2026-10-27T12:00:00.000Z',
    lastActive: new Date().toISOString(),
    status: 'ACTIVE',
    isTrusted: true,
  },
];

// ==========================================
// 3. RBAC USERS REGISTRY
// ==========================================
export const RBAC_USERS: SecurityUser[] = [
  {
    id: 'usr-super-admin-01',
    name: 'Nuriye Ahmed Adem',
    email: 'mejennur669@gmail.com',
    role: 'super_admin',
    grade: 10,
    isGradeLocked: false,
    activeDevicesCount: 1,
    lastLogin: new Date().toISOString(),
    status: 'ACTIVE',
  },
  {
    id: 'usr-admin-01',
    name: 'Kebede Hailu (Admin)',
    email: 'admin.kebede@nur-school.edu.et',
    role: 'admin',
    grade: 10,
    isGradeLocked: false,
    activeDevicesCount: 1,
    lastLogin: '2026-10-28T05:30:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'usr-student-001',
    name: 'Almaz Tesfaye',
    email: 'almaz.tesfaye@nur-school.edu.et',
    role: 'student',
    grade: 10,
    isGradeLocked: true,
    activeDevicesCount: 2,
    lastLogin: '2026-10-28T06:50:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'usr-student-002',
    name: 'Bekele Tadesse',
    email: 'bekele.student@nur-school.edu.et',
    role: 'student',
    grade: 9,
    isGradeLocked: true,
    activeDevicesCount: 1,
    lastLogin: '2026-10-27T12:00:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'usr-student-003',
    name: 'Yared Getachew',
    email: 'student.yared@nur-school.edu.et',
    role: 'student',
    grade: 10,
    isGradeLocked: true,
    activeDevicesCount: 1,
    lastLogin: '2026-10-28T06:14:00.000Z',
    status: 'ACTIVE',
  },
  {
    id: 'usr-student-004',
    name: 'Meron Solomon',
    email: 'student.meron@nur-school.edu.et',
    role: 'student',
    grade: 11,
    isGradeLocked: true,
    activeDevicesCount: 1,
    lastLogin: '2026-10-28T06:45:00.000Z',
    status: 'ACTIVE',
  },
];

// ==========================================
// 4. RATE LIMITING SLIDING WINDOW ENGINE
// ==========================================
interface RateLimitBucket {
  timestamps: number[];
  blockedUntil?: number;
}

const RATE_LIMIT_BUCKETS = new Map<string, RateLimitBucket>();
const RATE_LIMIT_MAX = 60; // 60 requests per minute
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

export function rateLimiterMiddleware(req: Request, res: Response, next: NextFunction) {
  // Allow health checks, static assets, and admin queries without strict rate limit
  if (
    req.path === '/api/health' ||
    req.path.startsWith('/api/admin/stats') ||
    req.path.startsWith('/api/security/audit-logs') ||
    req.path.startsWith('/api/security/rate-limits')
  ) {
    return next();
  }

  // Identify client by IP
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress) || '127.0.0.1';

  const now = Date.now();
  let bucket = RATE_LIMIT_BUCKETS.get(ip);
  if (!bucket) {
    bucket = { timestamps: [] };
    RATE_LIMIT_BUCKETS.set(ip, bucket);
  }

  // Check if currently blocked
  if (bucket.blockedUntil && bucket.blockedUntil > now) {
    const retryAfter = Math.ceil((bucket.blockedUntil - now) / 1000);
    res.setHeader('Retry-After', retryAfter);
    res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX);
    res.setHeader('X-RateLimit-Remaining', 0);
    return res.status(429).json({
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: `የጥያቄ ብዛት ከደቂቃ ገደብ (60 req/min) አልፏል። እባክዎ ከ${retryAfter} ሰከንድ በኋላ ይሞክሩ። (Rate limit exceeded: max 60 req/min per client IP)`,
      retryAfterSeconds: retryAfter,
      clientIp: ip,
    });
  }

  // Clean up older timestamps outside sliding 60s window
  bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (bucket.timestamps.length >= RATE_LIMIT_MAX) {
    // Block IP for 60 seconds
    bucket.blockedUntil = now + 60 * 1000;

    // Log to Audit Trail
    IMMUTABLE_AUDIT_LOGS.unshift({
      logId: `AUD-RL-${Date.now()}`,
      actorId: ip,
      actorRole: 'SYSTEM',
      action: 'RATE_LIMIT_EXCEEDED',
      resourceType: 'API_ENDPOINT',
      resourceId: req.path,
      result: 'denied',
      ip,
      timestamp: new Date().toISOString(),
      details: `Exceeded ${RATE_LIMIT_MAX} req/min. Blocked for 60s.`,
    });

    res.setHeader('Retry-After', 60);
    res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX);
    res.setHeader('X-RateLimit-Remaining', 0);
    return res.status(429).json({
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'የጥያቄ ብዛት ከደቂቃ ገደብ (60 req/min) አልፏል። እባክዎ ከ60 ሰከንድ በኋላ ይሞክሩ። (Rate limit exceeded: max 60 req/min per client IP)',
      retryAfterSeconds: 60,
      clientIp: ip,
    });
  }

  bucket.timestamps.push(now);
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_MAX - bucket.timestamps.length));
  next();
}

// ==========================================
// 5. INPUT SANITIZATION MIDDLEWARE (XSS, Prototype Pollution)
// ==========================================
function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    // Strip malicious tags and javascript pseudoprotocols
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
  if (value && typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }
    const cleanObj: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      // Prevent prototype pollution
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') {
        continue;
      }
      cleanObj[k] = sanitizeValue(v);
    }
    return cleanObj;
  }
  return value;
}

export function inputSanitizerMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }
  next();
}

// ==========================================
// 6. SECURITY ROUTER ENDPOINTS
// ==========================================

// Audit Logs: Read immutable records with optional filtering
securityRouter.get('/audit-logs', (req: Request, res: Response) => {
  const { action, actorRole, result, limit = '100' } = req.query;

  let logs = [...IMMUTABLE_AUDIT_LOGS];

  if (action && typeof action === 'string' && action !== 'ALL') {
    logs = logs.filter((l) => l.action.toLowerCase().includes(action.toLowerCase()));
  }
  if (actorRole && typeof actorRole === 'string' && actorRole !== 'ALL') {
    logs = logs.filter((l) => l.actorRole === actorRole);
  }
  if (result && typeof result === 'string' && result !== 'ALL') {
    logs = logs.filter((l) => l.result === result);
  }

  const maxItems = Math.min(parseInt(limit as string, 10) || 100, 250);
  res.json({
    success: true,
    totalCount: logs.length,
    logs: logs.slice(0, maxItems),
    superAdminOwner: 'mejennur669@gmail.com',
  });
});

// Audit Logs: Append-only event ingestion
securityRouter.post('/audit-logs', (req: Request, res: Response) => {
  const { actorId, actorRole, action, resourceType, resourceId, result = 'success', ip, details } = req.body;

  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = ip || (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress) || '196.188.64.12';

  const newLog: AuditLog = {
    logId: `AUD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    actorId: actorId || 'anonymous_client',
    actorRole: actorRole || 'STUDENT',
    action: action || 'SECURITY_PROBE',
    resourceType: resourceType || 'SYSTEM_MODULE',
    resourceId: resourceId || 'GENERAL',
    result: result === 'denied' ? 'denied' : 'success',
    ip: clientIp,
    timestamp: new Date().toISOString(),
    details: details || 'Security event logged to immutable audit trail',
  };

  IMMUTABLE_AUDIT_LOGS.unshift(newLog);

  res.json({
    success: true,
    logId: newLog.logId,
    timestamp: newLog.timestamp,
    message: 'Audit log appended immutably.',
  });
});

// Device Registration & Concurrent Multi-Device Detection
securityRouter.post('/devices/register', (req: Request, res: Response) => {
  const { deviceId, studentId, studentEmail, deviceName, browser, os } = req.body;

  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress) || '196.188.64.12';

  if (!studentEmail) {
    return res.status(400).json({ success: false, error: 'studentEmail is required' });
  }

  const existingIdx = ACTIVE_DEVICE_SESSIONS.findIndex((d) => d.deviceId === deviceId);
  const otherActiveForUser = ACTIVE_DEVICE_SESSIONS.filter(
    (d) => d.studentEmail.toLowerCase() === studentEmail.toLowerCase() && d.deviceId !== deviceId && d.status === 'ACTIVE'
  );

  const isConcurrent = otherActiveForUser.length > 0;
  const status: 'ACTIVE' | 'FLAGGED_CONCURRENT' = isConcurrent ? 'FLAGGED_CONCURRENT' : 'ACTIVE';

  const sessionObj: DeviceSession = {
    deviceId: deviceId || `DEV-${Math.floor(100000 + Math.random() * 900000)}`,
    studentId: studentId || studentEmail,
    studentEmail,
    deviceName: deviceName || 'Generic Client Device',
    browser: browser || 'Standard Web Browser',
    os: os || 'Linux/Android/Windows',
    ip: clientIp,
    registeredAt: existingIdx >= 0 ? ACTIVE_DEVICE_SESSIONS[existingIdx].registeredAt : new Date().toISOString(),
    lastActive: new Date().toISOString(),
    status,
    isTrusted: studentEmail.toLowerCase() === 'mejennur669@gmail.com' ? true : !isConcurrent,
  };

  if (existingIdx >= 0) {
    ACTIVE_DEVICE_SESSIONS[existingIdx] = sessionObj;
  } else {
    ACTIVE_DEVICE_SESSIONS.unshift(sessionObj);
  }

  if (isConcurrent) {
    // Log to Audit Trail
    IMMUTABLE_AUDIT_LOGS.unshift({
      logId: `AUD-CONC-${Date.now()}`,
      actorId: studentEmail,
      actorRole: 'STUDENT',
      action: 'CONCURRENT_DEVICE_LOGIN_DETECTED',
      resourceType: 'DEVICE_SESSION',
      resourceId: sessionObj.deviceId,
      result: 'denied',
      ip: clientIp,
      timestamp: new Date().toISOString(),
      details: `Concurrent login detected on ${sessionObj.deviceName}. User already active on ${otherActiveForUser[0].deviceName}.`,
    });
  }

  res.json({
    success: true,
    session: sessionObj,
    isConcurrentAlert: isConcurrent,
    concurrentDevices: otherActiveForUser,
    message: isConcurrent
      ? 'ማስጠንቀቂያ፡ ይህ አካውንት በሌላ መሳሪያ ላይ እየሰራ ይገኛል። (Concurrent device login flagged)'
      : 'መሣሪያው በተሳካ ሁኔታ ተመዝግቧል። (Device registered successfully)',
  });
});

// Device Sessions: List all registered devices
securityRouter.get('/devices', (_req: Request, res: Response) => {
  res.json({
    success: true,
    totalDevices: ACTIVE_DEVICE_SESSIONS.length,
    activeSessions: ACTIVE_DEVICE_SESSIONS,
    concurrentAlertCount: ACTIVE_DEVICE_SESSIONS.filter((d) => d.status === 'FLAGGED_CONCURRENT').length,
  });
});

// Device Sessions: Revoke device session
securityRouter.post('/devices/revoke', (req: Request, res: Response) => {
  const { deviceId, revokedBy } = req.body;
  const session = ACTIVE_DEVICE_SESSIONS.find((d) => d.deviceId === deviceId);

  if (!session) {
    return res.status(404).json({ success: false, error: 'Device session not found' });
  }

  session.status = 'REVOKED';

  IMMUTABLE_AUDIT_LOGS.unshift({
    logId: `AUD-REV-${Date.now()}`,
    actorId: revokedBy || 'mejennur669@gmail.com',
    actorRole: 'SUPER_ADMIN',
    action: 'DEVICE_SESSION_REVOKED',
    resourceType: 'DEVICE_SESSION',
    resourceId: deviceId,
    result: 'success',
    ip: '196.188.64.12',
    timestamp: new Date().toISOString(),
    details: `Session revoked for ${session.studentEmail} on ${session.deviceName}`,
  });

  res.json({
    success: true,
    deviceId,
    status: 'REVOKED',
    message: `Device ${session.deviceName} was revoked. Client forced to re-authenticate.`,
  });
});

// Device Sessions: Trust device
securityRouter.post('/devices/trust', (req: Request, res: Response) => {
  const { deviceId } = req.body;
  const session = ACTIVE_DEVICE_SESSIONS.find((d) => d.deviceId === deviceId);
  if (!session) {
    return res.status(404).json({ success: false, error: 'Device not found' });
  }
  session.status = 'ACTIVE';
  session.isTrusted = true;
  res.json({ success: true, session });
});

// RBAC: List users and roles
securityRouter.get('/users', (_req: Request, res: Response) => {
  res.json({
    success: true,
    users: RBAC_USERS,
    superAdmin: 'mejennur669@gmail.com (Nuriye Ahmed Adem)',
  });
});

// RBAC: Update user role or grade lock
securityRouter.post('/users/update-role', (req: Request, res: Response) => {
  const { userId, newRole, isGradeLocked, targetGrade, actorEmail } = req.body;

  const user = RBAC_USERS.find((u) => u.id === userId || u.email.toLowerCase() === (userId || '').toLowerCase());
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  // Prevent demoting Super Admin
  if (user.email.toLowerCase() === 'mejennur669@gmail.com' && newRole && newRole !== 'super_admin') {
    return res.status(403).json({
      success: false,
      error: 'CANNOT_MODIFY_SUPER_ADMIN',
      message: 'የዋና አስተዳዳሪ (Nuriye Ahmed Adem) ፈቃድ ሊቀነስ አይችልም። (Super Admin role is immutable)',
    });
  }

  const previousRole = user.role;
  if (newRole) user.role = newRole;
  if (typeof isGradeLocked === 'boolean') user.isGradeLocked = isGradeLocked;
  if (targetGrade && [9, 10, 11, 12].includes(targetGrade)) user.grade = targetGrade;

  IMMUTABLE_AUDIT_LOGS.unshift({
    logId: `AUD-ROLE-${Date.now()}`,
    actorId: actorEmail || 'mejennur669@gmail.com',
    actorRole: 'SUPER_ADMIN',
    action: 'USER_ROLE_UPDATED',
    resourceType: 'RBAC_SECURITY',
    resourceId: user.email,
    result: 'success',
    ip: '196.188.64.12',
    timestamp: new Date().toISOString(),
    details: `Updated ${user.email} from ${previousRole} to ${user.role}. Grade locked: ${user.isGradeLocked}. Grade: ${user.grade}.`,
  });

  res.json({
    success: true,
    user,
    message: `User permissions for ${user.name} successfully updated to ${user.role.toUpperCase()}.`,
  });
});

// Rate Limits: Monitor statistics
securityRouter.get('/rate-limits', (_req: Request, res: Response) => {
  const now = Date.now();
  const buckets: Array<{ ip: string; recentRequests: number; isBlocked: boolean; blockedRemainingSec: number }> = [];

  for (const [ip, bucket] of RATE_LIMIT_BUCKETS.entries()) {
    const validTimestamps = bucket.timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    const isBlocked = Boolean(bucket.blockedUntil && bucket.blockedUntil > now);
    const blockedRemainingSec = isBlocked && bucket.blockedUntil ? Math.ceil((bucket.blockedUntil - now) / 1000) : 0;

    buckets.push({
      ip,
      recentRequests: validTimestamps.length,
      isBlocked,
      blockedRemainingSec,
    });
  }

  res.json({
    success: true,
    policy: {
      maxRequestsPerMinute: RATE_LIMIT_MAX,
      windowSeconds: 60,
      enforcedOn: 'All /api/* endpoints (excluding static/health)',
    },
    activeMonitoredIps: buckets,
  });
});

// Rate Limits: Simulate flood testing
securityRouter.post('/rate-limits/simulate', (req: Request, res: Response) => {
  const { clientIp = '197.156.104.99', simulatedRequests = 65 } = req.body;
  const now = Date.now();

  let bucket = RATE_LIMIT_BUCKETS.get(clientIp);
  if (!bucket) {
    bucket = { timestamps: [] };
    RATE_LIMIT_BUCKETS.set(clientIp, bucket);
  }

  for (let i = 0; i < simulatedRequests; i++) {
    bucket.timestamps.push(now);
  }
  bucket.blockedUntil = now + 60 * 1000;

  IMMUTABLE_AUDIT_LOGS.unshift({
    logId: `AUD-SIM-${Date.now()}`,
    actorId: clientIp,
    actorRole: 'SYSTEM',
    action: 'RATE_LIMIT_BURST_SIMULATION',
    resourceType: 'RATE_LIMIT_FIREWALL',
    resourceId: `${simulatedRequests} req / 5s`,
    result: 'denied',
    ip: clientIp,
    timestamp: new Date().toISOString(),
    details: `Simulated flood attack of ${simulatedRequests} requests. IP ${clientIp} throttled for 60s.`,
  });

  res.json({
    success: true,
    simulatedIp: clientIp,
    simulatedRequests,
    status: 'THROTTLED_429',
    retryAfterSeconds: 60,
    message: `Simulated ${simulatedRequests} rapid requests. Client IP ${clientIp} throttled with HTTP 429.`,
  });
});

// Rate Limits: Unblock IP
securityRouter.post('/rate-limits/unblock', (req: Request, res: Response) => {
  const { clientIp } = req.body;
  if (!clientIp) return res.status(400).json({ success: false, error: 'clientIp required' });

  const bucket = RATE_LIMIT_BUCKETS.get(clientIp);
  if (bucket) {
    bucket.blockedUntil = undefined;
    bucket.timestamps = [];
  }

  res.json({
    success: true,
    clientIp,
    message: `Client IP ${clientIp} unblocked and request quota reset.`,
  });
});

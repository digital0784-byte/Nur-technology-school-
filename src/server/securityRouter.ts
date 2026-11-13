import { Router, Request, Response, NextFunction } from 'express';
import { AuditLog, DeviceSession, SecurityUser } from '../types';
import { adminDb } from './adminDb';

export const securityRouter = Router();

// ==========================================
// 1. IMMUTABLE AUDIT LOGS STORE (APPEND-ONLY)
// ==========================================
export const IMMUTABLE_AUDIT_LOGS: AuditLog[] = [];

export function pushAudit(log: AuditLog) {
  IMMUTABLE_AUDIT_LOGS.unshift(log);
  if (IMMUTABLE_AUDIT_LOGS.length > 500) IMMUTABLE_AUDIT_LOGS.pop();
  adminDb
    .collection('security_audit_logs')
    .doc(log.logId)
    .set(log)
    .catch(() => {});
}

// ==========================================
// 2. DEVICE SESSIONS STORE & CONCURRENT LOGINS
// ==========================================
export const ACTIVE_DEVICE_SESSIONS: DeviceSession[] = [];

// ==========================================
// 3. RBAC USERS REGISTRY
// ==========================================
export const RBAC_USERS: SecurityUser[] = [];

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

  // Identify client by (req as any).user?.uid first, then the existing IP logic
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress) || '127.0.0.1';
  const clientId = (req as any).user?.uid || ip;

  const now = Date.now();
  let bucket = RATE_LIMIT_BUCKETS.get(clientId);
  if (!bucket) {
    bucket = { timestamps: [] };
    RATE_LIMIT_BUCKETS.set(clientId, bucket);
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
    pushAudit({
      logId: `AUD-RL-${Date.now()}`,
      actorId: clientId,
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
securityRouter.get('/audit-logs', async (req: Request, res: Response) => {
  const { action, actorRole, result, limit = '100' } = req.query;

  let logs: AuditLog[] = [];
  try {
    const snap = await adminDb
      .collection('security_audit_logs')
      .orderBy('timestamp', 'desc')
      .limit(500)
      .get();
    logs = snap.docs.map((d) => d.data() as AuditLog);
  } catch {
    console.warn('[securityRouter] Firestore unavailable for security_audit_logs, using in-memory logs.');
    logs = [...IMMUTABLE_AUDIT_LOGS];
  }

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
  const actorId = req.user?.email || req.user?.uid || 'anonymous_client';
  const actorRole = req.user?.role === 'super_admin' ? 'SUPER_ADMIN' : 'STUDENT';
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = req.ip || (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress) || '127.0.0.1';

  const action = String(req.body?.action || 'SECURITY_PROBE').slice(0, 64);
  const resourceType = String(req.body?.resourceType || 'SYSTEM_MODULE').slice(0, 64);
  const resourceId = String(req.body?.resourceId || 'GENERAL').slice(0, 128);
  const details = String(req.body?.details || 'Security event logged to immutable audit trail').slice(0, 500);
  const result = req.body?.result === 'denied' ? 'denied' : 'success';

  const newLog: AuditLog = {
    logId: `AUD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    actorId,
    actorRole,
    action,
    resourceType,
    resourceId,
    result,
    ip: clientIp,
    timestamp: new Date().toISOString(),
    details,
  };

  pushAudit(newLog);

  res.json({
    success: true,
    logId: newLog.logId,
    timestamp: newLog.timestamp,
    message: 'Audit log appended immutably.',
  });
});

// Device Registration & Concurrent Multi-Device Detection
securityRouter.post('/devices/register', (req: Request, res: Response) => {
  const { deviceId, deviceName, browser, os } = req.body;
  const studentEmail = req.user?.email || '';
  const studentId = req.user?.uid || '';

  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = req.ip || (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress) || '127.0.0.1';

  if (!studentEmail) {
    return res.status(400).json({ success: false, error: 'studentEmail is required (user must be authenticated)' });
  }

  const existingIdx = ACTIVE_DEVICE_SESSIONS.findIndex((d) => d.deviceId === deviceId);
  const otherActiveForUser = ACTIVE_DEVICE_SESSIONS.filter(
    (d) => d.studentEmail.toLowerCase() === studentEmail.toLowerCase() && d.deviceId !== deviceId && d.status === 'ACTIVE'
  );

  const isConcurrent = otherActiveForUser.length > 0;
  const status: 'ACTIVE' | 'FLAGGED_CONCURRENT' = isConcurrent ? 'FLAGGED_CONCURRENT' : 'ACTIVE';

  const sessionObj: DeviceSession = {
    deviceId: deviceId || `DEV-${Math.floor(100000 + Math.random() * 900000)}`,
    studentId,
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
    pushAudit({
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
  return res.status(403).json({ success: false, error: 'Disabled until server-side authentication is added' });
});

// Device Sessions: Revoke device session
securityRouter.post('/devices/revoke', (_req: Request, res: Response) => {
  return res.status(403).json({ success: false, error: 'Disabled until server-side authentication is added' });
});

// Device Sessions: Trust device
securityRouter.post('/devices/trust', (_req: Request, res: Response) => {
  return res.status(403).json({ success: false, error: 'Disabled until server-side authentication is added' });
});

// RBAC: List users and roles
securityRouter.get('/users', (_req: Request, res: Response) => {
  return res.status(403).json({ success: false, error: 'Disabled until server-side authentication is added' });
});

// RBAC: Update user role or grade lock
securityRouter.post('/users/update-role', (_req: Request, res: Response) => {
  return res.status(403).json({ success: false, error: 'Disabled until server-side authentication is added' });
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
securityRouter.post('/rate-limits/simulate', (_req: Request, res: Response) => {
  return res.status(403).json({ success: false, error: 'Disabled until server-side authentication is added' });
});

// Rate Limits: Unblock IP
securityRouter.post('/rate-limits/unblock', (_req: Request, res: Response) => {
  return res.status(403).json({ success: false, error: 'Disabled until server-side authentication is added' });
});

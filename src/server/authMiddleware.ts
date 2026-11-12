import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import './adminDb'; // initialises firebase-admin (see adminDb.ts for credential order)

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'nur-technology-school';

export interface AuthedUser {
  uid: string;
  email?: string;
  role: 'student' | 'super_admin';
  isPremium: boolean;
  premiumExpiresAt?: string;
  hasPremiumLearning?: boolean;
  premiumLearningExpiresAt?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthedUser;
    }
  }
}

const PROFILE_TTL_MS = 60_000;
const profileCache = new Map<string, {
  at: number;
  role: AuthedUser['role'];
  isPremium: boolean;
  premiumExpiresAt?: string;
  hasPremiumLearning?: boolean;
  premiumLearningExpiresAt?: string;
}>();

// Reads users/{uid} using the user's OWN token, so Firestore rules apply:
// the role can only come from the protected Firestore document.
async function loadProfile(uid: string, idToken: string) {
  const hit = profileCache.get(uid);
  if (hit && Date.now() - hit.at < PROFILE_TTL_MS) return hit;

  let role: AuthedUser['role'] = 'student';
  let isPremium = false;
  let premiumExpiresAt: string | undefined;
  let hasPremiumLearning = false;
  let premiumLearningExpiresAt: string | undefined;

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${uid}`;
    const r = await fetch(url, { headers: { Authorization: `Bearer ${idToken}` } });
    if (r.ok) {
      const f = ((await r.json()) as any).fields || {};
      role = f.role?.stringValue === 'super_admin' ? 'super_admin' : 'student';
      isPremium = f.isPremium?.booleanValue === true;
      premiumExpiresAt = f.premiumExpiresAt?.stringValue;
      hasPremiumLearning = f.hasPremiumLearning?.booleanValue === true;
      premiumLearningExpiresAt = f.premiumLearningExpiresAt?.stringValue;
    }
  } catch (e) {
    console.error('Profile lookup failed:', e);
  }

  // Check fallback storage if premium or premiumLearning wasn't found in live Firestore
  try {
    const fs = await import('fs');
    const path = await import('path');
    const usersFile = path.resolve(process.cwd(), '.data/users_store.json');
    if (fs.existsSync(usersFile)) {
      const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
      if (users[uid]) {
        if (!isPremium && users[uid].isPremium) isPremium = true;
        if (!premiumExpiresAt && users[uid].premiumExpiresAt) premiumExpiresAt = users[uid].premiumExpiresAt;
        if (!hasPremiumLearning && users[uid].hasPremiumLearning) hasPremiumLearning = true;
        if (!premiumLearningExpiresAt && users[uid].premiumLearningExpiresAt) premiumLearningExpiresAt = users[uid].premiumLearningExpiresAt;
        if (users[uid].role) role = users[uid].role;
      }
    }
  } catch {}

  const entry = { at: Date.now(), role, isPremium, premiumExpiresAt, hasPremiumLearning, premiumLearningExpiresAt };
  profileCache.set(uid, entry);
  return entry;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const m = (req.headers.authorization || '').match(/^Bearer (.+)$/i);
  if (!m) {
    return res.status(401).json({ success: false, error: 'LOGIN_REQUIRED', message: 'እባክዎ መጀመሪያ ይግቡ / Please sign in.' });
  }
  try {
    const decoded = await getAuth().verifyIdToken(m[1]);
    const p = await loadProfile(decoded.uid, m[1]);
    const email = (decoded.email || '').toLowerCase().trim();
    const isSuper = email === 'mejennur669@gmail.com' || email === 'abuzinad7862@gmail.com' || p.role === 'super_admin';

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: isSuper ? 'super_admin' : p.role,
      isPremium: isSuper ? true : p.isPremium,
      premiumExpiresAt: isSuper ? undefined : p.premiumExpiresAt,
      hasPremiumLearning: isSuper ? true : p.hasPremiumLearning,
      premiumLearningExpiresAt: isSuper ? undefined : p.premiumLearningExpiresAt,
    };
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'INVALID_TOKEN', message: 'Session expired. Please sign in again.' });
  }
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  const email = (req.user?.email || '').toLowerCase().trim();
  const isSuper =
    req.user?.role === 'super_admin' ||
    email === 'mejennur669@gmail.com' ||
    email === 'abuzinad7862@gmail.com';
  if (isSuper) return next();
  return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Super Admin only.' });
}

export function isPremiumActive(u?: AuthedUser): boolean {
  if (!u) return false;
  if (u.role === 'super_admin') return true;
  if (!u.isPremium) return false;
  if (!u.premiumExpiresAt) return true;
  return new Date(u.premiumExpiresAt + 'T23:59:59') >= new Date();
}

export function isPremiumLearningActive(u?: AuthedUser): boolean {
  if (!u) return false;
  if (u.role === 'super_admin') return true;
  if (!u.hasPremiumLearning) return false;
  if (!u.premiumLearningExpiresAt) return true;
  return new Date(u.premiumLearningExpiresAt + 'T23:59:59') >= new Date();
}

export function hasAnyPaidPlan(u?: AuthedUser): boolean {
  return isPremiumActive(u) || isPremiumLearningActive(u);
}

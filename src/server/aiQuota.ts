import { AsyncLocalStorage } from 'async_hooks';
import type { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { adminDb, FieldValue } from './adminDb';
import { AuthedUser, hasAnyPaidPlan } from './authMiddleware';

// Daily cap on real Gemini calls per user (cache hits do not count).
// Tune with env vars: AI_FREE_DAILY_LIMIT, AI_PREMIUM_DAILY_LIMIT.
const FREE_LIMIT = Number(process.env.AI_FREE_DAILY_LIMIT) || 15;
const PREMIUM_LIMIT = Number(process.env.AI_PREMIUM_DAILY_LIMIT) || 200;

const als = new AsyncLocalStorage<{ user?: AuthedUser }>();

export function aiContextMiddleware(req: Request, _res: Response, next: NextFunction) {
  als.run({ user: req.user }, next);
}

export class AiQuotaError extends Error {
  statusCode = 429;
  code = 'AI_QUOTA_EXCEEDED';
  constructor(public limit: number, public premium: boolean) {
    super(
      premium
        ? `የዛሬው የAI ጥያቄ ገደብ (${limit}) ደርሷል። ነገ ይሞክሩ። / Daily AI limit (${limit}) reached.`
        : `የዛሬው የነጻ AI ጥያቄ ገደብ (${limit}) ደርሷል። ያልተገደበ ለማግኘት ፕሪሚየም ይግዙ ወይም ነገ ይሞክሩ። / Daily free AI limit (${limit}) reached. Upgrade to Premium or try tomorrow.`
    );
  }
}

// Persistent local fallback if Firestore Admin is unavailable
const AI_USAGE_FILE = path.resolve(process.cwd(), '.data/ai_usage.json');
const memoryCounts = new Map<string, number>();
let loggedFallbackNotice = false;

function summarizeFirestoreError(err: unknown): string {
  const raw = String((err as any)?.message || err || 'unknown');
  if (/PERMISSION_DENIED|insufficient permissions/i.test(raw)) return 'PERMISSION_DENIED';
  if (/default credentials/i.test(raw)) return 'NO_CREDENTIALS';
  return raw.replace(/\s+/g, ' ').slice(0, 120);
}

function readLocalCount(key: string): number {
  const mem = memoryCounts.get(key);
  if (typeof mem === 'number') return mem;
  try {
    if (fs.existsSync(AI_USAGE_FILE)) {
      const store = JSON.parse(fs.readFileSync(AI_USAGE_FILE, 'utf-8'));
      const val = Number(store[key]?.count || 0);
      memoryCounts.set(key, val);
      return val;
    }
  } catch {
    // ignore read error
  }
  return 0;
}

function writeLocalCount(key: string, uid: string, day: string, count: number): void {
  memoryCounts.set(key, count);
  try {
    const dir = path.dirname(AI_USAGE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const store = fs.existsSync(AI_USAGE_FILE)
      ? JSON.parse(fs.readFileSync(AI_USAGE_FILE, 'utf-8'))
      : {};
    store[key] = { uid, day, count, updatedAt: new Date().toISOString() };
    fs.writeFileSync(AI_USAGE_FILE, JSON.stringify(store, null, 2));
  } catch {
    // ignore write error
  }
}

// Ethiopia is UTC+3, so "today" rolls over at local midnight.
const dayKey = () => new Date(Date.now() + 3 * 3600_000).toISOString().slice(0, 10);

export async function consumeAiQuota(): Promise<void> {
  const user = als.getStore()?.user;
  if (!user) throw Object.assign(new Error('LOGIN_REQUIRED'), { statusCode: 401 });
  if (user.role === 'super_admin') return;

  const premium = hasAnyPaidPlan(user);
  const limit = premium ? PREMIUM_LIMIT : FREE_LIMIT;
  const day = dayKey();
  const key = `${user.uid}_${day}`;

  try {
    const ref = adminDb.collection('ai_usage').doc(key);
    await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const used = Number(snap.data()?.count || 0);
      if (used >= limit) throw new AiQuotaError(limit, premium);
      tx.set(ref, { uid: user.uid, day, count: used + 1, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    });
  } catch (e) {
    if (e instanceof AiQuotaError) throw e;
    if (!loggedFallbackNotice) {
      loggedFallbackNotice = true;
      console.warn('[aiQuota] Firestore unavailable, using local .data/ai_usage.json fallback:', summarizeFirestoreError(e));
    }
    const used = readLocalCount(key);
    if (used >= limit) throw new AiQuotaError(limit, premium);
    writeLocalCount(key, user.uid, day, used + 1);
  }
}

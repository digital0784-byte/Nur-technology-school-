import { AsyncLocalStorage } from 'async_hooks';
import type { Request, Response, NextFunction } from 'express';
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

// Fallback if Firestore is unreachable (per-instance only).
const memoryCounts = new Map<string, number>();

// Ethiopia is UTC+3, so "today" rolls over at local midnight.
const dayKey = () => new Date(Date.now() + 3 * 3600_000).toISOString().slice(0, 10);

export async function consumeAiQuota(): Promise<void> {
  const user = als.getStore()?.user;
  if (!user) throw Object.assign(new Error('LOGIN_REQUIRED'), { statusCode: 401 });
  if (user.role === 'super_admin') return;

  const premium = hasAnyPaidPlan(user);
  const limit = premium ? PREMIUM_LIMIT : FREE_LIMIT;
  const key = `${user.uid}_${dayKey()}`;

  try {
    const ref = adminDb.collection('ai_usage').doc(key);
    await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const used = Number(snap.data()?.count || 0);
      if (used >= limit) throw new AiQuotaError(limit, premium);
      tx.set(ref, { uid: user.uid, day: dayKey(), count: used + 1, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    });
  } catch (e) {
    if (e instanceof AiQuotaError) throw e;
    console.error('AI quota store unavailable, using in-memory counter:', (e as any)?.message || e);
    const used = memoryCounts.get(key) || 0;
    if (used >= limit) throw new AiQuotaError(limit, premium);
    memoryCounts.set(key, used + 1);
  }
}

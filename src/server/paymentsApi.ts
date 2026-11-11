import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { adminDb, FieldValue } from './adminDb';
import { requireSuperAdmin } from './authMiddleware';

export const paymentsRouter = Router();

// Fallback local storage for payments when Firebase service account is pending configuration
const DATA_DIR = path.resolve(process.cwd(), '.data');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments_store.json');
const USERS_FILE = path.join(DATA_DIR, 'users_store.json');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {}
}

export function readFallbackPayments(): Record<string, any> {
  ensureDataDir();
  try {
    if (fs.existsSync(PAYMENTS_FILE)) {
      return JSON.parse(fs.readFileSync(PAYMENTS_FILE, 'utf-8'));
    }
  } catch {}
  return {};
}

export function saveFallbackPayment(id: string, record: any) {
  ensureDataDir();
  try {
    const all = readFallbackPayments();
    all[id] = { ...record, id, updatedAt: new Date().toISOString() };
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(all, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write fallback payment:', e);
  }
}

// ---------------------------------------------------------------------------
// Config: payment accounts are public by design (students need them to pay).
// Pricing is read from Firestore app_config/payment (editable by the Super Admin
// in the dashboard) with these defaults as a fallback.
// ---------------------------------------------------------------------------
export const VERIFIED_PAYMENT_ACCOUNTS = [
  { id: 'telebirr', name: 'ቴሌብር (Telebirr)', accountName: 'Nuriye Ahmed Adem', accountNumberOrPhone: '0910097862', ussdCode: '*127#', method: 'In-app transfer or USSD (*127#)' },
  { id: 'cbe_birr', name: 'ሲቢኢ ብር (CBE Birr)', accountName: 'Nuriye Ahmed Adem', accountNumberOrPhone: '0910097862', ussdCode: '*847#', method: 'In-app transfer or USSD (*847#)' },
  { id: 'cbe', name: 'የኢትዮጵያ ንግድ ባንክ (Commercial Bank of Ethiopia - CBE)', accountName: 'Nuriye Ahmed Adem', accountNumberOrPhone: '1000382883776', method: 'CBE Mobile Banking, CBE Birr, or branch deposit' },
  { id: 'dashen', name: 'ዳሸን ባንክ (Dashen Bank / Amole)', accountName: 'Nuriye Ahmed Adem', accountNumberOrPhone: '2976196269611', method: 'Dashen Mobile App or Amole' },
  { id: 'abyssinia', name: 'አቢሲኒያ ባንክ (Bank of Abyssinia)', accountName: 'Nuriye Ahmed Adem', accountNumberOrPhone: '251120889', method: 'BoA Mobile Banking or branch transfer' },
];

const GATEWAY_IDS = new Set(VERIFIED_PAYMENT_ACCOUNTS.map((a) => a.id));

export const DEFAULT_PRICING = {
  grade9: 160,
  grade10: 180,
  grade11: 200,
  grade12: 200,
  singleAssignment: 57,
  billingCycleDays: 30,
  currency: 'ETB',
};
export type Pricing = typeof DEFAULT_PRICING;

let pricingCache: { at: number; value: Pricing } | null = null;
const PRICING_TTL_MS = 60_000;

export async function getPricing(): Promise<Pricing> {
  if (pricingCache && Date.now() - pricingCache.at < PRICING_TTL_MS) return pricingCache.value;
  let value: Pricing = { ...DEFAULT_PRICING };
  try {
    const snap = await adminDb.collection('app_config').doc('payment').get();
    const p = snap.data()?.pricing;
    if (p && typeof p === 'object') {
      for (const k of Object.keys(DEFAULT_PRICING) as Array<keyof Pricing>) {
        if (k === 'currency') continue;
        const n = Number((p as any)[k]);
        if (Number.isFinite(n) && n > 0 && n < 100_000) (value as any)[k] = n;
      }
    }
  } catch (e) {
    // Expected fallback when service account is not yet configured
  }
  pricingCache = { at: Date.now(), value };
  return value;
}

export function priceForGrade(p: Pricing, grade: number): number {
  return grade === 10 ? p.grade10 : grade === 11 ? p.grade11 : grade === 12 ? p.grade12 : p.grade9;
}

const toYmd = (d: Date) => d.toISOString().slice(0, 10);
const MAX_PENDING_PER_USER = 5;

// GET /api/payment/config
paymentsRouter.get('/config', async (_req: Request, res: Response) => {
  res.json({
    success: true,
    accounts: VERIFIED_PAYMENT_ACCOUNTS,
    pricing: await getPricing(),
    superAdminContact: { email: 'mejennur669@gmail.com', name: 'Nuriye Ahmed Adem', phone: '0910097862' },
  });
});

// POST /api/payment/submit  — student payment record creation.
paymentsRouter.post('/submit', async (req: Request, res: Response) => {
  const user = req.user!;
  const gateway = String(req.body?.gateway || '').toLowerCase();
  const ref = String(req.body?.transactionRef || '').trim().replace(/[^A-Za-z0-9_-]/g, '');
  const phone = String(req.body?.phone || '').trim();

  if (!GATEWAY_IDS.has(gateway)) {
    return res.status(400).json({ success: false, error: 'የክፍያ መንገድ ትክክል አይደለም / Invalid payment gateway.' });
  }
  if (ref.length < 4 || ref.length > 64) {
    return res.status(400).json({ success: false, error: 'እባክዎ ትክክለኛ የግብይት ማረጋገጫ (FT Reference) ያስገቡ።' });
  }
  if (phone.length < 9 || phone.length > 20) {
    return res.status(400).json({ success: false, error: 'እባክዎ ትክክለኛ የስልክ ቁጥር ያስገቡ።' });
  }

  try {
    let profile: any = {};
    try {
      const profileSnap = await adminDb.collection('users').doc(user.uid).get();
      profile = profileSnap.data() || {};
    } catch {
      // Gracefully continue with defaults if Firestore read is unauthenticated
    }
    const grade = [9, 10, 11, 12].includes(Number(profile.grade)) ? Number(profile.grade) : 9;
    const pricing = await getPricing();
    const amount = priceForGrade(pricing, grade);

    const id = `${gateway}_${ref}`;

    // Check duplicate in fallback store first
    const fallbackAll = readFallbackPayments();
    if (fallbackAll[id]) {
      return res.status(409).json({
        success: false,
        error: 'ይህ የግብይት ቁጥር ቀድሞ ገብቷል / This transaction ID was already submitted.',
      });
    }

    const data = {
      id,
      userId: user.uid,
      studentId: user.uid,
      studentName: String(profile.name || user.email || 'ተማሪ').slice(0, 120),
      studentEmail: user.email || '',
      studentPhone: phone,
      grade,
      amount,
      currency: 'ETB',
      paymentGateway: gateway,
      transactionRef: ref,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    let savedToFirestore = false;
    try {
      await adminDb.collection('payments').doc(id).create({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
      });
      savedToFirestore = true;
    } catch (e: any) {
      if (e?.code === 6 || String(e?.message || '').includes('ALREADY_EXISTS')) {
        return res.status(409).json({
          success: false,
          error: 'ይህ የግብይት ቁጥር ቀድሞ ገብቷል / This transaction ID was already submitted.',
        });
      }
      // Resilient fallback storage: save locally so payment proof is NEVER lost
      console.warn('[paymentsApi] Firestore adminDb unavailable, using resilient fallback storage:', e?.message || e);
      saveFallbackPayment(id, data);
    }

    if (savedToFirestore) {
      try {
        await adminDb.collection('audit_logs').add({
          scope: 'payment',
          actorUid: user.uid,
          actorEmail: user.email || '',
          action: 'SUBMITTED',
          targetUserId: user.uid,
          targetPaymentId: id,
          details: `${gateway} ${ref} ${amount} ETB (Grade ${grade})`,
          newStatus: 'PENDING',
          createdAt: FieldValue.serverTimestamp(),
        });
      } catch {
        // Safe to ignore audit log errors
      }
    }

    return res.json({
      success: true,
      submission: data,
    });
  } catch (e: any) {
    console.error('payment submit failed:', e);
    // Even if an unexpected error occurs, record into fallback if we have id
    try {
      const id = `${gateway}_${ref}`;
      const pricing = await getPricing();
      const amount = priceForGrade(pricing, 9);
      const fallbackRecord = {
        id,
        userId: user.uid,
        studentId: user.uid,
        studentName: String(user.email || 'ተማሪ').slice(0, 120),
        studentEmail: user.email || '',
        studentPhone: phone,
        grade: 9,
        amount,
        currency: 'ETB',
        paymentGateway: gateway,
        transactionRef: ref,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      saveFallbackPayment(id, fallbackRecord);
      return res.json({ success: true, submission: fallbackRecord });
    } catch {
      return res.status(500).json({ success: false, error: 'ክፍያውን መመዝገብ አልተቻለም። እባክዎ ቆይተው ይሞክሩ።' });
    }
  }
});

// GET /api/payment/admin/notifications — pending payments for the Super Admin.
paymentsRouter.get('/admin/notifications', requireSuperAdmin, async (req: Request, res: Response) => {
  const pendingOnly = req.query.pending === 'true';
  const fallbackAll = Object.values(readFallbackPayments());
  let notifications: any[] = [];
  try {
    let q: FirebaseFirestore.Query = adminDb.collection('payments');
    if (pendingOnly) q = q.where('status', '==', 'pending');
    const snap = await q.limit(200).get();
    notifications = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    // Normal fallback when Firestore credentials are not configured yet
  }

  // Merge fallback payments (avoiding duplicates)
  const existingIds = new Set(notifications.map((n) => n.id));
  for (const fb of fallbackAll) {
    if (!existingIds.has(fb.id)) {
      if (!pendingOnly || String(fb.status).toLowerCase() === 'pending') {
        notifications.push(fb);
      }
    }
  }

  res.json({
    success: true,
    count: notifications.length,
    pendingCount: notifications.filter((n: any) => String(n.status).toLowerCase() === 'pending').length,
    notifications,
  });
});

// POST /api/payment/admin/approve — approves a payment and switches Premium on.
paymentsRouter.post('/admin/approve', requireSuperAdmin, async (req: Request, res: Response) => {
  const paymentId = String(req.body?.paymentId || '');
  if (!paymentId || paymentId.includes('/')) {
    return res.status(400).json({ success: false, error: 'paymentId is required' });
  }
  const adminEmail = req.user?.email || 'mejennur669@gmail.com';

  const pricing = await getPricing();
  const today = toYmd(new Date());
  const base = new Date(`${today}T00:00:00Z`);
  base.setUTCDate(base.getUTCDate() + (pricing.billingCycleDays || 30));
  const expiresAt = toYmd(base);

  // 1. Try live Firestore transaction
  try {
    const result = await adminDb.runTransaction(async (tx) => {
      const payRef = adminDb.collection('payments').doc(paymentId);
      const paySnap = await tx.get(payRef);
      if (!paySnap.exists) return { code: 404 as const };
      const pay = paySnap.data()!;
      const status = String(pay.status || '').toLowerCase();
      if (status === 'approved') return { code: 200 as const, already: true, expiresAt: pay.expiresAt as string };
      if (status !== 'pending') return { code: 409 as const };

      const uid = String(pay.studentId || pay.userId || '');
      if (!uid) return { code: 422 as const };
      const userRef = adminDb.collection('users').doc(uid);
      const userSnap = await tx.get(userRef);

      const existing = String(userSnap.data()?.premiumExpiresAt || '');
      const baseStr = existing && existing > today ? existing : today;
      const expDate = new Date(`${baseStr}T00:00:00Z`);
      expDate.setUTCDate(expDate.getUTCDate() + (pricing.billingCycleDays || 30));
      const finalExpiresAt = toYmd(expDate);
      const plan = `${pay.grade || 10}ኛ ክፍል ወርሃዊ ሙሉ ፈቃድ`;

      tx.update(payRef, {
        status: 'approved',
        reviewedAt: FieldValue.serverTimestamp(),
        reviewedBy: adminEmail,
        expiresAt: finalExpiresAt,
      });
      tx.set(
        userRef,
        {
          isPremium: true,
          premiumExpiresAt: finalExpiresAt,
          premiumPlan: plan,
          premiumGateway: pay.paymentGateway || '',
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      tx.set(
        adminDb.collection('subscriptions').doc(uid),
        {
          status: 'ACTIVE',
          isPremium: true,
          expiresAt: finalExpiresAt,
          planTitle: plan,
          amountPaid: pay.amount ?? null,
          activePaymentId: paymentId,
          activatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      tx.set(
        adminDb.collection('entitlements').doc(uid),
        { isPremium: true, expiresAt: finalExpiresAt, plan, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
      return { code: 200 as const, already: false, expiresAt: finalExpiresAt };
    });

    if (result.code === 200) {
      return res.json({ success: true, paymentId, already: result.already, expiresAt: result.expiresAt });
    }
  } catch (err: any) {
    console.warn('[paymentsApi] Firestore approve transaction unavailable, falling back to local persistent store:', err?.message || err);
  }

  // 2. Fallback approval for persistent store
  const allFallback = readFallbackPayments();
  const fallbackPay = allFallback[paymentId];
  if (fallbackPay) {
    fallbackPay.status = 'approved';
    fallbackPay.reviewedAt = new Date().toISOString();
    fallbackPay.reviewedBy = adminEmail;
    fallbackPay.expiresAt = expiresAt;
    saveFallbackPayment(paymentId, fallbackPay);

    // Save student premium status to fallback users
    const uid = fallbackPay.studentId || fallbackPay.userId;
    if (uid) {
      ensureDataDir();
      try {
        let users: Record<string, any> = {};
        if (fs.existsSync(USERS_FILE)) {
          users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
        }
        users[uid] = {
          ...(users[uid] || {}),
          isPremium: true,
          premiumExpiresAt: expiresAt,
          updatedAt: new Date().toISOString(),
        };
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
      } catch (e) {
        console.error('Failed to update fallback user:', e);
      }
    }

    return res.json({ success: true, paymentId, already: false, expiresAt });
  }

  return res.status(404).json({ success: false, error: 'Payment not found' });
});


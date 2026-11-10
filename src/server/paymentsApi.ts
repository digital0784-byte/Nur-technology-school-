import { Router, Request, Response } from 'express';
import { adminDb, FieldValue } from './adminDb';
import { requireSuperAdmin } from './authMiddleware';

export const paymentsRouter = Router();

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
    console.error('Pricing lookup failed, using defaults:', e);
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

// POST /api/payment/submit  — the ONLY way a student payment record is created.
// Identity comes from the verified token, grade/name from the user's profile,
// the amount from server-side pricing. The document id (gateway_ref) is unique,
// so the same transaction number can never be submitted twice.
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
    const profileSnap = await adminDb.collection('users').doc(user.uid).get();
    const profile = profileSnap.data() || {};
    const grade = [9, 10, 11, 12].includes(Number(profile.grade)) ? Number(profile.grade) : 9;
    const pricing = await getPricing();
    const amount = priceForGrade(pricing, grade);

    const pending = await adminDb
      .collection('payments')
      .where('userId', '==', user.uid)
      .where('status', '==', 'pending')
      .limit(MAX_PENDING_PER_USER)
      .get();
    if (pending.size >= MAX_PENDING_PER_USER) {
      return res.status(429).json({
        success: false,
        error: 'ብዙ ያልተረጋገጡ ክፍያዎች አሉዎት። እባክዎ አድሚኑ እስኪያረጋግጥ ይጠብቁ።',
      });
    }

    const id = `${gateway}_${ref}`;
    const data = {
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
      createdAt: FieldValue.serverTimestamp(),
    };

    try {
      await adminDb.collection('payments').doc(id).create(data);
    } catch (e: any) {
      if (e?.code === 6 || String(e?.message || '').includes('ALREADY_EXISTS')) {
        return res.status(409).json({
          success: false,
          error: 'ይህ የግብይት ቁጥር ቀድሞ ገብቷል / This transaction ID was already submitted.',
        });
      }
      throw e;
    }

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

    return res.json({
      success: true,
      submission: { id, ...data, createdAt: null },
    });
  } catch (e: any) {
    console.error('payment submit failed:', e);
    return res.status(500).json({ success: false, error: 'ክፍያውን መመዝገብ አልተቻለም። እባክዎ ቆይተው ይሞክሩ።' });
  }
});

// GET /api/payment/admin/notifications — pending payments for the Super Admin.
paymentsRouter.get('/admin/notifications', requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const pendingOnly = req.query.pending === 'true';
    let q: FirebaseFirestore.Query = adminDb.collection('payments');
    if (pendingOnly) q = q.where('status', '==', 'pending');
    const snap = await q.limit(200).get();
    const notifications = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({
      success: true,
      count: notifications.length,
      pendingCount: notifications.filter((n: any) => n.status === 'pending').length,
      notifications,
    });
  } catch (e) {
    console.error('notifications failed:', e);
    res.status(500).json({ success: false, error: 'Failed to load payments' });
  }
});

// POST /api/payment/admin/approve — approves a payment and switches Premium on,
// all in one Firestore transaction (idempotent).
paymentsRouter.post('/admin/approve', requireSuperAdmin, async (req: Request, res: Response) => {
  const paymentId = String(req.body?.paymentId || '');
  if (!paymentId || paymentId.includes('/')) {
    return res.status(400).json({ success: false, error: 'paymentId is required' });
  }
  const adminEmail = req.user?.email || '';

  try {
    const pricing = await getPricing();
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

      // Extend from the current expiry if the student is still active.
      const today = toYmd(new Date());
      const existing = String(userSnap.data()?.premiumExpiresAt || '');
      const baseStr = existing && existing > today ? existing : today;
      const base = new Date(`${baseStr}T00:00:00Z`);
      base.setUTCDate(base.getUTCDate() + (pricing.billingCycleDays || 30));
      const expiresAt = toYmd(base);
      const plan = `${pay.grade || 10}ኛ ክፍል ወርሃዊ ሙሉ ፈቃድ`;

      tx.update(payRef, {
        status: 'approved',
        reviewedAt: FieldValue.serverTimestamp(),
        reviewedBy: adminEmail,
        expiresAt,
      });
      tx.set(
        userRef,
        {
          isPremium: true,
          premiumExpiresAt: expiresAt,
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
          expiresAt,
          planTitle: plan,
          amountPaid: pay.amount ?? null,
          activePaymentId: paymentId,
          activatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      tx.set(
        adminDb.collection('entitlements').doc(uid),
        { isPremium: true, expiresAt, plan, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
      tx.set(adminDb.collection('audit_logs').doc(), {
        scope: 'payment',
        actorUid: req.user!.uid,
        actorEmail: adminEmail,
        action: 'APPROVED',
        targetUserId: uid,
        targetPaymentId: paymentId,
        details: `Approved ${pay.amount} ETB until ${expiresAt}`,
        previousStatus: 'PENDING',
        newStatus: 'APPROVED',
        createdAt: FieldValue.serverTimestamp(),
      });
      return { code: 200 as const, already: false, expiresAt };
    });

    if (result.code === 404) return res.status(404).json({ success: false, error: 'Payment not found' });
    if (result.code === 409) return res.status(409).json({ success: false, error: 'Payment is not pending' });
    if (result.code === 422) return res.status(422).json({ success: false, error: 'Payment has no student id' });
    return res.json({ success: true, paymentId, already: result.already, expiresAt: result.expiresAt });
  } catch (e) {
    console.error('approve failed:', e);
    return res.status(500).json({ success: false, error: 'Approval failed' });
  }
});

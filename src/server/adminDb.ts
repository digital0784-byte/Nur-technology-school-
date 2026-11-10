import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'nur-technology-school';

// Single place where firebase-admin is initialised (authMiddleware imports this file too).
// Credential order:
//   1. FIREBASE_SERVICE_ACCOUNT_JSON  – the full service-account JSON pasted as a secret/env var
//      (easiest on AI Studio / any host outside the Firebase project).
//   2. Application Default Credentials – automatic on Cloud Run/GCE when the runtime service account
//      has been granted access to the Firebase project, or via GOOGLE_APPLICATION_CREDENTIALS.
if (!getApps().length) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  let done = false;
  if (raw) {
    try {
      const sa = JSON.parse(raw);
      initializeApp({ credential: cert(sa), projectId: sa.project_id || PROJECT_ID });
      done = true;
      console.log('[firebase-admin] using FIREBASE_SERVICE_ACCOUNT_JSON for', sa.project_id || PROJECT_ID);
    } catch (e: any) {
      console.error('[firebase-admin] FIREBASE_SERVICE_ACCOUNT_JSON is invalid, falling back to default credentials:', e?.message || e);
    }
  }
  if (!done) initializeApp({ projectId: PROJECT_ID });
}

export const adminDb = getFirestore();
// REST transport: a missing/invalid credential becomes a normal rejected promise (handled by callers)
// instead of an unhandled gRPC error that can terminate the process.
try { adminDb.settings({ preferRest: true }); } catch { /* already initialised */ }
export { FieldValue };

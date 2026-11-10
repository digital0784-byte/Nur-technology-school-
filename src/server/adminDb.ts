import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'nur-technology-school';

// Uses Application Default Credentials: automatic on Cloud Run / GCE, or set
// GOOGLE_APPLICATION_CREDENTIALS to a service-account key file when running elsewhere.
if (!getApps().length) initializeApp({ projectId: PROJECT_ID });

export const adminDb = getFirestore();
export { FieldValue };

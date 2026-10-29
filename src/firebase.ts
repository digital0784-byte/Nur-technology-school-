import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase web config is PUBLIC by design (it only identifies the project; data is
// protected by firestore.rules). Env vars override these defaults if set.
const env = import.meta.env;
export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyD4jentItnXSqzVnr5tZ6zr1r_4UjTbEfM',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'nur-technology-school.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'nur-technology-school',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'nur-technology-school.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '216526332715',
  appId: env.VITE_FIREBASE_APP_ID || '1:216526332715:web:443060888f2074f35c9b6e',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

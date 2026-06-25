import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const requiredFirebaseEnv = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const missingFirebaseEnvVars = Object.entries(requiredFirebaseEnv)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const isFirebaseConfigured = missingFirebaseEnvVars.length === 0;

const firebaseConfig = {
  apiKey: requiredFirebaseEnv.NEXT_PUBLIC_FIREBASE_API_KEY ?? "build-only-api-key",
  authDomain: requiredFirebaseEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "build-only.firebaseapp.com",
  projectId: requiredFirebaseEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "build-only",
  storageBucket: requiredFirebaseEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "build-only.appspot.com",
  messagingSenderId: requiredFirebaseEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "000000000000",
  appId: requiredFirebaseEnv.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:000000000000:web:0000000000000000000000",
};

const hasExistingApp = getApps().length > 0;

export const app = hasExistingApp ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db =
  hasExistingApp
    ? getFirestore(app)
    : initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
      });
export const storage = getStorage(app);

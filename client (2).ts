// ============================================
// 🔥 Firebase Client — Lazy + Safe
// ============================================

import { initializeApp, getApps } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

export const hasFirebaseConfig = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let _auth: Auth | null = null;
let _db: Firestore | null = null;

export function getFirebaseAuth(): Auth {
  if (!_auth) {
    const { getAuth } = require("firebase/auth");
    _auth = getAuth(app);
  }
  return _auth!;
}

export async function getFirebaseDb(): Promise<Firestore> {
  if (!_db) {
    const { getFirestore } = await import("firebase/firestore");
    _db = getFirestore(app);
  }
  return _db;
}

export { app };

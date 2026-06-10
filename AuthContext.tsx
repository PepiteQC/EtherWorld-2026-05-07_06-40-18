// ============================================
// 🔐 Auth Context — Guest Mode + Firebase prêt
// ============================================

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getFirebaseAuth, getFirebaseDb, hasFirebaseConfig } from "@/lib/firebase/client";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type { User } from "firebase/auth";

export interface PlayerProfile {
  uid: string;
  username: string;
  email: string;
  is_admin: boolean;
  role: "player" | "admin" | "moderator";
  avatar: { skin_color: string; hair_color: string; hair_style: string; body_type: string };
  created_at: string;
}

interface AuthState {
  user: User | null;
  profile: PlayerProfile | null;
  loading: boolean;
  isGuest: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  joinAsGuest: (username: string) => void;
  getFirebaseToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthState | null>(null);
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

const GUEST_KEY = "etherworld_guest";
function defAvatar() { return { skin_color: "#f5d0c5", hair_color: "#4a3728", hair_style: "short", body_type: "default" }; }
function makeProfile(uid: string, username: string, email: string): PlayerProfile {
  return { uid, username, email, is_admin: true, role: "admin", avatar: defAvatar(), created_at: new Date().toISOString() };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasFirebaseConfig) {
      const stored = localStorage.getItem(GUEST_KEY);
      if (stored) { try { setProfile(JSON.parse(stored).profile); } catch {} }
      setLoading(false);
      return;
    }
    try {
      const auth = getFirebaseAuth();
      const unsub = onAuthStateChanged(auth, async (fbUser) => {
        setUser(fbUser);
        if (fbUser) {
          try {
            const db = await getFirebaseDb();
            const snap = await getDoc(doc(db, "players", fbUser.uid));
            if (snap.exists()) setProfile(snap.data() as PlayerProfile);
          } catch {}
        } else { setProfile(null); }
        setLoading(false);
      });
      return unsub;
    } catch { setLoading(false); }
  }, []);

  async function login(email: string, password: string) {
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function register(email: string, password: string, username: string) {
    const auth = getFirebaseAuth();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: username });
    const p = makeProfile(cred.user.uid, username, email);
    const db = await getFirebaseDb();
    await setDoc(doc(db, "users", cred.user.uid), p);
    setProfile(p);
  }

  async function loginWithGoogle() {
    const auth = getFirebaseAuth();
    const cred = await signInWithPopup(auth, new GoogleAuthProvider());
    const db = await getFirebaseDb();
    const existing = await getDoc(doc(db, "players", cred.user.uid));
    if (!existing.exists()) {
      const p = makeProfile(cred.user.uid, cred.user.displayName || "Player", cred.user.email || "");
      await setDoc(doc(db, "users", cred.user.uid), p);
      setProfile(p);
    } else { setProfile(existing.data() as PlayerProfile); }
  }

  async function logout() {
    try { if (hasFirebaseConfig && user) { const auth = getFirebaseAuth(); await signOut(auth); } } catch {}
    localStorage.removeItem(GUEST_KEY);
    setUser(null); setProfile(null);
  }

  function joinAsGuest(username: string) {
    const uid = "guest_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const p = makeProfile(uid, username, "");
    setProfile(p);
    localStorage.setItem(GUEST_KEY, JSON.stringify({ profile: p }));
  }

  async function getFirebaseToken(): Promise<string | null> {
    try { if (hasFirebaseConfig && user) return await user.getIdToken(); } catch {}
    if (profile) return `guest_${profile.uid}`;
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, isGuest: !user && !!profile, isLoggedIn: !!user || !!profile, login, register, loginWithGoogle, logout, joinAsGuest, getFirebaseToken }}>
      {children}
    </AuthContext.Provider>
  );
}

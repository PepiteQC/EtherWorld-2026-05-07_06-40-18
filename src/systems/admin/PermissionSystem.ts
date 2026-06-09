// src/systems/admin/PermissionSystem.ts

import { db } from "@/lib/firebase/config";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { EtherworldPlayer } from "./types";

const ROLE_LEVELS: Record<string, number> = {
  player: 0,
  mod: 1,
  staff: 2,
  admin: 3,
  owner: 99,
};

export class PermissionSystem {
  private static adminCache: Map<string, string> = new Map(); // uid → role

  static async loadAdmins(): Promise<void> {
    try {
      const snap = await getDocs(collection(db, "admins"));
      snap.forEach((d) => {
        this.adminCache.set(d.id, d.data().role || "mod");
      });
      console.log(`[ETHERWORLD] ✅ ${this.adminCache.size} admin(s) chargés`);
    } catch (err) {
      console.error("[ETHERWORLD] ❌ Erreur chargement admins:", err);
    }
  }

  static async getPlayerRole(uid: string): Promise<string> {
    // Cache local d'abord
    if (this.adminCache.has(uid)) {
      return this.adminCache.get(uid)!;
    }

    // Sinon Firebase
    try {
      const ref = doc(db, "admins", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const role = snap.data().role || "mod";
        this.adminCache.set(uid, role);
        return role;
      }
    } catch {}

    return "player";
  }

  static hasPermission(
    playerRole: string,
    requiredRole: "mod" | "admin" | "owner"
  ): boolean {
    return (
      (ROLE_LEVELS[playerRole] ?? 0) >= (ROLE_LEVELS[requiredRole] ?? 99)
    );
  }

  static getRoleBadge(role: string): string {
    const badges: Record<string, string> = {
      owner: "👑 OWNER",
      admin: "🛡️ ADMIN",
      staff: "⭐ STAFF",
      mod: "🔧 MOD",
      player: "🎮 PLAYER",
    };
    return badges[role] ?? "🎮 PLAYER";
  }
}
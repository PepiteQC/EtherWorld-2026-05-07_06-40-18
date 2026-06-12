// ============================================
// 🌐 API Client — Parle au serveur Node
// ============================================

const API_URL = "http://localhost:4000";

export interface ServerHealth {
  status: string;
  time: string;
  version?: string;
}

async function getFirebaseToken(): Promise<string | null> {
  // Guest token from localStorage
  const raw = localStorage.getItem("etherworld_guest");
  if (raw) {
    try {
      const data = JSON.parse(raw);
      return `guest_${data.profile.uid}`;
    } catch {}
  }
  return null;
}

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getFirebaseToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(body.error || `API Error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function checkServerHealth(): Promise<ServerHealth | null> {
  try {
    return await apiFetch<ServerHealth>("/health");
  } catch {
    return null;
  }
}

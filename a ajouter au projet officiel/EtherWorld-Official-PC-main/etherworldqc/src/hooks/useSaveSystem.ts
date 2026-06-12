// ============================================
// 💾 Save System — localStorage
// ============================================

const SAVE_KEY = "etherworld_save";

export interface SaveData {
  version: number;
  mode: "driving" | "walking";
  vehiclePos: [number, number, number];
  vehicleRotY: number;
  walkerPos?: [number, number, number];
  zone: string;
  money: number;
  isNewPlayer: boolean;
}

export function readSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch {
    return null;
  }
}

export function writeSave(data: SaveData): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {}
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function hasSave(): boolean {
  return !!localStorage.getItem(SAVE_KEY);
}

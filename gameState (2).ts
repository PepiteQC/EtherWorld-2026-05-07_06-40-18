// ============================================
// 🎮 Game State — Zustand Store
// ============================================

import { create } from "zustand";

export interface ActiveJob {
  id: string;
  label: string;
  durationMs: number;
  reward: number;
  startedAt: number;
}

interface GameState {
  money: number;
  activeJobs: ActiveJob[];
  jobCooldowns: Record<string, number>; // jobId -> timestamp when available again

  // Actions
  addMoney: (amount: number) => void;
  startJob: (job: { id: string; label: string; durationMs: number; reward: number }) => void;
  canStartJob: (jobId: string) => boolean;
  getJobCooldownSec: (jobId: string) => number;
}

export const useGameStore = create<GameState>((set, get) => ({
  money: 0,
  activeJobs: [],
  jobCooldowns: {},

  addMoney: (amount) => set((s) => ({ money: s.money + amount })),

  startJob: (job) => {
    const state = get();
    if (!state.canStartJob(job.id)) return;

    const activeJob: ActiveJob = {
      id: job.id,
      label: job.label,
      durationMs: job.durationMs,
      reward: job.reward,
      startedAt: Date.now(),
    };

    set((s) => ({ activeJobs: [...s.activeJobs, activeJob] }));

    // Complete job after duration
    setTimeout(() => {
      set((s) => ({
        money: s.money + job.reward,
        activeJobs: s.activeJobs.filter((j) => j.id !== job.id),
        jobCooldowns: { ...s.jobCooldowns, [job.id]: Date.now() + 30_000 },
      }));
    }, job.durationMs);
  },

  canStartJob: (jobId) => {
    const state = get();
    if (state.activeJobs.some((j) => j.id === jobId)) return false;
    const cooldownEnd = state.jobCooldowns[jobId];
    if (cooldownEnd && Date.now() < cooldownEnd) return false;
    return true;
  },

  getJobCooldownSec: (jobId) => {
    const cooldownEnd = get().jobCooldowns[jobId];
    if (!cooldownEnd) return 0;
    const remaining = cooldownEnd - Date.now();
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  },
}));

// Non-hook access
export const startJob = useGameStore.getState().startJob;
export const canStartJob = useGameStore.getState().canStartJob;
export const getJobCooldownSec = useGameStore.getState().getJobCooldownSec;
export const getState = useGameStore.getState;

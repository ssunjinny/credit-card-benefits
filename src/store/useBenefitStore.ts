import { create } from 'zustand';
import { BenefitLog, BenefitWithProgress } from '../types';
import { BENEFITS, getBenefitById } from '../constants/benefits';
import {
  getOnboarded,
  loadAppState,
  saveAppState,
  setOnboarded as persistOnboarded,
} from './storage';

interface BenefitStore {
  logs: BenefitLog[];
  lastResetYear: number;
  isLoaded: boolean;
  onboarded: boolean;
  initialize: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  addLog: (log: BenefitLog) => Promise<void>;
  deleteLog: (logId: string) => Promise<void>;
  resetYear: () => Promise<void>;
  getBenefitWithProgress: (benefitId: string) => BenefitWithProgress | null;
  getAllBenefitsWithProgress: () => BenefitWithProgress[];
}

const currentYear = () => new Date().getFullYear();

const inCurrentYear = (log: BenefitLog, year: number): boolean => {
  const d = new Date(log.date);
  return d.getFullYear() === year;
};

export const useBenefitStore = create<BenefitStore>((set, get) => ({
  logs: [],
  lastResetYear: currentYear(),
  isLoaded: false,
  onboarded: false,

  initialize: async () => {
    const [stored, onboarded] = await Promise.all([loadAppState(), getOnboarded()]);
    const year = currentYear();
    if (!stored) {
      const fresh = { logs: [], lastResetYear: year };
      await saveAppState(fresh);
      set({ logs: [], lastResetYear: year, onboarded, isLoaded: true });
      return;
    }
    if (year > stored.lastResetYear) {
      // Jan 1 reset: clear jan1-resetting logs from previous years.
      // Keep per_use benefit logs (e.g. Global Entry every 4 years).
      const perUseIds = new Set(
        BENEFITS.filter((b) => b.resetType === 'per_use').map((b) => b.id)
      );
      const keptLogs = stored.logs.filter((l) => perUseIds.has(l.benefitId));
      const next = { logs: keptLogs, lastResetYear: year };
      await saveAppState(next);
      set({ ...next, onboarded, isLoaded: true });
      return;
    }
    set({
      logs: stored.logs,
      lastResetYear: stored.lastResetYear,
      onboarded,
      isLoaded: true,
    });
  },

  completeOnboarding: async () => {
    await persistOnboarded();
    set({ onboarded: true });
  },

  addLog: async (log) => {
    const next = [...get().logs, log];
    set({ logs: next });
    await saveAppState({ logs: next, lastResetYear: get().lastResetYear });
  },

  deleteLog: async (logId) => {
    const next = get().logs.filter((l) => l.id !== logId);
    set({ logs: next });
    await saveAppState({ logs: next, lastResetYear: get().lastResetYear });
  },

  resetYear: async () => {
    const year = currentYear();
    const perUseIds = new Set(
      BENEFITS.filter((b) => b.resetType === 'per_use').map((b) => b.id)
    );
    const keptLogs = get().logs.filter((l) => perUseIds.has(l.benefitId));
    set({ logs: keptLogs, lastResetYear: year });
    await saveAppState({ logs: keptLogs, lastResetYear: year });
  },

  getBenefitWithProgress: (benefitId) => {
    const benefit = getBenefitById(benefitId);
    if (!benefit) return null;
    const year = currentYear();
    const allLogs = get().logs.filter((l) => l.benefitId === benefitId);
    const yearLogs =
      benefit.resetType === 'per_use'
        ? allLogs
        : allLogs.filter((l) => inCurrentYear(l, year));
    const used = yearLogs.reduce((sum, l) => sum + l.valueAmount, 0);
    return { ...benefit, currentYearUsed: used, logs: allLogs };
  },

  getAllBenefitsWithProgress: () => {
    const year = currentYear();
    const logs = get().logs;
    return BENEFITS.map((benefit) => {
      const all = logs.filter((l) => l.benefitId === benefit.id);
      const yearLogs =
        benefit.resetType === 'per_use'
          ? all
          : all.filter((l) => inCurrentYear(l, year));
      const used = yearLogs.reduce((sum, l) => sum + l.valueAmount, 0);
      return { ...benefit, currentYearUsed: used, logs: all };
    });
  },
}));

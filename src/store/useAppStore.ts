import { create } from 'zustand'

import { BENEFITS, findBenefit, computeBenefitProgress } from '@/features/benefits'
import type { BenefitWithProgress } from '@/features/benefits'
import type { BenefitLog } from '@/features/logs/types'
import { storage } from '@/lib/storage'
import { currentYear } from '@/lib/date'

const STATE_STORAGE_KEY = 'amex_tracker_state'
const ONBOARDING_KEY = 'amex_tracker_onboarded'

type PersistedState = {
  logs: BenefitLog[]
  lastResetYear: number
}

type AppStore = {
  logs: BenefitLog[]
  lastResetYear: number
  isLoaded: boolean
  hasOnboarded: boolean

  initialize: () => Promise<void>
  completeOnboarding: () => Promise<void>
  addLog: (log: BenefitLog) => Promise<void>
  deleteLog: (id: string) => Promise<void>
  resetCurrentYear: () => Promise<void>

  getBenefitProgress: (id: string) => BenefitWithProgress | null
  getAllBenefitsWithProgress: () => BenefitWithProgress[]
}

const persist = async (state: PersistedState) => {
  await storage.setItem(STATE_STORAGE_KEY, JSON.stringify(state))
}

const readPersisted = async (): Promise<PersistedState | null> => {
  const raw = await storage.getItem(STATE_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as PersistedState
  } catch {
    return null
  }
}

const perUseBenefitIds = new Set(
  BENEFITS.filter((benefit) => benefit.resetType === 'per_use').map((b) => b.id),
)

const dropExpiredLogs = (logs: BenefitLog[]) =>
  logs.filter((log) => perUseBenefitIds.has(log.benefitId))

export const useAppStore = create<AppStore>((set, get) => ({
  logs: [],
  lastResetYear: currentYear(),
  isLoaded: false,
  hasOnboarded: false,

  initialize: async () => {
    const [persisted, onboarded] = await Promise.all([
      readPersisted(),
      storage.getItem(ONBOARDING_KEY),
    ])
    const year = currentYear()

    if (!persisted) {
      const fresh: PersistedState = { logs: [], lastResetYear: year }
      await persist(fresh)
      set({ ...fresh, hasOnboarded: onboarded === 'true', isLoaded: true })
      return
    }

    if (year > persisted.lastResetYear) {
      const next: PersistedState = {
        logs: dropExpiredLogs(persisted.logs),
        lastResetYear: year,
      }
      await persist(next)
      set({ ...next, hasOnboarded: onboarded === 'true', isLoaded: true })
      return
    }

    set({
      logs: persisted.logs,
      lastResetYear: persisted.lastResetYear,
      hasOnboarded: onboarded === 'true',
      isLoaded: true,
    })
  },

  completeOnboarding: async () => {
    await storage.setItem(ONBOARDING_KEY, 'true')
    set({ hasOnboarded: true })
  },

  addLog: async (log) => {
    const next = [...get().logs, log]
    set({ logs: next })
    await persist({ logs: next, lastResetYear: get().lastResetYear })
  },

  deleteLog: async (id) => {
    const next = get().logs.filter((log) => log.id !== id)
    set({ logs: next })
    await persist({ logs: next, lastResetYear: get().lastResetYear })
  },

  resetCurrentYear: async () => {
    const year = currentYear()
    const next: PersistedState = {
      logs: dropExpiredLogs(get().logs),
      lastResetYear: year,
    }
    set({ ...next })
    await persist(next)
  },

  getBenefitProgress: (id) => {
    const benefit = findBenefit(id)
    if (!benefit) return null
    return { ...benefit, progress: computeBenefitProgress(benefit, get().logs) }
  },

  getAllBenefitsWithProgress: () => {
    const logs = get().logs
    return BENEFITS.map((benefit) => ({
      ...benefit,
      progress: computeBenefitProgress(benefit, logs),
    }))
  },
}))

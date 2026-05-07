import { create } from 'zustand'

import { BENEFITS, findBenefit, computeBenefitProgress } from '@/features/benefits'
import type { BenefitWithProgress } from '@/features/benefits'
import type { BenefitLog } from '@/features/logs/types'
import type { NetWorthItem } from '@/features/networth'
import { storage } from '@/lib/storage'
import { generateId } from '@/lib/id'
import { currentYear } from '@/lib/date'

const STATE_STORAGE_KEY = 'amex_tracker_state'
const ONBOARDING_KEY = 'amex_tracker_onboarded'
const NETWORTH_STORAGE_KEY = 'nwm_networth_items'

type PersistedBenefitsState = {
  logs: BenefitLog[]
  lastResetYear: number
}

type PersistedNetWorthState = {
  items: NetWorthItem[]
}

type AddItemInput = Omit<NetWorthItem, 'id' | 'updatedAt'>

type UpdateItemPatch = Partial<Omit<NetWorthItem, 'id'>>

type AppStore = {
  logs: BenefitLog[]
  lastResetYear: number
  isLoaded: boolean
  hasOnboarded: boolean
  items: NetWorthItem[]

  initialize: () => Promise<void>
  completeOnboarding: () => Promise<void>
  addLog: (log: BenefitLog) => Promise<void>
  deleteLog: (id: string) => Promise<void>
  resetCurrentYear: () => Promise<void>

  addItem: (input: AddItemInput) => Promise<NetWorthItem>
  updateItem: (id: string, patch: UpdateItemPatch) => Promise<void>
  deleteItem: (id: string) => Promise<void>

  getBenefitProgress: (id: string) => BenefitWithProgress | null
  getAllBenefitsWithProgress: () => BenefitWithProgress[]
}

const persistBenefits = async (state: PersistedBenefitsState) => {
  await storage.setItem(STATE_STORAGE_KEY, JSON.stringify(state))
}

const persistNetWorth = async (state: PersistedNetWorthState) => {
  await storage.setItem(NETWORTH_STORAGE_KEY, JSON.stringify(state))
}

const readPersistedBenefits = async (): Promise<PersistedBenefitsState | null> => {
  const raw = await storage.getItem(STATE_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as PersistedBenefitsState
  } catch {
    return null
  }
}

const readPersistedNetWorth = async (): Promise<PersistedNetWorthState | null> => {
  const raw = await storage.getItem(NETWORTH_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as PersistedNetWorthState
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
  items: [],

  initialize: async () => {
    const [persistedBenefits, persistedNetWorth, onboarded] = await Promise.all([
      readPersistedBenefits(),
      readPersistedNetWorth(),
      storage.getItem(ONBOARDING_KEY),
    ])
    const year = currentYear()

    const networth = persistedNetWorth ?? { items: [] }
    if (!persistedNetWorth) {
      await persistNetWorth(networth)
    }

    if (!persistedBenefits) {
      const fresh: PersistedBenefitsState = { logs: [], lastResetYear: year }
      await persistBenefits(fresh)
      set({
        ...fresh,
        ...networth,
        hasOnboarded: onboarded === 'true',
        isLoaded: true,
      })
      return
    }

    if (year > persistedBenefits.lastResetYear) {
      const next: PersistedBenefitsState = {
        logs: dropExpiredLogs(persistedBenefits.logs),
        lastResetYear: year,
      }
      await persistBenefits(next)
      set({
        ...next,
        ...networth,
        hasOnboarded: onboarded === 'true',
        isLoaded: true,
      })
      return
    }

    set({
      logs: persistedBenefits.logs,
      lastResetYear: persistedBenefits.lastResetYear,
      ...networth,
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
    await persistBenefits({ logs: next, lastResetYear: get().lastResetYear })
  },

  deleteLog: async (id) => {
    const next = get().logs.filter((log) => log.id !== id)
    set({ logs: next })
    await persistBenefits({ logs: next, lastResetYear: get().lastResetYear })
  },

  resetCurrentYear: async () => {
    const year = currentYear()
    const next: PersistedBenefitsState = {
      logs: dropExpiredLogs(get().logs),
      lastResetYear: year,
    }
    set({ ...next })
    await persistBenefits(next)
  },

  addItem: async (input) => {
    const item: NetWorthItem = {
      ...input,
      id: generateId(),
      updatedAt: new Date().toISOString(),
    }
    const nextItems = [...get().items, item]
    set({ items: nextItems })
    await persistNetWorth({ items: nextItems })
    return item
  },

  updateItem: async (id, patch) => {
    const nextItems = get().items.map((item) =>
      item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item,
    )
    set({ items: nextItems })
    await persistNetWorth({ items: nextItems })
  },

  deleteItem: async (id) => {
    const nextItems = get().items.filter((item) => item.id !== id)
    set({ items: nextItems })
    await persistNetWorth({ items: nextItems })
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

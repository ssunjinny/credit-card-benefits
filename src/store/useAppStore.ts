import { create } from 'zustand'

import { BENEFITS, findBenefit, computeBenefitProgress } from '@/features/benefits'
import type { BenefitWithProgress } from '@/features/benefits'
import type { BenefitLog } from '@/features/logs/types'
import type { Account, BalanceSnapshot } from '@/features/networth'
import { storage } from '@/lib/storage'
import { generateId } from '@/lib/id'
import { currentYear, today } from '@/lib/date'

const STATE_STORAGE_KEY = 'amex_tracker_state'
const ONBOARDING_KEY = 'amex_tracker_onboarded'
const NETWORTH_STORAGE_KEY = 'nwm_networth_state'

type PersistedBenefitsState = {
  logs: BenefitLog[]
  lastResetYear: number
}

type PersistedNetWorthState = {
  accounts: Account[]
  balances: BalanceSnapshot[]
}

type AddAccountInput = Omit<Account, 'id' | 'createdAt'> & {
  startingBalanceCents?: number
  startingBalanceDate?: string
}

type RecordBalanceInput = {
  accountId: string
  amountCents: number
  takenAt?: string
  note?: string
}

type AppStore = {
  logs: BenefitLog[]
  lastResetYear: number
  isLoaded: boolean
  hasOnboarded: boolean
  accounts: Account[]
  balances: BalanceSnapshot[]

  initialize: () => Promise<void>
  completeOnboarding: () => Promise<void>
  addLog: (log: BenefitLog) => Promise<void>
  deleteLog: (id: string) => Promise<void>
  resetCurrentYear: () => Promise<void>

  addAccount: (input: AddAccountInput) => Promise<Account>
  updateAccount: (id: string, patch: Partial<Omit<Account, 'id' | 'createdAt'>>) => Promise<void>
  deleteAccount: (id: string) => Promise<void>
  recordBalance: (input: RecordBalanceInput) => Promise<BalanceSnapshot>
  deleteBalance: (id: string) => Promise<void>

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
  accounts: [],
  balances: [],

  initialize: async () => {
    const [persistedBenefits, persistedNetWorth, onboarded] = await Promise.all([
      readPersistedBenefits(),
      readPersistedNetWorth(),
      storage.getItem(ONBOARDING_KEY),
    ])
    const year = currentYear()

    const networth = persistedNetWorth ?? { accounts: [], balances: [] }
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

  addAccount: async ({ startingBalanceCents, startingBalanceDate, ...rest }) => {
    const account: Account = {
      ...rest,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    const nextAccounts = [...get().accounts, account]
    let nextBalances = get().balances
    if (startingBalanceCents != null && startingBalanceCents >= 0) {
      const snapshot: BalanceSnapshot = {
        id: generateId(),
        accountId: account.id,
        amountCents: startingBalanceCents,
        takenAt: startingBalanceDate ?? today(),
      }
      nextBalances = [...nextBalances, snapshot]
    }
    set({ accounts: nextAccounts, balances: nextBalances })
    await persistNetWorth({ accounts: nextAccounts, balances: nextBalances })
    return account
  },

  updateAccount: async (id, patch) => {
    const nextAccounts = get().accounts.map((account) =>
      account.id === id ? { ...account, ...patch } : account,
    )
    set({ accounts: nextAccounts })
    await persistNetWorth({ accounts: nextAccounts, balances: get().balances })
  },

  deleteAccount: async (id) => {
    const nextAccounts = get().accounts.filter((account) => account.id !== id)
    const nextBalances = get().balances.filter((balance) => balance.accountId !== id)
    set({ accounts: nextAccounts, balances: nextBalances })
    await persistNetWorth({ accounts: nextAccounts, balances: nextBalances })
  },

  recordBalance: async ({ accountId, amountCents, takenAt, note }) => {
    const snapshot: BalanceSnapshot = {
      id: generateId(),
      accountId,
      amountCents,
      takenAt: takenAt ?? today(),
      note,
    }
    const nextBalances = [...get().balances, snapshot]
    set({ balances: nextBalances })
    await persistNetWorth({ accounts: get().accounts, balances: nextBalances })
    return snapshot
  },

  deleteBalance: async (id) => {
    const nextBalances = get().balances.filter((balance) => balance.id !== id)
    set({ balances: nextBalances })
    await persistNetWorth({ accounts: get().accounts, balances: nextBalances })
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

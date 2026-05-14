import { create } from 'zustand'

import { BENEFITS, computeBenefitProgress, findBenefit } from '@/features/benefits'
import type { BenefitWithProgress } from '@/features/benefits'
import type { BenefitLog } from '@/features/logs/types'
import type {
  NetWorthItem,
  NetWorthItemCategory,
  NetWorthItemKind,
  NetWorthSnapshot,
} from '@/features/networth'
import { today } from '@/lib/date'
import { storage } from '@/lib/storage'
import { supabase } from '@/lib/supabase'

const ONBOARDING_KEY = 'amex_tracker_onboarded'

type BenefitLogRow = {
  id: string
  benefit_id: string
  log_date: string
  value_amount_cents: number
  note: string | null
}

type NetWorthItemRow = {
  id: string
  name: string
  kind: NetWorthItemKind
  category: string
  amount_cents: number
  updated_at: string
}

type NetWorthSnapshotRow = {
  id: string
  item_id: string
  amount_cents: number
  captured_at: string
  note: string | null
  created_at: string
}

type AddLogInput = {
  benefitId: string
  date: string
  valueAmountCents: number
  note: string | null
}

type AddItemInput = {
  name: string
  kind: NetWorthItemKind
  category: NetWorthItemCategory
  amountCents: number
}

type UpdateItemPatch = Partial<AddItemInput>

type LogSnapshotInput = {
  amountCents: number
  capturedAt: string
  note?: string | null
}

type UpdateSnapshotPatch = Partial<{
  amountCents: number
  capturedAt: string
  note: string | null
}>

type AppStore = {
  logs: BenefitLog[]
  items: NetWorthItem[]
  snapshots: NetWorthSnapshot[]
  hasOnboarded: boolean
  isLoaded: boolean

  loadOnboarding: () => Promise<void>
  loadForUser: (userId: string) => Promise<void>
  clear: () => void
  completeOnboarding: () => Promise<void>

  addLog: (input: AddLogInput) => Promise<void>
  deleteLog: (id: string) => Promise<void>

  addItem: (input: AddItemInput) => Promise<NetWorthItem>
  updateItem: (id: string, patch: UpdateItemPatch) => Promise<void>
  deleteItem: (id: string) => Promise<void>

  logSnapshot: (itemId: string, input: LogSnapshotInput) => Promise<void>
  updateSnapshot: (id: string, patch: UpdateSnapshotPatch) => Promise<void>
  deleteSnapshot: (id: string) => Promise<void>

  getBenefitProgress: (id: string) => BenefitWithProgress | null
  getAllBenefitsWithProgress: () => BenefitWithProgress[]
}

const logFromRow = (row: BenefitLogRow): BenefitLog => ({
  id: row.id,
  benefitId: row.benefit_id,
  date: row.log_date,
  valueAmountCents: row.value_amount_cents,
  note: row.note,
})

const itemFromRow = (row: NetWorthItemRow): NetWorthItem => ({
  id: row.id,
  name: row.name,
  kind: row.kind,
  category: row.category as NetWorthItemCategory,
  amountCents: row.amount_cents,
  updatedAt: row.updated_at,
})

const snapshotFromRow = (row: NetWorthSnapshotRow): NetWorthSnapshot => ({
  id: row.id,
  itemId: row.item_id,
  amountCents: row.amount_cents,
  capturedAt: row.captured_at,
  note: row.note,
  createdAt: row.created_at,
})

const requireUserId = async (): Promise<string> => {
  const { data } = await supabase.auth.getSession()
  const id = data.session?.user.id
  if (!id) throw new Error('Not signed in')
  return id
}

export const useAppStore = create<AppStore>((set, get) => ({
  logs: [],
  items: [],
  snapshots: [],
  hasOnboarded: false,
  isLoaded: false,

  loadOnboarding: async () => {
    const flag = await storage.getItem(ONBOARDING_KEY)
    set({ hasOnboarded: flag === 'true' })
  },

  loadForUser: async (userId) => {
    set({ isLoaded: false })
    const [logsRes, itemsRes, snapshotsRes] = await Promise.all([
      supabase
        .from('benefit_logs')
        .select('id, benefit_id, log_date, value_amount_cents, note')
        .eq('user_id', userId)
        .order('log_date', { ascending: false }),
      supabase
        .from('net_worth_items')
        .select('id, name, kind, category, amount_cents, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false }),
      supabase
        .from('net_worth_snapshots')
        .select('id, item_id, amount_cents, captured_at, note, created_at')
        .eq('user_id', userId)
        .order('captured_at', { ascending: false }),
    ])
    if (logsRes.error) throw logsRes.error
    if (itemsRes.error) throw itemsRes.error
    if (snapshotsRes.error) throw snapshotsRes.error
    set({
      logs: (logsRes.data ?? []).map(logFromRow),
      items: (itemsRes.data ?? []).map(itemFromRow),
      snapshots: (snapshotsRes.data ?? []).map(snapshotFromRow),
      isLoaded: true,
    })
  },

  clear: () => set({ logs: [], items: [], snapshots: [], isLoaded: false }),

  completeOnboarding: async () => {
    set({ hasOnboarded: true })
    await storage.setItem(ONBOARDING_KEY, 'true')
  },

  addLog: async (input) => {
    const userId = await requireUserId()
    const { data, error } = await supabase
      .from('benefit_logs')
      .insert({
        user_id: userId,
        benefit_id: input.benefitId,
        log_date: input.date,
        value_amount_cents: input.valueAmountCents,
        note: input.note,
      })
      .select('id, benefit_id, log_date, value_amount_cents, note')
      .single()
    if (error) throw error
    const log = logFromRow(data)
    set((s) => ({ logs: [log, ...s.logs] }))
  },

  deleteLog: async (id) => {
    const { error } = await supabase.from('benefit_logs').delete().eq('id', id)
    if (error) throw error
    set((s) => ({ logs: s.logs.filter((l) => l.id !== id) }))
  },

  addItem: async (input) => {
    const userId = await requireUserId()
    const { data, error } = await supabase
      .from('net_worth_items')
      .insert({
        user_id: userId,
        name: input.name,
        kind: input.kind,
        category: input.category,
        amount_cents: input.amountCents,
      })
      .select('id, name, kind, category, amount_cents, updated_at')
      .single()
    if (error) throw error
    const item = itemFromRow(data)
    set((s) => ({ items: [item, ...s.items] }))
    return item
  },

  updateItem: async (id, patch) => {
    const update: Record<string, unknown> = {}
    if (patch.name !== undefined) update.name = patch.name
    if (patch.kind !== undefined) update.kind = patch.kind
    if (patch.category !== undefined) update.category = patch.category
    if (patch.amountCents !== undefined) update.amount_cents = patch.amountCents
    const { data, error } = await supabase
      .from('net_worth_items')
      .update(update)
      .eq('id', id)
      .select('id, name, kind, category, amount_cents, updated_at')
      .single()
    if (error) throw error
    const item = itemFromRow(data)
    set((s) => ({ items: s.items.map((i) => (i.id === id ? item : i)) }))
  },

  deleteItem: async (id) => {
    const { error } = await supabase.from('net_worth_items').delete().eq('id', id)
    if (error) throw error
    set((s) => ({
      items: s.items.filter((i) => i.id !== id),
      snapshots: s.snapshots.filter((snap) => snap.itemId !== id),
    }))
  },

  logSnapshot: async (itemId, input) => {
    const userId = await requireUserId()
    const { data, error } = await supabase
      .from('net_worth_snapshots')
      .insert({
        user_id: userId,
        item_id: itemId,
        amount_cents: input.amountCents,
        captured_at: input.capturedAt,
        note: input.note ?? null,
      })
      .select('id, item_id, amount_cents, captured_at, note, created_at')
      .single()
    if (error) throw error
    const snapshot = snapshotFromRow(data)

    const shouldSyncItem = input.capturedAt === today()
    if (shouldSyncItem) {
      const { data: itemData, error: itemError } = await supabase
        .from('net_worth_items')
        .update({ amount_cents: input.amountCents })
        .eq('id', itemId)
        .select('id, name, kind, category, amount_cents, updated_at')
        .single()
      if (itemError) throw itemError
      const item = itemFromRow(itemData)
      set((s) => ({
        snapshots: [snapshot, ...s.snapshots],
        items: s.items.map((i) => (i.id === itemId ? item : i)),
      }))
      return
    }

    set((s) => ({ snapshots: [snapshot, ...s.snapshots] }))
  },

  updateSnapshot: async (id, patch) => {
    const update: Record<string, unknown> = {}
    if (patch.amountCents !== undefined) update.amount_cents = patch.amountCents
    if (patch.capturedAt !== undefined) update.captured_at = patch.capturedAt
    if (patch.note !== undefined) update.note = patch.note
    const { data, error } = await supabase
      .from('net_worth_snapshots')
      .update(update)
      .eq('id', id)
      .select('id, item_id, amount_cents, captured_at, note, created_at')
      .single()
    if (error) throw error
    const snapshot = snapshotFromRow(data)
    set((s) => ({
      snapshots: s.snapshots.map((snap) => (snap.id === id ? snapshot : snap)),
    }))
  },

  deleteSnapshot: async (id) => {
    const { error } = await supabase.from('net_worth_snapshots').delete().eq('id', id)
    if (error) throw error
    set((s) => ({ snapshots: s.snapshots.filter((snap) => snap.id !== id) }))
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

import { create } from 'zustand'

import type {
  NetWorthItem,
  NetWorthItemCategory,
  NetWorthItemKind,
  NetWorthSnapshot,
} from '@/features/networth'
import { today } from '@/lib/date'
import { storage } from '@/lib/storage'
import { supabase } from '@/lib/supabase'

const ONBOARDING_KEY = 'networthmaxxing_onboarded'

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
  items: NetWorthItem[]
  snapshots: NetWorthSnapshot[]
  hasOnboarded: boolean
  isLoaded: boolean

  loadOnboarding: () => Promise<void>
  loadForUser: (userId: string) => Promise<void>
  clear: () => void
  completeOnboarding: () => Promise<void>

  addItem: (input: AddItemInput) => Promise<NetWorthItem>
  updateItem: (id: string, patch: UpdateItemPatch) => Promise<void>
  deleteItem: (id: string) => Promise<void>

  logSnapshot: (itemId: string, input: LogSnapshotInput) => Promise<void>
  updateSnapshot: (id: string, patch: UpdateSnapshotPatch) => Promise<void>
  deleteSnapshot: (id: string) => Promise<void>
}

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

export const useAppStore = create<AppStore>((set) => ({
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
    const [itemsRes, snapshotsRes] = await Promise.all([
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
    if (itemsRes.error) throw itemsRes.error
    if (snapshotsRes.error) throw snapshotsRes.error
    set({
      items: (itemsRes.data ?? []).map(itemFromRow),
      snapshots: (snapshotsRes.data ?? []).map(snapshotFromRow),
      isLoaded: true,
    })
  },

  clear: () => set({ items: [], snapshots: [], isLoaded: false }),

  completeOnboarding: async () => {
    set({ hasOnboarded: true })
    await storage.setItem(ONBOARDING_KEY, 'true')
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
}))

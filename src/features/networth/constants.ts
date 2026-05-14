import type { NetWorthItemCategory, NetWorthItemKind } from './types'

export type CategoryMeta = {
  key: NetWorthItemCategory
  label: string
  kind: NetWorthItemKind
}

export const ITEM_CATEGORIES: CategoryMeta[] = [
  { key: 'cash', label: 'Cash', kind: 'asset' },
  { key: 'checking_account', label: 'Checking account', kind: 'asset' },
  { key: 'savings_account', label: 'Savings account', kind: 'asset' },
  { key: 'investment', label: 'Investments', kind: 'asset' },
  { key: 'crypto', label: 'Crypto', kind: 'asset' },
  { key: 'real_estate', label: 'Real estate', kind: 'asset' },
  { key: 'vehicle', label: 'Vehicle', kind: 'asset' },
  { key: 'electronics', label: 'Electronics', kind: 'asset' },
  { key: 'furniture', label: 'Furniture', kind: 'asset' },
  { key: 'other_asset', label: 'Other', kind: 'asset' },
  { key: 'credit_card', label: 'Credit card', kind: 'liability' },
  { key: 'mortgage', label: 'Mortgage', kind: 'liability' },
  { key: 'student_loan', label: 'Student loan', kind: 'liability' },
  { key: 'auto_loan', label: 'Auto loan', kind: 'liability' },
  { key: 'personal_loan', label: 'Personal loan', kind: 'liability' },
  { key: 'other_liability', label: 'Other', kind: 'liability' },
]

export const findCategory = (key: NetWorthItemCategory): CategoryMeta | null =>
  ITEM_CATEGORIES.find((meta) => meta.key === key) ?? null

export const categoriesForKind = (kind: NetWorthItemKind): CategoryMeta[] =>
  ITEM_CATEGORIES.filter((meta) => meta.kind === kind)

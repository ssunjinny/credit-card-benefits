import type { SymbolViewProps } from 'expo-symbols'

import type { AccountCategory, AccountKind } from './types'

export type CategoryMeta = {
  key: AccountCategory
  label: string
  kind: AccountKind
  symbol: SymbolViewProps['name']
}

export const ACCOUNT_CATEGORIES: CategoryMeta[] = [
  { key: 'cash', label: 'Cash', kind: 'asset', symbol: 'banknote.fill' },
  {
    key: 'investment',
    label: 'Investments',
    kind: 'asset',
    symbol: 'chart.line.uptrend.xyaxis',
  },
  { key: 'crypto', label: 'Crypto', kind: 'asset', symbol: 'bitcoinsign.circle.fill' },
  { key: 'real_estate', label: 'Real estate', kind: 'asset', symbol: 'house.fill' },
  { key: 'vehicle', label: 'Vehicle', kind: 'asset', symbol: 'car.fill' },
  { key: 'other_asset', label: 'Other', kind: 'asset', symbol: 'square.dotted' },
  { key: 'credit_card', label: 'Credit card', kind: 'liability', symbol: 'creditcard.fill' },
  { key: 'mortgage', label: 'Mortgage', kind: 'liability', symbol: 'building.2.fill' },
  {
    key: 'student_loan',
    label: 'Student loan',
    kind: 'liability',
    symbol: 'graduationcap.fill',
  },
  { key: 'auto_loan', label: 'Auto loan', kind: 'liability', symbol: 'car.fill' },
  { key: 'personal_loan', label: 'Personal loan', kind: 'liability', symbol: 'banknote' },
  { key: 'other_liability', label: 'Other', kind: 'liability', symbol: 'square.dotted' },
]

export const findCategory = (key: AccountCategory): CategoryMeta | null =>
  ACCOUNT_CATEGORIES.find((meta) => meta.key === key) ?? null

export const categoriesForKind = (kind: AccountKind): CategoryMeta[] =>
  ACCOUNT_CATEGORIES.filter((meta) => meta.kind === kind)

import type { SymbolViewProps } from 'expo-symbols'

export type AccountKind = 'asset' | 'liability'

export type AccountCategory =
  | 'cash'
  | 'investment'
  | 'crypto'
  | 'real_estate'
  | 'vehicle'
  | 'other_asset'
  | 'credit_card'
  | 'mortgage'
  | 'student_loan'
  | 'auto_loan'
  | 'personal_loan'
  | 'other_liability'

export type Account = {
  id: string
  name: string
  kind: AccountKind
  category: AccountCategory
  symbol: SymbolViewProps['name']
  institution?: string
  createdAt: string
}

export type BalanceSnapshot = {
  id: string
  accountId: string
  amountCents: number
  takenAt: string
  note?: string
}

export type CategoryTotal = {
  category: AccountCategory
  totalCents: number
  accountCount: number
}

export type NetWorthSummary = {
  totalAssetsCents: number
  totalLiabilitiesCents: number
  netCents: number
  asOf: string | null
}

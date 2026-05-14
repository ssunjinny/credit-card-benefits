export type NetWorthItemKind = 'asset' | 'liability'

export type NetWorthItemCategory =
  | 'cash'
  | 'checking_account'
  | 'savings_account'
  | 'investment'
  | 'crypto'
  | 'real_estate'
  | 'vehicle'
  | 'electronics'
  | 'furniture'
  | 'other_asset'
  | 'credit_card'
  | 'mortgage'
  | 'student_loan'
  | 'auto_loan'
  | 'personal_loan'
  | 'other_liability'

export type NetWorthItem = {
  id: string
  name: string
  kind: NetWorthItemKind
  category: NetWorthItemCategory
  amountCents: number
  updatedAt: string
}

export type NetWorthSummary = {
  totalAssetsCents: number
  totalLiabilitiesCents: number
  netCents: number
}

export type NetWorthSnapshot = {
  id: string
  itemId: string
  amountCents: number
  capturedAt: string
  note: string | null
  createdAt: string
}

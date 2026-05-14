export type NetWorthItemKind = 'asset' | 'liability'

export type NetWorthItemCategory =
  | 'cash'
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

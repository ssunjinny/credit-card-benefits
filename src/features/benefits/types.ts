import type { SymbolViewProps } from 'expo-symbols'

export type BenefitResetType = 'jan1' | 'per_use'

export type Benefit =
  | {
      id: string
      name: string
      tagline: string
      symbol: SymbolViewProps['name']
      category: 'fixed'
      annualCap: number
      resetType: BenefitResetType
    }
  | {
      id: string
      name: string
      tagline: string
      symbol: SymbolViewProps['name']
      category: 'soft'
      annualCap: null
      resetType: 'jan1'
    }

export type BenefitProgress = {
  used: number
  cap: number | null
  percentage: number
  status: BenefitStatus
}

export type BenefitStatus = 'captured' | 'inProgress' | 'untouched'

export type BenefitWithProgress = Benefit & {
  progress: BenefitProgress
}

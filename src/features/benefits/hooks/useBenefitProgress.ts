import { useMemo } from 'react'

import { useAppStore } from '@/store/useAppStore'

import { findBenefit } from '../constants'
import { computeBenefitProgress } from '../utils'

export const useBenefitProgress = (benefitId: string) => {
  const logs = useAppStore((state) => state.logs)
  return useMemo(() => {
    const benefit = findBenefit(benefitId)
    if (!benefit) return null
    return { benefit, progress: computeBenefitProgress(benefit, logs) }
  }, [benefitId, logs])
}

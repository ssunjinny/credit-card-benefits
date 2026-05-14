import { useMemo } from 'react'

import { useAppStore } from '@/store/useAppStore'

import { ANNUAL_FEE, BENEFITS } from '../constants'
import { computeBenefitProgress, remainingToBreakEven, totalCapturedThisYear } from '../utils'
import type { BenefitStatus, BenefitWithProgress } from '../types'

const statusOrder: Record<BenefitStatus, number> = {
  inProgress: 0,
  untouched: 1,
  captured: 2,
}

export const useBenefitsOverview = () => {
  const logs = useAppStore((state) => state.logs)

  return useMemo(() => {
    const benefits: BenefitWithProgress[] = BENEFITS.map((benefit) => ({
      ...benefit,
      progress: computeBenefitProgress(benefit, logs),
    }))

    const sorted = [...benefits].sort((a, b) => {
      const orderDiff = statusOrder[a.progress.status] - statusOrder[b.progress.status]
      if (orderDiff !== 0) return orderDiff
      return a.name.localeCompare(b.name)
    })

    const totalCaptured = totalCapturedThisYear(logs)
    const remaining = remainingToBreakEven(totalCaptured, ANNUAL_FEE)
    const utilization = Math.min(100, (totalCaptured / ANNUAL_FEE) * 100)

    return {
      benefits: sorted,
      totalCaptured,
      remaining,
      utilization,
      annualFee: ANNUAL_FEE,
    }
  }, [logs])
}

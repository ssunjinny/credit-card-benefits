import { currentYear, yearOf } from '@/lib/date'

import type { BenefitLog } from '../logs/types'

import type { Benefit, BenefitProgress, BenefitStatus } from './types'

const sumLogCents = (logs: BenefitLog[]) =>
  logs.reduce((total, log) => total + log.valueAmountCents, 0)

export const filterLogsForBenefit = (logs: BenefitLog[], benefitId: string) =>
  logs.filter((log) => log.benefitId === benefitId)

export const filterRelevantLogs = (logs: BenefitLog[], benefit: Benefit) => {
  const owned = filterLogsForBenefit(logs, benefit.id)
  if (benefit.resetType === 'per_use') return owned
  const year = currentYear()
  return owned.filter((log) => yearOf(log.date) === year)
}

const statusFor = (used: number, cap: number | null): BenefitStatus => {
  if (used <= 0) return 'untouched'
  if (cap != null && used >= cap) return 'captured'
  return 'inProgress'
}

export const computeBenefitProgress = (benefit: Benefit, logs: BenefitLog[]): BenefitProgress => {
  const relevant = filterRelevantLogs(logs, benefit)
  const used = sumLogCents(relevant) / 100
  const cap = benefit.annualCap
  const percentage = cap && cap > 0 ? Math.min(100, (used / cap) * 100) : used > 0 ? 100 : 0
  return { used, cap, percentage, status: statusFor(used, cap) }
}

export const totalCapturedThisYear = (logs: BenefitLog[]) => {
  const year = currentYear()
  const cents = logs
    .filter((log) => yearOf(log.date) === year)
    .reduce((total, log) => total + log.valueAmountCents, 0)
  return cents / 100
}

export const remainingToBreakEven = (totalCaptured: number, annualFee: number) =>
  Math.max(0, annualFee - totalCaptured)

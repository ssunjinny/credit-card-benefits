import { BenefitLog, BenefitWithProgress } from '../types';

export function getTotalCaptured(logs: BenefitLog[], year: number): number {
  return logs
    .filter((l) => new Date(l.date).getFullYear() === year)
    .reduce((sum, l) => sum + l.valueAmount, 0);
}

export function getBreakEvenRemaining(
  totalCaptured: number,
  annualFee: number
): number {
  return Math.max(0, annualFee - totalCaptured);
}

export interface BenefitProgress {
  used: number;
  cap: number | null;
  percentage: number;
}

export function getBenefitProgress(
  benefitId: string,
  logs: BenefitLog[],
  cap: number | null
): BenefitProgress {
  const used = logs
    .filter((l) => l.benefitId === benefitId)
    .reduce((sum, l) => sum + l.valueAmount, 0);
  const percentage = cap && cap > 0 ? Math.min(100, (used / cap) * 100) : used > 0 ? 100 : 0;
  return { used, cap, percentage };
}

export interface StatusCounts {
  maxed: number;
  inProgress: number;
  unused: number;
}

export function countByStatus(benefits: BenefitWithProgress[]): StatusCounts {
  let maxed = 0;
  let inProgress = 0;
  let unused = 0;
  for (const b of benefits) {
    const used = b.currentYearUsed;
    if (used <= 0) {
      unused += 1;
    } else if (b.annualCap != null && used >= b.annualCap) {
      maxed += 1;
    } else {
      inProgress += 1;
    }
  }
  return { maxed, inProgress, unused };
}

export type BenefitStatus = 'maxed' | 'inProgress' | 'unused';

export function getStatus(b: BenefitWithProgress): BenefitStatus {
  if (b.currentYearUsed <= 0) return 'unused';
  if (b.annualCap != null && b.currentYearUsed >= b.annualCap) return 'maxed';
  return 'inProgress';
}

export function formatCurrency(amount: number): string {
  return `$${Math.round(amount).toLocaleString('en-US')}`;
}

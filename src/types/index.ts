export type BenefitCategory = 'fixed' | 'soft';

export type BenefitResetType = 'jan1' | 'per_use';

export interface Benefit {
  id: string;
  name: string;
  description: string;
  category: BenefitCategory;
  annualCap: number | null;
  resetType: BenefitResetType;
  icon: string;
}

export interface BenefitLog {
  id: string;
  benefitId: string;
  date: string;
  valueAmount: number;
  note: string | null;
}

export interface BenefitWithProgress extends Benefit {
  currentYearUsed: number;
  logs: BenefitLog[];
}

export interface AppState {
  logs: BenefitLog[];
  lastResetYear: number;
}

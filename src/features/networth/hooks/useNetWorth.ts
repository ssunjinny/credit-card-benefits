import { useMemo } from 'react'

import { useAppStore } from '@/store/useAppStore'

import { summarizeNetWorth, totalsByCategory } from '../utils'

export const useNetWorth = () => {
  const accounts = useAppStore((state) => state.accounts)
  const balances = useAppStore((state) => state.balances)

  return useMemo(() => {
    const summary = summarizeNetWorth(accounts, balances)
    const byCategory = totalsByCategory(accounts, balances)
    return { ...summary, byCategory, accountCount: accounts.length }
  }, [accounts, balances])
}

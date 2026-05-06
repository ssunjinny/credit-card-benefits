import { useMemo } from 'react'

import { useAppStore } from '@/store/useAppStore'

import { balancesForAccount, latestBalanceFor } from '../utils'

export const useAccountBalance = (accountId: string) => {
  const balances = useAppStore((state) => state.balances)

  return useMemo(() => {
    const history = balancesForAccount(accountId, balances)
    const latest = latestBalanceFor(accountId, balances)
    return { latest, history }
  }, [accountId, balances])
}

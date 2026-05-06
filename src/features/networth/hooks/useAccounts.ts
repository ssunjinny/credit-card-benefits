import { useMemo } from 'react'

import { useAppStore } from '@/store/useAppStore'

import { groupAccountsByKind } from '../utils'

export const useAccounts = () => {
  const accounts = useAppStore((state) => state.accounts)
  return useMemo(() => groupAccountsByKind(accounts), [accounts])
}

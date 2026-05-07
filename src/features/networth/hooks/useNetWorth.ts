import { useMemo } from 'react'

import { useAppStore } from '@/store/useAppStore'

import { summarizeNetWorth, totalsByCategory } from '../utils'

export const useNetWorth = () => {
  const items = useAppStore((state) => state.items)

  return useMemo(() => {
    const summary = summarizeNetWorth(items)
    const byCategory = totalsByCategory(items)
    return { ...summary, byCategory, itemCount: items.length }
  }, [items])
}

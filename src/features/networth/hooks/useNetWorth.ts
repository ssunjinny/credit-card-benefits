import { useMemo } from 'react'

import { useAppStore } from '@/store/useAppStore'

import { summarizeNetWorth } from '../utils'

export const useNetWorth = () => {
  const items = useAppStore((state) => state.items)

  return useMemo(() => {
    const summary = summarizeNetWorth(items)
    return { ...summary, itemCount: items.length }
  }, [items])
}

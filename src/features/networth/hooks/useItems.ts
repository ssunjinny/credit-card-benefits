import { useMemo } from 'react'

import { useAppStore } from '@/store/useAppStore'

import { groupItemsByKind } from '../utils'

export const useItems = () => {
  const items = useAppStore((state) => state.items)
  return useMemo(() => groupItemsByKind(items), [items])
}

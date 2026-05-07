import type {
  CategoryTotal,
  NetWorthItem,
  NetWorthItemCategory,
  NetWorthItemKind,
  NetWorthSummary,
} from './types'

export const dollarsToCents = (dollars: number) => Math.round(dollars * 100)

export const centsToDollars = (cents: number) => cents / 100

export const groupItemsByKind = (items: NetWorthItem[]) => {
  const assets: NetWorthItem[] = []
  const liabilities: NetWorthItem[] = []
  for (const item of items) {
    if (item.kind === 'asset') assets.push(item)
    else liabilities.push(item)
  }
  return { assets, liabilities }
}

export const sumItemsForKind = (items: NetWorthItem[], kind: NetWorthItemKind) =>
  items.filter((item) => item.kind === kind).reduce((total, item) => total + item.amountCents, 0)

export const summarizeNetWorth = (items: NetWorthItem[]): NetWorthSummary => {
  const totalAssetsCents = sumItemsForKind(items, 'asset')
  const totalLiabilitiesCents = sumItemsForKind(items, 'liability')
  return {
    totalAssetsCents,
    totalLiabilitiesCents,
    netCents: totalAssetsCents - totalLiabilitiesCents,
    asOf: latestUpdatedAt(items),
  }
}

export const totalsByCategory = (items: NetWorthItem[]): CategoryTotal[] => {
  const totals = new Map<NetWorthItemCategory, CategoryTotal>()
  for (const item of items) {
    const existing = totals.get(item.category)
    if (existing) {
      existing.totalCents += item.amountCents
      existing.itemCount += 1
    } else {
      totals.set(item.category, {
        category: item.category,
        totalCents: item.amountCents,
        itemCount: 1,
      })
    }
  }
  return Array.from(totals.values())
}

const latestUpdatedAt = (items: NetWorthItem[]): string | null => {
  let latest: string | null = null
  for (const item of items) {
    if (!latest || item.updatedAt > latest) latest = item.updatedAt
  }
  return latest
}

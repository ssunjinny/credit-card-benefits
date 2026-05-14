import type { NetWorthItem, NetWorthItemKind, NetWorthSummary } from './types'

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
  }
}

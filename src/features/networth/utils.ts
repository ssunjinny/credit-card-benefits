import type {
  Account,
  AccountCategory,
  AccountKind,
  BalanceSnapshot,
  CategoryTotal,
  NetWorthSummary,
} from './types'

export const dollarsToCents = (dollars: number) => Math.round(dollars * 100)

export const centsToDollars = (cents: number) => cents / 100

export const latestBalanceFor = (
  accountId: string,
  balances: BalanceSnapshot[],
): BalanceSnapshot | null => {
  let latest: BalanceSnapshot | null = null
  for (const balance of balances) {
    if (balance.accountId !== accountId) continue
    if (!latest || balance.takenAt > latest.takenAt) latest = balance
  }
  return latest
}

export const balancesForAccount = (
  accountId: string,
  balances: BalanceSnapshot[],
): BalanceSnapshot[] =>
  balances
    .filter((balance) => balance.accountId === accountId)
    .sort((a, b) => b.takenAt.localeCompare(a.takenAt))

export const groupAccountsByKind = (accounts: Account[]) => {
  const assets: Account[] = []
  const liabilities: Account[] = []
  for (const account of accounts) {
    if (account.kind === 'asset') assets.push(account)
    else liabilities.push(account)
  }
  return { assets, liabilities }
}

export const sumLatestForKind = (
  accounts: Account[],
  balances: BalanceSnapshot[],
  kind: AccountKind,
) =>
  accounts
    .filter((account) => account.kind === kind)
    .reduce(
      (total, account) => total + (latestBalanceFor(account.id, balances)?.amountCents ?? 0),
      0,
    )

export const summarizeNetWorth = (
  accounts: Account[],
  balances: BalanceSnapshot[],
): NetWorthSummary => {
  const totalAssetsCents = sumLatestForKind(accounts, balances, 'asset')
  const totalLiabilitiesCents = sumLatestForKind(accounts, balances, 'liability')
  const asOf = latestSnapshotDate(balances)
  return {
    totalAssetsCents,
    totalLiabilitiesCents,
    netCents: totalAssetsCents - totalLiabilitiesCents,
    asOf,
  }
}

export const totalsByCategory = (
  accounts: Account[],
  balances: BalanceSnapshot[],
): CategoryTotal[] => {
  const totals = new Map<AccountCategory, CategoryTotal>()
  for (const account of accounts) {
    const cents = latestBalanceFor(account.id, balances)?.amountCents ?? 0
    const existing = totals.get(account.category)
    if (existing) {
      existing.totalCents += cents
      existing.accountCount += 1
    } else {
      totals.set(account.category, {
        category: account.category,
        totalCents: cents,
        accountCount: 1,
      })
    }
  }
  return Array.from(totals.values())
}

const latestSnapshotDate = (balances: BalanceSnapshot[]): string | null => {
  let latest: string | null = null
  for (const balance of balances) {
    if (!latest || balance.takenAt > latest) latest = balance.takenAt
  }
  return latest
}

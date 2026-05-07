import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme, type Theme } from '@/features/theme'
import { formatCurrency } from '@/lib/currency'
import { Card, Icon, Text } from '@/ui'

import { ITEM_CATEGORIES, type CategoryMeta } from '../constants'
import type { CategoryTotal, NetWorthItemKind } from '../types'
import { centsToDollars } from '../utils'

export type BalanceBreakdownProps = {
  totals: CategoryTotal[]
}

const orderedCategoriesForKind = (
  kind: NetWorthItemKind,
  totals: CategoryTotal[],
): {
  meta: CategoryMeta
  total: CategoryTotal
}[] => {
  const totalsByKey = new Map(totals.map((entry) => [entry.category, entry]))
  return ITEM_CATEGORIES.filter((meta) => meta.kind === kind)
    .map((meta) => {
      const total = totalsByKey.get(meta.key)
      if (!total || total.totalCents === 0) return null
      return { meta, total }
    })
    .filter((entry): entry is { meta: CategoryMeta; total: CategoryTotal } => entry !== null)
}

export const BalanceBreakdown = ({ totals }: BalanceBreakdownProps) => {
  const assets = orderedCategoriesForKind('asset', totals)
  const liabilities = orderedCategoriesForKind('liability', totals)

  if (assets.length === 0 && liabilities.length === 0) return null

  return (
    <View>
      {assets.length > 0 ? <BreakdownSection title="Assets" rows={assets} /> : null}
      {liabilities.length > 0 ? <BreakdownSection title="Liabilities" rows={liabilities} /> : null}
    </View>
  )
}

type BreakdownSectionProps = {
  title: string
  rows: { meta: CategoryMeta; total: CategoryTotal }[]
}

const BreakdownSection = ({ title, rows }: BreakdownSectionProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const sumCents = rows.reduce((acc, row) => acc + row.total.totalCents, 0)

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text variant="sectionHeader" tone="tertiary">
          {title}
        </Text>
        <Text variant="listValue">{formatCurrency(centsToDollars(sumCents))}</Text>
      </View>
      <Card padded={false}>
        {rows.map(({ meta, total }, index) => (
          <View key={meta.key} style={[styles.row, index < rows.length - 1 && styles.divider]}>
            <View style={styles.leading}>
              <Icon name={meta.symbol} size={20} tone="signal" />
            </View>
            <Text variant="body" style={styles.label}>
              {meta.label}
            </Text>
            <Text variant="listValue" tone="secondary">
              {formatCurrency(centsToDollars(total.totalCents))}
            </Text>
          </View>
        ))}
      </Card>
    </View>
  )
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    section: {
      marginTop: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      paddingHorizontal: theme.spacing.xs,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.md,
    },
    divider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.separator,
    },
    leading: {
      width: 28,
      alignItems: 'center',
    },
    label: {
      flex: 1,
    },
  })

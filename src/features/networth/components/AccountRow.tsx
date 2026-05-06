import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme, type Theme } from '@/features/theme'
import { formatCurrency } from '@/lib/currency'
import { Icon, Pressable, Text } from '@/ui'

import type { Account, BalanceSnapshot } from '../types'
import { centsToDollars } from '../utils'

export type AccountRowProps = {
  account: Account
  latest: BalanceSnapshot | null
  onPress: () => void
  isLast?: boolean
}

const ROW_MIN_HEIGHT = 64

const balanceLabel = (latest: BalanceSnapshot | null) =>
  latest ? formatCurrency(centsToDollars(latest.amountCents)) : '—'

const subline = (account: Account) => account.institution ?? labelForCategory(account.category)

const labelForCategory = (category: string) =>
  category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export const AccountRow = ({ account, latest, onPress, isLast }: AccountRowProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.row, !isLast && styles.divider]}>
        <View style={styles.leading}>
          <Icon name={account.symbol} size={22} tone="signal" />
        </View>
        <View style={styles.middle}>
          <Text variant="headline" numberOfLines={1}>
            {account.name}
          </Text>
          <Text variant="footnote" tone="tertiary" numberOfLines={1}>
            {subline(account)}
          </Text>
        </View>
        <View style={styles.right}>
          <Text variant="listValue">{balanceLabel(latest)}</Text>
        </View>
      </View>
    </Pressable>
  )
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface.card,
    },
    row: {
      minHeight: ROW_MIN_HEIGHT,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.base,
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    divider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.separator,
    },
    leading: {
      width: 32,
      alignItems: 'center',
    },
    middle: {
      flex: 1,
      gap: 2,
    },
    right: {
      alignItems: 'flex-end',
    },
  })

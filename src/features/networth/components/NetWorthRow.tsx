import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme, type Theme } from '@/features/theme'
import { formatCurrency } from '@/lib/currency'
import { Icon, Pressable, Text } from '@/ui'

import { findCategory } from '../constants'
import type { NetWorthItem } from '../types'
import { centsToDollars } from '../utils'

export type NetWorthRowProps = {
  item: NetWorthItem
  onPress: () => void
  isLast?: boolean
}

const ROW_MIN_HEIGHT = 64

export const NetWorthRow = ({ item, onPress, isLast }: NetWorthRowProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const categoryLabel = findCategory(item.category)?.label ?? ''

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.row, !isLast && styles.divider]}>
        <View style={styles.leading}>
          <Icon name={item.symbol} size={22} tone="signal" />
        </View>
        <View style={styles.middle}>
          <Text variant="headline" numberOfLines={1}>
            {item.name}
          </Text>
          <Text variant="footnote" tone="tertiary" numberOfLines={1}>
            {categoryLabel}
          </Text>
        </View>
        <View style={styles.right}>
          <Text variant="listValue">{formatCurrency(centsToDollars(item.amountCents))}</Text>
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

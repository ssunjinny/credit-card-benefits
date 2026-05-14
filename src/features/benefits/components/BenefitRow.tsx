import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme, type Theme } from '@/features/theme'
import { formatCurrency } from '@/lib/currency'
import { Pressable, StatusBadge, Text } from '@/ui'

import type { BenefitWithProgress } from '../types'

export type BenefitRowProps = {
  benefit: BenefitWithProgress
  onPress: () => void
  isLast?: boolean
}

const ROW_MIN_HEIGHT = 64

const progressLabel = (benefit: BenefitWithProgress) => {
  const { progress } = benefit
  if (progress.cap != null) {
    return `${formatCurrency(progress.used)} of ${formatCurrency(progress.cap)}`
  }
  if (progress.used > 0) return `${formatCurrency(progress.used)} captured`
  return 'No captures yet'
}

export const BenefitRow = ({ benefit, onPress, isLast }: BenefitRowProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.row, !isLast && styles.divider]}>
        <View style={styles.middle}>
          <Text variant="headline" numberOfLines={1}>
            {benefit.name}
          </Text>
          <Text variant="footnote" tone="tertiary" numberOfLines={1}>
            {progressLabel(benefit)}
          </Text>
        </View>
        <View style={styles.right}>
          <StatusBadge status={benefit.progress.status} percentage={benefit.progress.percentage} />
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
    middle: {
      flex: 1,
      gap: 2,
    },
    right: {
      alignItems: 'flex-end',
    },
  })

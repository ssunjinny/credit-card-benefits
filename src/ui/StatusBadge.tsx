import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import type { BenefitStatus } from '@/features/benefits'
import { useTheme, type Theme } from '@/features/theme'

import { Text } from './Text'

export type StatusBadgeProps = {
  status: BenefitStatus
  percentage?: number
}

export const StatusBadge = ({ status, percentage }: StatusBadgeProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])

  const { background, label, color } = describe(theme, status, percentage)

  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      <Text variant="caption" style={{ color }}>
        {label}
      </Text>
    </View>
  )
}

const describe = (theme: Theme, status: BenefitStatus, percentage?: number) => {
  switch (status) {
    case 'captured':
      return {
        background: theme.colors.signal.soft,
        color: theme.colors.signal.onSoft,
        label: 'Captured',
      }
    case 'inProgress':
      return {
        background: theme.colors.surface.inset,
        color: theme.colors.label.secondary,
        label: percentage != null ? `${Math.round(percentage)}%` : 'In progress',
      }
    case 'untouched':
    default:
      return {
        background: theme.colors.surface.inset,
        color: theme.colors.label.tertiary,
        label: 'Untouched',
      }
  }
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    badge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.radii.pill,
      alignSelf: 'flex-start',
    },
  })

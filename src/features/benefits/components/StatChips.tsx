import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme, type Theme } from '@/features/theme'
import { Card, Text } from '@/ui'

import type { StatusCounts } from '../hooks/useBenefitsOverview'

export type StatChipsProps = {
  counts: StatusCounts
}

export const StatChips = ({ counts }: StatChipsProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <View style={styles.row}>
      <Chip value={counts.captured} label="Captured" />
      <Chip value={counts.inProgress} label="In progress" />
      <Chip value={counts.untouched} label="Untouched" />
    </View>
  )
}

type ChipProps = {
  value: number
  label: string
}

const Chip = ({ value, label }: ChipProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  return (
    <Card padded={false} style={styles.chip}>
      <Text variant="title2">{value}</Text>
      <Text variant="caption" tone="tertiary">
        {label}
      </Text>
    </Card>
  )
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    chip: {
      flex: 1,
      paddingVertical: theme.spacing.base,
      alignItems: 'center',
      gap: 2,
    },
  })

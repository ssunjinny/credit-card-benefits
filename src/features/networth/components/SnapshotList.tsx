import { useMemo } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import * as Haptics from 'expo-haptics'

import { useTheme, type Theme } from '@/features/theme'
import { formatCurrency } from '@/lib/currency'
import { formatLogDateLabel } from '@/lib/date'
import { Card, Pressable, Text } from '@/ui'

import type { NetWorthSnapshot } from '../types'
import { centsToDollars } from '../utils'

export type SnapshotListProps = {
  snapshots: NetWorthSnapshot[]
  onDelete: (id: string) => Promise<void>
}

export const SnapshotList = ({ snapshots, onDelete }: SnapshotListProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])

  if (snapshots.length === 0) {
    return (
      <Card>
        <Text variant="footnote" tone="tertiary" style={styles.empty}>
          No history yet. Logging a value will add an entry here.
        </Text>
      </Card>
    )
  }

  return (
    <Card padded={false}>
      {snapshots.map((snapshot, index) => {
        const previous = snapshots[index + 1]
        const delta = previous ? snapshot.amountCents - previous.amountCents : null
        const isLast = index === snapshots.length - 1
        return (
          <SnapshotRow
            key={snapshot.id}
            snapshot={snapshot}
            delta={delta}
            isLast={isLast}
            onDelete={onDelete}
          />
        )
      })}
    </Card>
  )
}

type SnapshotRowProps = {
  snapshot: NetWorthSnapshot
  delta: number | null
  isLast: boolean
  onDelete: (id: string) => Promise<void>
}

const SnapshotRow = ({ snapshot, delta, isLast, onDelete }: SnapshotRowProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    Alert.alert('Delete this entry?', `Logged ${formatLogDateLabel(snapshot.capturedAt)}.`, [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await onDelete(snapshot.id)
          } catch (e) {
            Alert.alert('Could not delete', e instanceof Error ? e.message : 'Please try again.')
          }
        },
      },
    ])
  }

  const deltaLabel =
    delta == null
      ? null
      : `${delta >= 0 ? '+' : '−'}${formatCurrency(centsToDollars(Math.abs(delta)))}`

  return (
    <Pressable onLongPress={handleLongPress} delayLongPress={350} scaleOnPress={false}>
      <View style={[styles.row, !isLast && styles.divider]}>
        <View style={styles.left}>
          <Text variant="body">{formatLogDateLabel(snapshot.capturedAt)}</Text>
          {snapshot.note ? (
            <Text variant="footnote" tone="tertiary" numberOfLines={1}>
              {snapshot.note}
            </Text>
          ) : null}
        </View>
        <View style={styles.right}>
          <Text variant="listValue">{formatCurrency(centsToDollars(snapshot.amountCents))}</Text>
          {deltaLabel ? (
            <Text variant="footnote" tone="tertiary">
              {deltaLabel}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  )
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.base,
      gap: theme.spacing.md,
    },
    divider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.separator,
    },
    left: {
      flex: 1,
      gap: 2,
    },
    right: {
      alignItems: 'flex-end',
      gap: 2,
    },
    empty: {
      textAlign: 'center',
    },
  })

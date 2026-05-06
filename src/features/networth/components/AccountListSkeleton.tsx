import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme, type Theme } from '@/features/theme'
import { Card, Skeleton } from '@/ui'

const SKELETON_ROW_COUNT = 4

export const AccountListSkeleton = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <Card padded={false}>
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
        <View key={index} style={[styles.row, index < SKELETON_ROW_COUNT - 1 && styles.divider]}>
          <Skeleton width={28} height={28} radius={theme.radii.sm} />
          <View style={styles.middle}>
            <Skeleton width="50%" height={14} />
            <Skeleton width="35%" height={12} />
          </View>
          <Skeleton width={72} height={18} />
        </View>
      ))}
    </Card>
  )
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
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
      gap: 8,
    },
  })

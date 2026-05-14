import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme, type Theme } from '@/features/theme'
import { Card, Skeleton } from '@/ui'

const SKELETON_ROW_COUNT = 6

export const BenefitListSkeleton = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <View style={styles.container}>
      <Card padded={false}>
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
          <View key={index} style={[styles.row, index < SKELETON_ROW_COUNT - 1 && styles.divider]}>
            <View style={styles.middle}>
              <Skeleton width="60%" height={14} />
              <Skeleton width="40%" height={12} />
            </View>
            <Skeleton width={56} height={20} radius={theme.radii.pill} />
          </View>
        ))}
      </Card>
    </View>
  )
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.md,
    },
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

import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme, type Theme } from '@/features/theme'
import { Icon, Text } from '@/ui'

export const AccountListEmpty = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <View style={styles.container}>
      <Icon name="building.columns" size={48} tone="tertiary" />
      <Text variant="headline" tone="secondary" style={styles.headline}>
        Add your first account.
      </Text>
      <Text variant="callout" tone="tertiary" style={styles.copy}>
        Start with a checking account, a brokerage, or a credit card balance. The picture builds
        from there.
      </Text>
    </View>
  )
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xxl,
      paddingHorizontal: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    headline: {
      textAlign: 'center',
    },
    copy: {
      textAlign: 'center',
      lineHeight: 22,
    },
  })

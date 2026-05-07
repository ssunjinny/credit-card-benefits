import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme, type Theme } from '@/features/theme'
import { Icon, Text } from '@/ui'

export const NetWorthEmpty = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <View style={styles.container}>
      <Icon name="square.stack.3d.up" size={48} tone="tertiary" />
      <Text variant="headline" tone="secondary" style={styles.headline}>
        Add your first asset or liability.
      </Text>
      <Text variant="callout" tone="tertiary" style={styles.copy}>
        Track what you own and what you owe. Values are entered manually — update them any time.
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

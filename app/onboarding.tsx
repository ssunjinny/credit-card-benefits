import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme, type Theme } from '@/features/theme'
import { useAppStore } from '@/store/useAppStore'
import { Button, Icon, Screen, Text } from '@/ui'

const OnboardingScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.body}>
          <Icon name="chart.pie.fill" size={56} tone="signal" />
          <Text variant="title1" style={styles.title}>
            A quiet ledger for your money.
          </Text>
          <Text variant="callout" tone="secondary" style={styles.copy}>
            Track what you own and what you owe. Watch the worth climb.
          </Text>
        </View>
        <Button label="Begin" onPress={completeOnboarding} />
      </View>
    </Screen>
  )
}

export default OnboardingScreen

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing.xl,
      justifyContent: 'space-between',
    },
    body: {
      flex: 1,
      justifyContent: 'center',
      gap: theme.spacing.lg,
    },
    title: {
      marginTop: theme.spacing.lg,
    },
    copy: {
      lineHeight: 24,
    },
  })

import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme, type Theme } from '@/features/theme'
import { formatCurrency } from '@/lib/currency'
import { Card, ProgressBar, Text } from '@/ui'

export type HeroCardProps = {
  totalCaptured: number
  annualFee: number
  utilization: number
  remaining: number
}

const statusLine = (remaining: number) =>
  remaining > 0 ? `${formatCurrency(remaining)} to break even` : 'Break even reached'

export const HeroCard = ({
  totalCaptured,
  annualFee,
  utilization,
  remaining,
}: HeroCardProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <Card hero elevation="elevated">
      <Text variant="caption" tone="tertiary">
        CAPTURED THIS YEAR
      </Text>
      <Text variant="hero" style={styles.heroNumber}>
        {formatCurrency(totalCaptured)}
      </Text>
      <Text variant="footnote" tone="secondary">
        of {formatCurrency(annualFee)} annual fee
      </Text>
      <View style={styles.progress}>
        <ProgressBar percentage={utilization} />
      </View>
      <View style={styles.footer}>
        <Text variant="footnote" tone="signal">
          {statusLine(remaining)}
        </Text>
        <Text variant="footnote" tone="tertiary">
          Resets January 1
        </Text>
      </View>
    </Card>
  )
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    heroNumber: {
      marginTop: theme.spacing.xs,
      color: theme.colors.signal.base,
    },
    progress: {
      marginTop: theme.spacing.lg,
    },
    footer: {
      marginTop: theme.spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  })

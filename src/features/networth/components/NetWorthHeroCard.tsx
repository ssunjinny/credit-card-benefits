import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme, type Theme } from '@/features/theme'
import { formatCurrency } from '@/lib/currency'
import { relativeDayLabel } from '@/lib/date'
import { Card, Text } from '@/ui'

import { centsToDollars } from '../utils'

export type NetWorthHeroCardProps = {
  netCents: number
  totalAssetsCents: number
  totalLiabilitiesCents: number
  asOf: string | null
}

const updatedLabel = (asOf: string | null) =>
  asOf ? `Updated ${relativeDayLabel(asOf)}` : 'Nothing tracked yet'

export const NetWorthHeroCard = ({
  netCents,
  totalAssetsCents,
  totalLiabilitiesCents,
  asOf,
}: NetWorthHeroCardProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <Card hero elevation="elevated">
      <Text variant="caption" tone="tertiary">
        NET WORTH
      </Text>
      <Text variant="hero" style={styles.heroNumber}>
        {formatCurrency(centsToDollars(netCents))}
      </Text>
      <Text variant="footnote" tone="tertiary" style={styles.subline}>
        {updatedLabel(asOf)}
      </Text>
      <View style={styles.footer}>
        <View style={styles.footerCell}>
          <Text variant="caption" tone="tertiary">
            ASSETS
          </Text>
          <Text variant="listValue" tone="primary">
            {formatCurrency(centsToDollars(totalAssetsCents))}
          </Text>
        </View>
        <View style={styles.footerCell}>
          <Text variant="caption" tone="tertiary">
            LIABILITIES
          </Text>
          <Text variant="listValue" tone="primary">
            {formatCurrency(centsToDollars(totalLiabilitiesCents))}
          </Text>
        </View>
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
    subline: {
      marginTop: theme.spacing.xs,
    },
    footer: {
      marginTop: theme.spacing.xl,
      flexDirection: 'row',
      gap: theme.spacing.xl,
    },
    footerCell: {
      gap: 2,
    },
  })

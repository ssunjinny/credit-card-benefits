import { useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'

import { BalanceBreakdown } from '@/features/networth/components/BalanceBreakdown'
import { NetWorthEmpty } from '@/features/networth/components/NetWorthEmpty'
import { NetWorthHeroCard } from '@/features/networth/components/NetWorthHeroCard'
import { NetWorthRow } from '@/features/networth/components/NetWorthRow'
import { NetWorthSkeleton } from '@/features/networth/components/NetWorthSkeleton'
import { useItems } from '@/features/networth/hooks/useItems'
import { useNetWorth } from '@/features/networth/hooks/useNetWorth'
import { useTheme, type Theme } from '@/features/theme'
import { useAppStore } from '@/store/useAppStore'
import { Card, Icon, Pressable, Screen, Text } from '@/ui'

const NetWorthScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const isLoaded = useAppStore((state) => state.isLoaded)
  const { assets, liabilities } = useItems()
  const summary = useNetWorth()

  if (!isLoaded) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={styles.content}>
          <NetWorthSkeleton />
        </ScrollView>
      </Screen>
    )
  }

  const hasItems = assets.length + liabilities.length > 0

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.push('/settings')} hitSlop={12} scaleOnPress={false}>
            <Icon name="gearshape" size={22} tone="tertiary" />
          </Pressable>
          <Pressable onPress={() => router.push('/networth/new')} hitSlop={12} scaleOnPress={false}>
            <Icon name="plus" size={22} tone="signal" />
          </Pressable>
        </View>

        <NetWorthHeroCard
          netCents={summary.netCents}
          totalAssetsCents={summary.totalAssetsCents}
          totalLiabilitiesCents={summary.totalLiabilitiesCents}
          asOf={summary.asOf}
        />

        {!hasItems ? <NetWorthEmpty /> : null}

        <BalanceBreakdown totals={summary.byCategory} />

        {assets.length > 0 ? (
          <View style={styles.section}>
            <Text variant="sectionHeader" tone="tertiary" style={styles.sectionLabel}>
              Assets
            </Text>
            <Card padded={false}>
              {assets.map((item, index) => (
                <NetWorthRow
                  key={item.id}
                  item={item}
                  isLast={index === assets.length - 1}
                  onPress={() => router.push(`/networth/${item.id}`)}
                />
              ))}
            </Card>
          </View>
        ) : null}

        {liabilities.length > 0 ? (
          <View style={styles.section}>
            <Text variant="sectionHeader" tone="tertiary" style={styles.sectionLabel}>
              Liabilities
            </Text>
            <Card padded={false}>
              {liabilities.map((item, index) => (
                <NetWorthRow
                  key={item.id}
                  item={item}
                  isLast={index === liabilities.length - 1}
                  onPress={() => router.push(`/networth/${item.id}`)}
                />
              ))}
            </Card>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  )
}

export default NetWorthScreen

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl,
      gap: theme.spacing.md,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: theme.spacing.sm,
    },
    section: {
      marginTop: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    sectionLabel: {
      paddingHorizontal: theme.spacing.xs,
    },
  })

import { useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'

import { AccountListEmpty } from '@/features/networth/components/AccountListEmpty'
import { AccountListSkeleton } from '@/features/networth/components/AccountListSkeleton'
import { AccountRow } from '@/features/networth/components/AccountRow'
import { BalanceBreakdown } from '@/features/networth/components/BalanceBreakdown'
import { NetWorthHeroCard } from '@/features/networth/components/NetWorthHeroCard'
import { useAccounts } from '@/features/networth/hooks/useAccounts'
import { useNetWorth } from '@/features/networth/hooks/useNetWorth'
import { useTheme, type Theme } from '@/features/theme'
import { useAppStore } from '@/store/useAppStore'
import { Card, Icon, Pressable, Screen, Text } from '@/ui'

import { latestBalanceFor } from '@/features/networth/utils'

const NetWorthScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const isLoaded = useAppStore((state) => state.isLoaded)
  const balances = useAppStore((state) => state.balances)
  const { assets, liabilities } = useAccounts()
  const summary = useNetWorth()

  if (!isLoaded) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={styles.content}>
          <AccountListSkeleton />
        </ScrollView>
      </Screen>
    )
  }

  const hasAccounts = assets.length + liabilities.length > 0

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.push('/settings')} hitSlop={12} scaleOnPress={false}>
            <Icon name="gearshape" size={22} tone="tertiary" />
          </Pressable>
          <Pressable
            onPress={() => router.push('/networth/account/new')}
            hitSlop={12}
            scaleOnPress={false}
          >
            <Icon name="plus" size={22} tone="signal" />
          </Pressable>
        </View>

        <NetWorthHeroCard
          netCents={summary.netCents}
          totalAssetsCents={summary.totalAssetsCents}
          totalLiabilitiesCents={summary.totalLiabilitiesCents}
          asOf={summary.asOf}
        />

        {!hasAccounts ? <AccountListEmpty /> : null}

        <BalanceBreakdown totals={summary.byCategory} />

        {assets.length > 0 ? (
          <View style={styles.section}>
            <Text variant="sectionHeader" tone="tertiary" style={styles.sectionLabel}>
              Asset accounts
            </Text>
            <Card padded={false}>
              {assets.map((account, index) => (
                <AccountRow
                  key={account.id}
                  account={account}
                  latest={latestBalanceFor(account.id, balances)}
                  isLast={index === assets.length - 1}
                  onPress={() => router.push(`/networth/account/${account.id}`)}
                />
              ))}
            </Card>
          </View>
        ) : null}

        {liabilities.length > 0 ? (
          <View style={styles.section}>
            <Text variant="sectionHeader" tone="tertiary" style={styles.sectionLabel}>
              Liability accounts
            </Text>
            <Card padded={false}>
              {liabilities.map((account, index) => (
                <AccountRow
                  key={account.id}
                  account={account}
                  latest={latestBalanceFor(account.id, balances)}
                  isLast={index === liabilities.length - 1}
                  onPress={() => router.push(`/networth/account/${account.id}`)}
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

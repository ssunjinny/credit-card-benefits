import { useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'

import { useBenefitsOverview } from '@/features/benefits/hooks/useBenefitsOverview'
import { BenefitListSkeleton } from '@/features/benefits/components/BenefitListSkeleton'
import { BenefitRow } from '@/features/benefits/components/BenefitRow'
import { HeroCard } from '@/features/benefits/components/HeroCard'
import { StatChips } from '@/features/benefits/components/StatChips'
import { useTheme, type Theme } from '@/features/theme'
import { useAppStore } from '@/store/useAppStore'
import { Card, Icon, Pressable, Text } from '@/ui'

const HomeScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const isLoaded = useAppStore((state) => state.isLoaded)
  const overview = useBenefitsOverview()

  if (!isLoaded) {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <BenefitListSkeleton />
      </ScrollView>
    )
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
      <HeroCard
        totalCaptured={overview.totalCaptured}
        annualFee={overview.annualFee}
        utilization={overview.utilization}
        remaining={overview.remaining}
      />

      <View style={styles.spacer} />
      <StatChips counts={overview.counts} />

      <View style={styles.sectionHeader}>
        <Text variant="sectionHeader" tone="tertiary">
          Benefits
        </Text>
        <Pressable onPress={() => router.push('/settings')} hitSlop={12} scaleOnPress={false}>
          <Icon name="gearshape" size={20} tone="tertiary" />
        </Pressable>
      </View>

      {!overview.hasAnyLogs ? <FirstCaptureNudge /> : null}

      <Card padded={false}>
        {overview.benefits.map((benefit, index) => (
          <BenefitRow
            key={benefit.id}
            benefit={benefit}
            isLast={index === overview.benefits.length - 1}
            onPress={() => router.push(`/benefit/${benefit.id}`)}
          />
        ))}
      </Card>
    </ScrollView>
  )
}

const FirstCaptureNudge = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  return (
    <Card style={styles.nudge}>
      <Icon name="sparkles" size={28} tone="signal" />
      <View style={styles.nudgeText}>
        <Text variant="headline">Your first capture goes here.</Text>
        <Text variant="footnote" tone="tertiary">
          Start with the easy ones — Uber Cash, the airline credit, a streaming subscription.
        </Text>
      </View>
    </Card>
  )
}

export default HomeScreen

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl,
      gap: theme.spacing.md,
    },
    spacer: {
      height: theme.spacing.xs,
    },
    sectionHeader: {
      marginTop: theme.spacing.xl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.xs,
    },
    nudge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.base,
    },
    nudgeText: {
      flex: 1,
      gap: 2,
    },
  })

import { useMemo } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'

import { useBenefitsOverview } from '@/features/benefits/hooks/useBenefitsOverview'
import { BenefitListSkeleton } from '@/features/benefits/components/BenefitListSkeleton'
import { BenefitRow } from '@/features/benefits/components/BenefitRow'
import { HeroCard } from '@/features/benefits/components/HeroCard'
import { useTheme, type Theme } from '@/features/theme'
import { useAppStore } from '@/store/useAppStore'
import { Card, Screen } from '@/ui'

const HomeScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const isLoaded = useAppStore((state) => state.isLoaded)
  const overview = useBenefitsOverview()

  if (!isLoaded) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={styles.content}>
          <BenefitListSkeleton />
        </ScrollView>
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <HeroCard
          totalCaptured={overview.totalCaptured}
          annualFee={overview.annualFee}
          utilization={overview.utilization}
          remaining={overview.remaining}
        />

        <Card padded={false}>
          {overview.benefits.map((benefit, index) => (
            <BenefitRow
              key={benefit.id}
              benefit={benefit}
              isLast={index === overview.benefits.length - 1}
              onPress={() => router.push(`/cards/benefit/${benefit.id}`)}
            />
          ))}
        </Card>
      </ScrollView>
    </Screen>
  )
}

export default HomeScreen

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl,
      gap: theme.spacing.md,
    },
  })

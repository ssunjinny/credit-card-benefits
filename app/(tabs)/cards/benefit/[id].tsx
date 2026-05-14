import { useMemo } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'

import { filterLogsForBenefit } from '@/features/benefits'
import { useBenefitProgress } from '@/features/benefits/hooks/useBenefitProgress'
import { useTheme, type Theme } from '@/features/theme'
import { formatCurrency } from '@/lib/currency'
import { formatDateLabel } from '@/lib/date'
import { useAppStore } from '@/store/useAppStore'
import { Button, Card, Icon, Pressable, ProgressBar, Screen, Text } from '@/ui'

const BenefitDetailScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const allLogs = useAppStore((state) => state.logs)
  const deleteLog = useAppStore((state) => state.deleteLog)
  const result = useBenefitProgress(id)

  if (!result) {
    return <BenefitNotFound />
  }

  const { benefit, progress } = result
  const logs = [...filterLogsForBenefit(allLogs, benefit.id)].sort((a, b) =>
    b.date.localeCompare(a.date),
  )

  const remainingLabel =
    progress.cap != null
      ? progress.used >= progress.cap
        ? 'Maxed for the year'
        : `${formatCurrency(Math.max(0, progress.cap - progress.used))} remaining`
      : `${formatCurrency(progress.used)} captured`

  const onDelete = (logId: string) => {
    Alert.alert('Remove this entry?', '', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          deleteLog(logId)
        },
      },
    ])
  }

  return (
    <Screen edges={['bottom']}>
      <Stack.Screen options={{ title: '' }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Icon name={benefit.symbol} size={48} tone="signal" />
          <Text variant="title1" style={styles.name}>
            {benefit.name}
          </Text>
          <Text variant="callout" tone="secondary" style={styles.tagline}>
            {benefit.tagline}
          </Text>
        </View>

        <Card hero elevation="elevated">
          <Text variant="caption" tone="tertiary">
            {benefit.resetType === 'per_use' ? 'CAPTURED LIFETIME' : 'CAPTURED THIS YEAR'}
          </Text>
          <Text variant="display" style={styles.amount}>
            {formatCurrency(progress.used)}
            {progress.cap != null ? (
              <Text variant="title3" tone="tertiary">
                {`  of ${formatCurrency(progress.cap)}`}
              </Text>
            ) : null}
          </Text>
          {progress.cap != null ? (
            <View style={styles.progress}>
              <ProgressBar percentage={progress.percentage} />
            </View>
          ) : null}
          <Text variant="footnote" tone="signal" style={styles.remaining}>
            {remainingLabel}
          </Text>
        </Card>

        <Button
          label="Capture a use"
          onPress={() => router.push(`/cards/log/${benefit.id}`)}
          leading={<Icon name="plus" size={18} tone="onSignal" />}
        />

        <Text variant="sectionHeader" tone="tertiary" style={styles.sectionHeader}>
          History
        </Text>
        {logs.length === 0 ? <HistoryEmpty /> : null}
        {logs.length > 0 ? (
          <Card padded={false}>
            {logs.map((log, index) => (
              <Pressable key={log.id} onLongPress={() => onDelete(log.id)} scaleOnPress={false}>
                <View style={[styles.logRow, index < logs.length - 1 && styles.logDivider]}>
                  <View style={styles.logMain}>
                    <Text variant="listValue">{formatCurrency(log.valueAmountCents / 100)}</Text>
                    <Text variant="footnote" tone="tertiary">
                      {formatDateLabel(log.date)}
                    </Text>
                  </View>
                  {log.note ? (
                    <Text variant="footnote" tone="secondary" numberOfLines={2}>
                      {log.note}
                    </Text>
                  ) : null}
                  <Pressable
                    onPress={() => onDelete(log.id)}
                    hitSlop={10}
                    scaleOnPress={false}
                    style={styles.deleteButton}
                  >
                    <Text variant="footnote" style={{ color: theme.colors.danger.base }}>
                      Remove
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </Card>
        ) : null}
      </ScrollView>
    </Screen>
  )
}

const HistoryEmpty = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  return (
    <Card style={styles.emptyCard}>
      <Icon name="bookmark" size={32} tone="tertiary" />
      <Text variant="headline" tone="secondary">
        No captures here yet.
      </Text>
      <Text variant="callout" tone="tertiary">
        Tap “Capture a use” the next time you redeem this benefit.
      </Text>
    </Card>
  )
}

const BenefitNotFound = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={styles.notFound}>
        <Icon name="questionmark.circle" size={40} tone="tertiary" />
        <Text variant="headline" tone="secondary">
          That benefit isn’t one we know about.
        </Text>
      </View>
    </Screen>
  )
}

export default BenefitDetailScreen

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl,
      gap: theme.spacing.md,
    },
    header: {
      alignItems: 'center',
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    name: {
      textAlign: 'center',
      marginTop: theme.spacing.sm,
    },
    tagline: {
      textAlign: 'center',
      lineHeight: 22,
    },
    amount: {
      marginTop: theme.spacing.xs,
      color: theme.colors.signal.base,
    },
    progress: {
      marginTop: theme.spacing.lg,
    },
    remaining: {
      marginTop: theme.spacing.md,
    },
    sectionHeader: {
      marginTop: theme.spacing.xl,
      paddingHorizontal: theme.spacing.xs,
    },
    logRow: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.base,
      gap: theme.spacing.xs,
    },
    logDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.separator,
    },
    logMain: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
    },
    deleteButton: {
      alignSelf: 'flex-end',
    },
    emptyCard: {
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    notFound: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.md,
    },
  })

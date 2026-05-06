import { useMemo } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'

import { centsToDollars, findCategory } from '@/features/networth'
import { useAccountBalance } from '@/features/networth/hooks/useAccountBalance'
import { useTheme, type Theme } from '@/features/theme'
import { formatCurrency } from '@/lib/currency'
import { formatDateLabel } from '@/lib/date'
import { useAppStore } from '@/store/useAppStore'
import { Button, Card, Icon, Pressable, Screen, Text } from '@/ui'

const AccountDetailScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const account = useAppStore((state) => state.accounts.find((a) => a.id === id))
  const deleteAccount = useAppStore((state) => state.deleteAccount)
  const deleteBalance = useAppStore((state) => state.deleteBalance)
  const { latest, history } = useAccountBalance(id)

  if (!account) {
    return <AccountNotFound />
  }

  const categoryLabel = findCategory(account.category)?.label ?? ''

  const onDeleteAccount = () => {
    Alert.alert(
      `Delete ${account.name}?`,
      'This removes the account and all of its balance history.',
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            await deleteAccount(account.id)
            router.back()
          },
        },
      ],
    )
  }

  const onDeleteBalance = (balanceId: string) => {
    Alert.alert('Remove this entry?', '', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          deleteBalance(balanceId)
        },
      },
    ])
  }

  return (
    <Screen edges={['bottom']}>
      <Stack.Screen options={{ title: '' }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Icon name={account.symbol} size={48} tone="signal" />
          <Text variant="title1" style={styles.name}>
            {account.name}
          </Text>
          <Text variant="callout" tone="secondary" style={styles.subline}>
            {[categoryLabel, account.institution].filter(Boolean).join(' · ')}
          </Text>
        </View>

        <Card hero elevation="elevated">
          <Text variant="caption" tone="tertiary">
            {account.kind === 'asset' ? 'CURRENT BALANCE' : 'CURRENT OWED'}
          </Text>
          <Text variant="display" style={styles.amount}>
            {latest ? formatCurrency(centsToDollars(latest.amountCents)) : '—'}
          </Text>
          {latest ? (
            <Text variant="footnote" tone="tertiary" style={styles.asOf}>
              As of {formatDateLabel(latest.takenAt)}
            </Text>
          ) : null}
        </Card>

        <Button
          label="Update balance"
          onPress={() => router.push(`/networth/balance/${account.id}`)}
          leading={<Icon name="plus" size={18} tone="onSignal" />}
        />

        <Text variant="sectionHeader" tone="tertiary" style={styles.sectionHeader}>
          History
        </Text>
        {history.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Icon name="clock" size={28} tone="tertiary" />
            <Text variant="headline" tone="secondary">
              No balances yet.
            </Text>
            <Text variant="footnote" tone="tertiary">
              Tap “Update balance” to record one.
            </Text>
          </Card>
        ) : (
          <Card padded={false}>
            {history.map((snapshot, index) => (
              <Pressable
                key={snapshot.id}
                onLongPress={() => onDeleteBalance(snapshot.id)}
                scaleOnPress={false}
              >
                <View
                  style={[styles.historyRow, index < history.length - 1 && styles.historyDivider]}
                >
                  <View style={styles.historyMain}>
                    <Text variant="listValue">
                      {formatCurrency(centsToDollars(snapshot.amountCents))}
                    </Text>
                    <Text variant="footnote" tone="tertiary">
                      {formatDateLabel(snapshot.takenAt)}
                    </Text>
                  </View>
                  {snapshot.note ? (
                    <Text variant="footnote" tone="secondary" numberOfLines={2}>
                      {snapshot.note}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            ))}
          </Card>
        )}

        <Pressable onPress={onDeleteAccount} style={styles.deleteAction} scaleOnPress={false}>
          <Text variant="footnote" style={{ color: theme.colors.danger.base }}>
            Delete account
          </Text>
        </Pressable>
      </ScrollView>
    </Screen>
  )
}

const AccountNotFound = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={styles.notFound}>
        <Icon name="questionmark.circle" size={40} tone="tertiary" />
        <Text variant="headline" tone="secondary">
          That account isn't here anymore.
        </Text>
      </View>
    </Screen>
  )
}

export default AccountDetailScreen

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
    subline: {
      textAlign: 'center',
    },
    amount: {
      marginTop: theme.spacing.xs,
      color: theme.colors.signal.base,
    },
    asOf: {
      marginTop: theme.spacing.sm,
    },
    sectionHeader: {
      marginTop: theme.spacing.xl,
      paddingHorizontal: theme.spacing.xs,
    },
    historyRow: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.base,
      gap: theme.spacing.xs,
    },
    historyDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.separator,
    },
    historyMain: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
    },
    emptyCard: {
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    deleteAction: {
      marginTop: theme.spacing.xl,
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
    },
    notFound: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.md,
    },
  })

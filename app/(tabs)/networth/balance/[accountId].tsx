import { useMemo, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'

import { dollarsToCents } from '@/features/networth'
import { useTheme, type Theme } from '@/features/theme'
import { isValidIsoDate, today, yesterday } from '@/lib/date'
import { useAppStore } from '@/store/useAppStore'
import { Card, Icon, Pressable, Screen, Text } from '@/ui'

const RecordBalanceScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const { accountId } = useLocalSearchParams<{ accountId: string }>()
  const account = useAppStore((state) => state.accounts.find((a) => a.id === accountId))
  const recordBalance = useAppStore((state) => state.recordBalance)

  const [date, setDate] = useState<string>(today())
  const [amount, setAmount] = useState<string>('')
  const [note, setNote] = useState<string>('')

  if (!account) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Not found' }} />
        <View style={styles.notFound}>
          <Text variant="headline" tone="secondary">
            That account isn't here anymore.
          </Text>
        </View>
      </Screen>
    )
  }

  const dateValid = isValidIsoDate(date)
  const numericAmount = Number.parseFloat(amount)
  const amountValid = Number.isFinite(numericAmount) && numericAmount >= 0
  const canSubmit = dateValid && amountValid

  const onSave = async () => {
    if (!canSubmit) {
      Alert.alert('Check the entry', 'A valid date and a non-negative balance are required.')
      return
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    await recordBalance({
      accountId: account.id,
      amountCents: dollarsToCents(numericAmount),
      takenAt: date,
      note: note.trim() ? note.trim() : undefined,
    })
    router.back()
  }

  const today_ = today()
  const yesterday_ = yesterday()

  return (
    <Screen edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Update balance',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={10} scaleOnPress={false}>
              <Text variant="body" tone="signal">
                Cancel
              </Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={onSave} disabled={!canSubmit} hitSlop={10} scaleOnPress={false}>
              <Text variant="headline" tone={canSubmit ? 'signal' : 'tertiary'}>
                Save
              </Text>
            </Pressable>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headline}>
            <Icon name={account.symbol} size={36} tone="signal" />
            <Text variant="title3">{account.name}</Text>
          </View>

          <Text variant="sectionHeader" tone="tertiary">
            Date
          </Text>
          <View style={styles.chipRow}>
            <DateChip label="Today" active={date === today_} onPress={() => setDate(today_)} />
            <DateChip
              label="Yesterday"
              active={date === yesterday_}
              onPress={() => setDate(yesterday_)}
            />
          </View>
          <Card padded={false} style={styles.inputCard}>
            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.colors.label.tertiary}
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.textInput,
                { color: dateValid ? theme.colors.label.primary : theme.colors.danger.base },
              ]}
            />
          </Card>

          <Text variant="sectionHeader" tone="tertiary" style={styles.sectionGap}>
            {account.kind === 'asset' ? 'Balance' : 'Owed'}
          </Text>
          <Card padded={false} style={styles.amountCard}>
            <Text variant="display" tone="tertiary" style={styles.dollar}>
              $
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor={theme.colors.label.tertiary}
              keyboardType="decimal-pad"
              autoFocus
              style={[styles.amountInput, { color: theme.colors.label.primary }]}
            />
          </Card>

          <Text variant="sectionHeader" tone="tertiary" style={styles.sectionGap}>
            Note (optional)
          </Text>
          <Card padded={false} style={styles.inputCard}>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="e.g. After paycheck deposit"
              placeholderTextColor={theme.colors.label.tertiary}
              multiline
              style={[styles.textInput, styles.noteInput, { color: theme.colors.label.primary }]}
            />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

type DateChipProps = {
  label: string
  active: boolean
  onPress: () => void
}

const DateChip = ({ label, active, onPress }: DateChipProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && { backgroundColor: theme.colors.signal.base }]}
    >
      <Text variant="footnote" tone={active ? 'onSignal' : 'primary'}>
        {label}
      </Text>
    </Pressable>
  )
}

export default RecordBalanceScreen

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    flex: { flex: 1 },
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl,
      gap: theme.spacing.sm,
    },
    notFound: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    headline: {
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    sectionGap: {
      marginTop: theme.spacing.lg,
    },
    chipRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginVertical: theme.spacing.sm,
    },
    chip: {
      paddingHorizontal: theme.spacing.base,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface.card,
      borderRadius: theme.radii.pill,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    inputCard: {
      paddingHorizontal: theme.spacing.base,
    },
    textInput: {
      paddingVertical: theme.spacing.base,
      fontSize: 17,
      lineHeight: 22,
      fontFamily: 'Satoshi-Regular',
    },
    noteInput: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    amountCard: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    dollar: {
      marginRight: theme.spacing.xs,
    },
    amountInput: {
      flex: 1,
      fontSize: 34,
      fontFamily: 'GeistMono_600SemiBold',
      paddingVertical: theme.spacing.base,
    },
  })

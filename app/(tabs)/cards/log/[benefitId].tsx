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

import { findBenefit, computeBenefitProgress } from '@/features/benefits'
import { useTheme, type Theme } from '@/features/theme'
import { formatCurrency } from '@/lib/currency'
import { isValidIsoDate, today, yesterday } from '@/lib/date'
import { generateId } from '@/lib/id'
import { useAppStore } from '@/store/useAppStore'
import { Card, Icon, Pressable, Screen, Text } from '@/ui'
import type { BenefitLog } from '@/features/logs/types'

const LogEntryScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const { benefitId } = useLocalSearchParams<{ benefitId: string }>()
  const benefit = findBenefit(benefitId)
  const logs = useAppStore((state) => state.logs)
  const addLog = useAppStore((state) => state.addLog)

  const [date, setDate] = useState<string>(today())
  const [amount, setAmount] = useState<string>('')
  const [note, setNote] = useState<string>('')

  if (!benefit) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Not found' }} />
        <View style={styles.notFound}>
          <Text variant="headline" tone="secondary">
            That benefit isn’t one we know about.
          </Text>
        </View>
      </Screen>
    )
  }

  const progress = computeBenefitProgress(benefit, logs)
  const remaining =
    benefit.annualCap != null ? Math.max(0, benefit.annualCap - progress.used) : null

  const amountHint =
    benefit.category === 'fixed' && remaining != null
      ? `Up to ${formatCurrency(remaining)} remaining this year.`
      : 'How much value did you actually receive?'

  const dateValid = isValidIsoDate(date)
  const numericAmount = Number.parseFloat(amount)
  const amountValid = Number.isFinite(numericAmount) && numericAmount > 0
  const canSubmit = dateValid && amountValid

  const onSave = async () => {
    if (!canSubmit) {
      Alert.alert('Check the entry', 'A valid date and dollar amount are required.')
      return
    }
    const log: BenefitLog = {
      id: generateId(),
      benefitId: benefit.id,
      date: new Date(date).toISOString(),
      valueAmount: Math.round(numericAmount * 100) / 100,
      note: note.trim() ? note.trim() : null,
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    await addLog(log)
    router.back()
  }

  const today_ = today()
  const yesterday_ = yesterday()

  return (
    <Screen edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Capture a use',
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
            <Icon name={benefit.symbol} size={36} tone="signal" />
            <Text variant="title3">{benefit.name}</Text>
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
            Amount
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
          <Text variant="footnote" tone="tertiary" style={styles.hint}>
            {amountHint}
          </Text>

          <Text variant="sectionHeader" tone="tertiary" style={styles.sectionGap}>
            Note (optional)
          </Text>
          <Card padded={false} style={styles.inputCard}>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="e.g. Centurion Lounge, JFK"
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

export default LogEntryScreen

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
    hint: {
      marginTop: theme.spacing.xs,
      paddingHorizontal: theme.spacing.xs,
    },
  })

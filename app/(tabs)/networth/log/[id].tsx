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
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'

import { useTheme, type Theme } from '@/features/theme'
import { AMOUNT_MAX_CENTS, NOTE_MAX_LENGTH } from '@/lib/constants'
import { dollarsToCents } from '@/features/networth'
import { formatAmountInput, parseAmount } from '@/lib/currency'
import { formatLogDateLabel, isoDateOnly, isValidIsoDate, today, yesterday } from '@/lib/date'
import { useAppStore } from '@/store/useAppStore'
import { Card, Icon, Pressable, Screen, Text } from '@/ui'

const AMOUNT_MAX_DOLLARS = AMOUNT_MAX_CENTS / 100

const LogValueScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const item = useAppStore((state) => state.items.find((i) => i.id === id))
  const logSnapshot = useAppStore((state) => state.logSnapshot)

  const [date, setDate] = useState<string>(today())
  const [amount, setAmount] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  if (!item) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Not found' }} />
        <View style={styles.notFound}>
          <Text variant="headline" tone="secondary">
            That entry isn't here anymore.
          </Text>
        </View>
      </Screen>
    )
  }

  const dateValid = isValidIsoDate(date) && date <= today()
  const numericAmount = parseAmount(amount)
  const amountValid =
    Number.isFinite(numericAmount) && numericAmount >= 0 && numericAmount <= AMOUNT_MAX_DOLLARS
  const canSubmit = dateValid && amountValid && !isSaving

  const onSave = async () => {
    if (!canSubmit) return
    setIsSaving(true)
    try {
      await logSnapshot(item.id, {
        amountCents: dollarsToCents(numericAmount),
        capturedAt: date,
        note: note.trim() ? note.trim() : null,
      })
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      router.back()
    } catch (e) {
      setIsSaving(false)
      Alert.alert('Could not save', e instanceof Error ? e.message : 'Please try again.')
    }
  }

  const today_ = today()
  const yesterday_ = yesterday()

  return (
    <Screen edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Log value',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={10} scaleOnPress={false}>
              <Text variant="body" tone="signal">
                Cancel
              </Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={onSave} disabled={!canSubmit} hitSlop={10} scaleOnPress={false}>
              <View style={[styles.saveButton, !canSubmit && styles.saveButtonDisabled]}>
                <Icon name="checkmark" size={16} tone="onSignal" weight="bold" />
              </View>
            </Pressable>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.headline}>
            <Text variant="title3">{item.name}</Text>
            <Text variant="footnote" tone="tertiary">
              Logs a new value to history. The current value updates if you pick today.
            </Text>
          </View>

          <Text variant="sectionHeader" tone="tertiary">
            Date
          </Text>
          <View style={styles.chipRow}>
            <DateChip
              label="Today"
              active={date === today_}
              onPress={() => {
                setDate(today_)
                setIsPickerOpen(false)
              }}
            />
            <DateChip
              label="Yesterday"
              active={date === yesterday_}
              onPress={() => {
                setDate(yesterday_)
                setIsPickerOpen(false)
              }}
            />
          </View>
          <Card padded={false}>
            <Pressable onPress={() => setIsPickerOpen((v) => !v)} scaleOnPress={false}>
              <View style={styles.dateRow}>
                <Text variant="body">{formatLogDateLabel(date)}</Text>
                <Icon name="calendar" size={16} tone="tertiary" />
              </View>
            </Pressable>
            {isPickerOpen ? (
              <View style={styles.pickerWrap}>
                <DateTimePicker
                  value={new Date(`${date}T00:00:00`)}
                  mode="date"
                  display="inline"
                  maximumDate={new Date()}
                  themeVariant={theme.isDark ? 'dark' : 'light'}
                  accentColor={theme.colors.signal.base}
                  onChange={(_event: DateTimePickerEvent, selected?: Date) => {
                    if (selected) setDate(isoDateOnly(selected))
                  }}
                />
              </View>
            ) : null}
          </Card>

          <Text variant="sectionHeader" tone="tertiary" style={styles.sectionGap}>
            {item.kind === 'asset' ? 'Value' : 'Amount owed'}
          </Text>
          <Card padded={false} style={styles.amountCard}>
            <Text variant="display" tone="tertiary" style={styles.dollar}>
              $
            </Text>
            <TextInput
              value={amount}
              onChangeText={(raw) => setAmount(formatAmountInput(raw))}
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
              placeholder="e.g. After payday deposit"
              placeholderTextColor={theme.colors.label.tertiary}
              multiline
              maxLength={NOTE_MAX_LENGTH}
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

export default LogValueScreen

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
    dateRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.base,
    },
    pickerWrap: {
      paddingHorizontal: theme.spacing.xs,
      paddingBottom: theme.spacing.xs,
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
    saveButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.signal.base,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveButtonDisabled: {
      opacity: 0.35,
    },
  })

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
import { Stack, useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'

import {
  ITEM_CATEGORIES,
  categoriesForKind,
  dollarsToCents,
  type CategoryMeta,
  type NetWorthItemKind,
} from '@/features/networth'
import { useTheme, type Theme } from '@/features/theme'
import { useAppStore } from '@/store/useAppStore'
import { Card, Icon, Pressable, Screen, Text } from '@/ui'

const NewItemScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const addItem = useAppStore((state) => state.addItem)

  const [kind, setKind] = useState<NetWorthItemKind>('asset')
  const [category, setCategory] = useState<CategoryMeta>(ITEM_CATEGORIES[0])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const numericAmount = Number.parseFloat(amount)
  const amountValid = Number.isFinite(numericAmount) && numericAmount >= 0
  const canSubmit = name.trim().length > 0 && amountValid && !isSaving

  const handleKindChange = (next: NetWorthItemKind) => {
    if (next === kind) return
    setKind(next)
    setCategory(categoriesForKind(next)[0])
  }

  const onSave = async () => {
    if (!canSubmit) {
      Alert.alert('Check the entry', 'A name and a non-negative value are required.')
      return
    }
    setIsSaving(true)
    try {
      await addItem({
        name: name.trim(),
        kind,
        category: category.key,
        amountCents: dollarsToCents(numericAmount),
      })
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      router.back()
    } catch (e) {
      setIsSaving(false)
      Alert.alert('Could not save', e instanceof Error ? e.message : 'Please try again.')
    }
  }

  return (
    <Screen edges={['bottom']}>
      <Stack.Screen
        options={{
          title: kind === 'asset' ? 'New asset' : 'New liability',
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
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <KindSelector kind={kind} onChange={handleKindChange} />

          <Text variant="sectionHeader" tone="tertiary" style={styles.sectionGap}>
            Name
          </Text>
          <Card padded={false} style={styles.inputCard}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={kind === 'asset' ? 'e.g. Brokerage' : 'e.g. Auto loan'}
              placeholderTextColor={theme.colors.label.tertiary}
              autoCapitalize="words"
              style={[styles.textInput, { color: theme.colors.label.primary }]}
            />
          </Card>

          <Text variant="sectionHeader" tone="tertiary" style={styles.sectionGap}>
            Category
          </Text>
          <CategoryPicker kind={kind} value={category} onChange={setCategory} />

          <Text variant="sectionHeader" tone="tertiary" style={styles.sectionGap}>
            {kind === 'asset' ? 'Value' : 'Amount owed'}
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
              style={[styles.amountInput, { color: theme.colors.label.primary }]}
            />
          </Card>
          <Text variant="footnote" tone="tertiary" style={styles.hint}>
            You can update this any time.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

type KindSelectorProps = {
  kind: NetWorthItemKind
  onChange: (next: NetWorthItemKind) => void
}

const KindSelector = ({ kind, onChange }: KindSelectorProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  return (
    <View style={styles.kindRow}>
      <KindPill label="Asset" active={kind === 'asset'} onPress={() => onChange('asset')} />
      <KindPill
        label="Liability"
        active={kind === 'liability'}
        onPress={() => onChange('liability')}
      />
    </View>
  )
}

type KindPillProps = {
  label: string
  active: boolean
  onPress: () => void
}

const KindPill = ({ label, active, onPress }: KindPillProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  return (
    <Pressable
      onPress={onPress}
      style={[styles.kindPill, active && { backgroundColor: theme.colors.signal.base }]}
    >
      <Text variant="headline" tone={active ? 'onSignal' : 'secondary'}>
        {label}
      </Text>
    </Pressable>
  )
}

type CategoryPickerProps = {
  kind: NetWorthItemKind
  value: CategoryMeta
  onChange: (next: CategoryMeta) => void
}

const CategoryPicker = ({ kind, value, onChange }: CategoryPickerProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const options = categoriesForKind(kind)

  return (
    <Card padded={false}>
      {options.map((option, index) => {
        const isLast = index === options.length - 1
        const isSelected = option.key === value.key
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option)}
            style={[styles.categoryRow, !isLast && styles.divider]}
            scaleOnPress={false}
          >
            <View style={styles.categoryLeading}>
              <Icon name={option.symbol} size={20} tone="signal" />
            </View>
            <Text variant="body" style={styles.categoryLabel}>
              {option.label}
            </Text>
            {isSelected ? <Icon name="checkmark" size={18} tone="signal" /> : null}
          </Pressable>
        )
      })}
    </Card>
  )
}

export default NewItemScreen

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    flex: { flex: 1 },
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl,
    },
    sectionGap: {
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
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
    kindRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    kindPill: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      backgroundColor: theme.colors.surface.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    categoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.md,
    },
    divider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.separator,
    },
    categoryLeading: {
      width: 28,
      alignItems: 'center',
    },
    categoryLabel: {
      flex: 1,
    },
  })

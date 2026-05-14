import { useEffect, useMemo, useState } from 'react'
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

import {
  categoriesForKind,
  centsToDollars,
  dollarsToCents,
  findCategory,
  type CategoryMeta,
} from '@/features/networth'
import { useTheme, type Theme } from '@/features/theme'
import { AMOUNT_MAX_CENTS, NAME_MAX_LENGTH } from '@/lib/constants'
import { useAppStore } from '@/store/useAppStore'
import { Card, Icon, Pressable, Screen, Text } from '@/ui'

const AMOUNT_MAX_DOLLARS = AMOUNT_MAX_CENTS / 100

const EditItemScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const item = useAppStore((state) => state.items.find((i) => i.id === id))
  const updateItem = useAppStore((state) => state.updateItem)
  const deleteItem = useAppStore((state) => state.deleteItem)

  const initialCategory = item
    ? (findCategory(item.category) ?? categoriesForKind(item.kind)[0])
    : null
  const initialAmount = item ? centsToDollars(item.amountCents).toString() : ''

  const [name, setName] = useState(item?.name ?? '')
  const [category, setCategory] = useState<CategoryMeta | null>(initialCategory)
  const [amount, setAmount] = useState(initialAmount)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!item) return
    setName(item.name)
    setCategory(findCategory(item.category) ?? categoriesForKind(item.kind)[0])
    setAmount(centsToDollars(item.amountCents).toString())
  }, [item])

  if (!item) {
    return <NotFound />
  }

  const numericAmount = Number.parseFloat(amount)
  const amountValid =
    Number.isFinite(numericAmount) && numericAmount >= 0 && numericAmount <= AMOUNT_MAX_DOLLARS
  const canSubmit = name.trim().length > 0 && amountValid && category !== null && !isSaving

  const onSave = async () => {
    if (!canSubmit || !category) {
      Alert.alert('Check the entry', 'A name and a non-negative value are required.')
      return
    }
    setIsSaving(true)
    try {
      await updateItem(item.id, {
        name: name.trim(),
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

  const onDelete = () => {
    Alert.alert(`Delete ${item.name}?`, 'This removes the entry from your net worth.', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteItem(item.id)
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            router.back()
          } catch (e) {
            Alert.alert('Could not delete', e instanceof Error ? e.message : 'Please try again.')
          }
        },
      },
    ])
  }

  return (
    <Screen edges={['bottom']}>
      <Stack.Screen
        options={{
          title: item.kind === 'asset' ? 'Edit asset' : 'Edit liability',
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
          <Text variant="sectionHeader" tone="tertiary" style={styles.firstSection}>
            Name
          </Text>
          <Card padded={false} style={styles.inputCard}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholderTextColor={theme.colors.label.tertiary}
              autoCapitalize="words"
              maxLength={NAME_MAX_LENGTH}
              style={[styles.textInput, { color: theme.colors.label.primary }]}
            />
          </Card>

          <Text variant="sectionHeader" tone="tertiary" style={styles.sectionGap}>
            Category
          </Text>
          {category ? (
            <CategoryPicker kind={item.kind} value={category} onChange={setCategory} />
          ) : null}

          <Text variant="sectionHeader" tone="tertiary" style={styles.sectionGap}>
            {item.kind === 'asset' ? 'Value' : 'Amount owed'}
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

          <Pressable onPress={onDelete} style={styles.deleteAction} scaleOnPress={false}>
            <Text variant="footnote" style={{ color: theme.colors.danger.base }}>
              Delete entry
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

type CategoryPickerProps = {
  kind: 'asset' | 'liability'
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

const NotFound = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={styles.notFound}>
        <Icon name="questionmark.circle" size={40} tone="tertiary" />
        <Text variant="headline" tone="secondary">
          That entry isn't here anymore.
        </Text>
      </View>
    </Screen>
  )
}

export default EditItemScreen

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    flex: { flex: 1 },
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl,
    },
    firstSection: {
      marginBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
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
    categoryLabel: {
      flex: 1,
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

import { useMemo } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'

import { centsToDollars, findCategory } from '@/features/networth'
import { SnapshotList } from '@/features/networth/components/SnapshotList'
import { useTheme, type Theme } from '@/features/theme'
import { formatCurrency } from '@/lib/currency'
import { useAppStore } from '@/store/useAppStore'
import { Icon, Pressable, Screen, Text } from '@/ui'

const ItemDetailScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const item = useAppStore((state) => state.items.find((i) => i.id === id))
  const allSnapshots = useAppStore((state) => state.snapshots)
  const deleteItem = useAppStore((state) => state.deleteItem)
  const deleteSnapshot = useAppStore((state) => state.deleteSnapshot)

  const snapshots = useMemo(
    () =>
      allSnapshots
        .filter((s) => s.itemId === id)
        .sort((a, b) => b.capturedAt.localeCompare(a.capturedAt)),
    [allSnapshots, id],
  )

  if (!item) {
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

  const categoryLabel = findCategory(item.category)?.label ?? ''

  const onDelete = () => {
    Alert.alert(`Delete ${item.name}?`, 'This removes the entry and all its history.', [
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
          title: '',
          headerRight: () => (
            <Pressable
              onPress={() => router.push(`/networth/edit/${item.id}`)}
              hitSlop={10}
              scaleOnPress={false}
            >
              <Icon name="pencil" size={20} tone="signal" />
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroBlock}>
          <Text variant="caption" tone="tertiary">
            {item.kind === 'asset' ? 'CURRENT VALUE' : 'CURRENT BALANCE'}
          </Text>
          <Text variant="hero" style={styles.heroNumber}>
            {formatCurrency(centsToDollars(item.amountCents))}
          </Text>
          <Text variant="headline" style={styles.name}>
            {item.name}
          </Text>
          <Text variant="footnote" tone="tertiary">
            {categoryLabel}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push(`/networth/log/${item.id}`)}
          style={styles.primaryButton}
        >
          <View style={styles.primaryButtonContent}>
            <Icon name="plus" size={16} tone="onSignal" weight="bold" />
            <Text variant="headline" tone="onSignal">
              Log new value
            </Text>
          </View>
        </Pressable>

        <Text variant="sectionHeader" tone="tertiary" style={styles.historyHeader}>
          History
        </Text>
        <SnapshotList snapshots={snapshots} onDelete={deleteSnapshot} />

        <Pressable onPress={onDelete} style={styles.deleteAction} scaleOnPress={false}>
          <Text variant="footnote" style={{ color: theme.colors.danger.base }}>
            Delete entry
          </Text>
        </Pressable>
      </ScrollView>
    </Screen>
  )
}

export default ItemDetailScreen

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl,
    },
    heroBlock: {
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
      gap: theme.spacing.xs,
    },
    heroNumber: {
      color: theme.colors.signal.base,
    },
    name: {
      marginTop: theme.spacing.md,
    },
    primaryButton: {
      height: 52,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.signal.base,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    historyHeader: {
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
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

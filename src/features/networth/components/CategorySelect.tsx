import { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme, type Theme } from '@/features/theme'
import { Card, Icon, Pressable, Text } from '@/ui'

import { categoriesForKind, type CategoryMeta } from '../constants'
import type { NetWorthItemKind } from '../types'

export type CategorySelectProps = {
  kind: NetWorthItemKind
  value: CategoryMeta
  onChange: (next: CategoryMeta) => void
}

export const CategorySelect = ({ kind, value, onChange }: CategorySelectProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const options = categoriesForKind(kind)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card padded={false}>
      <Pressable onPress={() => setIsOpen((v) => !v)} scaleOnPress={false}>
        <View style={[styles.triggerRow, isOpen && styles.divider]}>
          <Text variant="body">{value.label}</Text>
          <Icon name={isOpen ? 'chevron.up' : 'chevron.down'} size={14} tone="tertiary" />
        </View>
      </Pressable>
      {isOpen
        ? options.map((option, index) => {
            const isLast = index === options.length - 1
            const isSelected = option.key === value.key
            return (
              <Pressable
                key={option.key}
                onPress={() => {
                  onChange(option)
                  setIsOpen(false)
                }}
                scaleOnPress={false}
              >
                <View style={[styles.optionRow, !isLast && styles.divider]}>
                  <Text variant="body" style={styles.optionLabel}>
                    {option.label}
                  </Text>
                  {isSelected ? <Icon name="checkmark" size={16} tone="signal" /> : null}
                </View>
              </Pressable>
            )
          })
        : null}
    </Card>
  )
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    triggerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.base,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    optionLabel: {
      flex: 1,
    },
    divider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.separator,
    },
  })

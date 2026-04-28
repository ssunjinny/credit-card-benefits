import { useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import * as Haptics from 'expo-haptics'

import {
  themeList,
  useSetTheme,
  useTheme,
  type Theme,
  type ThemeKey,
} from '@/features/theme'
import { Icon, Pressable, Screen } from '@/ui'

const SWATCH_SIZE = 28

const ThemeSettingsScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const { themeKey, setTheme } = useSetTheme()

  const onPick = (key: ThemeKey) => {
    if (key === themeKey) return
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    setTheme(key)
  }

  return (
    <Screen edges={['bottom']}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {themeList.map((option) => (
            <ThemePalette
              key={option.key}
              theme={option}
              selected={option.key === themeKey}
              onPress={() => onPick(option.key)}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  )
}

type ThemePaletteProps = {
  theme: Theme
  selected: boolean
  onPress: () => void
}

const ThemePalette = ({ theme, selected, onPress }: ThemePaletteProps) => {
  const ambient = useTheme()
  const styles = useMemo(() => createStyles(ambient), [ambient])

  const swatches = [
    theme.colors.surface.canvas,
    theme.colors.surface.cardElevated,
    theme.colors.signal.base,
    theme.colors.label.primary,
  ]

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tile,
        { backgroundColor: theme.colors.surface.cardElevated },
        selected && {
          borderColor: ambient.colors.signal.base,
          borderWidth: 2,
        },
      ]}
    >
      <View style={styles.swatches}>
        {swatches.map((color, index) => (
          <View
            key={index}
            style={[styles.swatch, { backgroundColor: color }]}
          />
        ))}
      </View>
      {selected ? (
        <View style={styles.check}>
          <Icon name="checkmark.circle.fill" size={22} tone="signal" />
        </View>
      ) : null}
    </Pressable>
  )
}

export default ThemeSettingsScreen

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    tile: {
      flexBasis: '47%',
      flexGrow: 1,
      aspectRatio: 1.4,
      borderRadius: theme.radii.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      justifyContent: 'center',
    },
    swatches: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      justifyContent: 'center',
    },
    swatch: {
      width: SWATCH_SIZE,
      height: SWATCH_SIZE,
      borderRadius: SWATCH_SIZE / 2,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'rgba(0,0,0,0.08)',
    },
    check: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
    },
  })

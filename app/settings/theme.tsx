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
import { Card, Icon, Pressable, ProgressBar, Screen, Text } from '@/ui'

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
        <Text variant="callout" tone="secondary" style={styles.intro}>
          Pick the mood that fits. Changes apply instantly.
        </Text>
        <View style={styles.grid}>
          {themeList.map((option) => (
            <ThemePreview
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

type ThemePreviewProps = {
  theme: Theme
  selected: boolean
  onPress: () => void
}

const ThemePreview = ({ theme, selected, onPress }: ThemePreviewProps) => {
  const ambient = useTheme()
  const styles = useMemo(() => createStyles(ambient), [ambient])

  const previewBackground = theme.colors.surface.canvas
  const previewSurface = theme.colors.surface.cardElevated
  const previewLabel = theme.colors.label.primary
  const previewSub = theme.colors.label.tertiary
  const previewSignal = theme.colors.signal.base
  const borderColor = selected ? ambient.colors.borderEmphasis : ambient.colors.border

  return (
    <Pressable onPress={onPress} style={[styles.previewWrap, { borderColor }]}>
      <View style={[styles.preview, { backgroundColor: previewBackground }]}>
        <View
          style={[
            styles.previewCard,
            {
              backgroundColor: previewSurface,
              borderRadius: theme.radii.lg,
            },
          ]}
        >
          <Text
            variant="caption"
            style={{ color: previewSub }}
          >
            CAPTURED
          </Text>
          <Text variant="display" style={{ color: previewSignal }}>
            $597
          </Text>
          <View style={styles.previewBar}>
            <View
              style={[
                styles.previewBarTrack,
                { backgroundColor: theme.colors.surface.inset },
              ]}
            >
              <View
                style={[
                  styles.previewBarFill,
                  { backgroundColor: previewSignal },
                ]}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.previewMeta}>
        <Text variant="headline">{theme.name}</Text>
        {selected ? <Icon name="checkmark.circle.fill" size={18} tone="signal" /> : null}
      </View>
    </Pressable>
  )
}

export default ThemeSettingsScreen

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl,
      gap: theme.spacing.lg,
    },
    intro: {
      paddingHorizontal: theme.spacing.xs,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    previewWrap: {
      flexBasis: '47%',
      flexGrow: 1,
      borderRadius: theme.radii.lg,
      borderWidth: StyleSheet.hairlineWidth,
      overflow: 'hidden',
    },
    preview: {
      padding: theme.spacing.base,
      borderTopLeftRadius: theme.radii.lg,
      borderTopRightRadius: theme.radii.lg,
    },
    previewCard: {
      padding: theme.spacing.base,
      gap: theme.spacing.xs,
    },
    previewBar: {
      marginTop: theme.spacing.sm,
    },
    previewBarTrack: {
      height: 6,
      borderRadius: 3,
      overflow: 'hidden',
    },
    previewBarFill: {
      width: '66%',
      height: '100%',
      borderRadius: 3,
    },
    previewMeta: {
      paddingHorizontal: theme.spacing.base,
      paddingVertical: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface.card,
    },
  })

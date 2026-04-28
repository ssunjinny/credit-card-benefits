import { useMemo, type ReactNode } from 'react'
import { StyleSheet, View, type ViewStyle } from 'react-native'
import * as Haptics from 'expo-haptics'

import { useTheme, type Theme } from '@/features/theme'

import { Pressable } from './Pressable'
import { Text } from './Text'

const BUTTON_HEIGHT = 52

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export type ButtonProps = {
  label: string
  onPress: () => void | Promise<void>
  variant?: ButtonVariant
  disabled?: boolean
  leading?: ReactNode
  style?: ViewStyle
  testID?: string
}

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  leading,
  style,
  testID,
}: ButtonProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])

  const handlePress = () => {
    if (disabled) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onPress()
  }

  const surface =
    variant === 'primary'
      ? styles.primary
      : variant === 'danger'
        ? styles.danger
        : variant === 'secondary'
          ? styles.secondary
          : styles.ghost

  const tone =
    variant === 'primary' ? 'onSignal' : variant === 'danger' ? 'onSignal' : 'primary'

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      testID={testID}
      style={[styles.button, surface, disabled && styles.disabled, style]}
    >
      <View style={styles.content}>
        {leading}
        <Text variant="headline" tone={tone}>
          {label}
        </Text>
      </View>
    </Pressable>
  )
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      height: BUTTON_HEIGHT,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    primary: {
      backgroundColor: theme.colors.signal.base,
    },
    secondary: {
      backgroundColor: theme.colors.surface.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.borderEmphasis,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    danger: {
      backgroundColor: theme.colors.danger.base,
    },
    disabled: {
      opacity: 0.4,
    },
  })

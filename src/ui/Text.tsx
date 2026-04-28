import { useMemo } from 'react'
import { StyleSheet, Text as RNText, type TextProps as RNTextProps } from 'react-native'

import { useTheme, type Theme } from '@/features/theme'

export type TextVariant = keyof Theme['typography']
export type TextTone = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'signal' | 'onSignal'

export type TextProps = RNTextProps & {
  variant?: TextVariant
  tone?: TextTone
}

export const Text = ({
  variant = 'body',
  tone = 'primary',
  style,
  children,
  ...rest
}: TextProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <RNText style={[styles[variant], toneStyle(theme, tone), style]} {...rest}>
      {children}
    </RNText>
  )
}

const toneStyle = (theme: Theme, tone: TextTone) => {
  switch (tone) {
    case 'secondary':
      return { color: theme.colors.label.secondary }
    case 'tertiary':
      return { color: theme.colors.label.tertiary }
    case 'quaternary':
      return { color: theme.colors.label.quaternary }
    case 'signal':
      return { color: theme.colors.signal.base }
    case 'onSignal':
      return { color: theme.isDark ? theme.colors.surface.canvas : theme.colors.surface.card }
    case 'primary':
    default:
      return { color: theme.colors.label.primary }
  }
}

const createStyles = (theme: Theme) => StyleSheet.create(theme.typography)

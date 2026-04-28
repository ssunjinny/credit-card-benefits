import { useMemo, type ReactNode } from 'react'
import { StyleSheet, View, type ViewProps } from 'react-native'

import { useTheme, type Theme } from '@/features/theme'

export type CardElevation = 'flat' | 'card' | 'elevated' | 'floating'

export type CardProps = ViewProps & {
  elevation?: CardElevation
  padded?: boolean
  hero?: boolean
  children?: ReactNode
}

export const Card = ({
  elevation = 'card',
  padded = true,
  hero = false,
  style,
  children,
  ...rest
}: CardProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])

  const surface = elevation === 'elevated' || hero ? styles.surfaceElevated : styles.surface
  const radius = hero ? styles.heroRadius : styles.cardRadius
  const shadow =
    elevation === 'flat'
      ? theme.shadows.none
      : elevation === 'elevated' || hero
        ? theme.shadows.elevated
        : elevation === 'floating'
          ? theme.shadows.floating
          : theme.shadows.card

  return (
    <View
      style={[
        styles.base,
        surface,
        radius,
        padded && (hero ? styles.heroPadding : styles.padding),
        shadow,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  )
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      overflow: 'hidden',
    },
    surface: {
      backgroundColor: theme.colors.surface.card,
    },
    surfaceElevated: {
      backgroundColor: theme.colors.surface.cardElevated,
    },
    cardRadius: {
      borderRadius: theme.radii.lg,
    },
    heroRadius: {
      borderRadius: theme.radii.xl,
    },
    padding: {
      padding: theme.spacing.xl,
    },
    heroPadding: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.xxl,
      paddingBottom: theme.spacing.xl,
    },
  })

import type { TextStyle, ViewStyle } from 'react-native'

export type ThemeKey = 'cream' | 'midnight' | 'onyx' | 'platinum'

export type ColorTokens = {
  surface: {
    canvas: string
    card: string
    cardElevated: string
    inset: string
    deep: string
  }
  label: {
    primary: string
    secondary: string
    tertiary: string
    quaternary: string
    onDark: string
  }
  signal: {
    base: string
    soft: string
    onSoft: string
  }
  warning: { base: string; soft: string }
  danger: { base: string; soft: string }
  separator: string
  border: string
  borderEmphasis: string
}

export type TypographyScale = {
  hero: TextStyle
  display: TextStyle
  largeTitle: TextStyle
  title1: TextStyle
  title2: TextStyle
  title3: TextStyle
  headline: TextStyle
  body: TextStyle
  callout: TextStyle
  subheadline: TextStyle
  footnote: TextStyle
  caption: TextStyle
  listValue: TextStyle
  sectionHeader: TextStyle
}

export type SpacingScale = {
  xs: 4
  sm: 8
  md: 12
  base: 16
  lg: 20
  xl: 24
  xxl: 32
  xxxl: 48
  huge: 72
}

export type RadiiScale = {
  sm: 8
  md: 14
  lg: 20
  xl: 28
  pill: 999
}

export type ShadowScale = {
  none: ViewStyle
  card: ViewStyle
  elevated: ViewStyle
  floating: ViewStyle
}

export type MotionScale = {
  spring: { damping: number; stiffness: number; mass: number }
  springSoft: { damping: number; stiffness: number; mass: number }
  springSnappy: { damping: number; stiffness: number; mass: number }
  timing: { duration: number }
  timingFast: { duration: number }
}

export type Theme = {
  key: ThemeKey
  name: string
  isDark: boolean
  colors: ColorTokens
  typography: TypographyScale
  spacing: SpacingScale
  radii: RadiiScale
  shadows: ShadowScale
  motion: MotionScale
}

export const typography: TypographyScale = {
  hero: {
    fontSize: 56,
    lineHeight: 60,
    fontWeight: '600',
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'],
  },
  display: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '600',
    letterSpacing: -0.8,
    fontVariant: ['tabular-nums'],
  },
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: '600' },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 17, lineHeight: 24, fontWeight: '400' },
  callout: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  subheadline: { fontSize: 15, lineHeight: 20, fontWeight: '400' },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  listValue: { fontSize: 17, fontWeight: '500', fontVariant: ['tabular-nums'] },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
}

export const spacing: SpacingScale = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 72,
}

export const radii: RadiiScale = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
}

export const shadowsLight: ShadowScale = {
  none: {},
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  elevated: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  floating: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
}

export const shadowsNone: ShadowScale = {
  none: {},
  card: {},
  elevated: {},
  floating: {},
}

export const motion: MotionScale = {
  spring: { damping: 18, stiffness: 200, mass: 1 },
  springSoft: { damping: 22, stiffness: 140, mass: 1 },
  springSnappy: { damping: 15, stiffness: 350, mass: 0.8 },
  timing: { duration: 280 },
  timingFast: { duration: 180 },
}

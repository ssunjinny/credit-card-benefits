import type { TextStyle, ViewStyle } from 'react-native'

export type ThemeKey = 'light' | 'dark'

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

export const fontFamily = {
  satoshiRegular: 'Satoshi-Regular',
  satoshiMedium: 'Satoshi-Medium',
  satoshiBold: 'Satoshi-Bold',
  satoshiBlack: 'Satoshi-Black',
  monoRegular: 'GeistMono_400Regular',
  monoMedium: 'GeistMono_500Medium',
  monoSemiBold: 'GeistMono_600SemiBold',
  monoBold: 'GeistMono_700Bold',
} as const

export const typography: TypographyScale = {
  hero: {
    fontFamily: fontFamily.monoSemiBold,
    fontSize: 56,
    lineHeight: 60,
    letterSpacing: -1.8,
    fontVariant: ['tabular-nums'],
  },
  display: {
    fontFamily: fontFamily.monoSemiBold,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.8,
    fontVariant: ['tabular-nums'],
  },
  largeTitle: {
    fontFamily: fontFamily.satoshiBold,
    fontSize: 34,
    lineHeight: 41,
    letterSpacing: -0.5,
  },
  title1: {
    fontFamily: fontFamily.satoshiBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  title2: {
    fontFamily: fontFamily.satoshiMedium,
    fontSize: 22,
    lineHeight: 28,
  },
  title3: {
    fontFamily: fontFamily.satoshiMedium,
    fontSize: 20,
    lineHeight: 25,
  },
  headline: {
    fontFamily: fontFamily.satoshiMedium,
    fontSize: 17,
    lineHeight: 22,
  },
  body: {
    fontFamily: fontFamily.satoshiRegular,
    fontSize: 17,
    lineHeight: 24,
  },
  callout: {
    fontFamily: fontFamily.satoshiRegular,
    fontSize: 16,
    lineHeight: 22,
  },
  subheadline: {
    fontFamily: fontFamily.satoshiRegular,
    fontSize: 15,
    lineHeight: 20,
  },
  footnote: {
    fontFamily: fontFamily.satoshiRegular,
    fontSize: 13,
    lineHeight: 18,
  },
  caption: {
    fontFamily: fontFamily.satoshiMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  listValue: {
    fontFamily: fontFamily.monoMedium,
    fontSize: 17,
    fontVariant: ['tabular-nums'],
  },
  sectionHeader: {
    fontFamily: fontFamily.satoshiMedium,
    fontSize: 13,
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

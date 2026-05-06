import { motion, radii, shadowsNone, spacing, typography, type Theme } from '../tokens'

export const dark: Theme = {
  key: 'dark',
  name: 'Dark',
  isDark: true,
  colors: {
    surface: {
      canvas: '#0A0A0A',
      card: '#1A1A1A',
      cardElevated: '#222222',
      inset: '#141414',
      deep: '#050505',
    },
    label: {
      primary: '#FAFAFA',
      secondary: 'rgba(250,250,250,0.62)',
      tertiary: 'rgba(250,250,250,0.42)',
      quaternary: 'rgba(250,250,250,0.22)',
      onDark: '#FAFAFA',
    },
    signal: {
      base: '#C9A86A',
      soft: 'rgba(201,168,106,0.15)',
      onSoft: '#C9A86A',
    },
    warning: { base: '#D49659', soft: 'rgba(212,150,89,0.15)' },
    danger: { base: '#C26E6E', soft: 'rgba(194,110,110,0.15)' },
    separator: 'rgba(250,250,250,0.08)',
    border: 'rgba(250,250,250,0.10)',
    borderEmphasis: 'rgba(250,250,250,0.18)',
  },
  typography,
  spacing,
  radii,
  shadows: shadowsNone,
  motion,
}

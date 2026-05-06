import { motion, radii, shadowsNone, spacing, typography, type Theme } from '../tokens'

export const onyx: Theme = {
  key: 'onyx',
  name: 'Onyx & Champagne',
  isDark: true,
  colors: {
    surface: {
      canvas: '#0E0E10',
      card: '#1C1C20',
      cardElevated: '#24242A',
      inset: '#161618',
      deep: '#000000',
    },
    label: {
      primary: '#EDE6D6',
      secondary: 'rgba(237,230,214,0.62)',
      tertiary: 'rgba(237,230,214,0.42)',
      quaternary: 'rgba(237,230,214,0.22)',
      onDark: '#EDE6D6',
    },
    signal: {
      base: '#C9A86A',
      soft: 'rgba(201,168,106,0.15)',
      onSoft: '#C9A86A',
    },
    warning: { base: '#D49659', soft: 'rgba(212,150,89,0.15)' },
    danger: { base: '#C26E6E', soft: 'rgba(194,110,110,0.15)' },
    separator: 'rgba(237,230,214,0.06)',
    border: 'rgba(237,230,214,0.08)',
    borderEmphasis: 'rgba(237,230,214,0.16)',
  },
  typography,
  spacing,
  radii,
  shadows: shadowsNone,
  motion,
}

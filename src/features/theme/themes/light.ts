import { motion, radii, shadowsLight, spacing, typography, type Theme } from '../tokens'

export const light: Theme = {
  key: 'light',
  name: 'Light',
  isDark: false,
  colors: {
    surface: {
      canvas: '#FAFAFA',
      card: '#FFFFFF',
      cardElevated: '#FFFFFF',
      inset: '#F1F1F1',
      deep: '#0A0A0A',
    },
    label: {
      primary: '#0A0A0A',
      secondary: 'rgba(10,10,10,0.62)',
      tertiary: 'rgba(10,10,10,0.42)',
      quaternary: 'rgba(10,10,10,0.22)',
      onDark: '#FAFAFA',
    },
    signal: {
      base: '#8B6F3D',
      soft: '#E8DCC2',
      onSoft: '#5C4827',
    },
    warning: { base: '#A05A1F', soft: '#F0E2CE' },
    danger: { base: '#8C2828', soft: '#EDD9D5' },
    separator: 'rgba(10,10,10,0.08)',
    border: 'rgba(10,10,10,0.10)',
    borderEmphasis: 'rgba(10,10,10,0.18)',
  },
  typography,
  spacing,
  radii,
  shadows: shadowsLight,
  motion,
}

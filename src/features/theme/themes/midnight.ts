import {
  motion,
  radii,
  shadowsNone,
  spacing,
  typography,
  type Theme,
} from '../tokens'

export const midnight: Theme = {
  key: 'midnight',
  name: 'Midnight Concierge',
  isDark: true,
  colors: {
    surface: {
      canvas: '#14171C',
      card: '#1E232A',
      cardElevated: '#252B33',
      inset: '#1A1E24',
      deep: '#0A0C10',
    },
    label: {
      primary: '#E8DFCB',
      secondary: 'rgba(232,223,203,0.62)',
      tertiary: 'rgba(232,223,203,0.42)',
      quaternary: 'rgba(232,223,203,0.22)',
      onDark: '#E8DFCB',
    },
    signal: {
      base: '#C9A86A',
      soft: 'rgba(201,168,106,0.15)',
      onSoft: '#C9A86A',
    },
    warning: { base: '#D49659', soft: 'rgba(212,150,89,0.15)' },
    danger: { base: '#C26E6E', soft: 'rgba(194,110,110,0.15)' },
    separator: 'rgba(232,223,203,0.08)',
    border: 'rgba(232,223,203,0.10)',
    borderEmphasis: 'rgba(232,223,203,0.18)',
  },
  typography,
  spacing,
  radii,
  shadows: shadowsNone,
  motion,
}

import { motion, radii, shadowsNone, spacing, typography, type Theme } from '../tokens'

export const platinum: Theme = {
  key: 'platinum',
  name: 'Platinum Vault',
  isDark: true,
  colors: {
    surface: {
      canvas: '#1A1F26',
      card: '#252B34',
      cardElevated: '#2D343E',
      inset: '#1F2530',
      deep: '#0D1117',
    },
    label: {
      primary: '#D4D9DF',
      secondary: 'rgba(212,217,223,0.62)',
      tertiary: 'rgba(212,217,223,0.42)',
      quaternary: 'rgba(212,217,223,0.22)',
      onDark: '#D4D9DF',
    },
    signal: {
      base: '#B8A77F',
      soft: 'rgba(184,167,127,0.15)',
      onSoft: '#B8A77F',
    },
    warning: { base: '#C29050', soft: 'rgba(194,144,80,0.15)' },
    danger: { base: '#B86B6B', soft: 'rgba(184,107,107,0.15)' },
    separator: 'rgba(212,217,223,0.08)',
    border: 'rgba(212,217,223,0.10)',
    borderEmphasis: 'rgba(212,217,223,0.18)',
  },
  typography,
  spacing,
  radii,
  shadows: shadowsNone,
  motion,
}

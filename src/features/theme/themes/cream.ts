import {
  motion,
  radii,
  shadowsLight,
  spacing,
  typography,
  type Theme,
} from '../tokens'

export const cream: Theme = {
  key: 'cream',
  name: 'Cream & Graphite',
  isDark: false,
  colors: {
    surface: {
      canvas: '#EFEAE0',
      card: '#FBF8F1',
      cardElevated: '#FBF8F1',
      inset: '#E5DFD2',
      deep: '#1C1C1A',
    },
    label: {
      primary: '#1C1C1A',
      secondary: 'rgba(28,28,26,0.62)',
      tertiary: 'rgba(28,28,26,0.42)',
      quaternary: 'rgba(28,28,26,0.22)',
      onDark: '#EFEAE0',
    },
    signal: {
      base: '#8B6F3D',
      soft: '#E8DCC2',
      onSoft: '#5C4827',
    },
    warning: { base: '#A05A1F', soft: '#F0E2CE' },
    danger: { base: '#8C2828', soft: '#EDD9D5' },
    separator: 'rgba(28,28,26,0.08)',
    border: 'rgba(28,28,26,0.10)',
    borderEmphasis: 'rgba(28,28,26,0.18)',
  },
  typography,
  spacing,
  radii,
  shadows: shadowsLight,
  motion,
}

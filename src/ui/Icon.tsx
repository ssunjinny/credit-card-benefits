import { SymbolView, type SymbolViewProps } from 'expo-symbols'

import { useTheme, type Theme } from '@/features/theme'

export type IconTone = 'primary' | 'secondary' | 'tertiary' | 'signal' | 'onSignal' | 'danger'

export type IconProps = {
  name: SymbolViewProps['name']
  size?: number
  tone?: IconTone
  weight?: SymbolViewProps['weight']
}

const colorFor = (theme: Theme, tone: IconTone) => {
  switch (tone) {
    case 'secondary':
      return theme.colors.label.secondary
    case 'tertiary':
      return theme.colors.label.tertiary
    case 'signal':
      return theme.colors.signal.base
    case 'onSignal':
      return theme.isDark ? theme.colors.surface.canvas : theme.colors.surface.card
    case 'danger':
      return theme.colors.danger.base
    case 'primary':
    default:
      return theme.colors.label.primary
  }
}

export const Icon = ({ name, size = 22, tone = 'primary', weight = 'regular' }: IconProps) => {
  const theme = useTheme()
  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={colorFor(theme, tone)}
      weight={weight}
      resizeMode="scaleAspectFit"
    />
  )
}

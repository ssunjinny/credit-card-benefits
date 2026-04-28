import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated'

import { useTheme, type Theme } from '@/features/theme'

export type ProgressBarProps = {
  percentage: number
  height?: number
  tone?: 'signal' | 'neutral'
}

export const ProgressBar = ({ percentage, height = 8, tone = 'signal' }: ProgressBarProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme, height, tone), [theme, height, tone])

  const clamped = Math.max(0, Math.min(100, percentage))
  const target = useDerivedValue(() =>
    withSpring(clamped, theme.motion.springSoft),
  )

  const fillStyle = useAnimatedStyle(() => ({
    width: `${target.value}%`,
  }))

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, fillStyle]} />
    </View>
  )
}

const createStyles = (theme: Theme, height: number, tone: 'signal' | 'neutral') =>
  StyleSheet.create({
    track: {
      height,
      borderRadius: height / 2,
      backgroundColor: theme.colors.surface.inset,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: height / 2,
      backgroundColor:
        tone === 'signal' ? theme.colors.signal.base : theme.colors.label.tertiary,
    },
  })

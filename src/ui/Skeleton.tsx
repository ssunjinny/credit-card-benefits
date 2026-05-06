import { useEffect, useMemo } from 'react'
import { StyleSheet, View, type ViewStyle } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { useTheme, type Theme } from '@/features/theme'

export type SkeletonProps = {
  width?: number | `${number}%`
  height?: number
  radius?: number
  style?: ViewStyle
}

export const Skeleton = ({ width = '100%', height = 16, radius, style }: SkeletonProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const opacity = useSharedValue(0.6)

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700 }), -1, true)
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Animated.View
      style={[
        styles.base,
        { width, height, borderRadius: radius ?? theme.radii.sm },
        animatedStyle,
        style,
      ]}
    />
  )
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      backgroundColor: theme.colors.surface.inset,
    },
  })

export const Stack = ({
  gap = 8,
  children,
  style,
}: {
  gap?: number
  children: React.ReactNode
  style?: ViewStyle
}) => <View style={[{ gap }, style]}>{children}</View>

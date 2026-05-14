import { forwardRef } from 'react'
import {
  Pressable as RNPressable,
  type PressableProps as RNPressableProps,
  type View,
} from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import { useTheme } from '@/features/theme'

const PRESS_FEEDBACK_SCALE = 0.97
const PRESS_FEEDBACK_OPACITY = 0.92

export type PressableProps = RNPressableProps & {
  scaleOnPress?: boolean
}

export const Pressable = forwardRef<View, PressableProps>(
  ({ scaleOnPress = true, onPressIn, onPressOut, style, children, ...rest }, ref) => {
    const theme = useTheme()
    const scale = useSharedValue(1)
    const opacity = useSharedValue(1)

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }))

    const handlePressIn: RNPressableProps['onPressIn'] = (event) => {
      if (scaleOnPress) {
        scale.value = withSpring(PRESS_FEEDBACK_SCALE, theme.motion.springSnappy)
        opacity.value = withSpring(PRESS_FEEDBACK_OPACITY, theme.motion.springSnappy)
      }
      onPressIn?.(event)
    }

    const handlePressOut: RNPressableProps['onPressOut'] = (event) => {
      if (scaleOnPress) {
        scale.value = withSpring(1, theme.motion.springSnappy)
        opacity.value = withSpring(1, theme.motion.springSnappy)
      }
      onPressOut?.(event)
    }

    return (
      <RNPressable
        ref={ref}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style}
        {...rest}
      >
        {typeof children === 'function' ? (
          (state) => <Animated.View style={animatedStyle}>{children(state)}</Animated.View>
        ) : (
          <Animated.View style={animatedStyle}>{children}</Animated.View>
        )}
      </RNPressable>
    )
  },
)

Pressable.displayName = 'Pressable'

import { useMemo, type ReactNode } from 'react'
import { StyleSheet, View, type ViewStyle } from 'react-native'
import { SafeAreaView, type Edge } from 'react-native-safe-area-context'

import { useTheme, type Theme } from '@/features/theme'

export type ScreenProps = {
  children: ReactNode
  edges?: Edge[]
  style?: ViewStyle
}

export const Screen = ({ children, edges = ['top', 'bottom'], style }: ScreenProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  return (
    <SafeAreaView edges={edges} style={[styles.base, style]}>
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  )
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      flex: 1,
      backgroundColor: theme.colors.surface.canvas,
    },
    inner: {
      flex: 1,
    },
  })

import 'react-native-gesture-handler'

import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import {
  GeistMono_400Regular,
  GeistMono_500Medium,
  GeistMono_600SemiBold,
  GeistMono_700Bold,
} from '@expo-google-fonts/geist-mono'

import {
  ThemeProvider,
  useTheme,
  useThemeReady,
} from '@/features/theme'
import { Skeleton } from '@/ui'
import { useAppStore } from '@/store/useAppStore'

const RootStack = () => {
  const theme = useTheme()
  const themeReady = useThemeReady()
  const initialize = useAppStore((s) => s.initialize)
  const isLoaded = useAppStore((s) => s.isLoaded)
  const hasOnboarded = useAppStore((s) => s.hasOnboarded)
  const router = useRouter()
  const segments = useSegments()
  const [fontsLoaded] = useFonts({
    'Satoshi-Regular': require('../assets/fonts/Satoshi-Regular.otf'),
    'Satoshi-Medium': require('../assets/fonts/Satoshi-Medium.otf'),
    'Satoshi-Bold': require('../assets/fonts/Satoshi-Bold.otf'),
    'Satoshi-Black': require('../assets/fonts/Satoshi-Black.otf'),
    GeistMono_400Regular,
    GeistMono_500Medium,
    GeistMono_600SemiBold,
    GeistMono_700Bold,
  })

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (!isLoaded) return
    const inOnboarding = segments[0] === 'onboarding'
    if (!hasOnboarded && !inOnboarding) {
      router.replace('/onboarding')
    } else if (hasOnboarded && inOnboarding) {
      router.replace('/')
    }
  }, [isLoaded, hasOnboarded, segments, router])

  if (!themeReady || !isLoaded || !fontsLoaded) {
    return <BootSkeleton />
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface.canvas },
        headerShadowVisible: false,
        headerTintColor: theme.colors.signal.base,
        headerTitleStyle: {
          color: theme.colors.label.primary,
          fontFamily: 'Satoshi-Medium',
          fontSize: 17,
        },
        headerBackButtonDisplayMode: 'minimal',
        headerBackTitle: '',
        contentStyle: { backgroundColor: theme.colors.surface.canvas },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="benefit/[id]" options={{ title: '' }} />
      <Stack.Screen
        name="log/[benefitId]"
        options={{ presentation: 'modal', title: 'Capture a use' }}
      />
      <Stack.Screen name="settings/index" options={{ title: 'Settings' }} />
      <Stack.Screen name="settings/theme" options={{ title: 'Theme' }} />
    </Stack>
  )
}

const BootSkeleton = () => {
  const theme = useTheme()
  return (
    <View style={[styles.bootContainer, { backgroundColor: theme.colors.surface.canvas }]}>
      <View style={styles.bootStack}>
        <Skeleton width={140} height={20} />
        <Skeleton width="100%" height={180} radius={theme.radii.xl} />
        <Skeleton width="100%" height={56} radius={theme.radii.lg} />
      </View>
    </View>
  )
}

const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedStatusBar />
          <RootStack />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const ThemedStatusBar = () => {
  const theme = useTheme()
  return <StatusBar style={theme.isDark ? 'light' : 'dark'} />
}

export default RootLayout

const styles = StyleSheet.create({
  bootContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  bootStack: {
    gap: 16,
  },
})

import { Stack } from 'expo-router'

import { useTheme } from '@/features/theme'

const CardsStackLayout = () => {
  const theme = useTheme()

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
      <Stack.Screen name="benefit/[id]" options={{ title: '' }} />
      <Stack.Screen
        name="log/[benefitId]"
        options={{ presentation: 'modal', title: 'Capture a use' }}
      />
    </Stack>
  )
}

export default CardsStackLayout

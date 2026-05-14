import { Stack } from 'expo-router'

import { useTheme } from '@/features/theme'

const NetWorthStackLayout = () => {
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
      <Stack.Screen name="new" options={{ presentation: 'modal' }} />
      <Stack.Screen name="[id]" options={{ title: '' }} />
      <Stack.Screen name="edit/[id]" options={{ presentation: 'modal', title: 'Edit' }} />
      <Stack.Screen name="log/[id]" options={{ presentation: 'modal', title: 'Log value' }} />
    </Stack>
  )
}

export default NetWorthStackLayout

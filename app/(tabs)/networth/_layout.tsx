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
      <Stack.Screen name="account/[id]" options={{ title: '' }} />
      <Stack.Screen name="account/new" options={{ presentation: 'modal', title: 'Add account' }} />
      <Stack.Screen
        name="balance/[accountId]"
        options={{ presentation: 'modal', title: 'Update balance' }}
      />
    </Stack>
  )
}

export default NetWorthStackLayout

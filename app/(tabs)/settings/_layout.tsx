import { Stack } from 'expo-router'

import { useTheme } from '@/features/theme'

const SettingsStackLayout = () => {
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
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
      <Stack.Screen name="theme" options={{ title: 'Theme' }} />
    </Stack>
  )
}

export default SettingsStackLayout

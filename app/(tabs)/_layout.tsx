import { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { Tabs } from 'expo-router'
import { SymbolView, type SymbolViewProps } from 'expo-symbols'

import { useTheme, type Theme } from '@/features/theme'

type TabIconProps = {
  name: SymbolViewProps['name']
  color: string
  size: number
}

const TabIcon = ({ name, color, size }: TabIconProps) => (
  <SymbolView name={name} size={size} tintColor={color} resizeMode="scaleAspectFit" />
)

const TabsLayout = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.colors.signal.base,
        tabBarInactiveTintColor: theme.colors.label.tertiary,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="networth"
        options={{
          title: 'Net Worth',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="chart.pie.fill" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: 'Cards',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="creditcard.fill" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="gearshape.fill" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  )
}

export default TabsLayout

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: theme.colors.surface.canvas,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.separator,
    },
    tabBarLabel: {
      ...theme.typography.caption,
    },
  })

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useBenefitStore } from '../src/store/useBenefitStore';
import { getOnboarded } from '../src/store/storage';
import { colors } from '../src/constants/theme';

export default function RootLayout() {
  const initialize = useBenefitStore((s) => s.initialize);
  const isLoaded = useBenefitStore((s) => s.isLoaded);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    initialize();
    getOnboarded().then((done) => {
      setNeedsOnboarding(!done);
      setOnboardingChecked(true);
    });
  }, [initialize]);

  useEffect(() => {
    if (!onboardingChecked || !isLoaded) return;
    const inOnboarding = segments[0] === 'onboarding';
    if (needsOnboarding && !inOnboarding) {
      router.replace('/onboarding');
    }
  }, [onboardingChecked, isLoaded, needsOnboarding, segments, router]);

  if (!isLoaded || !onboardingChecked) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.blue,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="benefit/[id]" options={{ title: '' }} />
        <Stack.Screen
          name="log/[benefitId]"
          options={{ presentation: 'modal', title: 'Log a Use' }}
        />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});

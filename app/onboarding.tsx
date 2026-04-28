import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useBenefitStore } from '../src/store/useBenefitStore';
import { colors, radius, spacing } from '../src/constants/theme';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const completeOnboarding = useBenefitStore((s) => s.completeOnboarding);

  const onStart = async () => {
    Haptics.selectionAsync();
    await completeOnboarding();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.lg }]}>
      <View style={styles.content}>
        <Text style={styles.emoji}>💳</Text>
        <Text style={styles.title}>Track every dollar of value</Text>
        <Text style={styles.body}>
          Log each time you use an AMEX Platinum benefit and watch your captured value climb toward
          break-even on the $895 annual fee.
        </Text>
        <Text style={styles.body}>
          Fixed credits, lounge visits, hotel perks — all in one place, resetting every January 1.
        </Text>
      </View>
      <Pressable
        onPress={onStart}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  body: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.blue,
    borderRadius: radius.card,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

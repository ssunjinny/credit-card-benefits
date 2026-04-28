import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBenefitStore } from '../src/store/useBenefitStore';
import { ANNUAL_FEE } from '../src/constants/benefits';
import { colors, radius, shadow, spacing } from '../src/constants/theme';
import { BenefitRow } from '../src/components/BenefitRow';
import { ProgressBar } from '../src/components/ProgressBar';
import {
  countByStatus,
  formatCurrency,
  getBreakEvenRemaining,
  getStatus,
  getTotalCaptured,
} from '../src/utils/calculations';
import { BenefitWithProgress } from '../src/types';

const statusOrder: Record<ReturnType<typeof getStatus>, number> = {
  inProgress: 0,
  unused: 1,
  maxed: 2,
};

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const logs = useBenefitStore((s) => s.logs);
  const getAll = useBenefitStore((s) => s.getAllBenefitsWithProgress);

  const year = new Date().getFullYear();
  const benefits = useMemo(() => {
    const list = getAll();
    return [...list].sort((a, b) => {
      const orderDiff = statusOrder[getStatus(a)] - statusOrder[getStatus(b)];
      if (orderDiff !== 0) return orderDiff;
      return a.name.localeCompare(b.name);
    });
  }, [getAll, logs]);

  const totalCaptured = getTotalCaptured(logs, year);
  const utilization = Math.min(100, (totalCaptured / ANNUAL_FEE) * 100);
  const breakEven = getBreakEvenRemaining(totalCaptured, ANNUAL_FEE);
  const counts = countByStatus(benefits);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.xl },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Benefits</Text>
        <Pressable onPress={() => router.push('/settings')} hitSlop={10}>
          <Text style={styles.settings}>⚙︎</Text>
        </Pressable>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>TOTAL CAPTURED</Text>
        <Text style={styles.heroAmount}>{formatCurrency(totalCaptured)}</Text>
        <Text style={styles.heroSub}>
          of {formatCurrency(ANNUAL_FEE)} annual fee · {Math.round(utilization)}% utilized
        </Text>
        <View style={styles.barWrap}>
          <ProgressBar percentage={utilization} />
        </View>
        <View style={styles.heroFooter}>
          <Text style={styles.breakEven}>
            {breakEven > 0
              ? `${formatCurrency(breakEven)} until break-even`
              : 'Break-even reached 🎉'}
          </Text>
          <Text style={styles.resetNote}>Resets Jan 1</Text>
        </View>
      </View>

      <View style={styles.chips}>
        <StatChip value={counts.maxed} label="Maxed out" color={colors.green} />
        <StatChip value={counts.inProgress} label="In progress" color={colors.orange} />
        <StatChip value={counts.unused} label="Unused" color={colors.gray} />
      </View>

      <Text style={styles.sectionHeader}>BENEFITS</Text>

      {logs.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No uses logged yet</Text>
          <Text style={styles.emptyBody}>
            Tap a benefit below to log your first use and start tracking your value.
          </Text>
        </View>
      ) : null}

      <View style={styles.list}>
        {benefits.map((b: BenefitWithProgress, idx) => (
          <BenefitRow
            key={b.id}
            benefit={b}
            isLast={idx === benefits.length - 1}
            onPress={() => router.push(`/benefit/${b.id}`)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

interface ChipProps {
  value: number;
  label: string;
  color: string;
}

function StatChip({ value, label, color }: ChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={[styles.chipValue, { color }]}>{value}</Text>
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  settings: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.lg,
    ...shadow.card,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
    letterSpacing: 0.5,
  },
  heroAmount: {
    fontSize: 44,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  heroSub: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  barWrap: {
    marginTop: spacing.md,
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  breakEven: {
    fontSize: 13,
    color: colors.green,
    fontWeight: '600',
  },
  resetNote: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  chip: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    ...shadow.card,
  },
  chipValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  chipLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textTertiary,
    letterSpacing: 0.5,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  list: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    overflow: 'hidden',
    ...shadow.card,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emptyBody: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

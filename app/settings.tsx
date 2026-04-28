import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useBenefitStore } from '../src/store/useBenefitStore';
import { ANNUAL_FEE } from '../src/constants/benefits';
import { colors, radius, shadow, spacing } from '../src/constants/theme';
import { formatCurrency } from '../src/utils/calculations';

export default function SettingsScreen() {
  const lastResetYear = useBenefitStore((s) => s.lastResetYear);
  const resetYear = useBenefitStore((s) => s.resetYear);
  const year = new Date().getFullYear();

  const onReset = () => {
    Alert.alert(
      'Reset year?',
      'This clears all benefit logs for the current year. Per-use benefits (like Global Entry) are kept.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetYear(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>YOUR CARD</Text>
        <View style={styles.card}>
          <Row label="Annual fee" value={formatCurrency(ANNUAL_FEE)} />
          <Row label="Current year" value={String(year)} isLast />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>RESET</Text>
        <View style={styles.card}>
          <Row label="Last reset" value={`Jan 1, ${lastResetYear}`} />
          <Pressable onPress={onReset} style={styles.actionRow}>
            <Text style={styles.actionText}>Reset this year now</Text>
          </Pressable>
        </View>
        <Text style={styles.footnote}>
          Logs reset automatically on January 1 each year. Per-use benefits like Global Entry persist
          across years.
        </Text>
      </View>
    </ScrollView>
  );
}

interface RowProps {
  label: string;
  value: string;
  isLast?: boolean;
}

function Row({ label, value, isLast }: RowProps) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  section: { marginBottom: spacing.lg },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textTertiary,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    overflow: 'hidden',
    ...shadow.card,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  rowLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  rowValue: {
    fontSize: 16,
    color: colors.textTertiary,
  },
  actionRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  actionText: {
    fontSize: 16,
    color: colors.red,
  },
  footnote: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: spacing.sm,
    marginHorizontal: spacing.xs,
    lineHeight: 16,
  },
});

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { BenefitWithProgress } from '../types';
import { formatCurrency, getStatus } from '../utils/calculations';
import { StatusBadge } from './StatusBadge';

interface Props {
  benefit: BenefitWithProgress;
  onPress: () => void;
  isLast?: boolean;
}

export function BenefitRow({ benefit, onPress, isLast }: Props) {
  const status = getStatus(benefit);
  const percentage =
    benefit.annualCap && benefit.annualCap > 0
      ? (benefit.currentYearUsed / benefit.annualCap) * 100
      : 0;

  const progressText = benefit.annualCap
    ? `${formatCurrency(benefit.currentYearUsed)} / ${formatCurrency(benefit.annualCap)}`
    : benefit.currentYearUsed > 0
      ? `${formatCurrency(benefit.currentYearUsed)} captured`
      : 'No uses yet';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !isLast && styles.rowBorder,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.icon}>{benefit.icon}</Text>
      <View style={styles.middle}>
        <Text style={styles.name} numberOfLines={1}>
          {benefit.name}
        </Text>
        <Text style={styles.progress} numberOfLines={1}>
          {progressText}
        </Text>
      </View>
      <View style={styles.right}>
        <StatusBadge status={status} percentage={percentage} />
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  pressed: {
    backgroundColor: colors.background,
  },
  icon: {
    fontSize: 26,
    marginRight: spacing.md,
  },
  middle: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  progress: {
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chevron: {
    fontSize: 22,
    color: colors.textTertiary,
    marginLeft: 4,
    lineHeight: 24,
  },
});

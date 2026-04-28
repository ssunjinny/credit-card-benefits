import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../constants/theme';
import { BenefitStatus } from '../utils/calculations';

interface Props {
  status: BenefitStatus;
  percentage?: number;
}

const config: Record<BenefitStatus, { bg: string; fg: string; label: (pct?: number) => string }> = {
  maxed: { bg: colors.greenSoft, fg: colors.green, label: () => 'Maxed' },
  inProgress: {
    bg: colors.orangeSoft,
    fg: colors.orange,
    label: (pct) => (pct != null ? `${Math.round(pct)}%` : 'In progress'),
  },
  unused: { bg: colors.graySoft, fg: colors.gray, label: () => 'Unused' },
};

export function StatusBadge({ status, percentage }: Props) {
  const c = config[status];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.fg }]}>{c.label(percentage)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

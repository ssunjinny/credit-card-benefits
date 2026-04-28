import React, { useMemo } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useBenefitStore } from '../../src/store/useBenefitStore';
import { colors, radius, shadow, spacing } from '../../src/constants/theme';
import { ProgressBar } from '../../src/components/ProgressBar';
import { formatCurrency } from '../../src/utils/calculations';

export default function BenefitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const logs = useBenefitStore((s) => s.logs);
  const getProgress = useBenefitStore((s) => s.getBenefitWithProgress);
  const deleteLog = useBenefitStore((s) => s.deleteLog);

  const benefit = useMemo(() => getProgress(id), [id, logs, getProgress]);

  if (!benefit) {
    return (
      <View style={styles.notFound}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Text style={styles.notFoundText}>Benefit not found.</Text>
      </View>
    );
  }

  const used = benefit.currentYearUsed;
  const cap = benefit.annualCap;
  const percentage = cap && cap > 0 ? Math.min(100, (used / cap) * 100) : used > 0 ? 100 : 0;
  const remaining = cap != null ? Math.max(0, cap - used) : null;
  const sortedLogs = [...benefit.logs].sort((a, b) => b.date.localeCompare(a.date));

  const onDelete = (logId: string) => {
    Alert.alert('Delete log', 'Remove this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          deleteLog(logId);
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      <Stack.Screen options={{ title: '' }} />

      <View style={styles.header}>
        <Text style={styles.icon}>{benefit.icon}</Text>
        <Text style={styles.name}>{benefit.name}</Text>
        <Text style={styles.description}>{benefit.description}</Text>
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.progressLabel}>
          {benefit.resetType === 'per_use' ? 'TOTAL CAPTURED' : 'CAPTURED THIS YEAR'}
        </Text>
        <View style={styles.progressRow}>
          <Text style={styles.progressAmount}>{formatCurrency(used)}</Text>
          {cap != null && (
            <Text style={styles.progressCap}>of {formatCurrency(cap)}</Text>
          )}
        </View>
        {cap != null && (
          <>
            <View style={styles.barWrap}>
              <ProgressBar percentage={percentage} />
            </View>
            <Text style={styles.remainingText}>
              {remaining! > 0
                ? `${formatCurrency(remaining!)} remaining`
                : 'Maxed out 🎉'}
            </Text>
          </>
        )}
      </View>

      <Pressable
        style={({ pressed }) => [styles.logButton, pressed && styles.logButtonPressed]}
        onPress={() => {
          Haptics.selectionAsync();
          router.push(`/log/${benefit.id}`);
        }}
      >
        <Text style={styles.logButtonText}>+ Log a use</Text>
      </Pressable>

      <Text style={styles.sectionHeader}>HISTORY</Text>

      {sortedLogs.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No uses logged yet</Text>
          <Text style={styles.emptyBody}>
            Tap "Log a use" to log your first use of this benefit.
          </Text>
        </View>
      ) : (
        <View style={styles.logList}>
          {sortedLogs.map((log, idx) => (
            <Pressable
              key={log.id}
              onLongPress={() => onDelete(log.id)}
              style={({ pressed }) => [
                styles.logRow,
                idx !== sortedLogs.length - 1 && styles.logRowBorder,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.logLeft}>
                <Text style={styles.logAmount}>{formatCurrency(log.valueAmount)}</Text>
                <Text style={styles.logDate}>{formatDate(log.date)}</Text>
              </View>
              {log.note ? (
                <Text style={styles.logNote} numberOfLines={2}>
                  {log.note}
                </Text>
              ) : null}
              <Pressable
                onPress={() => onDelete(log.id)}
                hitSlop={10}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  notFoundText: {
    color: colors.textSecondary,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  icon: {
    fontSize: 56,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.lg,
    ...shadow.card,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
    letterSpacing: 0.5,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: spacing.xs,
  },
  progressAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  progressCap: {
    fontSize: 16,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
    marginBottom: spacing.sm,
  },
  barWrap: {
    marginTop: spacing.md,
  },
  remainingText: {
    fontSize: 13,
    color: colors.green,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  logButton: {
    backgroundColor: colors.blue,
    borderRadius: radius.card,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  logButtonPressed: {
    opacity: 0.85,
  },
  logButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.lg,
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
  logList: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    overflow: 'hidden',
    ...shadow.card,
  },
  logRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
  },
  logRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  pressed: {
    backgroundColor: colors.background,
  },
  logLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  logAmount: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  logDate: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  logNote: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
  },
  deleteText: {
    fontSize: 13,
    color: colors.red,
  },
});

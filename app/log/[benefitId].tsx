import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useBenefitStore } from '../../src/store/useBenefitStore';
import { getBenefitById } from '../../src/constants/benefits';
import { colors, radius, shadow, spacing } from '../../src/constants/theme';
import { formatCurrency } from '../../src/utils/calculations';
import { BenefitLog } from '../../src/types';

const toIsoDate = (d: Date) => d.toISOString().slice(0, 10);

export default function LogEntryScreen() {
  const { benefitId } = useLocalSearchParams<{ benefitId: string }>();
  const router = useRouter();
  const benefit = getBenefitById(benefitId);
  const addLog = useBenefitStore((s) => s.addLog);
  const getProgress = useBenefitStore((s) => s.getBenefitWithProgress);

  const today = toIsoDate(new Date());
  const yesterday = toIsoDate(new Date(Date.now() - 86400000));
  const [date, setDate] = useState<string>(today);
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const progress = useMemo(
    () => (benefit ? getProgress(benefit.id) : null),
    [benefit, getProgress]
  );

  if (!benefit) {
    return (
      <View style={styles.notFound}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Text>Benefit not found.</Text>
      </View>
    );
  }

  const remaining =
    benefit.annualCap != null && progress
      ? Math.max(0, benefit.annualCap - progress.currentYearUsed)
      : null;

  const amountHint =
    benefit.category === 'fixed' && remaining != null
      ? `Up to ${formatCurrency(remaining)} remaining`
      : 'How much value did you get?';

  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date));

  const onSave = async () => {
    const value = parseFloat(amount);
    if (!isFinite(value) || value <= 0) {
      Alert.alert('Invalid amount', 'Enter a dollar amount greater than zero.');
      return;
    }
    if (!validDate) {
      Alert.alert('Invalid date', 'Use YYYY-MM-DD format.');
      return;
    }
    const log: BenefitLog = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      benefitId: benefit.id,
      date: new Date(date).toISOString(),
      valueAmount: Math.round(value * 100) / 100,
      note: note.trim() ? note.trim() : null,
    };
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await addLog(log);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen
        options={{
          title: 'Log a Use',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={10}>
              <Text style={styles.headerLink}>Cancel</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={onSave} hitSlop={10}>
              <Text style={[styles.headerLink, styles.headerSave]}>Save</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.benefitHeader}>
          <Text style={styles.icon}>{benefit.icon}</Text>
          <Text style={styles.benefitName}>{benefit.name}</Text>
        </View>

        <Text style={styles.sectionLabel}>DATE</Text>
        <View style={styles.dateRow}>
          <DateChip label="Today" active={date === today} onPress={() => setDate(today)} />
          <DateChip
            label="Yesterday"
            active={date === yesterday}
            onPress={() => setDate(yesterday)}
          />
        </View>
        <TextInput
          style={[styles.input, !validDate && styles.inputError]}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.sectionLabel}>AMOUNT</Text>
        <View style={styles.amountRow}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            keyboardType="decimal-pad"
            autoFocus
          />
        </View>
        <Text style={styles.hint}>{amountHint}</Text>

        <Text style={styles.sectionLabel}>NOTE (OPTIONAL)</Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          value={note}
          onChangeText={setNote}
          placeholder="e.g. Delta lounge at JFK"
          multiline
        />

        <Pressable
          onPress={onSave}
          style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function DateChip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.dateChip, active && styles.dateChipActive]}
    >
      <Text style={[styles.dateChipText, active && styles.dateChipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerLink: {
    color: colors.blue,
    fontSize: 16,
    paddingHorizontal: spacing.sm,
  },
  headerSave: {
    fontWeight: '600',
  },
  benefitHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  icon: { fontSize: 44 },
  benefitName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
    letterSpacing: 0.5,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    ...shadow.card,
  },
  inputError: {
    borderColor: colors.red,
    borderWidth: 1,
  },
  noteInput: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  dateRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  dateChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    ...shadow.card,
  },
  dateChipActive: {
    backgroundColor: colors.blue,
  },
  dateChipText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  dateChipTextActive: {
    color: '#fff',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.card,
    paddingHorizontal: spacing.md,
    ...shadow.card,
  },
  dollarSign: {
    fontSize: 28,
    color: colors.textTertiary,
    marginRight: spacing.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '600',
    paddingVertical: spacing.md,
    color: colors.textPrimary,
  },
  hint: {
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  saveButton: {
    backgroundColor: colors.blue,
    borderRadius: radius.card,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  saveButtonPressed: {
    opacity: 0.85,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

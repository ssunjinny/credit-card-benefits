import { useMemo } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'

import { ANNUAL_FEE } from '@/features/benefits'
import { themes, useSetTheme, useTheme, type Theme } from '@/features/theme'
import { formatCurrency } from '@/lib/currency'
import { currentYear } from '@/lib/date'
import { useAppStore } from '@/store/useAppStore'
import { Card, Icon, Pressable, Screen, Text } from '@/ui'

const SettingsScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const { themeKey } = useSetTheme()
  const lastResetYear = useAppStore((s) => s.lastResetYear)
  const resetCurrentYear = useAppStore((s) => s.resetCurrentYear)

  const onReset = () => {
    Alert.alert(
      'Reset this year?',
      'Clears every capture for the current year. Per-use credits stay intact.',
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            resetCurrentYear()
          },
        },
      ],
    )
  }

  return (
    <Screen edges={['bottom']}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <Section label="Card">
          <Card padded={false}>
            <Row label="Annual fee" value={formatCurrency(ANNUAL_FEE)} />
            <Row label="Year" value={String(currentYear())} isLast />
          </Card>
        </Section>

        <Section label="Appearance">
          <Card padded={false}>
            <Pressable onPress={() => router.push('/settings/theme')} scaleOnPress={false}>
              <View style={styles.linkRow}>
                <Text variant="body">Theme</Text>
                <View style={styles.linkRight}>
                  <View style={styles.swatchPair}>
                    <View
                      style={[
                        styles.swatch,
                        { backgroundColor: themes[themeKey].colors.surface.canvas },
                      ]}
                    />
                    <View
                      style={[
                        styles.swatch,
                        styles.swatchOverlap,
                        { backgroundColor: themes[themeKey].colors.signal.base },
                      ]}
                    />
                  </View>
                  <Icon name="chevron.right" size={14} tone="tertiary" />
                </View>
              </View>
            </Pressable>
          </Card>
        </Section>

        <Section label="Reset">
          <Card padded={false}>
            <Row label="Last reset" value={`January 1, ${lastResetYear}`} />
            <Pressable onPress={onReset} scaleOnPress={false}>
              <View style={styles.actionRow}>
                <Text variant="body" style={{ color: theme.colors.danger.base }}>
                  Reset this year now
                </Text>
              </View>
            </Pressable>
          </Card>
          <Text variant="footnote" tone="tertiary" style={styles.footnote}>
            Captures clear automatically every January 1. Per-use credits persist across years.
          </Text>
        </Section>
      </ScrollView>
    </Screen>
  )
}

type SectionProps = {
  label: string
  children: React.ReactNode
}

const Section = ({ label, children }: SectionProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  return (
    <View style={styles.section}>
      <Text variant="sectionHeader" tone="tertiary" style={styles.sectionLabel}>
        {label}
      </Text>
      {children}
    </View>
  )
}

type RowProps = {
  label: string
  value: string
  isLast?: boolean
}

const Row = ({ label, value, isLast }: RowProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  return (
    <View style={[styles.row, !isLast && styles.divider]}>
      <Text variant="body">{label}</Text>
      <Text variant="body" tone="tertiary">
        {value}
      </Text>
    </View>
  )
}

export default SettingsScreen

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl,
      gap: theme.spacing.lg,
    },
    section: {
      gap: theme.spacing.sm,
    },
    sectionLabel: {
      paddingHorizontal: theme.spacing.xs,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.base,
    },
    linkRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.base,
    },
    linkRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    swatchPair: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    swatch: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.borderEmphasis,
    },
    swatchOverlap: {
      marginLeft: -6,
    },
    actionRow: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.base,
    },
    divider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.separator,
    },
    footnote: {
      marginHorizontal: theme.spacing.xs,
      lineHeight: 18,
    },
  })

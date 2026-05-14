import { useMemo } from 'react'
import { Alert, Linking, ScrollView, StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'

import { ANNUAL_FEE } from '@/features/benefits'
import { themes, useSetTheme, useTheme, type Theme } from '@/features/theme'
import { deleteAccount, signOut, useUser } from '@/lib/auth'
import { PRIVACY_POLICY_URL, TERMS_URL } from '@/lib/constants'
import { formatCurrency } from '@/lib/currency'
import { currentYear } from '@/lib/date'
import { Card, Icon, Pressable, Screen, Text } from '@/ui'

const SettingsScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const { themeKey } = useSetTheme()
  const user = useUser()

  const onSignOut = () => {
    Alert.alert('Sign out?', 'You can sign back in with the same email any time.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            await signOut()
          } catch (e) {
            Alert.alert('Could not sign out', e instanceof Error ? e.message : 'Please try again.')
          }
        },
      },
    ])
  }

  const onDeleteAccount = () => {
    Alert.alert(
      'Delete your account?',
      'This permanently erases your benefit captures and net worth entries. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: async () => {
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
              await deleteAccount()
            } catch (e) {
              Alert.alert(
                'Could not delete account',
                e instanceof Error ? e.message : 'Please try again.',
              )
            }
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

        <Section label="Account">
          <Card padded={false}>
            {user?.email ? <Row label="Email" value={user.email} /> : null}
            <Pressable onPress={onSignOut} scaleOnPress={false}>
              <View style={[styles.actionRow, styles.divider]}>
                <Text variant="body" style={{ color: theme.colors.danger.base }}>
                  Sign out
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={onDeleteAccount} scaleOnPress={false}>
              <View style={styles.actionRow}>
                <Text variant="body" style={{ color: theme.colors.danger.base }}>
                  Delete account
                </Text>
              </View>
            </Pressable>
          </Card>
        </Section>

        <Section label="Legal">
          <Card padded={false}>
            <Pressable onPress={() => Linking.openURL(PRIVACY_POLICY_URL)} scaleOnPress={false}>
              <View style={[styles.linkRow, styles.divider]}>
                <Text variant="body">Privacy policy</Text>
                <Icon name="arrow.up.right" size={14} tone="tertiary" />
              </View>
            </Pressable>
            <Pressable onPress={() => Linking.openURL(TERMS_URL)} scaleOnPress={false}>
              <View style={styles.linkRow}>
                <Text variant="body">Terms of service</Text>
                <Icon name="arrow.up.right" size={14} tone="tertiary" />
              </View>
            </Pressable>
          </Card>
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
  })

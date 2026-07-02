import { useMemo, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'

import { signUpWithEmail } from '@/lib/auth'
import { isValidEmail } from '@/lib/email'
import { useTheme, type Theme } from '@/features/theme'
import { Button, Card, Icon, Pressable, Screen, Text } from '@/ui'

const SignUpScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null)

  const canSubmit =
    isValidEmail(email) && password.length >= 8 && confirmPassword.length > 0 && !isSubmitting

  const onSubmit = async () => {
    if (!canSubmit) return
    setError(null)
    if (password !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }
    setIsSubmitting(true)
    try {
      const trimmedEmail = email.trim()
      const { needsEmailConfirmation } = await signUpWithEmail(trimmedEmail, password)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      if (needsEmailConfirmation) {
        setConfirmationEmail(trimmedEmail)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create your account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (confirmationEmail) {
    return (
      <Screen edges={['top', 'bottom']}>
        <View style={styles.successContent}>
          <View style={styles.successIcon}>
            <Icon name="envelope.fill" size={48} tone="signal" />
          </View>
          <Text variant="title1" style={styles.successTitle}>
            Check your email.
          </Text>
          <Text variant="callout" tone="secondary" style={styles.successBody}>
            We sent a confirmation link to{' '}
            <Text variant="callout" tone="primary">
              {confirmationEmail}
            </Text>
            . Open it on this device to finish signing in.
          </Text>
          <Pressable
            onPress={() => router.replace('/auth/sign-in')}
            scaleOnPress={false}
            style={styles.footerLink}
          >
            <Text variant="callout" tone="signal">
              Back to sign in
            </Text>
          </Pressable>
        </View>
      </Screen>
    )
  }

  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text variant="title1">Create an account.</Text>
            <Text variant="callout" tone="secondary" style={styles.subtitle}>
              Your net worth, synced everywhere you sign in.
            </Text>
          </View>

          <Text variant="sectionHeader" tone="tertiary" style={styles.sectionLabel}>
            Email
          </Text>
          <Card padded={false} style={styles.inputCard}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={theme.colors.label.tertiary}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              style={[styles.textInput, { color: theme.colors.label.primary }]}
            />
          </Card>

          <Text variant="sectionHeader" tone="tertiary" style={styles.sectionLabel}>
            Password
          </Text>
          <Card padded={false} style={styles.inputCard}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              placeholderTextColor={theme.colors.label.tertiary}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              style={[styles.textInput, { color: theme.colors.label.primary }]}
            />
          </Card>

          <Text variant="sectionHeader" tone="tertiary" style={styles.sectionLabel}>
            Confirm password
          </Text>
          <Card padded={false} style={styles.inputCard}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter password"
              placeholderTextColor={theme.colors.label.tertiary}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              style={[styles.textInput, { color: theme.colors.label.primary }]}
            />
          </Card>

          {error ? (
            <Text variant="footnote" style={[styles.error, { color: theme.colors.danger.base }]}>
              {error}
            </Text>
          ) : null}

          <Button
            label={isSubmitting ? 'Creating…' : 'Create account'}
            onPress={onSubmit}
            disabled={!canSubmit}
            style={styles.submit}
          />

          <Pressable
            onPress={() => router.replace('/auth/sign-in')}
            scaleOnPress={false}
            style={styles.footerLink}
          >
            <Text variant="callout" tone="signal">
              I already have an account
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

export default SignUpScreen

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    flex: { flex: 1 },
    content: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.xxl,
      paddingBottom: theme.spacing.xxxl,
    },
    header: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xxl,
    },
    subtitle: {
      lineHeight: 22,
    },
    sectionLabel: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
    },
    inputCard: {
      paddingHorizontal: theme.spacing.base,
    },
    textInput: {
      paddingVertical: theme.spacing.base,
      fontSize: 17,
      lineHeight: 22,
      fontFamily: 'Satoshi-Regular',
    },
    error: {
      marginTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.xs,
    },
    submit: {
      marginTop: theme.spacing.xl,
    },
    footerLink: {
      marginTop: theme.spacing.lg,
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    successContent: {
      flex: 1,
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.huge,
      gap: theme.spacing.lg,
    },
    successIcon: {
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    successTitle: {
      textAlign: 'center',
    },
    successBody: {
      textAlign: 'center',
      lineHeight: 22,
    },
  })

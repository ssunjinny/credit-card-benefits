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

import { signInWithEmail } from '@/lib/auth'
import { isValidEmail } from '@/lib/email'
import { useTheme, type Theme } from '@/features/theme'
import { Button, Card, Pressable, Screen, Text } from '@/ui'

const SignInScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = isValidEmail(email) && password.length >= 8 && !isSubmitting

  const onSubmit = async () => {
    if (!canSubmit) return
    setError(null)
    setIsSubmitting(true)
    try {
      await signInWithEmail(email.trim(), password)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Email or password is incorrect.')
    } finally {
      setIsSubmitting(false)
    }
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
            <Text variant="title1">Welcome back.</Text>
            <Text variant="callout" tone="secondary" style={styles.subtitle}>
              Sign in to see your assets and liabilities.
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
              textContentType="password"
              style={[styles.textInput, { color: theme.colors.label.primary }]}
            />
          </Card>

          {error ? (
            <Text variant="footnote" style={[styles.error, { color: theme.colors.danger.base }]}>
              {error}
            </Text>
          ) : null}

          <Button
            label={isSubmitting ? 'Signing in…' : 'Sign in'}
            onPress={onSubmit}
            disabled={!canSubmit}
            style={styles.submit}
          />

          <Pressable
            onPress={() => router.replace('/auth/sign-up')}
            scaleOnPress={false}
            style={styles.footerLink}
          >
            <Text variant="callout" tone="signal">
              Create an account
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

export default SignInScreen

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
  })

import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'

import { supabase } from '@/lib/supabase'
import { useTheme, type Theme } from '@/features/theme'
import { Screen, Text } from '@/ui'

const CallbackScreen = () => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const router = useRouter()
  const url = Linking.useURL()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!url) return
    const consume = async () => {
      try {
        const hashIdx = url.indexOf('#')
        const queryIdx = url.indexOf('?')
        const queryEnd = hashIdx === -1 ? url.length : hashIdx
        const queryString =
          queryIdx !== -1 && queryIdx < queryEnd ? url.slice(queryIdx + 1, queryEnd) : ''
        const fragment = hashIdx !== -1 ? url.slice(hashIdx + 1) : ''
        const queryParams = new URLSearchParams(queryString)
        const fragmentParams = new URLSearchParams(fragment)

        const code = queryParams.get('code')
        const accessToken = fragmentParams.get('access_token')
        const refreshToken = fragmentParams.get('refresh_token')

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) throw exchangeError
        } else if (accessToken && refreshToken) {
          const { error: setError_ } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (setError_) throw setError_
        } else {
          throw new Error('Confirmation link is invalid or expired.')
        }
        router.replace('/')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not complete sign-in.')
      }
    }
    consume()
  }, [url, router])

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.container}>
        {error ? (
          <Text variant="callout" tone="secondary" style={styles.text}>
            {error}
          </Text>
        ) : (
          <>
            <ActivityIndicator color={theme.colors.signal.base} />
            <Text variant="callout" tone="secondary" style={styles.text}>
              Confirming your account…
            </Text>
          </>
        )}
      </View>
    </Screen>
  )
}

export default CallbackScreen

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xl,
    },
    text: {
      textAlign: 'center',
    },
  })

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'

import { supabase } from './supabase'
import { AUTH_REDIRECT_URL } from './constants'

type AuthContextValue = {
  session: Session | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      const { data } = await supabase.auth.getSession()
      if (cancelled) return
      setSession(data.session)
      setIsLoading(false)
    }
    init()

    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })

    return () => {
      cancelled = true
      data.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({ session, isLoading }), [session, isLoading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export const useSession = () => useAuth().session
export const useIsAuthLoading = () => useAuth().isLoading
export const useUser = () => useAuth().session?.user ?? null
export const useIsAuthenticated = () => useAuth().session !== null

const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_MS = 60_000
const ATTEMPT_WINDOW_MS = 5 * 60_000

type AttemptState = { failures: number; firstFailureAt: number; lockedUntil: number }
const attempts = new Map<string, AttemptState>()

export class RateLimitedError extends Error {
  readonly secondsRemaining: number
  constructor(secondsRemaining: number) {
    super(`Too many attempts. Try again in ${secondsRemaining}s.`)
    this.name = 'RateLimitedError'
    this.secondsRemaining = secondsRemaining
  }
}

const checkRateLimit = (key: string) => {
  const state = attempts.get(key)
  if (!state) return
  const now = Date.now()
  if (state.lockedUntil > now) {
    throw new RateLimitedError(Math.ceil((state.lockedUntil - now) / 1000))
  }
  if (state.firstFailureAt && now - state.firstFailureAt > ATTEMPT_WINDOW_MS) {
    attempts.delete(key)
  }
}

const recordFailure = (key: string) => {
  const now = Date.now()
  const current = attempts.get(key) ?? { failures: 0, firstFailureAt: now, lockedUntil: 0 }
  const next: AttemptState = {
    failures: current.failures + 1,
    firstFailureAt: current.firstFailureAt || now,
    lockedUntil: 0,
  }
  if (next.failures >= MAX_FAILED_ATTEMPTS) {
    next.lockedUntil = now + LOCKOUT_MS
    next.failures = 0
    next.firstFailureAt = 0
  }
  attempts.set(key, next)
}

const recordSuccess = (key: string) => {
  attempts.delete(key)
}

const friendlySignInError = (e: unknown) => {
  if (e instanceof RateLimitedError) return e.message
  const message = e instanceof Error ? e.message.toLowerCase() : ''
  if (message.includes('email not confirmed')) return 'Please confirm your email first.'
  if (message.includes('rate') || message.includes('too many'))
    return 'Too many attempts. Try again later.'
  return 'Email or password is incorrect.'
}

const friendlySignUpError = (e: unknown) => {
  const message = e instanceof Error ? e.message.toLowerCase() : ''
  if (message.includes('rate') || message.includes('too many'))
    return 'Too many attempts. Try again later.'
  if (message.includes('password')) return 'Password must be at least 8 characters.'
  return 'Could not create your account. Please try again.'
}

export const signInWithEmail = async (email: string, password: string) => {
  const key = email.toLowerCase()
  checkRateLimit(key)
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    recordFailure(key)
    throw new Error(friendlySignInError(error))
  }
  recordSuccess(key)
}

export type SignUpResult = {
  needsEmailConfirmation: boolean
}

export const signUpWithEmail = async (email: string, password: string): Promise<SignUpResult> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: AUTH_REDIRECT_URL },
  })
  if (error) throw new Error(friendlySignUpError(error))
  return { needsEmailConfirmation: data.session === null }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const deleteAccount = async () => {
  const { data, error } = await supabase.functions.invoke('delete-account')
  if (error) throw new Error('Could not delete your account. Please try again.')
  if (data && typeof data === 'object' && 'error' in data) {
    throw new Error('Could not delete your account. Please try again.')
  }
  await supabase.auth.signOut()
}

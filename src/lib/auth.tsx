import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'

import { supabase } from './supabase'

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

export const signInWithEmail = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export const signUpWithEmail = async (email: string, password: string) => {
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

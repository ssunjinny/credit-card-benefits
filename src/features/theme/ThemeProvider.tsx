import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import { storage } from '@/lib/storage'

import { themes } from './themes'
import type { Theme, ThemeKey } from './tokens'

type ThemeContextValue = {
  theme: Theme
  themeKey: ThemeKey
  setTheme: (key: ThemeKey) => void
  isReady: boolean
}

const STORAGE_KEY = 'amex_tracker_theme'
const DEFAULT_KEY: ThemeKey = 'cream'

const ThemeContext = createContext<ThemeContextValue | null>(null)

const isThemeKey = (value: string | null): value is ThemeKey =>
  value === 'cream' || value === 'midnight' || value === 'onyx' || value === 'platinum'

type ThemeProviderProps = {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [themeKey, setThemeKey] = useState<ThemeKey>(DEFAULT_KEY)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    storage.getItem(STORAGE_KEY).then((stored) => {
      if (isThemeKey(stored)) {
        setThemeKey(stored)
      }
      setIsReady(true)
    })
  }, [])

  const setTheme = (key: ThemeKey) => {
    setThemeKey(key)
    storage.setItem(STORAGE_KEY, key)
  }

  return (
    <ThemeContext.Provider
      value={{ theme: themes[themeKey], themeKey, setTheme, isReady }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): Theme => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx.theme
}

export const useSetTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useSetTheme must be used inside ThemeProvider')
  return { themeKey: ctx.themeKey, setTheme: ctx.setTheme }
}

export const useThemeReady = (): boolean => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemeReady must be used inside ThemeProvider')
  return ctx.isReady
}

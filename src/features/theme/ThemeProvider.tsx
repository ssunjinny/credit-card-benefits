import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

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
const DEFAULT_KEY: ThemeKey = 'light'

const ThemeContext = createContext<ThemeContextValue | null>(null)

const isThemeKey = (value: string | null): value is ThemeKey =>
  value === 'light' || value === 'dark'

type ThemeProviderProps = {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [themeKey, setThemeKey] = useState<ThemeKey>(DEFAULT_KEY)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const loadStoredTheme = async () => {
      const stored = await storage.getItem(STORAGE_KEY)
      if (isThemeKey(stored)) {
        setThemeKey(stored)
      }
      setIsReady(true)
    }
    loadStoredTheme()
  }, [])

  const setTheme = useCallback((key: ThemeKey) => {
    setThemeKey(key)
    storage.setItem(STORAGE_KEY, key)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: themes[themeKey], themeKey, setTheme, isReady }),
    [themeKey, setTheme, isReady],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
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

import type { Theme, ThemeKey } from '../tokens'
import { dark } from './dark'
import { light } from './light'

export const themes: Record<ThemeKey, Theme> = { light, dark }

export const themeList: Theme[] = [light, dark]

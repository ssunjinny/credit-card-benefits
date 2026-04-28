import type { Theme, ThemeKey } from '../tokens'
import { cream } from './cream'
import { midnight } from './midnight'
import { onyx } from './onyx'
import { platinum } from './platinum'

export const themes: Record<ThemeKey, Theme> = {
  cream,
  midnight,
  onyx,
  platinum,
}

export const themeList: Theme[] = [cream, midnight, onyx, platinum]

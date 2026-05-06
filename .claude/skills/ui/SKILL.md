---
name: ui
description: Use this skill any time you're writing or modifying UI for the AMEX Platinum benefits tracker React Native app...
---

# React Native iOS UI Skill — AMEX Tracker

Use this skill any time you're writing or modifying UI for the AMEX Platinum benefits tracker app. This skill ensures the app feels like an extension of a luxury credit card — restrained, tactile, slightly precious — and supports a multi-theme system so the user can choose the mood that fits them.

---

## Design intent

This is not a budgeting app. It is a personal companion to a luxury credit card. The visual language draws from physical card design: brushed metal, embossed letterforms, deep matte finishes, thick cotton card stock. Open the app and it should feel the way pulling the card out of your wallet feels.

**References:**

- Visual restraint: **Ramp** — one signal color, editorial whitespace, numbers as heroes
- Friendly minimalism + soft motion: **Waymo** — rounded geometry, calm pacing, conversational status
- Material spirit: AMEX Platinum / Centurion card itself — matte metals, embossed accents, no shine

**Emotional target:** the satisfaction of opening an envelope addressed to you. Quiet, certain, slightly indulgent.

---

## Theme system

The app supports **two themes** the user can pick from in Settings: **Light** (default) and **Dark**. Each theme is a complete, swappable token set. Components are theme-agnostic — they consume tokens via the `useTheme()` hook, never import colors directly.

### Themes

1. **Light** _(default)_ — near-white canvas (`#FAFAFA`), warm gold accent. Daylight feel.
2. **Dark** — near-black canvas (`#0A0A0A`), lifted-tone surfaces, lighter champagne accent.

Both share the same warm gold/champagne accent family — `#8B6F3D` in light mode, `#C9A86A` in dark mode.

### Architecture

```
src/features/theme/
├── tokens.ts              # TypeScript type — the contract every theme must satisfy
├── themes/
│   ├── light.ts           # Light theme
│   └── dark.ts            # Dark theme
├── ThemeProvider.tsx      # React context, persistence, hooks
└── index.ts               # public exports
```

### Hard rule: components never import colors directly

```typescript
// WRONG
import { colors } from '../theme/themes/light'
backgroundColor: colors.surface.canvas

// RIGHT
const { colors } = useTheme()
backgroundColor: colors.surface.canvas
```

Same applies to `typography`, `spacing`, `radii`, `shadows`. All flow through `useTheme()`.

### Theme persistence

- User's selected theme key is stored in AsyncStorage under `amex_tracker_theme`.
- Theme loads synchronously on app boot before any UI renders. Use `expo-splash-screen` to prevent flash-of-wrong-theme.
- Default if no stored theme: `light`.
- Settings screen has a theme picker with two preview tiles, each rendered with its canvas + accent swatches (no theme name labels).

---

## Token contract (`src/theme/tokens.ts`)

Every theme exports an object matching this shape. New themes just satisfy this contract.

```typescript
export type Theme = {
  key: 'light' | 'dark'
  name: string
  isDark: boolean

  colors: {
    surface: {
      canvas: string
      card: string
      cardElevated: string
      inset: string
      deep: string
    }
    label: {
      primary: string
      secondary: string
      tertiary: string
      quaternary: string
      onDark: string
    }
    signal: {
      base: string
      soft: string
      onSoft: string
    }
    warning: { base: string; soft: string }
    danger: { base: string; soft: string }
    separator: string
    border: string
    borderEmphasis: string
  }

  typography: TypographyScale
  spacing: SpacingScale
  radii: RadiiScale
  shadows: ShadowScale
  motion: MotionScale
}
```

---

## Theme: Light (`themes/light.ts`) — default

```typescript
{
  key: 'light',
  name: 'Light',
  isDark: false,
  colors: {
    surface: {
      canvas:       '#FAFAFA',
      card:         '#FFFFFF',
      cardElevated: '#FFFFFF',
      inset:        '#F1F1F1',
      deep:         '#0A0A0A',
    },
    label: {
      primary:    '#0A0A0A',
      secondary:  'rgba(10,10,10,0.62)',
      tertiary:   'rgba(10,10,10,0.42)',
      quaternary: 'rgba(10,10,10,0.22)',
      onDark:     '#FAFAFA',
    },
    signal: {
      base:   '#8B6F3D',
      soft:   '#E8DCC2',
      onSoft: '#5C4827',
    },
    warning: { base: '#A05A1F', soft: '#F0E2CE' },
    danger:  { base: '#8C2828', soft: '#EDD9D5' },
    separator: 'rgba(10,10,10,0.08)',
    border:    'rgba(10,10,10,0.10)',
    borderEmphasis: 'rgba(10,10,10,0.18)',
  },
  shadows: shadowsLight,
}
```

---

## Theme: Dark (`themes/dark.ts`)

```typescript
{
  key: 'dark',
  name: 'Dark',
  isDark: true,
  colors: {
    surface: {
      canvas:       '#0A0A0A',
      card:         '#1A1A1A',
      cardElevated: '#222222',
      inset:        '#141414',
      deep:         '#050505',
    },
    label: {
      primary:    '#FAFAFA',
      secondary:  'rgba(250,250,250,0.62)',
      tertiary:   'rgba(250,250,250,0.42)',
      quaternary: 'rgba(250,250,250,0.22)',
      onDark:     '#FAFAFA',
    },
    signal: {
      base:   '#C9A86A',
      soft:   'rgba(201,168,106,0.15)',
      onSoft: '#C9A86A',
    },
    warning: { base: '#D49659', soft: 'rgba(212,150,89,0.15)' },
    danger:  { base: '#C26E6E', soft: 'rgba(194,110,110,0.15)' },
    separator: 'rgba(250,250,250,0.08)',
    border:    'rgba(250,250,250,0.10)',
    borderEmphasis: 'rgba(250,250,250,0.18)',
  },
  shadows: shadowsNone,
}
```

---

## Color usage rules — apply to ALL themes

1. **The signal color is sacred.** It appears ONLY in:
   - The progress bar fill on the hero card
   - Hero-level dollar amounts representing captured value
   - The "Maxed" status badge on benefit rows
   - The primary CTA button background
   - The milestone moment ("$298 to break even" → "Break even reached")

   That's it. Five places, max. If you reach for a sixth, use a label color instead.

2. **Status colors (warning, danger) are extremely rare.** Maybe one per screen. Muted brick or amber, never vibrant. If you reach for them, ask whether a label would do.

3. **Borders whisper.** Always at the `border` token (~10% opacity). Hairline weight via `StyleSheet.hairlineWidth`. Never `borderWidth: 1`.

4. **Backgrounds use near-pure values, not literal pure.** Light canvas is `#FAFAFA`, dark canvas is `#0A0A0A`. Pure `#FFFFFF` is reserved for elevated surfaces (`surface.card` / `cardElevated`) in light mode only — never as the primary canvas. Pure `#000000` is never used.

5. **Dark theme lifts surfaces with tone, not shadow.** Light theme uses subtle shadows. Dark theme has `shadows.none` everywhere — depth comes from the `card` → `cardElevated` tone shift (`#1A1A1A` → `#222222`).

---

## Typography — shared across themes

```typescript
export const typography = {
  hero: {
    fontSize: 56,
    lineHeight: 60,
    fontWeight: '600',
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'],
  },
  display: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '600',
    letterSpacing: -0.8,
    fontVariant: ['tabular-nums'],
  },
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: '600' },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 17, lineHeight: 24, fontWeight: '400' },
  callout: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  subheadline: { fontSize: 15, lineHeight: 20, fontWeight: '400' },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  listValue: { fontSize: 17, fontWeight: '500', fontVariant: ['tabular-nums'] },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
}
```

**Font:** System font (San Francisco). Don't import custom fonts in v1. If/when you do, **Inter** or **Inter Tight** is the safe free choice; **Söhne** if you want to splurge.

**Rules:**

- Numbers in hero/display/list ALWAYS use `fontVariant: ['tabular-nums']`.
- Body copy 17pt minimum. Never below 13pt for meaningful text.
- Hero number gets tight letter-spacing (`-1.5`) — financial publication typography.

---

## Spacing — shared

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 72,
}
```

- Default screen padding: `lg` (20pt) horizontal
- Card internal padding: `xl` (24pt) minimum
- Between major sections: `xxl` or `xxxl`
- Above primary CTA: `xxl` minimum

---

## Radii — shared

```typescript
export const radii = { sm: 8, md: 14, lg: 20, xl: 28, pill: 999 }
```

- Cards / grouped lists: `lg`
- Hero card: `xl`
- Buttons: `md`
- Bottom sheet top corners: `xl`

---

## Shadows — vary by theme

```typescript
export const shadowsLight = {
  none: {},
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  elevated: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  floating: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
}

export const shadowsNone = { none: {}, card: {}, elevated: {}, floating: {} }
```

---

## Motion — shared

```typescript
export const motion = {
  spring: { damping: 18, stiffness: 200, mass: 1 },
  springSoft: { damping: 22, stiffness: 140, mass: 1 },
  springSnappy: { damping: 15, stiffness: 350, mass: 0.8 },
  timing: { duration: 280 },
  timingFast: { duration: 180 },
}
```

- Reanimated 3 + Moti only. NEVER the legacy `Animated` API.
- Springs for transforms; timing for fades only.
- Hero number counts up on change (Moti `from`/`animate` with timing).
- Progress bars fill with `springSoft`.
- Button press: scale 0.97 with `springSnappy`.
- List add/remove: Reanimated `LinearTransition` + `FadeIn`/`FadeOut`.
- Milestones (break even, benefit maxed): single one-shot pulse on state change. Never continuously animate.

---

## Mandatory before writing any UI code

1. Confirm `src/theme/` is fully set up: `tokens.ts`, all four theme files, `ThemeProvider.tsx`, `index.ts`. If not, build that infrastructure FIRST.

2. Confirm dependencies installed:
   - `react-native-reanimated`
   - `moti`
   - `react-native-gesture-handler`
   - `react-native-safe-area-context`
   - `@gorhom/bottom-sheet`
   - `expo-haptics`
   - `expo-symbols`
   - `expo-blur`
   - `react-native-svg`
   - `@react-native-async-storage/async-storage`

3. Wrap root layout in `<ThemeProvider>`. The provider:
   - Reads stored theme key from AsyncStorage on mount
   - Falls back to `cream` if none stored
   - Holds theme in context
   - Exposes `useTheme()` and `useSetTheme()` hooks
   - Persists changes to AsyncStorage on every set

4. State the screen's design intent in a top comment:
   ```
   // Screen: Home Dashboard
   // Hero: total captured (the number is the design)
   // Emotional target: "you're winning, calmly"
   // Reference: Ramp homepage card + Waymo trip status
   ```

---

## Hard rules — never violate

- NEVER import from a specific theme file in a component. Always `useTheme()`.
- NEVER use emoji as primary icons. Use SF Symbols via `expo-symbols`.
- NEVER use raw hex values, spacing numbers, font sizes, or radii in components.
- NEVER use the built-in `Animated` API.
- NEVER use `borderWidth: 1`. Use `StyleSheet.hairlineWidth`.
- NEVER use `Touchable*`. Use `Pressable` with explicit press states.
- NEVER use a spinner where a skeleton matches the layout better.
- NEVER use a full-screen modal where a bottom sheet feels more grounded.
- NEVER omit empty / loading / error states.
- NEVER write generic copy. "Add log" → "Capture a use." "67% utilized" → "$298 to break even."
- NEVER use pure white surfaces or pure black backgrounds across any theme.
- ALWAYS add haptics on meaningful actions (save, delete, milestone, error).
- ALWAYS format currency with `Intl.NumberFormat`.
- ALWAYS use `fontVariant: ['tabular-nums']` for numerics in lists/dashboards.
- ALWAYS wrap screens in `SafeAreaView` from `react-native-safe-area-context`.
- ALWAYS use Expo Router native stack with `headerLargeTitle: true` for primary screens.
- ALWAYS verify a new screen renders correctly in ALL FOUR themes before considering it done.

---

## Component patterns

### Hero card (home dashboard)

- Surface: `colors.surface.cardElevated`
- Padding: `spacing.xl` all, `spacing.xxl` top
- Radius: `radii.xl`
- Shadow: `shadows.elevated`
- Layout: caption label → hero number → progress bar (fill = `colors.signal.base`) → status sentence in `colors.signal.base`

### List rows

- Min height: 56pt
- Padding: `spacing.base` vertical, `spacing.lg` horizontal
- Separator: `StyleSheet.hairlineWidth` of `colors.separator`, inset to align with content
- Right-side numerics: `typography.listValue`, right-aligned, tabular
- Press feedback: bg shifts to `colors.surface.inset` via `springSnappy`

### Buttons (primary)

- Height: 52pt
- Background: `colors.signal.base`
- Text color: theme-aware. On cream theme: `colors.surface.card` (cream-on-brass reads). On dark themes: `colors.surface.canvas` (canvas color on accent stays readable).
- Radius: `radii.md`
- Press: scale 0.97 + opacity 0.92 via `springSnappy`
- Haptic: `Haptics.impactAsync(Medium)` on press

### Bottom sheets

- `@gorhom/bottom-sheet`, never `Modal`
- Snap points: ~50% short forms, ~85% long forms
- Drag indicator: `colors.label.tertiary`
- Background: `colors.surface.canvas`
- Top corners: `radii.xl`

### Empty states

- SF Symbol at 48pt in `colors.label.tertiary`
- One line of `typography.headline` in `colors.label.secondary`
- Optional second line of `typography.callout` in `colors.label.tertiary`
- No primary CTA — text-style if any action

### Skeletons

- Moti's `Skeleton` matched to layout
- Background: `colors.surface.inset`
- Subtle 1.4s shimmer

### Theme picker (settings)

- 2x2 grid of preview cards
- Each card: theme name, mini hero number ("$597"), mini progress bar in that theme's signal color
- Selected: `borderEmphasis` border + `signal.base` checkmark
- Tap to apply with `Haptics.notificationAsync(Success)` + animated transition

---

## Copy guidelines

The app talks like a calm financial advisor with a sense of humor — never a startup growth team, never a bank.

- "Capture" instead of "log" for benefit uses
- "On track" / "Ahead of pace" / "Break even reached" for status
- "$298 to break even" not "67% utilized" for the hero
- Number-led: "$597 captured this year" not "You've captured $597"
- Section headers: "Captured", "In progress", "Untouched" — not "Maxed Out", "Partial Use", "Unused"
- Empty state: warm and forward-looking — "Your first capture goes here. Start with the easy ones." not "No data."

---

## Required deliverables for every new screen

1. The screen component (uses `useTheme()`)
2. Empty state component
3. Loading skeleton component (matches layout, not a spinner)
4. Press states defined for every interactive element
5. Haptics on every state-mutating action
6. Animations on user-caused state changes
7. Top-comment stating emotional target and reference
8. Verified to render correctly in all four themes

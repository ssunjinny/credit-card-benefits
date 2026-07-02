# networthmaxxing — Project Context

A self-contained brief for Claude (or a teammate) who has zero prior context on this project. Drop this file into the Claude project's "Project knowledge" so every conversation starts with the full picture.

---

## 1. What this app is

**networthmaxxing** is a personal finance mobile app for me, Kevin (kevin@beacons.ai). It's a React Native / Expo app for tracking **net worth**: all my assets and liabilities in one place, with history over time.

Two top-level tabs:

- **Net Worth** — add assets and liabilities, log new values over time, and see net worth at a glance.
- **Settings** — appearance (theme) and account.

Future scope (not yet built): **Budgets** as a third area.

The repo directory is still named `credit-card-benefits` for now (legacy — the project began as an AMEX Platinum benefits tracker, then pivoted to net worth and the benefits feature was removed). The npm package and Expo app name is `networthmaxxing`.

### Goals (in my own words)

- Justify my spending without feeling bad — by seeing net worth growth as the offsetting positive.
- Visualize my net worth over time.
- Keep my finances well organized in one place.
- Lay groundwork for budgets later without rework.

### Audience

**Just me.** This is a personal app. iOS-only by intent.

---

## 2. Tech stack

- **Expo SDK 54**, **expo-router 6** (file-based routing, native stack)
- **React 19**, **React Native 0.81** (Hermes runtime — `Array.prototype.toSorted` etc. available)
- **TypeScript 5.9** (strict mode)
- **Zustand 5** for global state
- **Supabase** (`@supabase/supabase-js`) for auth (email/password) and data — online-only, RLS on every table
- **AsyncStorage** for local persistence (wrapped in `src/lib/storage.ts`) — onboarding flag, theme key, Supabase auth session
- **react-native-reanimated 4** + **moti** for motion (no legacy `Animated` API)
- **@gorhom/bottom-sheet** for sheets (no `Modal`)
- **expo-symbols** for icons (SF Symbols, iOS-only)
- **expo-haptics** for feedback
- **react-native-svg** for any custom drawing
- **uuid v4** + **react-native-get-random-values** polyfill for IDs

### Toolchain

- **oxlint** for linting (`.oxlintrc.json`)
- **oxfmt** for formatting (`.oxfmtrc.json`) — single quotes, no semi, printWidth 100, trailing commas all
- **tsc --noEmit** for typechecking
- **husky + lint-staged** pre-commit hook runs `oxlint --fix` + `oxfmt` on staged files, then full `tsc --noEmit`
- **Never bypass the pre-commit hook** (`--no-verify`); fix the underlying issue.

### Scripts

| Command                           | Purpose               |
| --------------------------------- | --------------------- |
| `npm start`                       | Expo dev server       |
| `npm run ios` / `android` / `web` | Platform-specific dev |
| `npm run lint`                    | oxlint                |
| `npm run lint:fix`                | oxlint --fix          |
| `npm run fmt`                     | oxfmt apply           |
| `npm run fmt:check`               | oxfmt verify          |
| `npm run typecheck`               | tsc --noEmit          |

### Install hygiene

**`npm install` requires `--legacy-peer-deps` in this repo.** RN 0.81 + React 19 + expo-router create a peer-dep conflict that newer npm refuses. Always pass the flag:

```
npm install <pkg> --legacy-peer-deps
```

---

## 3. Project structure

```
credit-card-benefits/
├── app/                          # expo-router screens (file-based routing)
│   ├── _layout.tsx               # root: fonts, ThemeProvider, AuthProvider, boot/auth gate
│   ├── index.tsx                 # redirects to /networth
│   ├── onboarding.tsx
│   ├── auth/
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── callback.tsx          # email/OAuth deep-link callback
│   └── (tabs)/
│       ├── _layout.tsx           # bottom Tabs: Net Worth + Settings
│       ├── networth/
│       │   ├── _layout.tsx
│       │   ├── index.tsx         # Net Worth dashboard (hero + assets/liabilities lists)
│       │   ├── new.tsx           # add asset/liability (modal)
│       │   ├── [id].tsx          # item detail + snapshot history
│       │   ├── edit/[id].tsx     # edit item (modal)
│       │   └── log/[id].tsx      # log a new value snapshot (modal)
│       └── settings/
│           ├── index.tsx
│           └── theme.tsx         # theme picker
│
├── src/
│   ├── features/                 # domain code
│   │   ├── networth/             # items (assets/liabilities) + value snapshots
│   │   │   ├── components/       # NetWorthHeroCard, NetWorthRow, NetWorthEmpty,
│   │   │   │                     #   NetWorthSkeleton, CategorySelect, SnapshotList
│   │   │   ├── hooks/            # useItems, useNetWorth
│   │   │   ├── types.ts
│   │   │   ├── constants.ts      # ITEM_CATEGORIES + findCategory / categoriesForKind
│   │   │   ├── utils.ts
│   │   │   └── index.ts
│   │   └── theme/                # theme system
│   │       ├── tokens.ts
│   │       ├── themes/
│   │       │   ├── light.ts
│   │       │   ├── dark.ts
│   │       │   └── index.ts
│   │       ├── ThemeProvider.tsx
│   │       └── index.ts
│   │
│   ├── ui/                       # generic design-system primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Icon.tsx
│   │   ├── Pressable.tsx
│   │   ├── Screen.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Text.tsx
│   │   └── index.ts
│   │
│   ├── lib/                      # pure utilities + shared clients
│   │   ├── auth.tsx              # AuthProvider, useUser, signOut, deleteAccount
│   │   ├── supabase.ts           # Supabase client
│   │   ├── constants.ts          # public URLs, deep-link redirect
│   │   ├── currency.ts           # Intl.NumberFormat helpers
│   │   ├── date.ts               # today, isoDateOnly, relativeDayLabel, daysBetween
│   │   ├── email.ts
│   │   ├── id.ts                 # generateId() = uuid v4
│   │   └── storage.ts
│   │
│   └── store/
│       └── useAppStore.ts        # Zustand store (items + snapshots + onboarding)
│
├── supabase/
│   ├── migrations/               # net_worth_items, net_worth_snapshots, RLS, triggers
│   └── functions/delete-account/ # edge fn: admin-deletes the auth user (cascades data)
│
├── assets/                       # fonts, images
├── .oxlintrc.json
├── .oxfmtrc.json
├── .husky/pre-commit
└── package.json                  # name: "networthmaxxing"
```

### Folder placement rules

- Used by **one feature** → lives inside that feature's folder.
- Used by **multiple features and is generic UI** → `src/ui/`.
- Pure function with **no React** → `src/lib/`.
- Truly app-wide state → `src/store/`.
- **Never** create a top-level `components/`, `types/`, or `utils/` directory.

---

## 4. Design system

### Visual intent

**Premium, lightly tech.** References: Waymo, Ramp, Linear, Vercel, Mercury, Polymarket, Cron. Calm. Restrained. Numbers as heroes. **Avoid**: serif/editorial display fonts (e.g. Instrument Serif), pure white, pure black, vibrant status colors.

### Themes — Light + Dark only

The app has **two themes** — Light (default) and Dark — selected manually in Settings. No "system follow" option. (A previous four-bespoke-theme system was retired; do not reintroduce it.)

#### Light theme

```ts
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
      base:   '#8B6F3D',  // warm gold/champagne
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

#### Dark theme

```ts
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
      base:   '#C9A86A',  // lighter champagne for contrast on dark
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

### Background purity rule

Backgrounds use **near-pure**, never literal pure. Light canvas `#FAFAFA`, dark canvas `#0A0A0A`. Pure `#FFFFFF` is allowed only on `surface.card` / `cardElevated` in light mode (for elevation contrast). Pure `#000000` is never used.

### Signal color is sacred

The signal/accent appears in **at most five places**. For this app that means:

1. The hero net-worth number on the dashboard
2. The primary CTA button background (e.g. "Add asset", "Log new value")
3. The selected state in the category picker / theme picker (checkmark)
4. A single positive emphasis moment (e.g. net worth up since last snapshot)
5. One reserved slot

If you reach for a sixth, use a label color instead. Liabilities are **not** rendered in a vibrant danger color by default — use label colors; reserve `danger` for destructive actions (delete).

### Typography (shared across themes)

Two font families:

- **Satoshi** — body and headings. Loaded locally from `assets/fonts/`.
- **Geist Mono** — numeric / hero values. Loaded via `@expo-google-fonts/geist-mono`.

```ts
typography = {
  hero: {
    fontFamily: monoSemiBold,
    fontSize: 56,
    lineHeight: 60,
    letterSpacing: -1.8,
    fontVariant: ['tabular-nums'],
  },
  display: {
    fontFamily: monoSemiBold,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.8,
    fontVariant: ['tabular-nums'],
  },
  largeTitle: { fontFamily: satoshiBold, fontSize: 34, lineHeight: 41, letterSpacing: -0.5 },
  title1: { fontFamily: satoshiBold, fontSize: 28, lineHeight: 34, letterSpacing: -0.3 },
  title2: { fontFamily: satoshiMedium, fontSize: 22, lineHeight: 28 },
  title3: { fontFamily: satoshiMedium, fontSize: 20, lineHeight: 25 },
  headline: { fontFamily: satoshiMedium, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: satoshiRegular, fontSize: 17, lineHeight: 24 },
  callout: { fontFamily: satoshiRegular, fontSize: 16, lineHeight: 22 },
  subheadline: { fontFamily: satoshiRegular, fontSize: 15, lineHeight: 20 },
  footnote: { fontFamily: satoshiRegular, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: satoshiMedium, fontSize: 12, lineHeight: 16, letterSpacing: 0.3 },
  listValue: { fontFamily: monoMedium, fontSize: 17, fontVariant: ['tabular-nums'] },
  sectionHeader: {
    fontFamily: satoshiMedium,
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
}
```

**Rules:**

- Numerics in hero/display/list always use `fontVariant: ['tabular-nums']`.
- Currency formatted via `Intl.NumberFormat` (see `src/lib/currency.ts`).
- Body copy 17pt minimum, never below 13pt for meaningful text.
- Don't add new font families. Don't hardcode `fontFamily` — use the typography tokens.

### Spacing / radii / shadows

```ts
spacing = { xs: 4, sm: 8, md: 12, base: 16, lg: 20, xl: 24, xxl: 32, xxxl: 48, huge: 72 }
radii = { sm: 8, md: 14, lg: 20, xl: 28, pill: 999 }
```

- Default screen padding: `lg` (20pt) horizontal.
- Card internal padding: `xl` (24pt) minimum.
- Cards radius: `lg`. Hero card: `xl`. Buttons: `md`. Bottom sheet top corners: `xl`.
- **Borders whisper.** Always use `colors.border` (~10% opacity) at `StyleSheet.hairlineWidth`. Never `borderWidth: 1`.
- **Light theme** has subtle shadows. **Dark theme** is `shadowsNone` everywhere; depth comes from the `card` → `cardElevated` tone shift.

### Motion

```ts
motion = {
  spring: { damping: 18, stiffness: 200, mass: 1 },
  springSoft: { damping: 22, stiffness: 140, mass: 1 },
  springSnappy: { damping: 15, stiffness: 350, mass: 0.8 },
  timing: { duration: 280 },
  timingFast: { duration: 180 },
}
```

- **Reanimated 3 + Moti only.** Never the legacy `Animated` API.
- Springs for transforms; timing for fades only.
- Hero number counts up on change.
- Button press: scale 0.97 with `springSnappy`.
- List add/remove: Reanimated `LinearTransition` + `FadeIn`/`FadeOut`.

### Icons

**SF Symbols via `expo-symbols`, not emoji.** Project-wide convention. Net-worth item icons are derived from category (e.g. `banknote.fill`, `house.fill`, `car.fill`, `creditcard.fill`). iOS-only by intent.

### Theme picker UI

Two preview tiles, side by side. Each tile shows colored swatches (canvas / cardElevated / signal / label-primary) plus a checkmark when selected. **No theme name labels** anywhere on the tiles or in the settings row — purely visual identification.

### Hard rules (UI)

- **NEVER** import from a specific theme file in a component. Always `useTheme()`.
- **NEVER** use raw hex / spacing / radius / font-size values in components.
- **NEVER** use `Touchable*` from `react-native`. Use `@/ui` `Pressable`.
- **NEVER** use the built-in `Animated` API.
- **NEVER** use `borderWidth: 1`. Use `StyleSheet.hairlineWidth`.
- **NEVER** use a spinner where a skeleton matches the layout.
- **NEVER** use a full-screen `Modal` where a bottom sheet feels grounded.
- **NEVER** use pure white surfaces (canvas) or pure black (anywhere).
- **NEVER** omit empty / loading / error states on a screen.
- **NEVER** write generic copy. Prefer number-led, plain-spoken lines (see copy guidelines).
- **ALWAYS** add haptics on meaningful actions (save, delete, error).
- **ALWAYS** format currency with `Intl.NumberFormat`.
- **ALWAYS** use `fontVariant: ['tabular-nums']` for numerics in lists/dashboards.
- **ALWAYS** wrap screens in `SafeAreaView` from `react-native-safe-area-context` (the `Screen` ui primitive does this).
- **ALWAYS** use Expo Router native stack with `headerLargeTitle: true` for primary screens.
- **ALWAYS** verify a new screen renders correctly in **both** themes before considering it done.

### Copy guidelines

The app talks like a calm financial advisor with a sense of humor — never a startup growth team, never a bank.

- Number-led: "$482,190 net worth" not "Your net worth is $482,190".
- Plain labels: "Assets", "Liabilities", "Net worth". Section headers uppercase.
- Value updates read as "Logged {date}" for snapshots.
- Empty states: warm and forward-looking — "Add your first asset or liability." — no primary CTA.

---

## 5. Code conventions

### Five principles, ranked

1. **Readability is king.** When in doubt, write the boring, explicit version.
2. **Colocation beats categorization.** Files that change together live together.
3. **Explicit beats clever.** A 20-line function with clear names beats a 4-line one-liner.
4. **One reason to change per file.** If you can't describe a file's purpose in one sentence, split it.
5. **Top-down readability.** A reader scrolls a file and understands it without jumping around.

### File naming

| Kind       | Convention                 | Example                      |
| ---------- | -------------------------- | ---------------------------- |
| Components | `PascalCase.tsx`           | `NetWorthRow.tsx`            |
| Hooks      | `useCamelCase.ts`          | `useNetWorth.ts`             |
| Utilities  | `camelCase.ts`             | `currency.ts`                |
| Types      | `types.ts` per feature     | `features/networth/types.ts` |
| Constants  | `constants.ts` per feature |                              |
| Variants   | dot-suffixed               | `NetWorthRow.skeleton.tsx`   |

### Internal file structure (non-negotiable order)

1. **Imports** — grouped: external → `@/...` → relative
2. **Types** — props and any local types
3. **Constants** — named values for magic numbers
4. **The component**
5. **Styles** — at the bottom, always (`createStyles(theme)` pattern)

### Component patterns

- **Destructure props in the function signature.** API visible at a glance.
- **One component per file.** (The single exception: tiny private subcomponents used only within the file, kept above the main component.)
- **~150 line cap.** If over, extract.
- **Composition over configuration.** `<Card><Card.Header>…</Card.Header></Card>` over `<Card title=… subtitle=… …>`.
- **`createStyles(theme)` at the bottom.** Static styles in `createStyles`. Dynamic styles inline at the call site (e.g. `style={[styles.x, { opacity: pressed ? 0.6 : 1 }]}`).
- **Named exports only.** Default exports allowed only in `app/**` (expo-router requires them).

### Hooks

- One hook per file.
- Return objects, not arrays. (Arrays only for tuples with obvious order, like `[value, setValue]`.)
- Extract logic aggressively. If a component has more than ~10 lines of logic before JSX, extract it.

### TypeScript discipline

- **`type` over `interface`.** Save `interface` for declaration merging (rare).
- **Discriminated unions for variants.** Make impossible state literally unrepresentable.
- **Never `any`. Sometimes `unknown`** with a type guard.
- **Inferred return types** unless function is a public API or inference is wrong.
- **Types live next to the code that uses them.** Never a top-level `types/` directory.

### Imports / aliases

- **`@/` alias is mandatory** for cross-feature imports. Relative paths (`./`, `../`) only for sibling files in the same feature.
- **Never reach across features with relative paths.**

### State management hierarchy

Reach for state in this order:

1. **Local state (`useState`)** — first choice.
2. **URL/route state (Expo Router params)** — for deep-linkable / shareable state.
3. **Global store (Zustand)** — for genuinely app-wide state (items, snapshots, onboarding, theme).
4. **AsyncStorage** — persistence only. **Components never know AsyncStorage exists.** The store handles it.

### Reactive flags

**First-launch / has-seen-X / onboarded flags must live in Zustand**, not in a local `useState` seeded by an async storage read. Otherwise navigation gates don't re-evaluate when the flag flips. (Real bug we hit on the onboarding screen.)

### Money as integer cents

**Money is integer cents everywhere.** `bigint` in the DB, integer `number` on the client (`amountCents`). No numeric/decimal columns. Convert to/from dollars only at the form input and display boundaries (`src/lib/currency.ts`, `src/features/networth/utils.ts` `dollarsToCents` / `centsToDollars`).

### Comments

**Default to writing none. Code documents itself.**

The two narrow exceptions:

1. **`TODO` markers** with owner and date: `// TODO(kevin, 2026-06): wire Plaid sync`
2. **Workaround citations** linking external bugs.

If you reach for a comment, do one of:

- Rename the variable/function until it explains itself.
- Extract the confusing block into a named function.
- Replace edge-case comments with discriminated unions or type guards.
- Replace magic numbers with named constants.

No JSDoc on internal functions, no section dividers, no "this is tricky" preludes, no closing-tag markers.

### Edge cases / error handling

- **Loading + empty + error — every screen.**
- **Defensive defaults at boundaries, not everywhere.** `?.` belongs at data boundaries, not inside well-typed business logic.
- **`try/catch` only where you can act on the error.**

### Performance

- **`FlatList` for any list over ~20 items.** Never `.map()` over a long array inside a `ScrollView`.
- **Don't preemptively `memo` / `useCallback`.** Wait for the second use or a measured problem.
- **`InteractionManager.runAfterInteractions` for heavy work after a screen transition.**

---

## 6. Data model

Net worth is a set of **items** (assets and liabilities), each with a current amount, plus a history of **value snapshots**. All money is integer cents. Data lives in Supabase with RLS keyed on `auth.uid()`.

```ts
type NetWorthItemKind = 'asset' | 'liability'

type NetWorthItemCategory =
  | 'cash'
  | 'checking_account'
  | 'savings_account'
  | 'investment'
  | 'crypto'
  | 'real_estate'
  | 'vehicle'
  | 'electronics'
  | 'furniture'
  | 'other_asset'
  | 'credit_card'
  | 'mortgage'
  | 'student_loan'
  | 'auto_loan'
  | 'personal_loan'
  | 'other_liability'

type NetWorthItem = {
  id: string
  name: string
  kind: NetWorthItemKind
  category: NetWorthItemCategory
  amountCents: number // ALWAYS positive — sign comes from kind
  updatedAt: string // ISO
}

type NetWorthSnapshot = {
  id: string
  itemId: string
  amountCents: number
  capturedAt: string // ISO date (yyyy-mm-dd)
  note: string | null
  createdAt: string // ISO
}

type NetWorthSummary = {
  totalAssetsCents: number
  totalLiabilitiesCents: number
  netCents: number
}
```

- **Net worth = sum(asset item amounts) − sum(liability item amounts).** Computed on the fly, never stored.
- Each item holds a **current** `amountCents`. Snapshots record history.
- **Two write paths for value changes** (see the item detail / log screens):
  - _Update directly_ — edits the item amount, no snapshot written.
  - _Log new value_ — writes a snapshot; the item's `amountCents` is synced only when the snapshot's `capturedAt` is today.
- Categories live in `src/features/networth/constants.ts` (`ITEM_CATEGORIES`), each tagged with its `kind`.
- **Manual entry only for v1.** No Plaid / live sync; the model is forward-compatible if we add it later.

### Supabase tables

- `net_worth_items` — the assets/liabilities. Trigger keeps `updated_at` current.
- `net_worth_snapshots` — value history; `item_id` FK cascades on item delete.
- Both have RLS own-row policies (`auth.uid() = user_id`).

### Storage keys (AsyncStorage)

- `networthmaxxing_onboarded` — first-launch flag (also mirrored in Zustand)
- `networthmaxxing_theme` — current theme key (`light` | `dark`)
- Supabase auth session — managed by the Supabase client

---

## 7. Routing notes

- **expo-router 6 with a `(tabs)` group** at the root. `app/index.tsx` redirects to `/networth`.
- **`Stack.Screen` `name` prop must include the full route path including `/index`** (e.g. `name="settings/index"`, not `name="settings"`). Otherwise the override silently no-ops and the user sees the raw filename in the header.
- **Headers never expose route filenames.** No "settings/index", no "networth/[id]", no inherited back-labels.
- **iOS back button is chevron-only.** Set `headerBackButtonDisplayMode: 'minimal'` and `headerBackTitle: ''` once at the root stack and per-tab stacks.
- **No fixed header on the home large-title screen** — the screen is its own header.

---

## 8. Project-specific gotchas (won't be obvious from the code)

### `import 'react-native-get-random-values'` must be the first line of `app/_layout.tsx`

It polyfills `crypto.getRandomValues` for `uuid` and must run before any uuid call.

### Pressable wraps RNPressable + Animated.View

Never `createAnimatedComponent(Pressable)` — it silently breaks hit detection on RN 0.81 + Reanimated 4. The `@/ui` `Pressable` composes a plain `RNPressable` with an inner `Animated.View`.

### Pre-commit hook runs lint + format + typecheck

If a commit fails because of the hook, **fix the underlying issue** — don't bypass with `--no-verify`. The hook setup is `.husky/pre-commit` invoking `npx lint-staged` then `npm run typecheck`.

### Scaffold generators in place, not as siblings

Inside an existing repo, run `npx create-expo-app .` (target `.`) — don't pass a name argument or it creates a nested folder. The repo on disk is `credit-card-benefits`; the app name is `networthmaxxing` (just package identity, not folder).

---

## 9. About me (Kevin) and how I like to work

### Role / experience

Senior-level engineering background. I'm building this app for myself.

### Visual taste

**Premium, lightly tech.** I anchor on these brands:

- Visual restraint: **Ramp** — one signal color, editorial whitespace, numbers as heroes.
- Friendly minimalism + soft motion: **Waymo** — rounded geometry, calm pacing.
- Other touchstones: Linear, Vercel, Mercury, Polymarket, Cron.

I dislike serif/editorial display fonts (rejected Instrument Serif as "boring"). Single-family premium grotesques beat display+body pairings.

### How I read UI

**As a user, not as an implementer.** If a route filename leaks into a header ("settings/index"), if a parent's title leaks into a back button, if the simulator shows something a real user would notice — that's a bug, even if the code is "correct." Walk every screen as a user before declaring UI work done.

### Collaboration style

- **Be terse.** Don't summarize what's already in the diff. Don't write trailing recap paragraphs.
- **No filler text in code.** Default to writing no comments. Don't restate what the code does. Don't reference the current task or PR.
- **Small, focused diffs.** Don't add features beyond what was asked. Don't refactor opportunistically. Don't introduce abstractions for hypothetical futures. Three similar lines beats a premature abstraction.
- **For exploratory questions** ("how should I approach X?"), respond in 2–3 sentences with a recommendation and the main tradeoff. Don't implement until I agree.
- **Verify before declaring done.** Type-check, lint, format. For UI, walk the feature in the simulator.
- **Push back when you disagree.** I'll respect a reasoned argument more than a yes-and.

### Ask, don't guess

Ask clarifying questions when:

- Picking between materially different approaches.
- The data model has a load-bearing decision (e.g., manual vs integrated, the two value-write paths).
- You're about to introduce a new dependency.

Don't ask about routine stylistic choices that the conventions above already cover.

### Things I've corrected before (don't repeat)

- Don't use the legacy `Animated` API. Reanimated + Moti only.
- Don't use `Touchable*`. Use the `@/ui` `Pressable` wrapper.
- Don't use emoji as icons. Use SF Symbols via `expo-symbols`.
- Don't use pure white canvas (`#FFFFFF`) or pure black anywhere.
- Don't add new font families. Satoshi + Geist Mono only.
- Don't write code comments unless they meet the two narrow exceptions.
- Don't bypass the pre-commit hook with `--no-verify`.
- Don't pre-extract components or memoize before measuring.
- Don't add icons to rows/categories/pickers unless asked (functional icons — tab bar, +/checkmark/chevron — excepted).

---

## 10. Quick command reference

```sh
# install (always)
npm install <pkg> --legacy-peer-deps

# dev
npm start

# verify
npm run typecheck
npm run lint
npm run fmt:check

# fix
npm run lint:fix
npm run fmt
```

Generate an ID: `import { generateId } from '@/lib/id'` → `generateId()` returns a UUID v4.

Get the active theme tokens in a component: `const { colors, spacing, typography, radii, shadows, motion } = useTheme()`.

Format a currency value: `import { formatCurrency } from '@/lib/currency'` → `formatCurrency(amount)` (whole dollars by default; `formatCurrencyPrecise` for cents).
</content>
</invoke>

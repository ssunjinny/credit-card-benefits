---
name: readability
description: Use whenever creating, modifying, refactoring, or reviewing any code in this React Native project — screens, components, hooks, utilities, types, stores. Triggers on any code-creation or code-modification task. Enforces readability as the highest priority, plus the project's file organization (features/, ui/, lib/, store/, app/), file naming conventions, internal file structure (imports → types → constants → component → styles), TypeScript discipline (no any, discriminated unions, type over interface), import aliases (@/), state management hierarchy (local → URL → Zustand → AsyncStorage), and component patterns (destructured props, createStyles theme function, composition over configuration). Pairs with the UI skill — load both for any UI work.
---

# Readability & Organization Skill

Use this skill any time you are creating, modifying, refactoring, or reviewing code in this project. Readability is the highest-order concern in this codebase. Every other principle (DRY, performance, abstraction) bows to it. Code is read 10× more than it's written. If a clever pattern makes the next reader pause for 5 seconds, it's a net loss.

---

## Five principles, ranked

1. **Readability is king.** When in doubt, write the boring, explicit version.
2. **Colocation beats categorization.** Files that change together live together. A feature owns its components, hooks, utils, and types.
3. **Explicit beats clever.** A 20-line function with clear names beats a 4-line one-liner that requires staring.
4. **One reason to change per file.** If you can't describe a file's purpose in one sentence, split it.
5. **Top-down readability.** A reader scrolls a file from top to bottom and understands it without jumping around.

---

## Folder structure (canonical)

```
src/
├── app/                     # Expo Router screens (file-based routing)
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── benefit/
│   │   └── [id].tsx
│   ├── log/
│   │   └── [benefitId].tsx
│   └── settings/
│       ├── index.tsx
│       └── theme.tsx
│
├── features/                # Domain code, organized by feature
│   ├── benefits/
│   │   ├── components/      # Components used ONLY by this feature
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── types.ts
│   │   └── constants.ts
│   ├── logs/
│   └── theme/               # The theme system (paired with UI skill)
│
├── ui/                      # Generic, design-system primitives only
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Pressable.tsx
│   ├── Text.tsx
│   └── index.ts
│
├── lib/                     # Pure utilities, no React
│   ├── currency.ts
│   ├── date.ts
│   └── storage.ts
│
└── store/                   # Global state (Zustand)
    └── useAppStore.ts
```

### Rules for where things go

- **Used by one feature?** It lives inside that feature's folder.
- **Used by multiple features and is generic UI?** Goes in `ui/`.
- **A pure function with no React?** Goes in `lib/`.
- **Genuinely app-wide state?** Goes in `store/`.
- **Never create a top-level `components/` directory.** It becomes a junk drawer within a month.
- **Never create a top-level `types/` directory.** Types live next to the code that uses them.
- **Never create a top-level `utils/` directory.** Use `lib/` for pure utilities, or feature-local `utils/` folders.

---

## File naming

| Kind       | Convention                   | Example                                          |
| ---------- | ---------------------------- | ------------------------------------------------ |
| Components | `PascalCase.tsx`             | `BenefitRow.tsx`                                 |
| Hooks      | `useCamelCase.ts`            | `useBenefitProgress.ts`                          |
| Utilities  | `camelCase.ts`               | `currency.ts`                                    |
| Types      | `types.ts` (per feature)     | `features/benefits/types.ts`                     |
| Constants  | `constants.ts` (per feature) | `features/benefits/constants.ts`                 |
| Variants   | dot-suffixed                 | `BenefitRow.skeleton.tsx`, `BenefitRow.test.tsx` |

---

## Internal file structure (non-negotiable order)

Every component file follows this top-to-bottom order:

1. **Imports** — grouped: external → `@/...` → relative
2. **Types** — props and any local types
3. **Constants** — named values for any magic numbers
4. **The component**
5. **Styles** — at the bottom, always

```typescript
import { useState, useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { MotiView } from 'moti'

import { useTheme } from '@/features/theme'
import { Text, Pressable } from '@/ui'
import { formatCurrency } from '@/lib/currency'

import { useBenefitProgress } from './useBenefitProgress'

type BenefitRowProps = {
  benefit: Benefit
  onPress: () => void
}

const PRESS_FEEDBACK_SCALE = 0.97

export const BenefitRow = ({ benefit, onPress }: BenefitRowProps) => {
  const theme = useTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const progress = useBenefitProgress(benefit.id)

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text>{benefit.name}</Text>
      <Text>{formatCurrency(progress.used)}</Text>
    </Pressable>
  )
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: theme.spacing.base,
      paddingHorizontal: theme.spacing.lg,
    },
  })
```

**Why this order is mandatory:**

- Imports first → reader sees dependencies before code
- Types second → reader sees shape before usage
- Component in the middle → the main event
- Styles at the bottom → reference, not distraction

---

## Component patterns

### Destructure props in the signature

**Good** — API visible at a glance:

```typescript
export const BenefitRow = ({ benefit, onPress, isSelected }: BenefitRowProps) => {
```

**Bad** — props is opaque:

```typescript
export const BenefitRow = (props: BenefitRowProps) => {
  const { benefit, onPress, isSelected } = props
```

### One component per file

One file = one exported component. The single exception: tiny private subcomponents used ONLY within the file, kept above the main component. If a private subcomponent ever needs reuse, it gets its own file. Do not preemptively extract.

In `BenefitRow.tsx`, a private `StatusBadge` may live above the exported `BenefitRow`:

```typescript
const StatusBadge = ({ status }: { status: BenefitStatus }) => {
  return <View>{ /* ... */ }</View>
}

export const BenefitRow = ({ benefit }: BenefitRowProps) => {
  return <Pressable><StatusBadge status={benefit.status} /></Pressable>
}
```

### Component size limit: ~150 lines

If a component is over ~150 lines, it is doing too much. Extract:

- Subcomponents into their own files (under the feature's `components/`)
- Logic into hooks (under the feature's `hooks/`)
- Styles can stay long — they are a reference, not logic

### Composition over configuration

**Bad** — prop sprawl:

```typescript
<Card title="..." subtitle="..." showIcon icon="..." action="..." onAction={...} />
```

**Good** — composition:

```typescript
<Card>
  <Card.Header>
    <Icon name="..." />
    <Text>...</Text>
  </Card.Header>
  <Card.Body>...</Card.Body>
</Card>
```

### Style with `createStyles(theme)` pattern

Inline styles get unreadable fast. Raw `StyleSheet.create` outside the component cannot access theme. The pattern keeps `createStyles` at the bottom of the file:

```typescript
const theme = useTheme()
const styles = useMemo(() => createStyles(theme), [theme])

return <View style={styles.container} />

const createStyles = (theme: Theme) => StyleSheet.create({
  container: { backgroundColor: theme.colors.surface.card },
})
```

For values that depend on props or runtime state, do them inline at the call site:

```typescript
<View style={[styles.container, { opacity: isPressed ? 0.6 : 1 }]} />
```

Static styles in `createStyles`. Dynamic styles inline. Never the reverse.

---

## Hooks

### One hook per file

In `hooks/useBenefitProgress.ts`:

```typescript
export const useBenefitProgress = (benefitId: string) => {
  const logs = useAppStore((state) => state.logs);
  const used = sumLogsForBenefit(logs, benefitId);
  return { used, cap, percentage, status };
};
```

### Return objects, not arrays

Arrays only for tuples with an obvious order (like `[value, setValue]`). Objects for everything else — they are self-documenting at the call site.

**Bad** — what's the order again?

```typescript
const [used, cap, percentage] = useBenefitProgress(id);
```

**Good**:

```typescript
const { used, cap, percentage } = useBenefitProgress(id);
```

### Extract logic into hooks aggressively

If a component has more than ~10 lines of logic before the JSX, extract it. The component should read like a description of what's on the screen, not a programming exercise.

---

## State management hierarchy

The order to reach for state, top to bottom:

1. **Local state (`useState`)** — the first choice, always. Most state is local.
2. **URL/route state (Expo Router params)** — for state that should survive navigation, support deep links, or be shareable.
3. **Global store (Zustand)** — for genuinely app-wide state: logs, settings, theme.
4. **AsyncStorage** — persistence only. Wrapped behind the store, never accessed from components.

**Components never know AsyncStorage exists.** The store handles persistence; components read from the store.

### Zustand store organization

```typescript
type AppStore = {
  // STATE
  logs: BenefitLog[];
  themeKey: ThemeKey;
  isLoaded: boolean;

  // ACTIONS — verbs, mutate state
  addLog: (log: BenefitLog) => void;
  deleteLog: (id: string) => void;
  setTheme: (key: ThemeKey) => void;

  // QUERIES — derived data, no mutation
  getBenefitProgress: (benefitId: string) => Progress;
};
```

State, actions, and queries each get their own labeled section. Future-you will thank you.

### Always use selectors

```typescript
// BAD — re-renders when ANY state changes
const store = useAppStore();
const logs = store.logs;

// GOOD — re-renders only when logs change
const logs = useAppStore((state) => state.logs);
```

This matters more in React Native than web because re-renders are more expensive on mobile.

---

## TypeScript discipline

### `type` over `interface`

Use `type` for all app code. It is more flexible (unions, intersections, mapped types). Save `interface` for cases where declaration merging actually matters (rare).

### Discriminated unions for variants

```typescript
type Benefit =
  | { category: "fixed"; annualCap: number; resetType: "jan1" | "per_use" }
  | { category: "soft"; annualCap: null; resetType: "jan1" };
```

The impossible state (a soft benefit with a cap) is now literally not representable. Better than runtime checks.

### Never `any`. Sometimes `unknown`.

`any` opts out of type checking. `unknown` opts in by forcing narrowing before use. If tempted to use `any`, use `unknown` and add a type guard.

### Inferred return types

```typescript
// Don't annotate this — TypeScript infers it perfectly
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { ... }).format(amount)
}
```

Always annotate function parameters. Annotate return types only when:

- The function is a public API (exported from a module)
- Inference is wrong or too wide
- A specific shape needs to be enforced

### Types live next to the code that uses them

If a type is used in one feature → `features/<feature>/types.ts`. If truly global (like `Theme`) → its own file in the relevant module. **Never** a top-level `types/` directory.

---

## Imports and aliases

### Path alias `@/` is mandatory

`tsconfig.json` must have:

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

Use `@/` for any cross-feature import. Use relative (`./`, `../`) only for sibling files inside the same feature.

```typescript
// GOOD
import { useTheme } from "@/features/theme";
import { useBenefitProgress } from "./useBenefitProgress";

// BAD — never reach across features with relative paths
import { useTheme } from "../../theme/ThemeProvider";
```

### Barrel files (index.ts) — used carefully

Use barrel files for:

- The `ui/` folder (stable public-API surface)
- Each `features/<feature>/` if it has a clear public export

```typescript
// src/ui/index.ts
export { Button } from "./Button";
export { Card } from "./Card";
export { Text } from "./Text";
```

Do NOT barrel-export everything everywhere. Tree-shaking gets weird and circular imports get easier.

---

## Edge cases and errors

### Loading, empty, error — all three, every screen

```typescript
if (!isLoaded) return <BenefitListSkeleton />
if (logs.length === 0) return <BenefitListEmpty />
return <BenefitList logs={logs} />
```

### Defensive defaults at boundaries, not everywhere

```typescript
// BAD — explodes if note is undefined
<Text>{log.note.toUpperCase()}</Text>

// GOOD — handles edge case at the data boundary
<Text>{log.note?.toUpperCase() ?? ''}</Text>
```

But DO NOT sprinkle `?.` defensively inside well-typed business logic. Use it at boundaries (data crossing into the component). Inside typed code, optional chaining is a smell that types are too loose.

### `try/catch` only where you can act on the error

```typescript
// BAD — catches and re-throws, accomplishing nothing
try {
  await saveLog(log);
} catch (e) {
  throw e;
}

// GOOD — there's a recovery
try {
  await saveLog(log);
  Haptics.notificationAsync(Success);
} catch (e) {
  Haptics.notificationAsync(Error);
  showToast("Could not save. Try again.");
}
```

---

## Comments

### Do not write comments. Code documents itself.

Comments are a smell. They are debt. They lie over time as the code beneath them changes and the comment doesn't. They are a signal that the code is not clear enough on its own. The fix is always to make the code clearer — better names, smaller functions, types that encode intent, structure that flows top-down.

If you find yourself reaching for a comment, do one of the following instead:

- **Rename the variable, function, or component** until it explains itself.
- **Extract the confusing block** into a named function or hook whose name tells the story.
- **Replace a comment about edge cases** with a discriminated union or a type guard that makes the edge case impossible.
- **Replace a comment about a magic number** with a named constant.

```typescript
// BAD — relying on a comment to do the work
// scale down so the press feels tactile
transform: [{ scale: 0.97 }];

// GOOD — the constant explains itself
const PRESS_FEEDBACK_SCALE = 0.97;
transform: [{ scale: PRESS_FEEDBACK_SCALE }];
```

```typescript
// BAD — comment masks unclear logic
// only count logs from the current year
const valid = logs.filter(
  (l) => new Date(l.date).getFullYear() === currentYear,
);

// GOOD — extract; the function name is the comment
const logsThisYear = filterLogsForYear(logs, currentYear);
```

### The two narrow exceptions

These are the only comments allowed in this codebase:

1. **`TODO` markers** — for known incomplete work, with an owner and date so they don't rot:
   `// TODO(brandon, 2026-05): wire up Plaid auto-sync`

2. **Workaround citations** — when code looks wrong because of an external bug, link it:
   `// Workaround for expo issue #12345 — remove when fixed`

That's it. No JSDoc on internal functions. No section dividers. No "this is tricky" preludes. No restating what the code does. No closing-tag markers.

If a screen needs an "emotional intent" note (which the UI skill mentions), encode it in a const at the top of the file rather than as prose:

```typescript
// BAD
// Screen: Home Dashboard
// Emotional target: "you're winning, calmly"
// Reference: Ramp homepage card

// GOOD — captured as actual code, surfaceable in tooling
const SCREEN_INTENT = {
  name: "Home Dashboard",
  emotion: "winning, calmly",
  reference: "Ramp homepage card",
} as const;
```

…or omit it entirely if the file's name and structure already tell the story.

---

## Performance — the realistic version

Do not micro-optimize. Avoid the few patterns that genuinely hurt:

1. **`FlatList` for any list over ~20 items.** Never `.map()` over a long array inside a `ScrollView`.
2. **`memo` only after measuring.** Premature memoization adds complexity without benefit. If React DevTools profiler shows no problem, do not memoize.
3. **`useCallback` only for callbacks passed to memoized children.** Otherwise it is noise.
4. **`InteractionManager.runAfterInteractions` for heavy work after a screen transition.** Lets the animation finish before CPU-heavy work.
5. **Always specify image dimensions and use `expo-image`.** Better caching, transitions, and memory than the built-in `Image`.

---

## Testing baseline

For this personal app:

- **Unit tests for `lib/` utilities only** — currency formatting, date math, calculations. Pure functions break silently if wrong.
- **One smoke test that the app boots** — useful when upgrading dependencies.

Skip UI tests. They are expensive to maintain and rarely catch real bugs.

---

## Linting and formatting

Set once, never touch:

- **ESLint** with `@react-native/eslint-config` as the base
- **Prettier** — single quote, no semi, trailing commas, 100 print width
- **Husky + lint-staged** — runs on commit, automatic
- **No `// eslint-disable` litter.** If a rule is wrong, change it globally.

---

## Hard rules — never violate

- NEVER create a top-level `components/`, `types/`, or `utils/` directory.
- NEVER cross feature boundaries with relative imports (`../../`). Use `@/`.
- NEVER export a default function from a component file. Always named exports.
- NEVER use `any`. Use `unknown` + narrow if needed.
- NEVER use `Touchable*`. Use the `Pressable` wrapper from `@/ui`.
- NEVER access AsyncStorage from a component. Always through the store.
- NEVER store derived data. Compute it; cache only if measurably slow.
- NEVER preemptively extract a subcomponent or memoize. Wait for the second use or the measurement.
- NEVER write comments. Code documents itself. The only allowed comments are `TODO(owner, date)` markers and external workaround citations. Reaching for a comment means the code is not clear enough — fix the code instead.
- NEVER let a component grow past ~150 lines without extracting.
- ALWAYS destructure props in the function signature.
- ALWAYS use the `createStyles(theme)` pattern for static styles.
- ALWAYS use named exports.
- ALWAYS group imports: external → `@/...` → relative.
- ALWAYS keep file order: imports → types → constants → component → styles.
- ALWAYS handle loading, empty, and error states on every screen.
- ALWAYS use selectors with Zustand (`useAppStore(state => state.x)`).

---

## Definition of done for any code change

A change is not done until:

1. File internal order is correct (imports → types → constants → component → styles)
2. Imports are grouped correctly
3. No raw hex / spacing / radius values in components (paired with UI skill)
4. No `any`, no `Touchable*`, no `Animated` legacy API
5. Types live in the right place (feature-local, not global)
6. Empty/loading/error states are handled
7. The file passes lint without `eslint-disable`
8. The change reads cleanly top-to-bottom

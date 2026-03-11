# @mas/shared-types

Platform-agnostic **type definitions** shared across every project in the MAS monorepo.

This package contains **no runtime code** — it is types-only and safe to import from React Native, Angular, or any Node context.

---

## Exports

| Export | Kind | Description |
|---|---|---|
| `ThemeTokens` | `interface` | Design-token contract every theme must implement (colours, spacing, radius, typography) |
| `StylesOverride<S>` | `type` | Utility type for per-component style overrides |

---

## ThemeTokens

Defines the full shape of a theme object. Both `dark` and `light` themes in `@mas/rn-ui` implement this interface, and the `ThemeProvider` distributes an instance through React context.

```ts
import type { ThemeTokens } from '@mas/shared-types';

function MyComponent({ theme }: { theme: ThemeTokens }) {
  return <View style={{ backgroundColor: theme.colors.background }} />;
}
```

### Color tokens

| Token | Purpose |
|---|---|
| `background` | Screen background |
| `surface` | Card / sidebar background |
| `text` | Primary body text |
| `mutedText` | Secondary / placeholder text |
| `primary` | Brand action colour |
| `secondary` | Accent colour (alias: `track`) |
| `danger` | Destructive actions |
| `success` | Positive / keep actions |
| `border` | Borders and dividers |
| `onSurface` | Foreground on elevated surface |
| `shadow` | Elevation shadow |

---

## StylesOverride\<S\>

Lets consumers override individual named styles of a component without replacing the full stylesheet.

```ts
import type { StylesOverride } from '@mas/shared-types';

type ButtonStyles = { root: ViewStyle; label: TextStyle };

function Button({ stylesOverride }: { stylesOverride?: StylesOverride<ButtonStyles> }) {
  return (
    <TouchableOpacity style={[styles.root, stylesOverride?.root]}>
      <Text style={[styles.label, stylesOverride?.label]}>Press me</Text>
    </TouchableOpacity>
  );
}
```

---

## Used by

- `@mas/rn-ui` — theme provider and all UI components
- `@mas/rn-hooks` — `useResultedStyle` hook
- `apps/rn-pic-swipe-wipe` — app-level theming

# `@mas/rn/ui`

React Native UI component library for the `mas-repo` monorepo.
Provides themed, composable atoms and organisms shared across all React Native / Expo apps.

## Install / import

```ts
import { Button, Card, useTheme, ThemeProvider } from '@mas/rn/ui';
import VideoContainer from '@mas/rn/ui/video-player/VideoContainer';
```

Package name: `@mas/rn/ui`
Source: `libs/react-native/ui/src/`
Barrel: `libs/react-native/ui/src/index.ts`

---

## Theming

| Export | File | Description |
|--------|------|-------------|
| `ThemeProvider` | `ThemeContext.tsx` | Context provider — wrap the app root once. Defaults to dark mode. |
| `useTheme()` | `ThemeContext.tsx` | Hook returning `{ theme, isDark, toggleTheme, mode }`. |
| `darkTheme` | `dark.ts` | Dark-mode `ThemeTokens` token set. |
| `lightTheme` | `light.ts` | Light-mode `ThemeTokens` token set. |
| `useResultedStyle(theme, makeStyles, override?)` | `useResultedStyle.ts` | Composes base theme styles with optional partial overrides via `StyleSheet.compose`. Used by every component internally. |

```tsx
// Wrap once at root:
<ThemeProvider>
  <App />
</ThemeProvider>

// Consume anywhere:
const { theme, isDark, toggleTheme } = useTheme();
```

---

## Components

### Button
`button/Button.tsx` · `ButtonProps`

Pressable button supporting variants (`primary`, `secondary`, `ghost`, `danger`, `outline`),
sizes (`sm`, `md`, `lg`), start/end icons, and full style overrides.

```tsx
<Button label="Save" onPress={save} variant="primary" size="md" />
<Button onPress={del} icon={{ type: 'vector', name: 'trash-outline' }} variant="danger" />
```

---

### Card
`card/Card.tsx` · `CardProps`

Presentational card surface with an optional `renderOverlay` prop for
trash/approved colour overlays. No swipe logic.

```tsx
<Card renderOverlay={() => <TrashOverlay />}>
  <Image source={photo} style={{ flex: 1 }} />
</Card>
```

---

### CardsDeck
`cards-deck/CardsDeck.tsx` · `CardsDeckProps<TFront, TBack>`

Animated swipe deck rendering a front (interactive) and back (preview) card.
Drives `leftAction` / `rightAction` overlays and fires `onSwipeCommit` at threshold.

```tsx
<CardsDeck
  frontItem={items[cursor]}
  backItem={items[cursor + 1]}
  renderFront={(item) => <MediaCard item={item} />}
  leftAction={{ color: '#F00', icon: { type: 'vector', name: 'trash' } }}
  rightAction={{ color: '#0F0', icon: { type: 'vector', name: 'checkmark' } }}
  onSwipeCommit={(dir) => handleSwipe(dir)}
  resetKey={items[cursor]?.id}
/>
```

---

### Icon
`icon/Icon.tsx` · `IconProps`

Discriminated-union icon atom. Supports Ionicons (default) or any custom SVG component.
Encodes metadata in `accessibilityLabel` for test introspection.

```tsx
<Icon type="vector" name="trash-outline" size={24} color="#F00" />
<Icon type="svg" Svg={MyLogoSvg} size={32} />
```

---

### Logo
`logo/Logo.tsx` · `LogoProps`

`Animated.Image` with a continuous breathing scale loop. Configurable animation preset.

```tsx
<Logo source={require('../assets/logo.png')} size={120} />
```

---

### ProgressBar
`progress-bar/ProgressBar.tsx` · `ProgressBarProps`

Linear and circular progress indicator with determinate and indeterminate modes.
Circular variant uses `react-native-svg`.

```tsx
<ProgressBar value={0.6} variant="linear" />
<ProgressBar isInfinite variant="circular" size={48} />
```

---

### Select
`select/Select.tsx` · `SelectProps` · `SelectOption`

Modal-based dropdown with single/multi-select, per-option icons, and `iconsOnly` mode.

```tsx
<Select
  options={[{ label: 'Photos', value: 'photo', startIcon: { type: 'vector', name: 'image-outline' } }]}
  value={filter}
  onSelect={setFilter}
  triggerIcon={{ type: 'vector', name: 'filter-outline' }}
  iconsOnly
/>
```

---

### TabBar
`tab-bar/TabBar.tsx` · `TabBarProps`

Pure UI floating tab bar (no router dependency). Configurable icon position, labels, and sizes.
Connect to React Navigation via `TabBarAdapter`.

```tsx
<TabBar tabs={TABS} activeTab="HomeTab" onTabPress={(name) => navigate(name)} />
```

---

### TabBarAdapter
`tab-bar/TabBarAdapter.tsx` · `TabBarAdapterProps`

Bridges React Navigation `BottomTabBarProps` into `TabBar`.

```tsx
<Tab.Navigator tabBar={(props) => <TabBarAdapter {...props} theme={theme} tabs={TABS} />}>
  ...
</Tab.Navigator>
```

---

### VideoContainer
`video-player/VideoContainer.tsx` · `VideoContainerProps`

High-performance video player built on `expo-video`. Manages native player lifecycle,
animated feedback, scrubbing (`VideoProgressBar`), and mute control.
Composes `VideoGestures` and `VideoProgressBar` internally.

```tsx
<VideoContainer uri={item.uri} isActive={isCurrentCard} />
```

---

## Style system

Every component accepts a `stylesOverride` prop (typed as `StylesOverride<XShape>`)
that is merged on top of the base theme styles via `useResultedStyle`.
Only the keys you provide are patched — the rest inherit from the theme.

```tsx
<Button
  label="Delete"
  onPress={del}
  variant="primary"
  stylesOverride={{ base: { borderRadius: 4 } }}
/>
```

Style factories (`makeButtonStyles`, `makeCardStyles`, etc.) are exported from their
respective `.style.ts` files if you need to build custom components on top of them.

---

## Used in this repo

| Consumer | Usage |
|----------|-------|
| `apps/rn-pic-swipe-wipe` | All components — `ThemeProvider`, `Button`, `Card`, `CardsDeck`, `Icon`, `Logo`, `ProgressBar`, `Select`, `TabBar`, `VideoContainer` |
| `apps/storybook-native` | Component stories via `.storybook/preview.tsx` |

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `@expo/vector-icons` | Ionicons renderer used by `Icon` |
| `expo-video` | Native video player used by `VideoContainer` |
| `react-native-svg` | Circular `ProgressBar` variant |
| `react-native-gesture-handler` | Pan gesture in `VideoProgressBar` |
| `react-native-reanimated` | Animated feedback in `VideoContainer` |
| `@mas/shared/types` | `ThemeTokens`, `StylesOverride` types |

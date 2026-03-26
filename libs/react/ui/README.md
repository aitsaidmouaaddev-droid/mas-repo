# @mas/react-ui — React Web Design System

Atomic component library for React web apps. SCSS Modules + CSS variables (`@mas/shared/theme`), Storybook, 40 components, 185+ tests.

---

## Architecture

- **Theme**: `ThemeProvider` + `useTheme` (light/dark), JS → CSS custom properties via `@mas/shared/theme`
- **Styling**: SCSS Modules + `useStyles(scss, classOverride?, styleOverride?)` — merges base + overrides via `clsx`
- **Every component** receives `classOverride`, `styleOverride`, `testId`, `className`
- **Icons**: `react-icons/fi` (Feather set)

---

## Components (40)

### Phase 1 — Foundation (9)

| Component          | Category |
| ------------------ | -------- |
| Icon               | Atom     |
| Button             | Atom     |
| Card               | Molecule |
| Logo               | Atom     |
| ProgressBar        | Atom     |
| Select             | Molecule |
| NavBar             | Organism |
| SideBar            | Organism |
| FloatingMenuButton | Molecule |

### Phase 2 — Atoms (13)

| Component  | Description                                                  |
| ---------- | ------------------------------------------------------------ |
| Typography | variant (title/subtitle/body/caption/label), custom `as` tag |
| Input      | forwardRef, size (sm/md/lg), error, startIcon/endIcon        |
| Checkbox   | Custom styled, FiCheck icon                                  |
| Radio      | Custom styled circle/dot                                     |
| Switch     | Track/thumb toggle, role="switch"                            |
| Avatar     | Image / initials / fallback, size (sm/md/lg)                 |
| Badge      | variant (primary/secondary/success/warning/error), dot mode  |
| Tag        | Label + optional close button                                |
| Divider    | Horizontal/vertical, optional label                          |
| Spinner    | CSS border spin animation, size                              |
| Tooltip    | Hover/focus, position (top/bottom/left/right)                |
| Link       | Extends anchor, disabled state                               |
| Skeleton   | Shimmer animation, variant (text/circular/rectangular)       |

### Phase 2 — Molecules (9)

| Component     | Description                                        |
| ------------- | -------------------------------------------------- |
| InputField    | Composes Input + label + hint/error text           |
| SearchBar     | FiSearch icon + clear button                       |
| Tabs          | TabItem[] with key/label/content                   |
| Accordion     | Single/multiple expand, animated chevron           |
| Alert         | Auto icon per variant, closable                    |
| Toast         | Portal container, auto-dismiss, `useToast()` hook  |
| Pagination    | Prev/next + page numbers + ellipsis                |
| RadioGroup    | Wraps Radio components, manages selection          |
| CheckboxGroup | Wraps Checkbox components, manages multi-selection |

### Phase 2 — Organisms (4)

| Component    | Description                                   |
| ------------ | --------------------------------------------- |
| Modal        | Portal overlay, Escape/click-outside close    |
| DropdownMenu | Trigger/items, outside-click close, separator |
| Form         | e.preventDefault, actions slot                |
| Table        | Column config, sortable headers, empty state  |

### Phase 3 — Calendar / Date-Time (7)

| Component                | Category | Description                                                                   |
| ------------------------ | -------- | ----------------------------------------------------------------------------- |
| Popover                  | Utility  | Portal-based positioned overlay, viewport-clamped, Escape/outside-click close |
| DateCalendar             | Atom     | Headless month/year/day grid, single & range selection, minDate/maxDate       |
| MultiSectionDigitalClock | Atom     | Scroll-snap column clock — hours, minutes, optional AM/PM, minute step        |
| DatePickerField          | Molecule | Single-date field (Desktop/Mobile/Static variants, clearable, display format) |
| DateRangePickerField     | Molecule | Dual start/end fields sharing one calendar, two-step range selection          |
| TimePickerField          | Molecule | Time-only field (24h / 12h, minutesStep, Desktop/Mobile/Static)               |
| DateTimePickerField      | Molecule | Combined calendar + clock in one popover/sheet (Desktop/Mobile/Static)        |

> All picker fields accept `label`, `hint`, `errorText`, `disabled`, and `testId` — same API shell as `InputField`.
> `variant: 'auto'` detects `(pointer: coarse)` and switches between popover (desktop) and bottom-sheet (mobile) automatically.

### Phase 2 — Layout (5)

| Component  | Description                                   |
| ---------- | --------------------------------------------- |
| Breadcrumb | Nav landmark, aria-current, custom separator  |
| Header     | Left/right slots                              |
| Container  | maxWidth (sm/md/lg/xl/fluid), centered        |
| Stack      | Vertical/horizontal flex, gap, align          |
| Grid       | CSS Grid, columns (number or template string) |

---

## Scripts

```bash
npx nx test react-ui         # Run 230+ tests
npx nx storybook react-ui    # Launch Storybook at localhost:6006
```

---

## Storybook

Components are organized by category:

- **Atoms/** — Typography, Input, Checkbox, Radio, Switch, Avatar, Badge, Tag, Divider, Spinner, Tooltip, Link, Skeleton
- **Molecules/** — InputField, SearchBar, Tabs, Accordion, Alert, Toast, Pagination, RadioGroup, CheckboxGroup
- **Organisms/** — Modal, DropdownMenu, Form, Table
- **Layout/** — Breadcrumb, Header, Container, Stack, Grid
- **Calendar/** — Popover, DateCalendar, MultiSectionDigitalClock, DatePickerField, DateRangePickerField, TimePickerField, DateTimePickerField

Global decorator wraps all stories in `ThemeProvider` with light/dark toggle.

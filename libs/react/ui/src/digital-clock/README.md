# MultiSectionDigitalClock

Scrollable column-based digital time selector with hours, minutes, and optional AM/PM sections.

## Usage

```tsx
import { MultiSectionDigitalClock } from '@mas/react-ui';

const [hours, setHours] = useState(9);
const [minutes, setMinutes] = useState(0);
const [ampm, setAmPm] = useState<'AM' | 'PM'>('AM');

<MultiSectionDigitalClock
  hours={hours}
  minutes={minutes}
  ampm={ampm}
  onChange={(h, m, a) => {
    setHours(h);
    setMinutes(m);
    if (a) setAmPm(a);
  }}
/>;
```

## 12-hour mode

```tsx
<MultiSectionDigitalClock
  hours={hours} minutes={minutes} ampm={ampm}
  onChange={...}
  use12Hours
/>
```

## Props

| Prop          | Type                    | Default | Description                                |
| ------------- | ----------------------- | ------- | ------------------------------------------ |
| `hours`       | `number`                | —       | **Required.** Current hours (0–23 or 1–12) |
| `minutes`     | `number`                | —       | **Required.** Current minutes (0–59)       |
| `ampm`        | `'AM' \| 'PM'`          | `'AM'`  | AM/PM selection (use12Hours only)          |
| `onChange`    | `(h, m, ampm?) => void` | —       | **Required.** Called on any change         |
| `use12Hours`  | `boolean`               | `false` | Enable 12-hour mode with AM/PM column      |
| `minutesStep` | `number`                | `1`     | Minute interval (e.g. 15 = 0/15/30/45)     |
| `disabled`    | `boolean`               | `false` | Disables all interaction                   |

## Behaviour

- Each column scrolls independently with `scroll-snap-type: y mandatory`
- Auto-scrolls to the selected item on mount
- 24h mode: hours 00–23; 12h mode: hours 01–12 + AM/PM column
- `minutesStep` reduces the visible minute options (e.g. `minutesStep=15` → 4 options)
- The `onChange` callback returns the 24h hour value regardless of display mode

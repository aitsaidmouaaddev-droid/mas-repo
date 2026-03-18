# DateCalendar

Headless calendar component supporting single-date and date-range selection. Provides three views: days, months, years.

## Usage

```tsx
import { DateCalendar } from '@mas/react-ui';

const [value, setValue] = useState<Date | null>(null);
const [month, setMonth] = useState(new Date());
const [view, setView] = useState<'days' | 'months' | 'years'>('days');

<DateCalendar
  value={value}
  onChange={setValue}
  month={month}
  onMonthChange={setMonth}
  view={view}
  onViewChange={setView}
/>;
```

## Range selection

```tsx
const [start, setStart] = useState<Date | null>(null);
const [end, setEnd] = useState<Date | null>(null);

const handleRange = (d: Date) => {
  if (!start) {
    setStart(d);
    setEnd(null);
  } else {
    setEnd(d);
  }
};

<DateCalendar
  selectionMode="range"
  rangeStart={start}
  rangeEnd={end}
  onRangeChange={handleRange}
  month={month}
  onMonthChange={setMonth}
  view={view}
  onViewChange={setView}
/>;
```

## Props

| Prop            | Type                            | Default    | Description                                      |
| --------------- | ------------------------------- | ---------- | ------------------------------------------------ |
| `value`         | `Date \| null`                  | —          | Selected date (single mode)                      |
| `onChange`      | `(d: Date) => void`             | —          | Called on day click in single mode               |
| `rangeStart`    | `Date \| null`                  | —          | Range start (range mode)                         |
| `rangeEnd`      | `Date \| null`                  | —          | Range end (range mode)                           |
| `onRangeChange` | `(d: Date) => void`             | —          | Called on day click in range mode                |
| `month`         | `Date`                          | —          | **Required.** Currently displayed month          |
| `onMonthChange` | `(m: Date) => void`             | —          | **Required.** Called when month navigation fires |
| `selectionMode` | `'single' \| 'range'`           | `'single'` | Selection behaviour                              |
| `minDate`       | `Date`                          | —          | Earliest selectable date                         |
| `maxDate`       | `Date`                          | —          | Latest selectable date                           |
| `weekStartsOn`  | `0 \| 1`                        | `1`        | `0` = Sunday, `1` = Monday                       |
| `view`          | `'days' \| 'months' \| 'years'` | `'days'`   | Controlled view state                            |
| `onViewChange`  | `(v) => void`                   | —          | Called when user drills down/up between views    |

## Views

- **Days** — month grid with prev/next navigation. Click month name → months view; click year → years view.
- **Months** — 3×4 grid of months. Click a month → back to days view.
- **Years** — scrollable list of years (±100/+20 from today by default). Click a year → months view.

Range end and start cells get distinct highlight classes (`dayCellRangeStart`, `dayCellRangeEnd`, `dayCellInRange`) for custom styling.

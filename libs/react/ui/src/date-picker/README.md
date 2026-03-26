# DatePickerField / DateRangePickerField

Form-compatible date and date-range picker fields backed by `DateCalendar`.

---

## DatePickerField

Single date picker with `InputField`-compatible API.

### Usage

```tsx
import { DatePickerField } from '@mas/react-ui';

const [value, setValue] = useState<Date | null>(null);

<DatePickerField
  label="Date of birth"
  value={value}
  onChange={setValue}
  displayFormat="dd/MM/yyyy"
  clearable
/>;
```

### Props

| Prop            | Type                              | Default        | Description                               |
| --------------- | --------------------------------- | -------------- | ----------------------------------------- |
| `value`         | `Date \| null`                    | —              | Selected date                             |
| `onChange`      | `(d: Date \| null) => void`       | —              | Called on selection or clear              |
| `label`         | `string`                          | —              | Field label                               |
| `hint`          | `string`                          | —              | Hint text below the field                 |
| `errorText`     | `string`                          | —              | Error text (replaces hint)                |
| `placeholder`   | `string`                          | `'DD/MM/YYYY'` | Input placeholder                         |
| `disabled`      | `boolean`                         | `false`        | Disables interaction                      |
| `minDate`       | `Date`                            | —              | Earliest selectable date                  |
| `maxDate`       | `Date`                            | —              | Latest selectable date                    |
| `displayFormat` | `string`                          | `'dd/MM/yyyy'` | date-fns format string for display        |
| `variant`       | `'auto' \| 'desktop' \| 'mobile'` | `'auto'`       | `auto` detects pointer type               |
| `weekStartsOn`  | `0 \| 1`                          | `1`            | Week start day                            |
| `clearable`     | `boolean`                         | `true`         | Show clear button when a date is selected |
| `testId`        | `string`                          | —              | `data-testid` on wrapper                  |

### Exports

| Component                | Description                                |
| ------------------------ | ------------------------------------------ |
| `DatePickerField`        | Auto-detects device type (default)         |
| `DesktopDatePickerField` | Always uses popover                        |
| `MobileDatePickerField`  | Always uses bottom-sheet modal             |
| `StaticDatePickerField`  | Calendar always visible — no trigger input |

---

## DateRangePickerField

Two-field picker (start + end) sharing a single calendar with range highlighting.

### Usage

```tsx
import { DateRangePickerField, type DateRange } from '@mas/react-ui';

const [range, setRange] = useState<DateRange>({ start: null, end: null });

<DateRangePickerField
  value={range}
  onChange={setRange}
  startLabel="Check-in"
  endLabel="Check-out"
/>;
```

### Two-step selection

1. Click the start field → click a day = sets start date, clears end
2. Click another day = sets end date (if end < start, values are swapped automatically)

### Props

Same as `DatePickerField` plus:

| Prop         | Type                     | Default                 | Description               |
| ------------ | ------------------------ | ----------------------- | ------------------------- |
| `value`      | `DateRange`              | `{start:null,end:null}` | Range value               |
| `onChange`   | `(r: DateRange) => void` | —                       | Called on change or clear |
| `startLabel` | `string`                 | `'Start date'`          | Label for start input     |
| `endLabel`   | `string`                 | `'End date'`            | Label for end input       |

### `DateRange` type

```ts
interface DateRange {
  start: Date | null;
  end: Date | null;
}
```

# DateTimePickerField

Combined date + time picker: `DateCalendar` on top, `MultiSectionDigitalClock` below, in a single popover or bottom sheet.

## Usage

```tsx
import { DateTimePickerField } from '@mas/react-ui';

const [value, setValue] = useState<Date | null>(null);

<DateTimePickerField label="Event date & time" value={value} onChange={setValue} />;
```

## 12-hour mode

```tsx
<DateTimePickerField
  label="Appointment"
  value={value}
  onChange={setValue}
  use12Hours
  displayFormat="dd/MM/yyyy hh:mm aa"
/>
```

## Props

| Prop            | Type                              | Default              | Description                           |
| --------------- | --------------------------------- | -------------------- | ------------------------------------- |
| `value`         | `Date \| null`                    | —                    | Selected date+time                    |
| `onChange`      | `(d: Date \| null) => void`       | —                    | Called on selection or clear          |
| `label`         | `string`                          | —                    | Field label                           |
| `hint`          | `string`                          | —                    | Hint text below the field             |
| `errorText`     | `string`                          | —                    | Error text (replaces hint)            |
| `placeholder`   | `string`                          | `'DD/MM/YYYY HH:mm'` | Input placeholder                     |
| `disabled`      | `boolean`                         | `false`              | Disables interaction                  |
| `minDate`       | `Date`                            | —                    | Earliest selectable date              |
| `maxDate`       | `Date`                            | —                    | Latest selectable date                |
| `displayFormat` | `string`                          | `'dd/MM/yyyy HH:mm'` | date-fns format string                |
| `use12Hours`    | `boolean`                         | `false`              | 12-hour mode with AM/PM               |
| `minutesStep`   | `number`                          | `1`                  | Minute interval                       |
| `weekStartsOn`  | `0 \| 1`                          | `1`                  | Week start day                        |
| `clearable`     | `boolean`                         | `true`               | Show clear button when a value is set |
| `variant`       | `'auto' \| 'desktop' \| 'mobile'` | `'auto'`             | Picker presentation                   |
| `testId`        | `string`                          | —                    | `data-testid` on wrapper              |

## Exports

| Component                    | Description                                |
| ---------------------------- | ------------------------------------------ |
| `DateTimePickerField`        | Auto-detects device type (default)         |
| `DesktopDateTimePickerField` | Always uses popover                        |
| `MobileDateTimePickerField`  | Always uses bottom-sheet modal             |
| `StaticDateTimePickerField`  | Calendar+clock always visible — no trigger |

## Behaviour

- Selecting a date preserves the currently selected time, and vice versa
- When `value` is `null`, selecting a date creates a `Date` at midnight; time then adjusts from there
- Date and time changes fire `onChange` independently so the picker stays open until the user dismisses it

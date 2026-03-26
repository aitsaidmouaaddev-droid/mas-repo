# TimePickerField

Form-compatible time picker backed by `MultiSectionDigitalClock`.

## Usage

```tsx
import { TimePickerField } from '@mas/react-ui';

const [value, setValue] = useState<Date | null>(null);

<TimePickerField label="Start time" value={value} onChange={setValue} />;
```

## 12-hour mode

```tsx
<TimePickerField label="Meeting time" value={value} onChange={setValue} use12Hours />
```

## Custom minute steps

```tsx
<TimePickerField label="Slot" value={value} onChange={setValue} minutesStep={15} />
```

## Props

| Prop          | Type                              | Default   | Description                            |
| ------------- | --------------------------------- | --------- | -------------------------------------- |
| `value`       | `Date \| null`                    | —         | Selected time (only time part is used) |
| `onChange`    | `(d: Date \| null) => void`       | —         | Called on selection or clear           |
| `label`       | `string`                          | —         | Field label                            |
| `hint`        | `string`                          | —         | Hint text below the field              |
| `errorText`   | `string`                          | —         | Error text (replaces hint)             |
| `placeholder` | `string`                          | `'HH:mm'` | Input placeholder                      |
| `disabled`    | `boolean`                         | `false`   | Disables interaction                   |
| `use12Hours`  | `boolean`                         | `false`   | 12-hour mode with AM/PM                |
| `minutesStep` | `number`                          | `1`       | Minute interval                        |
| `clearable`   | `boolean`                         | `true`    | Show clear button when a time is set   |
| `variant`     | `'auto' \| 'desktop' \| 'mobile'` | `'auto'`  | Picker presentation                    |
| `testId`      | `string`                          | —         | `data-testid` on wrapper               |

## Exports

| Component                | Description                             |
| ------------------------ | --------------------------------------- |
| `TimePickerField`        | Auto-detects device type (default)      |
| `DesktopTimePickerField` | Always uses popover                     |
| `MobileTimePickerField`  | Always uses bottom-sheet modal          |
| `StaticTimePickerField`  | Clock always visible — no trigger input |

## Behaviour

The `value` is a full `Date` object. Only the hours/minutes are displayed and edited; the date part is preserved when changing time. When `value` is `null`, selecting a time creates a new `Date` with today's date at the selected time.

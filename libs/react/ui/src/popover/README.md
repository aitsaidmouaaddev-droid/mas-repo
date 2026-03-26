# Popover

Portal-based positioned overlay anchored to any DOM element.

## Usage

```tsx
import { Popover } from '@mas/react-ui';

const [open, setOpen] = useState(false);
const anchorRef = useRef<HTMLDivElement>(null);

<div ref={anchorRef}>
  <Button onClick={() => setOpen(true)}>Open</Button>
</div>

<Popover open={open} onClose={() => setOpen(false)} anchorEl={anchorRef.current}>
  <div>Content here</div>
</Popover>
```

## Props

| Prop        | Type                  | Default          | Description                            |
| ----------- | --------------------- | ---------------- | -------------------------------------- |
| `open`      | `boolean`             | —                | Controls visibility                    |
| `onClose`   | `() => void`          | —                | Called on outside click or Escape key  |
| `anchorEl`  | `HTMLElement \| null` | —                | DOM element the popover is anchored to |
| `children`  | `ReactNode`           | —                | Popover content                        |
| `placement` | `PopoverPlacement`    | `'bottom-start'` | Position relative to anchor            |

## Placement options

`'bottom-start'` | `'bottom-end'` | `'bottom'` | `'top-start'` | `'top-end'` | `'top'`

## Behaviour

- Renders into `document.body` via `createPortal`
- Tracks position on scroll and resize
- Clamps to viewport — never overflows the screen
- Closes on click outside (mousedown outside both popover and anchor)
- Closes on `Escape` key

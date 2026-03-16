import { FiX } from 'react-icons/fi';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './tag.module.scss';
import { withSkeleton } from '../skeletons/withSkeleton';
import TagSkeleton from '../skeletons/TagSkeleton';

/**
 * Props for the {@link Tag} component.
 *
 * @property label - Text displayed inside the tag
 * @property onRemove - Callback fired when the remove button is clicked; omit to hide the button
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Custom `data-testid` attribute
 * @property className - Additional CSS class name
 */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  onRemove?: () => void;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}



/**
 * Compact label chip with an optional dismiss button.
 *
 * @param props - {@link TagProps}
 * @returns A styled span containing the label and an optional remove button
 *
 * @example
 * ```tsx
 * <Tag label="React" onRemove={() => removeTag('React')} />
 * ```
 */
export default function Tag({
  label,
  variant,
  onRemove,
  classOverride,
  styleOverride,
  testId,
  className,
  ...rest
}: TagProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  return (
    <span
      className={clsx(s.className.base, variant && s.className[variant], className)}
      style={s.style.base}
      data-testid={testId}
      {...rest}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          className={s.className.close}
          style={s.style.close}
          onClick={onRemove}
          aria-label={`Remove ${label}`}
        >
          <FiX size={14} />
        </button>
      )}
    </span>
  );
}

export const TagWithSkeleton = withSkeleton(Tag, TagSkeleton);


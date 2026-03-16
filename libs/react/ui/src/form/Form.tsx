import type { FormEvent, ReactNode } from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './form.module.scss';
import FormSkeleton from '../skeletons/FormSkeleton';
import { withSkeleton } from '../skeletons/withSkeleton';

/**
 * Props for the {@link Form} component.
 *
 * @property children - Form fields and content rendered inside the form.
 * @property onSubmit - Callback fired on form submission (default prevented automatically).
 * @property actions - Optional node (e.g. submit/cancel buttons) rendered in an actions bar.
 * @property classOverride - SCSS class-name overrides keyed by slot.
 * @property styleOverride - Inline style overrides keyed by slot.
 * @property testId - Value forwarded to `data-testid` for testing.
 * @property className - Additional CSS class applied to the `<form>` element.
 */
export interface FormProps {
  children: ReactNode;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  actions?: ReactNode;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * A styled form wrapper that prevents default submission and provides an actions slot.
 *
 * Wraps children in a `<form>` element, calls `e.preventDefault()` automatically,
 * and renders an optional actions bar below the form content.
 *
 * @param props - {@link FormProps}
 * @returns The rendered form element.
 *
 * @example
 * ```tsx
 * <Form onSubmit={handleSave} actions={<Button label="Save" />}>
 *   <TextInput label="Name" value={name} onChange={setName} />
 * </Form>
 * ```
 */
function Form({
  children,
  onSubmit,
  actions,
  classOverride,
  styleOverride,
  testId,
  className,
}: FormProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form
      className={clsx(s.className.base, className)}
      style={s.style.base}
      onSubmit={handleSubmit}
      data-testid={testId}
    >
      {children}
      {actions && (
        <div className={s.className.actions} style={s.style.actions}>
          {actions}
        </div>
      )}
    </form>
  );
}

export const FormWithSkeleton = withSkeleton(Form, FormSkeleton);
export default Form;

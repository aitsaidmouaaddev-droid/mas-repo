import type { ReactNode } from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './header.module.scss';
import HeaderSkeleton from '../skeletons/HeaderSkeleton';
import { withSkeleton } from '../skeletons/withSkeleton';

/**
 * Props for the {@link Header} component.
 *
 * @property left - Content rendered on the left side; falls back to `children`.
 * @property right - Content rendered on the right side.
 * @property children - Default content for the left slot when `left` is not provided.
 * @property classOverride - SCSS class overrides keyed by slot name.
 * @property styleOverride - Inline style overrides keyed by slot name.
 * @property testId - Value for the `data-testid` attribute.
 * @property className - Additional CSS class applied to the root element.
 */
export interface HeaderProps {
  left?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
  className?: string;
}

/**
 * A page or section header with left and optional right content slots.
 *
 * @param props - {@link HeaderProps}
 * @returns A `<header>` element with left/right layout.
 *
 * @example
 * ```tsx
 * <Header left={<Logo src="/logo.png" />} right={<Button>Sign In</Button>} />
 * ```
 */
function Header({
  left,
  right,
  children,
  classOverride,
  styleOverride,
  testId,
  className,
}: HeaderProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  return (
    <header className={clsx(s.className.base, className)} style={s.style.base} data-testid={testId}>
      <div className={s.className.left} style={s.style.left}>
        {left ?? children}
      </div>
      {right && (
        <div className={s.className.right} style={s.style.right}>
          {right}
        </div>
      )}
    </header>
  );
}

export const HeaderWithSkeleton = withSkeleton(Header, HeaderSkeleton);
export default Header;

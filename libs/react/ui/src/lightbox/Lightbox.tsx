import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './lightbox.module.scss';

/**
 * Props for the {@link Lightbox} component.
 *
 * @property src - Image source URL.
 * @property alt - Alt text for the image.
 * @property open - Whether the lightbox overlay is visible.
 * @property onClose - Callback invoked when the lightbox is dismissed (overlay click or Escape key).
 * @property className - Additional CSS class for the overlay element.
 * @property classOverride - SCSS class overrides keyed by slot name.
 * @property styleOverride - Inline style overrides keyed by slot name.
 * @property testId - Value for the `data-testid` attribute.
 */
export interface LightboxProps {
  src: string;
  alt?: string;
  open: boolean;
  onClose: () => void;
  className?: string;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

/**
 * A fullscreen overlay that displays an image centered on the viewport.
 *
 * Rendered via a portal to `document.body`. Closes on overlay click or
 * Escape key press. Shows a close button in the top-right corner.
 *
 * @param props - {@link LightboxProps}
 * @returns The rendered lightbox portal, or `null` when closed.
 *
 * @example
 * ```tsx
 * <Lightbox src="/photo.jpg" alt="Detail" open={isOpen} onClose={() => setOpen(false)} />
 * ```
 */
export default function Lightbox({
  src,
  alt,
  open,
  onClose,
  className,
  classOverride,
  styleOverride,
  testId,
}: LightboxProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={clsx(s.className.overlay, className)}
      style={s.style.overlay}
      data-testid={testId}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className={s.className.close}
        style={s.style.close}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close lightbox"
      >
        &times;
      </button>
      <img
        src={src}
        alt={alt ?? ''}
        className={s.className.image}
        style={s.style.image}
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body,
  );
}

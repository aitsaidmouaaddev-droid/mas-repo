import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './modal.module.scss';
import ModalSkeleton from '../skeletons/ModalSkeleton';
import { withSkeleton } from '../skeletons/withSkeleton';

/**
 * Props for the {@link Modal} component.
 *
 * @property open - Whether the modal is visible.
 * @property onClose - Callback invoked when the modal is dismissed (overlay click or Escape key).
 * @property title - Optional heading rendered in the modal header with a close button.
 * @property children - Primary modal content.
 * @property footer - Optional footer content (e.g. action buttons).
 * @property classOverride - SCSS class overrides keyed by slot name.
 * @property styleOverride - Inline style overrides keyed by slot name.
 * @property testId - Value for the `data-testid` attribute.
 */
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

/**
 * An accessible modal dialog rendered via a React portal, with overlay-click and Escape-key dismissal.
 *
 * @param props - {@link ModalProps}
 * @returns A portal-mounted dialog overlay, or `null` when closed.
 *
 * @example
 * ```tsx
 * <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Confirm">
 *   <p>Are you sure?</p>
 * </Modal>
 * ```
 */
function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  classOverride,
  styleOverride,
  testId,
}: ModalProps) {
  const s = useStyles(scss, classOverride, styleOverride);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={s.className.overlay}
      style={s.style.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-testid={testId}
    >
      <div className={s.className.modal} style={s.style.modal} role="dialog" aria-modal="true">
        {title && (
          <div className={s.className.header} style={s.style.header}>
            <h2 className={s.className.title} style={s.style.title}>
              {title}
            </h2>
            <button
              type="button"
              className={s.className.close}
              style={s.style.close}
              onClick={onClose}
              aria-label="Close modal"
            >
              <FiX size={20} />
            </button>
          </div>
        )}
        <div className={s.className.body} style={s.style.body}>
          {children}
        </div>
        {footer && (
          <div className={s.className.footer} style={s.style.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export const ModalWithSkeleton = withSkeleton(Modal, ModalSkeleton);
export default Modal;

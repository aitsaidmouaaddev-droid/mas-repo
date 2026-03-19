import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import scss from './popover.module.scss';

export type PopoverPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'bottom'
  | 'top-start'
  | 'top-end'
  | 'top';

export interface PopoverProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  children: ReactNode;
  placement?: PopoverPlacement;
  /** When true, the popover width matches the anchor element's width. */
  matchAnchorWidth?: boolean;
}

const HIDDEN: React.CSSProperties = {
  position: 'fixed',
  top: -9999,
  left: -9999,
  visibility: 'hidden',
  pointerEvents: 'none',
};

export function Popover({
  open,
  onClose,
  anchorEl,
  children,
  placement = 'bottom-start',
  matchAnchorWidth = false,
}: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>(HIDDEN);

  useLayoutEffect(() => {
    if (!open || !anchorEl) {
      setStyle(HIDDEN);
      return;
    }

    const position = () => {
      if (!anchorEl || !popoverRef.current) return;
      const rect = anchorEl.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const popW = popoverRef.current.offsetWidth;
      const popH = popoverRef.current.offsetHeight;

      const isTop = placement.startsWith('top');
      const isEnd = placement.endsWith('end');
      const isCenter = placement === 'top' || placement === 'bottom';

      let top = isTop ? rect.top - popH - 8 : rect.bottom + 8;
      let left = isEnd
        ? rect.right - popW
        : isCenter
          ? rect.left + rect.width / 2 - popW / 2
          : rect.left;

      // Clamp to viewport
      if (left + popW > vw - 8) left = vw - popW - 8;
      if (left < 8) left = 8;
      if (top + popH > vh - 8) top = rect.top - popH - 8;
      if (top < 8) top = 8;

      setStyle({
        position: 'fixed',
        top,
        left,
        visibility: 'visible',
        ...(matchAnchorWidth && { width: rect.width }),
      });
    };

    position();
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);
    return () => {
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', position, true);
    };
  }, [open, anchorEl, placement, matchAnchorWidth]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorEl &&
        !anchorEl.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [open, onClose, anchorEl]);

  // Portal is always mounted so popoverRef is valid when useLayoutEffect fires.
  // When closed: element is offscreen + invisible + non-interactive.
  return createPortal(
    <div
      ref={popoverRef}
      className={scss.popover}
      style={open ? style : HIDDEN}
    >
      {open && children}
    </div>,
    document.body,
  );
}

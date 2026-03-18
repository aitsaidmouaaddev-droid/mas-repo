import { useEffect, useRef, useState, type ReactNode } from 'react';
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
}

export function Popover({
  open,
  onClose,
  anchorEl,
  children,
  placement = 'bottom-start',
}: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!open || !anchorEl) return;

    const position = () => {
      if (!anchorEl || !popoverRef.current) return;
      const rect = anchorEl.getBoundingClientRect();
      const pop = popoverRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let top: number;
      let left: number;

      const isTop = placement.startsWith('top');
      const isEnd = placement.endsWith('end');
      const isCenter = placement === 'top' || placement === 'bottom';

      top = isTop ? rect.top - pop.height - 8 : rect.bottom + 8;
      left = isEnd
        ? rect.right - pop.width
        : isCenter
          ? rect.left + rect.width / 2 - pop.width / 2
          : rect.left;

      // Clamp to viewport
      if (left + pop.width > vw - 8) left = vw - pop.width - 8;
      if (left < 8) left = 8;
      if (top + pop.height > vh - 8) top = rect.top - pop.height - 8;
      if (top < 8) top = 8;

      setStyle({ top, left, position: 'fixed' });
    };

    position();
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);
    return () => {
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', position, true);
    };
  }, [open, anchorEl, placement]);

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

  if (!open) return null;

  return createPortal(
    <div ref={popoverRef} className={scss.popover} style={style}>
      {children}
    </div>,
    document.body,
  );
}

import { useRef, useState, useLayoutEffect, useCallback } from 'react';
import scss from './seeMore.module.scss';

export interface SeeMoreProps {
  /** The full text content to display */
  text: string;
  /** Maximum height in pixels before truncation kicks in. @default 80 */
  maxHeight?: number;
  /** Label for the expand trigger. @default 'See more' */
  moreLabel?: string;
  /** Label for the collapse trigger. @default 'See less' */
  lessLabel?: string;
  /** Extra class for the root element */
  className?: string;
}

export default function SeeMore({
  text,
  maxHeight = 80,
  moreLabel = 'See more',
  lessLabel = 'See less',
  className,
}: SeeMoreProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [needsClamping, setNeedsClamping] = useState(false);

  const check = useCallback(() => {
    const el = textRef.current;
    if (!el) return;
    // Save current inline maxHeight so we can restore it after measuring
    const prev = el.style.maxHeight;
    el.style.maxHeight = 'none';
    const full = el.scrollHeight;
    el.style.maxHeight = prev; // restore — not '', which would wipe React's inline value
    setNeedsClamping(full > maxHeight);
  }, [maxHeight]);

  useLayoutEffect(() => {
    check();
    const ro = new ResizeObserver(check);
    if (textRef.current) ro.observe(textRef.current);
    return () => ro.disconnect();
  }, [check]);

  return (
    <div className={[scss.root, className].filter(Boolean).join(' ')}>
      <span
        ref={textRef}
        className={scss.text}
        style={
          !expanded && needsClamping
            ? { maxHeight, overflow: 'hidden', display: 'block' }
            : undefined
        }
      >
        {text}
      </span>
      {needsClamping && (
        <button type="button" className={scss.trigger} onClick={() => setExpanded((e) => !e)}>
          {expanded ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  );
}

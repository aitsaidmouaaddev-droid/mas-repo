import { useRef, useState, useEffect, useCallback } from 'react';
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

/**
 * Clamps text to a maximum container height and reveals it on demand.
 *
 * The component measures whether the full text overflows `maxHeight`.
 * If it does, it binary-searches for the longest prefix that fits,
 * appends "… See more", and expands to the full text on click.
 *
 * @example
 * ```tsx
 * <SeeMore text="A very long description…" maxHeight={72} />
 * ```
 */
export default function SeeMore({
  text,
  maxHeight = 80,
  moreLabel = 'See more',
  lessLabel = 'See less',
  className,
}: SeeMoreProps) {
  const probeRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState<string | null>(null);

  /** Binary-search the longest prefix of `text` that fits inside maxHeight. */
  const measure = useCallback(() => {
    const el = probeRef.current;
    if (!el) return;

    // Reset to full text and check if truncation is even needed
    el.textContent = text;
    if (el.scrollHeight <= maxHeight) {
      setTruncated(null);
      return;
    }

    // Suffix to reserve space for: "… See more"
    const suffix = '\u2026';
    let lo = 0;
    let hi = text.length;
    let best = 0;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      el.textContent = text.slice(0, mid) + suffix;
      if (el.scrollHeight <= maxHeight) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    setTruncated(text.slice(0, Math.max(best - 1, 0)));
  }, [text, maxHeight]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (probeRef.current) ro.observe(probeRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const needsClamping = truncated !== null;

  return (
    <div className={[scss.root, className].filter(Boolean).join(' ')}>
      {/* Hidden probe element used for measurements — same styles as visible text */}
      <div ref={probeRef} className={scss.probe} aria-hidden="true" />

      <span className={scss.text}>
        {expanded || !needsClamping ? (
          <>
            {text}
            {needsClamping && (
              <>
                {' '}
                <button type="button" className={scss.trigger} onClick={() => setExpanded(false)}>
                  {lessLabel}
                </button>
              </>
            )}
          </>
        ) : (
          <>
            {truncated}
            {'… '}
            <button type="button" className={scss.trigger} onClick={() => setExpanded(true)}>
              {moreLabel}
            </button>
          </>
        )}
      </span>
    </div>
  );
}

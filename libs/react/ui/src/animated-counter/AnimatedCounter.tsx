import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './animatedCounter.module.scss';

/**
 * Props for the {@link AnimatedCounter} component.
 *
 * @property end - Target number to count up to
 * @property duration - Animation duration in milliseconds @default 2000
 * @property prefix - Text displayed before the number (e.g. "$")
 * @property suffix - Text displayed after the number (e.g. "+")
 * @property className - Additional CSS class for the root element
 * @property classOverride - CSS-module class overrides
 * @property styleOverride - Inline style overrides
 * @property testId - Value for `data-testid`
 */
export interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

/** Ease-out quadratic: decelerates towards the end. */
function easeOutQuad(t: number): number {
  return t * (2 - t);
}

/**
 * A number that animates from 0 to a target value when it scrolls into view.
 *
 * Uses `IntersectionObserver` to detect visibility and `requestAnimationFrame`
 * for a smooth count-up animation with easeOutQuad easing. Only triggers once.
 *
 * @param props - {@link AnimatedCounterProps}
 * @returns The rendered counter element
 *
 * @example
 * ```tsx
 * <AnimatedCounter end={1500} suffix="+" duration={2500} />
 * ```
 */
export default function AnimatedCounter({
  end,
  duration = 2000,
  prefix,
  suffix,
  className,
  classOverride,
  styleOverride,
  testId,
}: AnimatedCounterProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const [current, setCurrent] = useState(0);
  const elRef = useRef<HTMLSpanElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasAnimatedRef = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);

      setCurrent(Math.round(eased * end));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [end, duration]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animate();
            observerRef.current?.disconnect();
          }
        }
      },
      { threshold: 0.1 },
    );

    observerRef.current.observe(el);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [animate]);

  return (
    <span
      ref={elRef}
      className={clsx(s.className.counter, className)}
      style={s.style.counter}
      data-testid={testId}
    >
      {prefix && (
        <span className={s.className.prefix} style={s.style.prefix}>
          {prefix}
        </span>
      )}
      <span className={s.className.value} style={s.style.value}>
        {current}
      </span>
      {suffix && (
        <span className={s.className.suffix} style={s.style.suffix}>
          {suffix}
        </span>
      )}
    </span>
  );
}

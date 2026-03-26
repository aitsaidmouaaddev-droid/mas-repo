import React, { useState, useEffect, useCallback, Children } from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './carousel.module.scss';

/**
 * Props for the {@link Carousel} component.
 *
 * @property children - Each direct child is rendered as a slide.
 * @property autoplay - When true, auto-advances slides at the given interval. @default false
 * @property autoplayInterval - Milliseconds between auto-advance transitions. @default 5000
 * @property loop - When true, wraps from the last slide back to the first. @default true
 * @property className - Additional CSS class for the root element.
 * @property classOverride - SCSS class overrides keyed by slot name.
 * @property styleOverride - Inline style overrides keyed by slot name.
 * @property testId - Value for the `data-testid` attribute.
 */
export interface CarouselProps {
  children: React.ReactNode;
  autoplay?: boolean;
  autoplayInterval?: number;
  loop?: boolean;
  className?: string;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

/**
 * A simple slide carousel with pagination dots.
 *
 * Renders each direct child as a slide, displaying one at a time with a
 * CSS transform transition. Supports optional autoplay, looping, and
 * clickable pagination dots.
 *
 * @param props - {@link CarouselProps}
 * @returns The rendered carousel element.
 *
 * @example
 * ```tsx
 * <Carousel autoplay loop>
 *   <img src="/slide1.jpg" alt="Slide 1" />
 *   <img src="/slide2.jpg" alt="Slide 2" />
 *   <img src="/slide3.jpg" alt="Slide 3" />
 * </Carousel>
 * ```
 */
export default function Carousel({
  children,
  autoplay = false,
  autoplayInterval = 5000,
  loop = true,
  className,
  classOverride,
  styleOverride,
  testId,
}: CarouselProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const slides = Children.toArray(children);
  const count = slides.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      if (loop) {
        setCurrentIndex(((index % count) + count) % count);
      } else {
        setCurrentIndex(Math.max(0, Math.min(index, count - 1)));
      }
    },
    [count, loop],
  );

  useEffect(() => {
    if (!autoplay || isHovered || count <= 1) return;

    const timer = setInterval(() => {
      goTo(currentIndex + 1);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [autoplay, autoplayInterval, currentIndex, isHovered, count, goTo]);

  return (
    <div
      className={clsx(s.className.carousel, className)}
      style={s.style.carousel}
      data-testid={testId}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={s.className.track}
        style={{
          ...s.style.track,
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {slides.map((slide, i) => (
          <div key={i} className={s.className.slide} style={s.style.slide}>
            {slide}
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className={s.className.dots} style={s.style.dots}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={clsx(s.className.dot, i === currentIndex && s.className.dotActive)}
              style={{ ...s.style.dot, ...(i === currentIndex ? s.style.dotActive : undefined) }}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

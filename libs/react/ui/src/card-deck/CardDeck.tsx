import { useState, useEffect, useCallback, useRef } from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './card-deck.module.scss';

/**
 * A single card in the deck.
 *
 * @property key   - Unique identifier used as the React key.
 * @property image - URL of the image to display.
 * @property title - Optional caption shown below the image.
 */
export interface CardDeckItem {
  key: string;
  image: string;
  title?: string;
}

/**
 * Props for the {@link CardDeck} component.
 *
 * @property items            - Ordered array of cards to display.
 * @property autoplay         - Auto-advance the deck at `autoplayInterval`. @default false
 * @property autoplayInterval - Milliseconds between auto-advances. @default 3000
 * @property loop             - Wrap back to first card after the last. @default true
 * @property className        - Additional CSS class for the root element.
 * @property classOverride    - SCSS class overrides keyed by slot name.
 * @property styleOverride    - Inline style overrides keyed by slot name.
 * @property testId           - Value for the `data-testid` attribute.
 */
export interface CardDeckProps {
  items: CardDeckItem[];
  autoplay?: boolean;
  autoplayInterval?: number;
  loop?: boolean;
  className?: string;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

const STACK_SIZE = 3;
const EXIT_MS = 420;

/**
 * A stacked card deck that shows up to three cards layered behind each other.
 *
 * The top card can be clicked to advance. Supports autoplay and looping.
 * Cards behind the active one are slightly rotated and scaled to give a
 * physical deck feel.
 *
 * @param props - {@link CardDeckProps}
 * @returns The rendered card deck element.
 *
 * @example
 * ```tsx
 * <CardDeck
 *   autoplay
 *   autoplayInterval={3000}
 *   items={[
 *     { key: 'a', image: '/img/a.png', title: 'App A' },
 *     { key: 'b', image: '/img/b.png', title: 'App B' },
 *     { key: 'c', image: '/img/c.png', title: 'App C' },
 *   ]}
 * />
 * ```
 */
export default function CardDeck({
  items,
  autoplay = false,
  autoplayInterval = 3000,
  loop = true,
  className,
  classOverride,
  styleOverride,
  testId,
}: CardDeckProps) {
  const s = useStyles(scss, classOverride, styleOverride);
  const [topIndex, setTopIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const busy = useRef(false);

  const advance = useCallback(() => {
    if (busy.current) return;
    if (!loop && topIndex >= items.length - 1) return;
    busy.current = true;
    setIsExiting(true);
    setTimeout(() => {
      setTopIndex((i) => (i + 1) % items.length);
      setIsExiting(false);
      busy.current = false;
    }, EXIT_MS);
  }, [loop, topIndex, items.length]);

  useEffect(() => {
    if (!autoplay || items.length <= 1) return;
    const id = setInterval(advance, autoplayInterval);
    return () => clearInterval(id);
  }, [autoplay, autoplayInterval, advance]);

  const visibleCount = Math.min(STACK_SIZE, items.length);

  // Render back→front so z-index stacking is correct
  // i=0 → stackPos=2 (back), i=last → stackPos=0 (top)
  const cards = Array.from({ length: visibleCount }, (_, i) => {
    const stackPos = visibleCount - 1 - i; // 2=back, 1=middle, 0=top
    const itemIndex = (topIndex + stackPos) % items.length;
    return { item: items[itemIndex], stackPos };
  });

  return (
    <div className={clsx(s.className.root, className)} style={s.style.root} data-testid={testId}>
      <div className={s.className.stack} style={s.style.stack}>
        {cards.map(({ item, stackPos }) => {
          const isTop = stackPos === 0;
          const isMiddle = stackPos === 1;
          const isBack = stackPos === 2;

          return (
            <div
              key={item.key}
              className={clsx(
                s.className.card,
                // During exit: top flies away, middle promotes to top, back to middle
                isTop && isExiting && s.className.cardExiting,
                isTop && !isExiting && s.className.cardTop,
                isMiddle && isExiting && s.className.cardTop,
                isMiddle && !isExiting && s.className.cardMiddle,
                isBack && isExiting && s.className.cardMiddle,
                isBack && !isExiting && s.className.cardBack,
              )}
              style={s.style.card}
              onClick={isTop && !isExiting ? advance : undefined}
              role={isTop && !isExiting ? 'button' : undefined}
              tabIndex={isTop && !isExiting ? 0 : undefined}
              onKeyDown={isTop && !isExiting ? (e) => e.key === 'Enter' && advance() : undefined}
              aria-label={
                isTop && !isExiting
                  ? `View ${item.title ?? `card ${topIndex + 1}`} — click for next`
                  : undefined
              }
            >
              <img
                src={item.image}
                alt={item.title ?? ''}
                className={s.className.image}
                style={s.style.image}
              />
              {item.title && (
                <p className={s.className.title} style={s.style.title}>
                  {item.title}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {items.length > 1 && (
        <div className={s.className.dots} style={s.style.dots} role="tablist">
          {items.map((item, i) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={i === topIndex}
              aria-label={`Go to card ${i + 1}${item.title ? `: ${item.title}` : ''}`}
              className={clsx(s.className.dot, i === topIndex && s.className.dotActive)}
              style={{
                ...s.style.dot,
                ...(i === topIndex ? s.style.dotActive : undefined),
              }}
              onClick={() => {
                if (i === topIndex || busy.current) return;
                busy.current = true;
                setIsExiting(true);
                setTimeout(() => {
                  setTopIndex(i);
                  setIsExiting(false);
                  busy.current = false;
                }, EXIT_MS);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

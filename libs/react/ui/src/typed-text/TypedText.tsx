import { useState, useEffect } from 'react';
import clsx from 'clsx';
import useStyles from '../useStyles';
import type { ClassOverride, StyleOverride } from '../useStyles';
import scss from './typedText.module.scss';

/**
 * Props for the {@link TypedText} component.
 *
 * @property strings - Array of words/phrases to cycle through.
 * @property typeSpeed - Milliseconds per character typed. @default 80
 * @property deleteSpeed - Milliseconds per character deleted. @default 50
 * @property pauseDuration - Milliseconds to pause after typing a word. @default 1500
 * @property loop - Whether to loop back to the start after the last string. @default true
 * @property className - Additional CSS class applied to the wrapper.
 * @property classOverride - SCSS class overrides keyed by slot name.
 * @property styleOverride - Inline style overrides keyed by slot name.
 * @property testId - Value for the `data-testid` attribute.
 */
export interface TypedTextProps {
  strings: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
  className?: string;
  classOverride?: ClassOverride<typeof scss>;
  styleOverride?: StyleOverride<typeof scss>;
  testId?: string;
}

/**
 * Animated typing effect that cycles through a list of words/phrases.
 *
 * Displays characters one at a time with a blinking cursor, pauses, then
 * deletes before moving on to the next string.
 *
 * @param props - {@link TypedTextProps}
 * @returns An inline `<span>` with the animated text and cursor.
 *
 * @example
 * ```tsx
 * <TypedText strings={['React', 'Angular', 'Vue']} typeSpeed={60} />
 * ```
 */
export default function TypedText(props: TypedTextProps) {
  const {
    strings,
    typeSpeed = 80,
    deleteSpeed = 50,
    pauseDuration = 1500,
    loop = true,
    className,
    classOverride,
    styleOverride,
    testId,
  } = props;

  const s = useStyles(scss, classOverride, styleOverride);

  const [stringIndex, setStringIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!strings.length) return undefined;

    const currentString = strings[stringIndex];

    // Pausing after fully typing a word
    if (isPaused) {
      const timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(timeout);
    }

    // Deleting characters
    if (isDeleting) {
      if (displayText.length === 0) {
        setIsDeleting(false);
        const nextIndex = stringIndex + 1;
        if (nextIndex >= strings.length) {
          if (!loop) return undefined;
          setStringIndex(0);
        } else {
          setStringIndex(nextIndex);
        }
        return undefined;
      }
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
      }, deleteSpeed);
      return () => clearTimeout(timeout);
    }

    // Typing characters
    if (displayText.length < currentString.length) {
      const timeout = setTimeout(() => {
        setDisplayText(currentString.slice(0, displayText.length + 1));
      }, typeSpeed);
      return () => clearTimeout(timeout);
    }

    // Fully typed — pause before deleting
    setIsPaused(true);
    return undefined;
  }, [strings, stringIndex, displayText, isDeleting, isPaused, typeSpeed, deleteSpeed, pauseDuration, loop]);

  return (
    <span
      className={clsx(s.className.wrapper, className)}
      style={s.style.wrapper}
      data-testid={testId}
    >
      {displayText}
      <span className={s.className.cursor} style={s.style.cursor} aria-hidden="true" />
    </span>
  );
}

/**
 * @module FocusUnmount
 * Higher-order wrapper that unmounts expensive children (video players, cameras)
 * when the enclosing tab loses focus, and remounts them when focus returns.
 *
 * Uses `useIsFocused` from `@react-navigation/native`. Wrap any tab route that
 * renders heavy native resources with this component so they are torn down cleanly
 * when the user switches tabs.
 *
 * @example
 * ```tsx
 * import FocusUnmount from './FocusUnmount.wrapper';
 *
 * <FocusUnmount>
 *   <VideoContainer uri={uri} isActive />
 * </FocusUnmount>
 * ```
 *
 * @see {@link FocusUnmount} — the default export
 */
import React from 'react';
import { useIsFocused } from '@react-navigation/native';

/** Props for {@link FocusUnmount}. */
interface FocusUnmountProps {
  /** Content to mount/unmount based on tab focus. */
  children: React.ReactNode;
  /** Optional placeholder rendered when the tab is not focused. Defaults to `null`. */
  fallback?: React.ReactNode;
}

/**
 * Mounts `children` while the screen is focused; renders `fallback` (default `null`) when unfocused.
 *
 * @param props - {@link FocusUnmountProps}
 */
const FocusUnmount = ({ children, fallback = null }: FocusUnmountProps) => {
  const isFocused = useIsFocused();

  // Si l'écran est focus, on rend les enfants.
  // Sinon, on démonte tout (ce qui coupe les players vidéos proprement).
  return <>{isFocused ? children : fallback}</>;
};

export default FocusUnmount;

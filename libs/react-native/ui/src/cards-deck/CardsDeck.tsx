/**
 * @module CardsDeck
 * Framework-agnostic swipe card deck with animated overlays.
 *
 * Renders a front card (interactive) and an optional back card (preview).
 * Swipe left → negative X → triggers `leftAction`.
 * Swipe right → positive X → triggers `rightAction`.
 *
 * ```tsx
 * import CardsDeck from '@mas/rn/ui/cards-deck/CardsDeck';
 *
 * <CardsDeck
 *   frontItem={items[cursor]}
 *   backItem={items[cursor + 1]}
 *   renderFront={(item) => <MediaCard item={item} />}
 *   leftAction={{ color: '#F00', icon: { type: 'vector', name: 'trash' } }}
 *   rightAction={{ color: '#0F0', icon: { type: 'vector', name: 'checkmark' } }}
 *   onSwipeCommit={(dir) => handleSwipe(dir)}
 *   resetKey={items[cursor]?.id}
 * />
 * ```
 *
 * @see {@link CardsDeckProps} — full prop reference
 * @see {@link makeCardsDeckStyles} — style factory in cardsDeck.style.ts
 */
import useResultedStyle from '../useResultedStyle';
import { useTheme } from '../ThemeContext';
import Card from '../card/Card';
import Icon from '../icon/Icon';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, View, type LayoutChangeEvent } from 'react-native';
import type { CardsDeckStyles } from './cardsDeck.style';
import makeCardsDeckStyles from './cardsDeck.style';

/** Physical swipe direction. Left = negative X, Right = positive X. */
export type SwipeDirection = 'left' | 'right';

/**
 * Real-time swipe progress payload emitted during a gesture.
 *
 * @see {@link CardsDeckProps.onSwipeProgress}
 */
export interface SwipeProgressInfo {
  /** Raw horizontal displacement in pixels. */
  dx: number;
  /** Normalised progress from 0 (start) to 1 (commit threshold reached). */
  progress: number;
  /** Direction of the current gesture. */
  direction: SwipeDirection;
}

/**
 * Visual configuration for a swipe-direction action overlay.
 *
 * @see {@link CardsDeckProps.leftAction}
 * @see {@link CardsDeckProps.rightAction}
 */
export interface SwipeActionVisual {
  /** Background colour of the overlay strip. */
  color: string;
  /** Icon rendered inside the overlay. Accepts any {@link IconProps} shape. */
  icon: any;
  /** Overlay width as a fraction of the card width (capped at 0.5). */
  widthRatio?: number;
  /** Icon size in logical pixels. Defaults to 32. */
  iconSize?: number;
  /** Icon colour. Defaults to white. */
  iconColor?: string;
}

/**
 * Props for {@link CardsDeck}.
 *
 * @template TFront - Type of the front card data item.
 * @template TBack  - Type of the back card data item (defaults to `TFront`).
 */
export interface CardsDeckProps<TFront, TBack = TFront> {
  /** Partial style overrides merged on top of the base deck styles. */
  stylesOverride?: Partial<CardsDeckStyles>;
  /** Data item rendered by the front (interactive) card. */
  frontItem: TFront;
  /** Data item rendered by the back (preview) card. Omit to hide the back card. */
  backItem?: TBack;
  /** Renders the content of the front card. */
  renderFront: (item: TFront) => React.ReactNode;
  /** Renders the content of the back card. */
  renderBack?: (item: TBack) => React.ReactNode;
  /**
   * Change this value to reset the deck to the initial position (e.g. pass the current item ID).
   * Triggers a `translateX` reset and clears commit locks.
   */
  resetKey?: any;
  /**
   * Fraction of the card width at which a swipe auto-commits.
   * @defaultValue `0.3`
   */
  swipeAutoCommitThresholdRatio?: number;
  /**
   * Maximum overlay width as a fraction of the card width.
   * @defaultValue `0.3`
   */
  overlayMaxWidthRatio?: number;
  /**
   * Maximum opacity of the action overlay at commit threshold.
   * @defaultValue `0.7`
   */
  overlayMaxOpacity?: number;
  /** Called once when a swipe crosses the commit threshold. */
  onSwipeCommit?: (direction: SwipeDirection) => void;
  /** Called when the user releases without reaching the commit threshold. */
  onSwipeCancel?: () => void;
  /** Called continuously during a swipe gesture with progress info. */
  onSwipeProgress?: (info: SwipeProgressInfo) => void;
  /** Visual config for the action triggered by swiping LEFT (negative X). */
  leftAction?: SwipeActionVisual;
  /** Visual config for the action triggered by swiping RIGHT (positive X). */
  rightAction?: SwipeActionVisual;
  /**
   * When `true`, the back card scales up slightly as the front card is swiped.
   * @defaultValue `true`
   */
  backCardDepthEffect?: boolean;
  /**
   * Scale of the back card at rest (depth effect).
   * @defaultValue `0.985`
   */
  backCardScale?: number;
}

/**
 * Animated swipe card deck.
 *
 * Manages pan gesture recognition, auto-commit threshold, left/right overlay animations,
 * and back-card depth scaling. Delegates rendering entirely to `renderFront` / `renderBack`.
 *
 * @param props - See {@link CardsDeckProps}.
 */
export default function CardsDeck<TFront, TBack = TFront>({
  stylesOverride,
  frontItem,
  backItem,
  renderFront,
  renderBack,
  onSwipeProgress,
  swipeAutoCommitThresholdRatio = 0.3,
  overlayMaxWidthRatio = 0.3,
  overlayMaxOpacity = 0.7,
  onSwipeCommit,
  onSwipeCancel,
  leftAction,
  rightAction,
  backCardScale = 0.985,
  backCardDepthEffect = true,
  resetKey,
}: CardsDeckProps<TFront, TBack>) {
  const { theme } = useTheme();
  const styles = useResultedStyle<CardsDeckStyles>(theme, makeCardsDeckStyles, stylesOverride);

  const translateX = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(1);

  const isCommittingRef = useRef(false);
  const committedThisGestureRef = useRef(false);

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width || 1);
  };

  const commitPx = width * swipeAutoCommitThresholdRatio;

  // Calcul des largeurs d'overlay basées sur les ratios fournis
  const leftOverlayWidthPx = width * Math.min(leftAction?.widthRatio ?? overlayMaxWidthRatio, 0.5);
  const rightOverlayWidthPx =
    width * Math.min(rightAction?.widthRatio ?? overlayMaxWidthRatio, 0.5);

  // Reset de la position lors du changement de clé (nouvel item)
  useEffect(() => {
    translateX.stopAnimation(() => translateX.setValue(0));
    isCommittingRef.current = false;
    committedThisGestureRef.current = false;
  }, [resetKey, translateX]);

  /**
   * Animation de sortie de la carte
   */
  const commitSwipe = useCallback(
    (direction: SwipeDirection) => {
      if (isCommittingRef.current || committedThisGestureRef.current) return;

      isCommittingRef.current = true;
      committedThisGestureRef.current = true;

      const toX = direction === 'left' ? -width * 1.3 : width * 1.3;

      Animated.timing(translateX, {
        toValue: toX,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        onSwipeCommit?.(direction);
        // Le reset de translateX se fera via le useEffect du resetKey
      });
    },
    [width, translateX, onSwipeCommit],
  );

  /**
   * Configuration du PanResponder avec verrouillage de direction
   */
  const panResponder = useMemo(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10,
      onPanResponderGrant: () => {
        committedThisGestureRef.current = false;
      },
      onPanResponderMove: (_, g) => {
        if (isCommittingRef.current || committedThisGestureRef.current) return;

        const isSwipingLeft = g.dx < 0;
        const isSwipingRight = g.dx > 0;

        // 🔒 VERROUILLAGE PHYSIQUE : Si la direction n'a pas d'action, on bloque le mouvement
        if ((isSwipingLeft && !leftAction) || (isSwipingRight && !rightAction)) {
          translateX.setValue(0);
          return;
        }

        const direction: SwipeDirection = isSwipingLeft ? 'left' : 'right';
        const progress = Math.min(Math.abs(g.dx) / (commitPx || 1), 1);

        onSwipeProgress?.({ dx: g.dx, progress, direction });

        // Seuil d'auto-commit atteint
        if (Math.abs(g.dx) >= commitPx) {
          commitSwipe(direction);
          return;
        }

        translateX.setValue(g.dx);
      },
      onPanResponderRelease: () => {
        if (isCommittingRef.current || committedThisGestureRef.current) return;

        Animated.spring(translateX, {
          toValue: 0,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }).start(() => onSwipeCancel?.());
      },
    });
  }, [commitPx, commitSwipe, onSwipeCancel, onSwipeProgress, translateX, leftAction, rightAction]);

  // --- INTERPOLATIONS AGNOSTIQUES ---

  // Opacité pour l'action de GAUCHE (activée par un mouvement vers la GAUCHE)
  const leftOpacity = translateX.interpolate({
    inputRange: [-commitPx, 0],
    outputRange: [overlayMaxOpacity, 0],
    extrapolate: 'clamp',
  });

  // Opacité pour l'action de DROITE (activée par un mouvement vers la DROITE)
  const rightOpacity = translateX.interpolate({
    inputRange: [0, commitPx],
    outputRange: [0, overlayMaxOpacity],
    extrapolate: 'clamp',
  });

  // Effet de zoom sur la carte arrière
  const backScale = translateX.interpolate({
    inputRange: [-commitPx, 0, commitPx],
    outputRange: [1, backCardDepthEffect ? backCardScale : 1, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container} onLayout={onLayout}>
      <View style={styles.deck}>
        {/* CARTE ARRIÈRE (Prévisualisation) */}
        {backItem !== undefined && (
          <Animated.View style={[styles.layer, { transform: [{ scale: backScale }] }]}>
            <Card stylesOverride={styles.card}>{renderBack ? renderBack(backItem) : null}</Card>
          </Animated.View>
        )}

        {/* CARTE AVANT (Interactive) */}
        <Animated.View
          testID="deck-front-card"
          style={[styles.layer, { transform: [{ translateX }] }]}
          {...panResponder.panHandlers}
        >
          <Card
            stylesOverride={styles.card}
            renderOverlay={() => (
              <>
                {/* Overlay GAUCHE (ex: Trash dans Home) */}
                {leftAction && (
                  <Animated.View
                    style={[
                      styles.overlayCommon,
                      styles.overlayRight, // Apparaît sur le bord droit quand on pousse vers la gauche
                      { width: leftOverlayWidthPx, opacity: leftOpacity },
                    ]}
                  >
                    <Animated.View
                      style={[
                        styles.fillRight,
                        {
                          width: leftOverlayWidthPx,
                          backgroundColor: leftAction.color,
                          transform: [
                            {
                              translateX: translateX.interpolate({
                                inputRange: [-commitPx, 0],
                                outputRange: [0, leftOverlayWidthPx],
                                extrapolate: 'clamp',
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                    <Icon
                      {...leftAction.icon}
                      size={leftAction.iconSize ?? 32}
                      color={leftAction.iconColor ?? '#FFF'}
                    />
                  </Animated.View>
                )}

                {/* Overlay DROIT (ex: Keep dans Home ou Restore dans Trash) */}
                {rightAction && (
                  <Animated.View
                    style={[
                      styles.overlayCommon,
                      styles.overlayLeft, // Apparaît sur le bord gauche quand on pousse vers la droite
                      { width: rightOverlayWidthPx, opacity: rightOpacity },
                    ]}
                  >
                    <Animated.View
                      style={[
                        styles.fillLeft,
                        {
                          width: rightOverlayWidthPx,
                          backgroundColor: rightAction.color,
                          transform: [
                            {
                              translateX: translateX.interpolate({
                                inputRange: [0, commitPx],
                                outputRange: [-rightOverlayWidthPx, 0],
                                extrapolate: 'clamp',
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                    <Icon
                      {...rightAction.icon}
                      size={rightAction.iconSize ?? 32}
                      color={rightAction.iconColor ?? '#FFF'}
                    />
                  </Animated.View>
                )}
              </>
            )}
          >
            {renderFront(frontItem)}
          </Card>
        </Animated.View>
      </View>
    </View>
  );
}

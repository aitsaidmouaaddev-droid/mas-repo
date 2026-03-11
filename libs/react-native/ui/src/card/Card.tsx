/**
 * @module Card
 * Presentational card wrapper with optional overlay layer.
 *
 * ```tsx
 * import Card from '@mas/rn/ui/card/Card';
 *
 * <Card renderOverlay={() => <TrashOverlay />}>
 *   <Image source={...} />
 * </Card>
 * ```
 *
 * @see {@link CardProps} — prop reference
 * @see {@link makeCardStyles} — style factory in card.style.ts
 */
import useResultedStyle from '../useResultedStyle';
import { useTheme } from '../ThemeContext';
import React from 'react';
import { View } from 'react-native';
import type { CardStyles } from './card.style';
import makeCardStyles from './card.style';

/**
 * Props for {@link Card}.
 */
export interface CardProps {
  /** Card content. */
  children: React.ReactNode;

  /** Partial style overrides merged on top of the base theme styles. */
  stylesOverride?: Partial<CardStyles>;

  /**
   * Optional overlay renderer.
   * Deck can provide overlays (trash/approved) without Card knowing swipe logic.
   */
  renderOverlay?: () => React.ReactNode;
}

/**
 * Presentational card surface.
 * Purely display-focused — manages themed layout and optional overlay composition only.
 *
 * Uses {@link useResultedStyle} to merge base styles with {@link CardProps.stylesOverride}.
 *
 * @param props - See {@link CardProps}.
 */
export default function Card({ children, stylesOverride, renderOverlay }: CardProps) {
  const { theme } = useTheme();

  // ✅ On génère les styles finaux (Fusion Thème + Overrides)
  const styles = useResultedStyle<CardStyles>(theme, makeCardStyles, stylesOverride);

  return (
    <View style={styles.base}>
      {/* Conteneur du contenu (Image, Vidéo, etc.) */}
      <View style={styles.content}>{children}</View>

      {/* Couche d'overlay (Filtres de couleur Trash/Approved) */}
      {renderOverlay && <View style={styles.overlayLayer}>{renderOverlay()}</View>}
    </View>
  );
}

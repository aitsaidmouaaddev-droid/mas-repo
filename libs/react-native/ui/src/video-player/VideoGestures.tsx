/**
 * @module VideoGestures
 * Touch gesture layer for the video player.
 *
 * - Single tap: toggles play/pause (after 250 ms debounce).
 * - Double tap: seeks ±3 s depending on the tap side (left/right).
 *
 * Used internally by {@link VideoContainer}.
 *
 * @see {@link VideoContainer} — parent component
 * @see {@link VideoPlayerShape} — styles shape from videoPlayer.style.ts
 */
import React, { useRef } from 'react';
import { TouchableWithoutFeedback, View, Dimensions } from 'react-native';
import type { VideoPlayerShape } from './videoPlayer.style';

/**
 * Props for the {@link VideoGestures} component.
 */
interface GestureProps {
  /** Toggles between play and pause. */
  onTogglePlay: () => void;
  /** Seeks by the given number of seconds (positive = forward, negative = backward). */
  onSeek: (offsetSeconds: number) => void;
  /** Gesture layer styles from {@link VideoPlayerShape.gestures}. */
  styles: VideoPlayerShape['gestures'];
}

/**
 * Invisible touch layer rendered over the video surface.
 *
 * Differentiates single tap (play/pause) from double tap (seek) using a 250 ms timer.
 * Tapping the left half seeks backward; right half seeks forward.
 *
 * @param props - See {@link GestureProps}.
 */
const VideoGestures = ({ onTogglePlay, onSeek, styles }: GestureProps) => {
  const { width } = Dimensions.get('window');

  // 🎯 Correction du type : On utilise ReturnType pour s'adapter à l'environnement
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTap = useRef<number>(0);

  /**
   * Analyse la pression pour différencier le simple du double tap.
   * - Simple Tap : Pause / Play après un délai de 250ms.
   * - Double Tap : Annule la pause et effectue un Seek +/- 3s.
   */
  const handlePress = (event: any) => {
    const now = Date.now();
    const x = event.nativeEvent.locationX;
    const DOUBLE_TAP_DELAY = 250;

    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // ⏩ DOUBLE TAP détecté
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      onSeek(x < width / 2 ? -3 : 3);
    } else {
      // ⏯️ SIMPLE TAP (en attente)
      // On stocke le timeout pour pouvoir l'annuler si un 2ème tap arrive
      timer.current = setTimeout(() => {
        onTogglePlay();
        timer.current = null;
      }, DOUBLE_TAP_DELAY);
    }
    lastTap.current = now;
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container} testID="video-gestures" />
    </TouchableWithoutFeedback>
  );
};

export default VideoGestures;

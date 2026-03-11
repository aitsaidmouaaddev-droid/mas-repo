/**
 * @module videoPlayer.style
 * Style factory and types for the video player component family:
 * {@link VideoContainer}, {@link VideoGestures}, {@link VideoProgressBar}.
 *
 * @see {@link VideoContainer} — video-player/VideoContainer.tsx
 */
import type { StylesOverride } from '../useResultedStyle';
import type { ThemeTokens } from '@mas/shared/types';
import type { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import type { IconStyles } from '../icon/icon.style';
import type { ButtonStyles } from '../button/button.style';

/**
 * Structural style shape for the video player component family.
 * Passed down from {@link VideoContainer} to {@link VideoGestures} and {@link VideoProgressBar}.
 */
export type VideoPlayerShape = {
  /** Full-size video surface container. */
  container: ViewStyle;
  /** expo-video `VideoView` surface. */
  videoView: ViewStyle;
  /** Absolute overlay for play/pause animated feedback icon. */
  feedbackContainer: ViewStyle;
  /** Circular backdrop behind the feedback icon. */
  feedbackIcon: ViewStyle;
  /** Absolute container for the mute toggle button. */
  muteButtonContainer: ViewStyle;
  /** Styles forwarded to {@link VideoGestures}. */
  gestures: {
    /** Absolute full-fill touch-detection layer. */
    container: ViewStyle;
    /** Individual hit zone (left/right half of screen). */
    hitZone: ViewStyle;
  };
  /** Styles forwarded to {@link VideoProgressBar}. */
  progressBar: {
    /** Absolute positioned bar container. */
    container: ViewStyle;
    /** Expanded touch area around the track. */
    hitSlop: ViewStyle;
    /** Track background rail. */
    track: ViewStyle;
    /** Filled portion of the track. */
    fill: ViewStyle;
    /** Draggable scrub knob. */
    knob: ViewStyle;
  };
  /** Icon style overrides for internal icons. */
  icon: IconStyles;
  /** Button style overrides for the mute button. */
  muteButton: ButtonStyles;
};

/**
 * Creates themed styles for the video player component family.
 *
 * @param theme - Active theme tokens.
 * @returns A {@link VideoPlayerShape} ready for composition with {@link useResultedStyle}.
 */
export default function makeVideoStyles(theme: ThemeTokens): VideoPlayerShape {
  const flats = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background || '#000',
      overflow: 'hidden',
      borderRadius: 0,
    },
    videoView: { flex: 1, borderRadius: 0 },
    feedbackContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 15,
      pointerEvents: 'none',
    },
    feedbackIcon: {
      backgroundColor: 'rgba(0,0,0,0.4)',
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    muteButtonContainer: {
      position: 'absolute',
      right: 20,
      zIndex: 30,
    },
    // ✅ On le nomme différemment pour l'extraire après
    gesturesContainerBase: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 10,
    },
  });

  // On extrait gesturesContainerBase pour ne pas le polluer dans le spread final
  const { gesturesContainerBase, ...otherFlats } = flats;

  return {
    ...otherFlats,
    // ✅ On respecte maintenant la Shape imbriquée
    gestures: {
      container: gesturesContainerBase,
      hitZone: {
        flex: 1, // Style par défaut pour tes zones de tap
      },
    },
    progressBar: {
      container: {
        position: 'absolute',
        left: 20,
        right: 20,
        height: 30,
        justifyContent: 'center',
        zIndex: 20,
      },
      hitSlop: { height: 40, justifyContent: 'center' },
      track: {
        height: 6,
        backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        borderRadius: 3,
      },
      fill: {
        height: '100%',
        backgroundColor: theme.colors.primary || '#6200EE',
        borderRadius: 3,
      },
      knob: {
        position: 'absolute',
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: theme.colors.primary || '#6200EE',
        top: -5,
        marginLeft: -8,
        elevation: 4,
      },
    },
    icon: {
      container: {},
      vectorIcon: { color: '#FFF' },
    },
    muteButton: {
      base: {
        borderRadius: 50,
        width: 54, // Un peu plus grand pour le confort
        height: 54,
        backgroundColor: theme.colors.background,
        borderWidth: 0,
      },
    },
  };
}

export type VideoPlayerStyles = StylesOverride<VideoPlayerShape>;

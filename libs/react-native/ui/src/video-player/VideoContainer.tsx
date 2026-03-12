/**
 * @module VideoContainer
 * High-performance video player built on `expo-video`.
 *
 * Manages native player lifecycle, animated play/pause feedback,
 * interactive scrubbing, and mute control. Composes {@link VideoGestures}
 * and {@link VideoProgressBar} as sub-components.
 *
 * ```tsx
 * import VideoContainer from '@mas/rn/ui/video-player/VideoContainer';
 *
 * <VideoContainer uri={item.uri} isActive={isCurrentCard} />
 * ```
 *
 * @see {@link VideoContainerProps} — prop reference
 * @see {@link VideoGestures} — gesture handler sub-component
 * @see {@link VideoProgressBar} — scrubbing bar sub-component
 * @see {@link makeVideoStyles} — style factory in videoPlayer.style.ts
 */
import { useEventListener } from 'expo';
import { createVideoPlayer, VideoView } from 'expo-video';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import useResultedStyle from '../useResultedStyle';
import { useTheme } from '../ThemeContext';
import Button from '../button/Button';
import Icon from '../icon/Icon';
import VideoGestures from './VideoGestures';
import type { VideoPlayerStyles } from './videoPlayer.style';
import makeVideoStyles from './videoPlayer.style';
import VideoProgressBar from './VideoProgressBar';

/**
 * Offsets de positionnement pour les contrôles par rapport à la TabBar.
 */
const PROGRESS_BAR_OFFSET = 90;
const MUTE_BUTTON_OFFSET = 130;

/**
 * Props for the {@link VideoContainer} component.
 */
export interface VideoContainerProps {
  /** Local file path or remote URI of the video asset. */
  uri: string;
  /** When `false`, the player is paused. Changing this drives play/pause externally. */
  isActive: boolean;
  /**
   * Loop the video when it reaches the end.
   * @defaultValue `true`
   */
  loop?: boolean;
  /**
   * Resize mode forwarded to `expo-video` (`"cover"`, `"contain"`, etc.).
   * @defaultValue `"cover"`
   */
  contentFit?: string;
  /** Partial style overrides merged on top of base video styles. */
  stylesOverride?: Partial<VideoPlayerStyles>;
}

/**
 * Optimised video player component.
 *
 * Uses a manual `playerRef` to avoid "Shared Object Released" memory leaks
 * when components are recycled in a virtualized list. The native player is released
 * in the cleanup effect.
 *
 * @param props - See {@link VideoContainerProps}.
 */
const VideoContainer = ({
  uri,
  isActive,
  stylesOverride,
  loop = true,
  contentFit = 'cover',
}: VideoContainerProps) => {
  const { theme } = useTheme();
  const styles = useResultedStyle<VideoPlayerStyles>(theme, makeVideoStyles, stylesOverride);

  // États de lecture et d'UI
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [lastAction, setLastAction] = useState<'play' | 'pause'>('play');

  // Valeurs animées pour le feedback central
  const feedbackOpacity = useSharedValue(0);
  const feedbackScale = useSharedValue(0.5);

  /**
   * Déclenche l'animation de l'icône centrale lors d'un Play/Pause.
   */
  const triggerFeedback = useCallback(
    (type: 'play' | 'pause') => {
      setLastAction(type);
      feedbackOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(400, withTiming(0, { duration: 200 })),
      );
      feedbackScale.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withDelay(400, withTiming(0.8, { duration: 200 })),
      );
    },
    [feedbackOpacity, feedbackScale],
  );

  /**
   * Initialisation manuelle du player.
   * On utilise createVideoPlayer pour un contrôle total sur le cycle de vie natif.
   */
  const playerRef = useRef<any>(null);
  if (!playerRef.current) {
    const p = createVideoPlayer(uri);
    p.loop = loop;
    p.timeUpdateEventInterval = 0.2;
    playerRef.current = p;
  }
  const player = playerRef.current;

  // Gestion du changement de source (Recyclage de cellule)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await player.replaceAsync(uri);
        if (cancelled) return;
        setCurrentTime(0);
        if (isActive) player.play();
        else player.pause();
      } catch (e) {
        console.error('Error', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [uri, player]);

  // Synchronisation de l'état de lecture
  useEffect(() => {
    try {
      if (isActive) player.play();
      else player.pause();
    } catch (e) {
      console.error('Error', e);
    }
  }, [isActive, player]);

  // Synchronisation du mute
  useEffect(() => {
    try {
      player.muted = isMuted;
    } catch (e) {
      console.error('Error', e);
    }
  }, [isMuted, player]);

  // Listeners d'événements natifs
  useEventListener(player, 'sourceLoad', (event: any) => {
    if (event?.duration > 0) setDuration(event.duration);
  });

  useEventListener(player, 'timeUpdate', (event: any) => {
    if (!isScrubbing && typeof event?.currentTime === 'number') {
      setCurrentTime(event.currentTime);
    }
  });

  // Nettoyage final de la mémoire
  useEffect(() => {
    return () => {
      try {
        playerRef.current?.release?.();
      } catch (e) {
        console.error('Error', e);
      } finally {
        playerRef.current = null;
      }
    };
  }, []);

  /**
   * Alterne la lecture et déclenche le feedback visuel.
   */
  const togglePlay = useCallback(() => {
    try {
      if (player.playing) {
        player.pause();
        triggerFeedback('pause');
      } else {
        player.play();
        triggerFeedback('play');
      }
    } catch (e) {
      console.error('Error', e);
    }
  }, [player, triggerFeedback]);

  // Styles Reanimated
  const animatedFeedbackStyle = useAnimatedStyle(() => ({
    opacity: feedbackOpacity.value,
    transform: [{ scale: feedbackScale.value }],
  }));

  // Handlers pour la barre de progression (Scrubbing)
  const onScrubStart = useCallback(() => {
    setIsScrubbing(true);
    try {
      player.pause();
    } catch (e) {
      console.error('Error', e);
    }
  }, [player]);

  const onScrub = useCallback(
    (r: number) => {
      const target = Math.max(0, Math.min(1, r)) * (duration || 1);
      setCurrentTime(target);
      try {
        player.currentTime = target;
      } catch (e) {
        console.error('Error', e);
      }
    },
    [duration, player],
  );

  const onScrubEnd = useCallback(
    (r: number) => {
      const target = Math.max(0, Math.min(1, r)) * (duration || 1);
      setIsScrubbing(false);
      setCurrentTime(target);
      try {
        player.currentTime = target;
        if (isActive) player.play();
      } catch (e) {
        console.error('Error', e);
      }
    },
    [duration, isActive, player],
  );

  return (
    <View style={styles.container} testID="video-container">
      <VideoView
        key={uri}
        player={player}
        style={styles.videoView}
        contentFit={contentFit as any}
        nativeControls={false}
        surfaceType="textureView"
      />

      {/* Couche de Feedback Animée */}
      <View style={styles.feedbackContainer}>
        <Animated.View style={[styles.feedbackIcon, animatedFeedbackStyle]}>
          <Icon
            type="vector"
            name={lastAction === 'play' ? 'play' : 'pause'}
            size={40}
            color="#FFF"
          />
        </Animated.View>
      </View>

      {/* Zone de détection des gestes */}
      <VideoGestures
        styles={styles.gestures}
        onTogglePlay={togglePlay}
        onSeek={(s) => player.seekBy(s)}
      />

      {/* Barre de progression interactive */}
      <VideoProgressBar
        styles={styles.progressBar}
        progress={Math.min(1, Math.max(0, currentTime / (duration || 1)))}
        bottomOffset={PROGRESS_BAR_OFFSET}
        onScrubStart={onScrubStart}
        onScrub={onScrub}
        onScrubEnd={onScrubEnd}
      />

      {/* Bouton de contrôle du volume */}
      <View style={[styles.muteButtonContainer, { bottom: MUTE_BUTTON_OFFSET }]}>
        <Button
          testID="mute-button"
          variant="primary"
          size="sm"
          onPress={() => setIsMuted((v) => !v)}
          icon={{
            type: 'vector',
            name: isMuted ? 'volume-mute' : 'volume-high',
            color: theme.colors.onSurface,
          }}
          stylesOverride={styles.muteButton}
        />
      </View>
    </View>
  );
};

export default VideoContainer;

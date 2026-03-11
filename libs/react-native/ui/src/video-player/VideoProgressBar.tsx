/**
 * @module VideoProgressBar
 * Interactive video scrub bar using `react-native-gesture-handler`.
 *
 * Reports scrub start, ongoing position, and release via callbacks.
 * Used internally by {@link VideoContainer}.
 *
 * @see {@link VideoContainer} — parent component
 * @see {@link VideoPlayerShape} — styles shape from videoPlayer.style.ts
 */
import React from "react";
import { View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { VideoPlayerShape } from "./videoPlayer.style";

/**
 * Props for the {@link VideoProgressBar} component.
 */
export interface ProgressBarProps {
  /** Progress bar styles from {@link VideoPlayerShape.progressBar}. */
  styles: VideoPlayerShape["progressBar"];
  /** Current playback position as a ratio from 0 (start) to 1 (end). */
  progress: number;
  /** Bottom offset in pixels used to position the bar above the tab bar. */
  bottomOffset: number;
  /** Called when the user starts a pan gesture on the bar. */
  onScrubStart: () => void;
  /** Called continuously during scrubbing with the current position ratio. */
  onScrub: (ratio: number) => void;
  /** Called when the user releases the bar with the final position ratio. */
  onScrubEnd: (ratio: number) => void;
}

/**
 * Scrubbing progress bar for the video player.
 *
 * Uses a `Gesture.Pan` from `react-native-gesture-handler` and `runOnJS`
 * to bridge worklet callbacks back to the JS thread.
 *
 * @param props - See {@link ProgressBarProps}.
 */
const VideoProgressBar = ({
  progress,
  bottomOffset,
  onScrubStart,
  onScrub,
  onScrubEnd,
  styles,
}: ProgressBarProps) => {
  const [width, setWidth] = React.useState(0);

  // Utilisation d'un Pan Gesture configuré pour être réactif
  const gesture = Gesture.Pan()
    .averageTouches(true)
    .onStart(() => {
      runOnJS(onScrubStart)();
    })
    .onUpdate((e) => {
      if (width > 0) {
        const newRatio = Math.min(Math.max(0, e.x / width), 1);
        runOnJS(onScrub)(newRatio);
      }
    })
    .onEnd((e) => {
      if (width > 0) {
        const finalRatio = Math.min(Math.max(0, e.x / width), 1);
        runOnJS(onScrubEnd)(finalRatio);
      }
    });

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[styles.container, { bottom: bottomOffset }]}
      testID="video-progress-bar"
    >
      <GestureDetector gesture={gesture}>
        {/* Important : cette View doit couvrir toute la zone de contact */}
        <View style={styles.hitSlop}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${progress * 100}%` }]} />
            <View style={[styles.knob, { left: `${progress * 100}%` }]} />
          </View>
        </View>
      </GestureDetector>
    </View>
  );
};

export default VideoProgressBar;

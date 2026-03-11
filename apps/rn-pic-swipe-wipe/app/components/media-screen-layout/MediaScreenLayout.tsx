/**
 * @module MediaScreenLayout
 * Core swipe-deck layout shared by HomeScreen, TrashScreen and ApprovedScreen.
 *
 * Renders two absolute layers:
 * 1. **Background** — {@link CardsDeck} with the current front/back media items.
 * 2. **Foreground** — transparent overlay for HUD controls passed as `children`.
 *
 * Handles media rendering (image vs. video), empty-state, and swipe-commit dispatch.
 *
 * @example
 * ```tsx
 * import MediaScreenLayout, { SwipeActionConfig } from '@components/media-screen-layout/MediaScreenLayout';
 *
 * <MediaScreenLayout items={items} cursor={cursor} leftAction={trashAction} rightAction={keepAction}>
 *   <MyHUDControls />
 * </MediaScreenLayout>
 * ```
 *
 * @see {@link SwipeActionConfig}
 * @see {@link MediaScreenLayoutProps}
 */
import APP_CONFIG from "../../config";
import { AppMediaType } from "@mas/rn/media";
import type { MediaItem } from "../../../store/types";
import { useTheme } from "@mas/rn/ui";
import CardsDeck from "@mas/rn/ui/cards-deck/CardsDeck";
import { IconProps } from "@mas/rn/ui/icon/Icon";
import VideoContainer from "@mas/rn/ui/video-player/VideoContainer";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import makeMediaScreenStyles from "./mediascreenlayout.style";

/**
 * Configuration for a single swipe direction (left or right).
 * Passed to {@link MediaScreenLayout} to define the action triggered by each swipe.
 */
export interface SwipeActionConfig {
  /** Accent colour of the swipe overlay (hex, e.g. `"#FF3B30"`). */
  color: string;
  /** Icon displayed on the swipe overlay. */
  icon: IconProps;
  /** Called with the swiped {@link MediaItem} when the gesture commits. */
  onAction: (item: MediaItem) => Promise<void> | void;
  /** Overlay width as a fraction of card width (0–1). */
  widthRatio?: number;
}

/** Props for {@link MediaScreenLayout}. */
interface MediaScreenLayoutProps {
  /** Ordered array of media items to display. */
  items: MediaItem[];
  /** Index of the currently visible (front) item in `items`. */
  cursor: number;
  /** Left-swipe action (e.g. trash). Omit to disable left swipes. */
  leftAction?: SwipeActionConfig;
  /** Right-swipe action (e.g. keep). Omit to disable right swipes. */
  rightAction?: SwipeActionConfig;
  /** Custom UI (filters, buttons, HUD) rendered on top of the deck. */
  children?: React.ReactNode;
  /** Message shown when `items` is empty. @default `"No more items"` */
  emptyTitle?: string;
}

/**
 * Two-layer swipe screen: {@link CardsDeck} behind a transparent HUD layer.
 *
 * @param props - {@link MediaScreenLayoutProps}
 * @returns The stacked layout, or an empty-state view when `items` is empty.
 */
export default function MediaScreenLayout({
  items,
  cursor,
  leftAction,
  rightAction,
  children,
  emptyTitle = "No more items",
}: MediaScreenLayoutProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeMediaScreenStyles(theme), [theme]);

  const frontItem = items[cursor];
  const backItem = items[cursor + 1];

  const frontItemRef = useRef(frontItem);
  useEffect(() => {
    frontItemRef.current = frontItem;
  }, [frontItem]);

  // 🛡️ Throw if config is broken
  if (!APP_CONFIG.deck) {
    throw new Error("[MediaScreenLayout] Missing APP_CONFIG.deck configuration.");
  }

  /**
   * Internal Media Renderer
   */
  const renderMedia = useCallback(
    (item: MediaItem) => {
      const isActive = frontItem?.id === item.id;

      if (item.type === AppMediaType.PHOTO) {
        return (
          <Image
            testID="media-image"
            source={{ uri: item.uri }}
            style={styles.mediaFull}
            resizeMode="cover"
          />
        );
      }

      if (item.type === AppMediaType.VIDEO) {
        return (
          <VideoContainer
            key={item.id}
            uri={item.uri}
            isActive={isActive}
            loop={APP_CONFIG.video.shouldLoop}
            contentFit={APP_CONFIG.video.contentFit}
          />
        );
      }

      return (
        <View style={styles.unsupported}>
          <Text style={styles.unsupportedText}>Unsupported format</Text>
        </View>
      );
    },
    [frontItem?.id, styles],
  );

  const onCommit = useCallback(
    async (direction: "left" | "right") => {
      const item = frontItemRef.current;
      if (!item) return;
      const config = direction === "left" ? leftAction : rightAction;
      if (config) await config.onAction(item);
    },
    [leftAction, rightAction],
  );

  // --- EMPTY STATE ---
  if (!frontItem) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyTitle}</Text>
        {/* We still render children so user can change filters even when empty */}
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {children}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 1. LAYER: THE DECK (Background) */}
      <View style={StyleSheet.absoluteFill}>
        <CardsDeck
          key={frontItem.id}
          stylesOverride={styles.deckContainer}
          frontItem={frontItem}
          backItem={backItem}
          renderFront={renderMedia}
          renderBack={renderMedia}
          leftAction={leftAction}
          rightAction={rightAction}
          onSwipeCommit={onCommit}
          overlayMaxOpacity={APP_CONFIG.deck.maxOverlayOpacity}
          overlayMaxWidthRatio={APP_CONFIG.deck.maxOverlayOpacity}
          swipeAutoCommitThresholdRatio={APP_CONFIG.deck.swipeThreshold}
          backCardScale={APP_CONFIG.deck.backCardScale}
        />
      </View>

      {/* 2. LAYER: UI CONTENT (Foreground) */}
      {/* pointerEvents="box-none" is key: UI elements respond to touch, 
          but empty areas let the touch pass through to the Deck. */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}

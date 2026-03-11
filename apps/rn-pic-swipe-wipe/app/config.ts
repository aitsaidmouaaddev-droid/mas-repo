/**
 * Centralised runtime configuration for the `rn-pic-swipe-wipe` app.
 *
 * All tuneable values are driven by `EXPO_PUBLIC_*` environment variables and
 * fall back to sensible defaults when the variable is absent.
 *
 * Import directly from this file using a relative path:
 * ```ts
 * import APP_CONFIG from '../config';
 * ```
 *
 * Labels are intentionally written in English to ease a future i18n migration.
 */
const APP_CONFIG = {
  /**
   * Media scanning settings.
   * Controls how many media items are loaded from the device library.
   */
  media: {
    /**
     * Maximum number of media items to load per scan.
     * Overridden by `EXPO_PUBLIC_MEDIA_LIMIT`. @default 500
     */
    scanLimit: Number(process.env.EXPO_PUBLIC_MEDIA_LIMIT) || 500,
  },

  /**
   * Swipe-card deck physics.
   */
  deck: {
    /**
     * Drag fraction (0–1) required to register a decision.
     * Overridden by `EXPO_PUBLIC_SWIPE_THRESHOLD`. @default 0.3
     */
    swipeThreshold: Number(process.env.EXPO_PUBLIC_SWIPE_THRESHOLD) || 0.3,
    /**
     * Maximum opacity (0–1) of the decision overlay during drag.
     * Overridden by `EXPO_PUBLIC_OVERLAY_MAX_OPACITY`. @default 0.75
     */
    maxOverlayOpacity: Number(process.env.EXPO_PUBLIC_OVERLAY_MAX_OPACITY) || 0.75,
    /**
     * Maximum overlay width as a fraction of card width (0–1).
     * Overridden by `EXPO_PUBLIC_OVERLAY_MAX_WIDTH_RATIO`. @default 0.3
     */
    overlayMaxWidthRatio: Number(process.env.EXPO_PUBLIC_OVERLAY_MAX_WIDTH_RATIO) || 0.3,
    /**
     * Scale factor of the back card in the deck stack (0–1).
     * Overridden by `EXPO_PUBLIC_BACK_CARD_SCALE`. @default 0.985
     */
    backCardScale: Number(process.env.EXPO_PUBLIC_BACK_CARD_SCALE) || 0.985,
  },

  /**
   * Video player settings.
   */
  video: {
    /**
     * Polling interval in seconds for progress updates.
     * Overridden by `EXPO_PUBLIC_VIDEO_TIME_INTERVAL`. @default 0.1
     */
    timeUpdateInterval: Number(process.env.EXPO_PUBLIC_VIDEO_TIME_INTERVAL) || 0.1,
    /**
     * Whether videos loop automatically.
     * Overridden by `EXPO_PUBLIC_VIDEO_LOOP` (`"true"`/`"false"`). @default false
     */
    shouldLoop: process.env.EXPO_PUBLIC_VIDEO_LOOP === "true",
    /**
     * Frame fit mode inside the player container.
     * @default "cover"
     */
    contentFit: "cover" as const,
  },

  /**
   * Decision action definitions (colours, icons, labels).
   * Used by swipe-overlay and result-list components.
   */
  decisions: {
    /** Swipe-left "trash" decision. Overridden by `EXPO_PUBLIC_COLOR_TRASH`. */
    trash: {
      color: process.env.EXPO_PUBLIC_COLOR_TRASH || "#FF3B30",
      icon: "trash-bin-outline" as const,
      label: "Trash",
    },
    /** Swipe-right "keep" decision. Overridden by `EXPO_PUBLIC_COLOR_KEEP`. */
    keep: {
      color: process.env.EXPO_PUBLIC_COLOR_KEEP || "#34C759",
      icon: "heart-outline" as const,
      label: "Keep",
    },
    /** Restore-to-home action. Overridden by `EXPO_PUBLIC_COLOR_RESTORE`. */
    restore: {
      color: process.env.EXPO_PUBLIC_COLOR_RESTORE || "#007AFF",
      icon: "home" as const,
      label: "Restore",
    },
  },

  /**
   * Bottom tab bar configuration.
   */
  tabs: {
    /** Tab bar height in dp. Overridden by `EXPO_PUBLIC_TAB_HEIGHT`. @default 65 */
    height: Number(process.env.EXPO_PUBLIC_TAB_HEIGHT) || 65,
    /** Bottom safe-area offset in dp. Overridden by `EXPO_PUBLIC_TAB_BOTTOM_OFFSET`. @default 24 */
    bottom: Number(process.env.EXPO_PUBLIC_TAB_BOTTOM_OFFSET) || 24,
    /** Active tab colour. Overridden by `EXPO_PUBLIC_TAB_ACTIVE_COLOR`. @default "#FF3B30" */
    activeTintColor: process.env.EXPO_PUBLIC_TAB_ACTIVE_COLOR || "#FF3B30",
    /** Inactive tab colour. Overridden by `EXPO_PUBLIC_TAB_INACTIVE_COLOR`. @default "#8E8E93" */
    inactiveTintColor: process.env.EXPO_PUBLIC_TAB_INACTIVE_COLOR || "#8E8E93",
    /** Route definitions for the three main tabs. */
    routes: {
      /** Trash tab — displays media marked for deletion. */
      trash: { name: "TrashTab", label: "trash", icon: "trash-bin-outline" as const },
      /** Home tab — displays the main swipe deck. */
      home:  { name: "HomeTab",  label: "home",  icon: "home" as const },
      /** Keep tab — displays approved / kept media. */
      keep:  { name: "ApprovedTab", label: "keep", icon: "heart-outline" as const },
    },
  },
};

export default APP_CONFIG;

/** TypeScript type inferred from {@link APP_CONFIG}. */
export type AppConfig = typeof APP_CONFIG;

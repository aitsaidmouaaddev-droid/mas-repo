/**
 * @module useMedia
 * React hook providing all media-action callbacks for swipe screens.
 *
 * Reads `mediaService` from {@link MediaServiceProvider} context and dispatches
 * Redux actions from the `mediaScan` slice.
 *
 * @example
 * ```ts
 * import useMedia from '../hooks/useMedia';
 *
 * const { handleSwipeCommit, restore, deletePermanently } = useMedia();
 * await handleSwipeCommit(assetId, 'right'); // keeps the item
 * ```
 *
 * @see {@link useMediaService} — context hook used internally
 * @see {@link mediaScanActions} — Redux actions dispatched
 */
import * as MediaLibrary from "expo-media-library";
import { useCallback } from "react";
import { MediaVerdict } from "../store/types";
import { mediaScanActions } from "../store";
import { useAppDispatch } from "../store/hooks";
import { useMediaService } from "./MediaServiceProvider";

/**
 * Provides three media-action callbacks used by all swipe screens.
 *
 * @returns
 * - `handleSwipeCommit(assetId, direction)` — persists verdict and moves item to trash/keep
 * - `restore(assetId, verdict)` — moves item back to the `unknown` bucket
 * - `deletePermanently(assetId)` — deletes from device gallery and purges store entry
 */
const useMedia = () => {
  const dispatch = useAppDispatch();
  const mediaService = useMediaService();

  /** Records a swipe verdict and moves the item to `trash` (left) or `keep` (right). */
  const handleSwipeCommit = useCallback(
    async (assetId: string, direction: "left" | "right") => {
      try {
        const verdict = direction === "right" ? MediaVerdict.KEEP : MediaVerdict.TRASH;
        await mediaService.recordDecision(assetId, verdict);
        dispatch(mediaScanActions.moveItem({ id: assetId, to: verdict }));
      } catch (error) {
        console.error("Failed to commit swipe decision:", error);
      }
    },
    [dispatch, mediaService],
  );

  /** Moves an item from `trash` or `keep` back to the `unknown` inbox. */
  const restore = useCallback(
    async (assetId: string, verdict: MediaVerdict) => {
      try {
        await mediaService.recordDecision(assetId, MediaVerdict.UNKNOWN);
        dispatch(mediaScanActions.restoreItem({ id: assetId, from: verdict }));
      } catch (error) {
        console.error("Failed to restore item:", error);
      }
    },
    [dispatch, mediaService],
  );

  /** Permanently deletes the asset from the device gallery and removes it from the store. */
  const deletePermanently = async (assetId: string) => {
    try {
      const success = await MediaLibrary.deleteAssetsAsync([assetId]);
      if (success) {
        await mediaService.deleteEntries([assetId]);
        dispatch(mediaScanActions.removePermanently(assetId));
      }
    } catch (error) {
      console.error("Failed to delete asset permanently:", error);
    }
  };

  return { handleSwipeCommit, restore, deletePermanently };
};

export default useMedia;

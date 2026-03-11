import * as MediaLibrary from "expo-media-library";
import { useCallback } from "react";
import { MediaVerdict } from "../store/types";
import { mediaScanActions } from "../store";
import { useAppDispatch } from "../store/hooks";
import { useMediaService } from "./MediaServiceProvider";

const useMedia = () => {
  const dispatch = useAppDispatch();
  const mediaService = useMediaService();

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

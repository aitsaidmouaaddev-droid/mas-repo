import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { requestMediaPermission, AppPermissionStatus } from "@mas/rn/media";
import type { MediaItem, MediaBucket, MediaScanState, MediaVerdict as _V } from "./types";
import { MediaVerdict } from "./types";
import type { MediaService } from "../services/mediaService";

/** Extra argument shape injected into all thunks via the store's middleware. */
export interface StoreExtra {
  mediaService: MediaService;
}

const emptyBucket = (): MediaBucket => ({ items: [], cursor: 0 });

const initialState: MediaScanState = {
  permission: AppPermissionStatus.UNKNOWN,
  isScanning: false,
  progress: 0,
  unknown: emptyBucket(),
  trash: emptyBucket(),
  keep: emptyBucket(),
};

/* ------------------------------------------------------------------ */
/*  THUNKS                                                              */
/* ------------------------------------------------------------------ */

/**
 * Scans the device media library and populates the three buckets.
 *
 * 1. Requests OS permission via `@mas/rn/media`.
 * 2. If granted, delegates to `mediaService.performFullScan(500)` (injected via extra).
 */
export const scanDevicePhotos = createAsyncThunk<
  { unknown: MediaItem[]; trash: MediaItem[]; keep: MediaItem[] },
  void
>(
  "mediaScan/scanDevicePhotos",
  async (_, thunkApi) => {
    try {
      const status = await requestMediaPermission();
      const granted = status === AppPermissionStatus.GRANTED;

      thunkApi.dispatch(
        mediaScanSlice.actions.setPermission(
          granted ? AppPermissionStatus.GRANTED : AppPermissionStatus.DENIED,
        ),
      );

      if (!granted) return thunkApi.rejectWithValue("Permission denied");

      const { mediaService } = thunkApi.extra as StoreExtra;
      return await mediaService.performFullScan(500);
    } catch (e: any) {
      return thunkApi.rejectWithValue(e?.message ?? "Scan error");
    }
  },
);

/* ------------------------------------------------------------------ */
/*  SLICE                                                               */
/* ------------------------------------------------------------------ */

export const mediaScanSlice = createSlice({
  name: "mediaScan",
  initialState,
  reducers: {
    setPermission: (state, action: PayloadAction<AppPermissionStatus>) => {
      state.permission = action.payload;
    },

    next: (state, action: PayloadAction<"unknown" | "trash" | "keep" | undefined>) => {
      const bucket = state[action.payload || "unknown"];
      if (bucket.items.length > 0) bucket.cursor = (bucket.cursor + 1) % bucket.items.length;
    },

    moveItem: (
      state,
      action: PayloadAction<{ id: string; to: MediaVerdict.KEEP | MediaVerdict.TRASH }>,
    ) => {
      const { id, to } = action.payload;
      const idx = state.unknown.items.findIndex((i) => i.id === id);
      if (idx === -1) return;

      const [item] = state.unknown.items.splice(idx, 1);
      item.verdict = to;

      const target = to === MediaVerdict.KEEP ? state.keep : state.trash;
      target.items.unshift(item);
      target.cursor = 0;

      if (state.unknown.cursor >= state.unknown.items.length) state.unknown.cursor = 0;
    },

    removePermanently: (state, action: PayloadAction<string>) => {
      state.trash.items = state.trash.items.filter((i) => i.id !== action.payload);
      if (state.trash.cursor >= state.trash.items.length)
        state.trash.cursor = Math.max(0, state.trash.items.length - 1);
    },

    restoreItem: (state, action: PayloadAction<{ id: string; from: MediaVerdict }>) => {
      const { id, from } = action.payload;
      const bucket = state[from as "trash" | "keep"];
      const idx = bucket.items.findIndex((i) => i.id === id);
      if (idx === -1) return;

      const [item] = bucket.items.splice(idx, 1);
      state.unknown.items.unshift({ ...item, verdict: MediaVerdict.UNKNOWN });
      state.unknown.cursor = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(scanDevicePhotos.pending,   (state) => { state.isScanning = true; state.progress = 0; })
      .addCase(scanDevicePhotos.fulfilled, (state, action) => {
        state.isScanning = false;
        state.unknown.items = action.payload.unknown;
        state.trash.items   = action.payload.trash;
        state.keep.items    = action.payload.keep;
        state.progress = 1;
      })
      .addCase(scanDevicePhotos.rejected,  (state, action: PayloadAction<any>) => {
        state.isScanning = false;
        state.error = action.payload;
      });
  },
});

export const mediaScanActions = mediaScanSlice.actions;
export default mediaScanSlice.reducer;

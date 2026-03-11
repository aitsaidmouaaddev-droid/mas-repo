import { useDispatch, useSelector } from 'react-redux';
import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import type { MediaScanRootState } from './types';

export type AppDispatch = ThunkDispatch<MediaScanRootState, unknown, UnknownAction>;

/** Typed dispatch hook with thunk support. */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/** Typed selector hook scoped to the app's root state. */
export const useAppSelector = useSelector.withTypes<MediaScanRootState>();

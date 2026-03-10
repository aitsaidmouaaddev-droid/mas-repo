import { useDispatch, useSelector } from 'react-redux';
import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import type { MediaScanRootState } from './types';

export type AppDispatch = ThunkDispatch<MediaScanRootState, unknown, UnknownAction>;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector = useSelector.withTypes<MediaScanRootState>();

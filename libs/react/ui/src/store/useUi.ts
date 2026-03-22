import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIsMobile, type UiState } from './uiSlice';

/** Minimal slice shape this hook depends on. */
interface WithUi {
  ui: UiState;
}

/** Returns true when viewport width ≤ 768 px. Subscribes to window resize. */
export function useIsMobile(): boolean {
  const dispatch = useDispatch();
  const isMobile = useSelector((state: WithUi) => state.ui.isMobile);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => dispatch(setIsMobile(e.matches));
    mq.addEventListener('change', handler);
    // Sync on mount in case store was hydrated server-side
    dispatch(setIsMobile(mq.matches));
    return () => mq.removeEventListener('change', handler);
  }, [dispatch]);

  return isMobile;
}

/** Returns the current theme mode from the Redux ui slice. */
export function useThemeMode(): 'light' | 'dark' {
  return useSelector((state: WithUi) => state.ui.theme);
}

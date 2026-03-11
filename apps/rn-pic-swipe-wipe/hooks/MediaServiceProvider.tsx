import React, { createContext, useContext, type ReactNode } from 'react';
import type { MediaService } from '../services/mediaService';

const MediaServiceContext = createContext<MediaService | null>(null);

/**
 * Provides a {@link MediaService} instance to the component subtree.
 *
 * Place this in the app root layout alongside the Redux `<Provider>`.
 */
export function MediaServiceProvider({
  value,
  children,
}: {
  value: MediaService;
  children: ReactNode;
}) {
  return (
    <MediaServiceContext.Provider value={value}>
      {children}
    </MediaServiceContext.Provider>
  );
}

/**
 * Returns the {@link MediaService} instance injected by {@link MediaServiceProvider}.
 * @throws If called outside a `<MediaServiceProvider>`.
 */
export function useMediaService(): MediaService {
  const ctx = useContext(MediaServiceContext);
  if (!ctx) throw new Error('useMediaService must be used within a MediaServiceProvider');
  return ctx;
}

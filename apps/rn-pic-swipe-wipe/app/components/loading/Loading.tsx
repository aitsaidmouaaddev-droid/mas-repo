import React from 'react';
import LoadingScreen from '../../screens/loading-screen/LoadingScreen';

const LOGO_SOURCE = require('../../../assets/logo.png');
const LOADING_TEXT = 'Scanning media…';

/**
 * Entry-point component that renders {@link LoadingScreen} with the app logo and
 * "Scanning media…" text.
 *
 * Mounted at the `/components/loading/Loading` Expo Router route — the root `Index`
 * component redirects here immediately on launch.
 *
 * @returns A {@link LoadingScreen} with the default logo source and loading text.
 */
export default function Loading() {
  return <LoadingScreen loadingText={LOADING_TEXT} logoSource={LOGO_SOURCE} />;
}

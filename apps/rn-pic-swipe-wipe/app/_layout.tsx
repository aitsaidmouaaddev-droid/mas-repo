import { createAppStore } from '@mas/rn/store';
import { ThemeProvider } from '@mas/rn/ui';
import { ExpoSQLiteAdapter } from '@mas/rn/database';
import { DatabaseManager } from '@mas/mas-sqlite';
import * as NavigationBar from 'expo-navigation-bar';
import { Slot } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { dbConfig } from '../database.config';
import { mediaLedgerRepository } from '../db/mediaLedgerRepository';
import { createMediaService } from '../services/mediaService';
import { MediaServiceProvider } from '../hooks/MediaServiceProvider';
import mediaScanReducer from '../store/mediaScanSlice';

const mediaService = createMediaService(mediaLedgerRepository);
const store = createAppStore({ mediaScan: mediaScanReducer }, { mediaService });

/**
 * Root layout and global provider wrapper for the entire application.
 *
 * Wires together all app-level dependencies:
 * - Mounts the SQLite database on startup.
 * - Creates the Redux store with the `mediaScan` slice and injects `mediaService`.
 * - Provides `mediaService` via `MediaServiceProvider` for hooks.
 * - Wraps the tree with `ThemeProvider` for app-wide styling.
 *
 * @returns The fully wrapped application component tree.
 */
export default function Layout() {
  useEffect(() => {
    DatabaseManager.mount(dbConfig, new ExpoSQLiteAdapter()).catch(console.error);
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    NavigationBar.setVisibilityAsync('hidden');
  }, []);

  return (
    <Provider store={store}>
      <MediaServiceProvider value={mediaService}>
        <ThemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1, borderRadius: 0, overflow: 'visible' }}>
              <StatusBar hidden />
              <Slot />
            </View>
          </GestureHandlerRootView>
        </ThemeProvider>
      </MediaServiceProvider>
    </Provider>
  );
}

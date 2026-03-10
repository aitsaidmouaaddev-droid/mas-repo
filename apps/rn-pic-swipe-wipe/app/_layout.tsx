import store from '@mas/rn/store/store';
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
import { dbConfig } from './database.config';

/**
 * Root layout and global provider wrapper for the entire application.
 *
 * This component acts as the highest level of the app's component tree. It wraps
 * every screen with essential global state providers and applies critical
 * device-level UI configurations immediately upon mounting.
 *
 * **Key Responsibilities:**
 * - Mounts the SQLite database (create if new, connect if existing).
 * - Injects the global Redux {@link store} via the `<Provider>`.
 * - Injects the custom {@link ThemeProvider} for app-wide styling.
 * - Renders the currently active route using Expo Router's `<Slot />`.
 * - Locks the device screen orientation strictly to Portrait mode.
 * - Hides the system Status Bar for a fully immersive, full-screen experience.
 * - Hides the Android bottom navigation bar.
 *
 * @returns The fully wrapped application component tree.
 */
export default function Layout() {
  useEffect(() => {
    // Mount the database — creates picSwipeWipe.db if it doesn't exist,
    // connects to it if it does. All repository calls await this automatically.
    DatabaseManager.mount(dbConfig, new ExpoSQLiteAdapter()).catch(console.error);

    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    NavigationBar.setVisibilityAsync('hidden');
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={{ flex: 1, borderRadius: 0, overflow: 'visible' }}>
            <StatusBar hidden />
            <Slot />
          </View>
        </GestureHandlerRootView>
      </ThemeProvider>
    </Provider>
  );
}

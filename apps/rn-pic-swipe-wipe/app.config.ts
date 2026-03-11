import 'dotenv/config'; // Charge le .env pour le build
import type { ExpoConfig, ConfigContext } from 'expo/config';
import { version } from './package.json';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'pic-swipe-wipe',
  slug: 'pic-swipe-wipe',
  version,
  newArchEnabled: true,
  owner: 'stifler9421s-organization',
  android: {
    ...config.android,
    package: 'com.stifler9421sorganization.picswipewipe',
    edgeToEdgeEnabled: true,
  },
  plugins: [
    [
      'expo-router',
      {
        root: './apps/rn-pic-swipe-wipe/app', // This must be from the top level
      },
    ],
    [
      'expo-media-library',
      {
        photosPermission: 'Allow Pic Swipe Wipe to access your photos.',
        savePhotosPermission: 'Allow Pic Swipe Wipe to save changes to your photos.',
      },
    ],
    'expo-sqlite',
    '@react-native-community/datetimepicker',
    'expo-video',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    ...config.extra,
    eas: {
      projectId: '86c6d008-f506-4115-b277-c4670e0634e6',
    },
  },
});

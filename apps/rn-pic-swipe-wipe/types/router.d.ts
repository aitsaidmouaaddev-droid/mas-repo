/* eslint-disable */
/**
 * Stable typed-routes declaration for expo-router.
 * This file is manually maintained to prevent the auto-generated
 * .expo/types/router.d.ts (which is excluded from tsconfig) from
 * polluting type-checking with monorepo lib paths.
 *
 * Update when adding or removing route files under app/.
 */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams:
        | { pathname: Router.RelativePathString; params?: Router.UnknownInputParams }
        | { pathname: Router.ExternalPathString; params?: Router.UnknownInputParams }
        | { pathname: `/`; params?: Router.UnknownInputParams }
        | { pathname: `/(tabs)/ApprovedTab`; params?: Router.UnknownInputParams }
        | { pathname: `/(tabs)/HomeTab`; params?: Router.UnknownInputParams }
        | { pathname: `/(tabs)/TrashTab`; params?: Router.UnknownInputParams }
        | { pathname: `/(tabs)/FocusUnmount.wrapper`; params?: Router.UnknownInputParams }
        | { pathname: `/components/loading/Loading`; params?: Router.UnknownInputParams }
        | {
            pathname: `/components/media-screen-layout/MediaScreenLayout`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `/screens/approved-screen/ApprovedScreen`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/screens/home-screen/HomeScreen`; params?: Router.UnknownInputParams }
        | { pathname: `/screens/loading-screen/LoadingScreen`; params?: Router.UnknownInputParams }
        | { pathname: `/screens/trash-screen/TrashScreen`; params?: Router.UnknownInputParams }
        | { pathname: `/_sitemap`; params?: Router.UnknownInputParams };

      hrefOutputParams:
        | { pathname: Router.RelativePathString; params?: Router.UnknownOutputParams }
        | { pathname: Router.ExternalPathString; params?: Router.UnknownOutputParams }
        | { pathname: `/`; params?: Router.UnknownOutputParams }
        | { pathname: `/(tabs)/ApprovedTab`; params?: Router.UnknownOutputParams }
        | { pathname: `/(tabs)/HomeTab`; params?: Router.UnknownOutputParams }
        | { pathname: `/(tabs)/TrashTab`; params?: Router.UnknownOutputParams }
        | { pathname: `/(tabs)/FocusUnmount.wrapper`; params?: Router.UnknownOutputParams }
        | { pathname: `/components/loading/Loading`; params?: Router.UnknownOutputParams }
        | {
            pathname: `/components/media-screen-layout/MediaScreenLayout`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `/screens/approved-screen/ApprovedScreen`;
            params?: Router.UnknownOutputParams;
          }
        | { pathname: `/screens/home-screen/HomeScreen`; params?: Router.UnknownOutputParams }
        | { pathname: `/screens/loading-screen/LoadingScreen`; params?: Router.UnknownOutputParams }
        | { pathname: `/screens/trash-screen/TrashScreen`; params?: Router.UnknownOutputParams }
        | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams };

      href:
        | Router.RelativePathString
        | Router.ExternalPathString
        | `/${`?${string}` | `#${string}` | ''}`
        | `/(tabs)/ApprovedTab${`?${string}` | `#${string}` | ''}`
        | `/(tabs)/HomeTab${`?${string}` | `#${string}` | ''}`
        | `/(tabs)/TrashTab${`?${string}` | `#${string}` | ''}`
        | `/(tabs)/FocusUnmount.wrapper${`?${string}` | `#${string}` | ''}`
        | `/components/loading/Loading${`?${string}` | `#${string}` | ''}`
        | `/components/media-screen-layout/MediaScreenLayout${`?${string}` | `#${string}` | ''}`
        | `/screens/approved-screen/ApprovedScreen${`?${string}` | `#${string}` | ''}`
        | `/screens/home-screen/HomeScreen${`?${string}` | `#${string}` | ''}`
        | `/screens/loading-screen/LoadingScreen${`?${string}` | `#${string}` | ''}`
        | `/screens/trash-screen/TrashScreen${`?${string}` | `#${string}` | ''}`
        | `/_sitemap${`?${string}` | `#${string}` | ''}`
        | { pathname: Router.RelativePathString; params?: Router.UnknownInputParams }
        | { pathname: Router.ExternalPathString; params?: Router.UnknownInputParams }
        | { pathname: `/`; params?: Router.UnknownInputParams }
        | { pathname: `/(tabs)/ApprovedTab`; params?: Router.UnknownInputParams }
        | { pathname: `/(tabs)/HomeTab`; params?: Router.UnknownInputParams }
        | { pathname: `/(tabs)/TrashTab`; params?: Router.UnknownInputParams }
        | { pathname: `/(tabs)/FocusUnmount.wrapper`; params?: Router.UnknownInputParams }
        | { pathname: `/components/loading/Loading`; params?: Router.UnknownInputParams }
        | {
            pathname: `/components/media-screen-layout/MediaScreenLayout`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `/screens/approved-screen/ApprovedScreen`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/screens/home-screen/HomeScreen`; params?: Router.UnknownInputParams }
        | { pathname: `/screens/loading-screen/LoadingScreen`; params?: Router.UnknownInputParams }
        | { pathname: `/screens/trash-screen/TrashScreen`; params?: Router.UnknownInputParams }
        | { pathname: `/_sitemap`; params?: Router.UnknownInputParams };
    }
  }
}

/* eslint-disable react/jsx-no-useless-fragment */
import React, { Suspense, type ComponentType, type ReactNode } from 'react';

/**
 * Extra props injected by the {@link withSkeleton} HOC.
 *
 * @property loading - When `true`, the skeleton fallback is rendered immediately
 * instead of the wrapped component.
 */
type WithSkeletonExtraProps = {
  loading?: boolean;
};

/**
 * Describes the fallback accepted by {@link withSkeleton}.
 *
 * It can be either:
 * - a static React node, or
 * - a factory function that receives the wrapped component props and returns
 *   a React node dynamically.
 *
 * @typeParam P - Props of the wrapped component.
 */
type FallbackFactory<P> = ReactNode | ((props: Partial<P>) => ReactNode);

/**
 * Wraps a component with skeleton loading support and React Suspense fallback support.
 *
 * This higher-order component provides a unified loading experience for two cases:
 *
 * 1. **Manual loading state** via the `loading` prop  
 *    When `loading` is `true`, the fallback is rendered immediately.
 *
 * 2. **Suspense loading state** via `React.Suspense`  
 *    When `loading` is `false`, the wrapped component is rendered inside
 *    a `Suspense` boundary. If that component suspends (for example when using
 *    `React.lazy()` or another Suspense-enabled data source), the same fallback
 *    is displayed automatically.
 *
 * If no custom `fallback` is provided, the given `Skeleton` component is rendered
 * by default and receives the wrapped component props as `Partial<P>`.
 *
 * @typeParam P - Props of the wrapped component.
 *
 * @param Component - The main component to render when not loading.
 * @param Skeleton - The skeleton component used as the default fallback.
 * It receives partial props from the wrapped component so it can optionally
 * mirror its layout.
 * @param fallback - Optional custom fallback. Can be:
 * - a static React node
 * - a function receiving the current props and returning a React node
 *
 * @returns A component that accepts:
 * - all original props of `Component`
 * - an additional optional `loading` prop
 *
 * @example
 * ```tsx
 * const UserCardWithSkeleton = withSkeleton(UserCard, UserCardSkeleton);
 *
 * <UserCardWithSkeleton loading={isLoading} user={user} />
 * ```
 *
 * @example
 * ```tsx
 * const LazyProfile = React.lazy(() => import('./Profile'));
 *
 * const ProfileWithSkeleton = withSkeleton(
 *   LazyProfile,
 *   ProfileSkeleton
 * );
 * ```
 *
 * @remarks
 * `Suspense` fallback is only shown if the wrapped component actually suspends.
 * Regular synchronous components will not trigger the `Suspense` fallback unless
 * `loading` is explicitly set to `true`.
 */
export function withSkeleton<P extends object>(
  Component: ComponentType<P>,
  Skeleton: ComponentType<Partial<P>>,
  fallback?: FallbackFactory<P>
): ComponentType<P & WithSkeletonExtraProps> {
  /**
   * Component returned by {@link withSkeleton}.
   *
   * It resolves the fallback once per render and uses it both for:
   * - immediate manual loading state
   * - Suspense fallback rendering
   *
   * @param props - Original component props plus the optional `loading` flag.
   * @returns The fallback or the wrapped component inside `Suspense`.
   */
  return function WithSkeleton({
    loading,
    ...props
  }: P & WithSkeletonExtraProps) {
    const skeletonFallback =
      typeof fallback === 'function'
        ? fallback(props as Partial<P>)
        : fallback ?? <Skeleton {...(props as Partial<P>)} />;

    if (loading) {
      return <>{skeletonFallback}</>;
    }

    return (
      <Suspense fallback={skeletonFallback}>
        <Component {...(props as P)} />
      </Suspense>
    );
  };
}
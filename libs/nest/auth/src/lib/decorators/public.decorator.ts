import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route or resolver as publicly accessible — bypasses the JWT guard.
 *
 * @example
 * ```ts
 * \@Public()
 * \@Mutation(() => AuthPayload)
 * login(@Args('input') input: LoginInput) { ... }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

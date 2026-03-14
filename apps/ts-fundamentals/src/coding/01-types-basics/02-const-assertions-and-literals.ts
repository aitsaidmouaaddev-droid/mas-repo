/**
 * CONCEPT: Literal Types, const assertions (`as const`), and `satisfies`
 *
 * WHY: Literal types let TypeScript track EXACT values rather than broad
 * categories. `as const` locks down inferred types to their narrowest form
 * and marks objects as deeply readonly. `satisfies` validates a value against
 * a type while keeping the narrow inferred type.
 *
 * WHEN/WHERE: Configuration objects, route definitions, event names, color
 * palettes, feature flags — any place where the exact value matters.
 *
 * DOCS:
 * - https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-inference
 * - https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator
 */

// ─── Exercise 1 ───────────────────────────────────────────────────────────────
// Create an HTTP_METHODS constant using `as const` so that
// HTTP_METHODS.GET has type `'GET'` (not `string`)
// TODO: define HTTP_METHODS with as const
export const HTTP_METHODS = {
  // TODO: add GET, POST, PUT, DELETE, PATCH methods
};

// ─── Exercise 2 ───────────────────────────────────────────────────────────────
// Create a ROUTES array using `as const` so each route is a literal type
// Include: '/home', '/about', '/contact'
// TODO: define ROUTES array with as const
export const ROUTES = [] as const; // replace with actual routes

// ─── Exercise 3 ───────────────────────────────────────────────────────────────
// Derive a `Route` type from the ROUTES constant (the union of all route strings)
// Hint: use `typeof ROUTES[number]`
// TODO: define Route type from ROUTES
export type Route = unknown;

// ─── Exercise 4 ───────────────────────────────────────────────────────────────
// Create a `PALETTE` object using `satisfies` to:
// 1. Validate it matches Record<string, string | number[]>
// 2. But keep the inferred type (so `PALETTE.red` is `number[]` not `string | number[]`)
// It should have: red: [255, 0, 0], green: '#00ff00', blue: [0, 0, 255]
// TODO: define PALETTE with satisfies
export const PALETTE = {
  // TODO: fill in with satisfies Record<string, string | number[]>
};

// ─── Exercise 5 ───────────────────────────────────────────────────────────────
// Write a function `getMethod` that takes an `HttpMethod` type
// (which should be the union of all values in HTTP_METHODS using keyof/typeof)
// and returns the value as-is.
// TODO: define HttpMethod type
export type HttpMethod = unknown;

// TODO: implement getMethod
export function getMethod(method: HttpMethod): HttpMethod {
  throw new Error('Not implemented');
}

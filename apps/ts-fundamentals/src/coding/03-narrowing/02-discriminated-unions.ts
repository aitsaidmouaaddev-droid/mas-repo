/**
 * CONCEPT: Discriminated Unions (Tagged Unions / Algebraic Data Types)
 *
 * WHY: Discriminated unions are the most powerful pattern for modeling state
 * in TypeScript. They combine union types with a shared literal discriminant
 * property, enabling exhaustive type-safe state handling with no runtime overhead.
 *
 * WHEN/WHERE: API response types, state machines, async state (loading/error/success),
 * parsers, interpreters, any domain with mutually exclusive states.
 *
 * DOCS: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
 */

// ─── Exercise 1 ───────────────────────────────────────────────────────────────
// Model async fetch state as a discriminated union with THREE states:
// - 'loading': no data
// - 'success': data: T
// - 'error': error: Error, retryCount: number
// TODO: define AsyncState<T> discriminated union
export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error; retryCount: number };

// ─── Exercise 2 ───────────────────────────────────────────────────────────────
// Write a function `renderState<T>(state: AsyncState<T>, render: (data: T) => string): string`
// that returns:
// - 'Loading...' for loading
// - the result of render(data) for success
// - `Error: ${message} (retry: ${count})` for error
// Use switch on state.status
// TODO: implement renderState
export function renderState<T>(state: AsyncState<T>, render: (data: T) => string): string {
  throw new Error('Not implemented');
}

// ─── Exercise 3 ───────────────────────────────────────────────────────────────
// Model a traffic light with a discriminated union — each state has different data:
// - 'red': duration: number (seconds)
// - 'yellow': duration: number, isFlashing: boolean
// - 'green': duration: number, isPedestrianActive: boolean
// Write getWaitTime(light: TrafficLight): number that sums all durations
// TODO: define TrafficLight discriminated union
export type TrafficLight =
  | { color: 'red'; duration: number }
  | { color: 'yellow'; duration: number; isFlashing: boolean }
  | { color: 'green'; duration: number; isPedestrianActive: boolean };

// TODO: implement getWaitTime
export function getWaitTime(light: TrafficLight): number {
  throw new Error('Not implemented');
}

// ─── Exercise 4 ───────────────────────────────────────────────────────────────
// Use the `in` operator to narrow a NotificationPayload union:
// - Email: { to: string; subject: string; body: string }
// - SMS: { phone: string; text: string }
// - Push: { deviceId: string; title: string; message: string }
// Write `sendNotification(payload: NotificationPayload): string` that returns
// a summary string like 'Email to: alice@...' / 'SMS to: +33...' / 'Push to: device-xxx'
// TODO: define union and implement
export type NotificationPayload =
  | { to: string; subject: string; body: string }
  | { phone: string; text: string }
  | { deviceId: string; title: string; message: string };

export function sendNotification(payload: NotificationPayload): string {
  throw new Error('Not implemented');
}

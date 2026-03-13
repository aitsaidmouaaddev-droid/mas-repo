/**
 * CONCEPT: Function Overloads
 *
 * WHY: Overloads let a single function expose MULTIPLE type signatures, giving
 * callers precise return types based on what they pass. Without overloads,
 * TypeScript can only return the widest union type, losing precision.
 *
 * WHEN/WHERE: When a function behaves differently based on input types and you
 * want callers to get the exact return type. APIs like DOM's `querySelector`
 * and `getElementById` use overloads.
 *
 * DOCS: https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads
 */

// ─── Exercise 1 ───────────────────────────────────────────────────────────────
// Write an overloaded function `convert` that:
// - When called with a string, returns a number (parseInt)
// - When called with a number, returns a string (String())
// The implementation accepts `string | number` and returns `string | number`
// TODO: write the two overload signatures + implementation
export function convert(x: string): number;
export function convert(x: number): string;
export function convert(x: string | number): string | number {
  throw new Error('Not implemented');
}

// ─── Exercise 2 ───────────────────────────────────────────────────────────────
// Write an overloaded function `createElement` that:
// - Called with 'input' → returns { type: 'input'; value: string }
// - Called with 'checkbox' → returns { type: 'checkbox'; checked: boolean }
// - Called with 'text' → returns { type: 'text'; content: string }
// TODO: write overload signatures + implementation
export type InputElement = { type: 'input'; value: string };
export type CheckboxElement = { type: 'checkbox'; checked: boolean };
export type TextElement = { type: 'text'; content: string };

export function createElement(tag: 'input'): InputElement;
export function createElement(tag: 'checkbox'): CheckboxElement;
export function createElement(tag: 'text'): TextElement;
export function createElement(
  tag: 'input' | 'checkbox' | 'text',
): InputElement | CheckboxElement | TextElement {
  throw new Error('Not implemented');
}

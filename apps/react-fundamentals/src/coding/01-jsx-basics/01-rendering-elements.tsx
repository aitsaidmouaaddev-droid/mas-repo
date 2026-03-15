/**
 * CONCEPT: JSX Basics — Rendering Elements
 *
 * WHY: JSX is the syntax extension that lets you write HTML-like markup
 * inside JavaScript. Understanding how to render elements, use expressions,
 * and apply attributes is the foundation of every React app.
 */

// ─── Exercise 1 ───────────────────────────────────────────────────────────────
// Create a component `Greeting` that accepts a `name` prop and renders:
//   <h1>Hello, {name}!</h1>
//
// TODO: implement Greeting

export function Greeting({ name }: { name: string }) {
  // TODO: return JSX
  return null;
}

// ─── Exercise 2 ───────────────────────────────────────────────────────────────
// Create a component `Sum` that accepts `a` and `b` number props, and renders:
//   <span>{a + b}</span>
//
// TODO: implement Sum

export function Sum({ a, b }: { a: number; b: number }) {
  // TODO: return JSX
  return null;
}

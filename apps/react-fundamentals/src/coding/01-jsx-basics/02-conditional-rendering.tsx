/**
 * CONCEPT: JSX Basics — Conditional Rendering
 *
 * WHY: React apps constantly show/hide UI based on state.
 * You need to master ternaries, logical &&, and early returns
 * to control what renders.
 */

// ─── Exercise 1 ───────────────────────────────────────────────────────────────
// Create a component `StatusBadge` that accepts an `isOnline` boolean prop.
// If online, render: <span className="online">Online</span>
// If offline, render: <span className="offline">Offline</span>
//
// TODO: implement StatusBadge

export function StatusBadge({ isOnline }: { isOnline: boolean }) {
  // TODO: return conditional JSX
  return null;
}

// ─── Exercise 2 ───────────────────────────────────────────────────────────────
// Create a component `AdminPanel` that accepts an `isAdmin` boolean prop.
// If isAdmin is true, render: <div>Welcome, admin</div>
// If false, render nothing (null).
//
// TODO: implement AdminPanel

export function AdminPanel({ isAdmin }: { isAdmin: boolean }) {
  // TODO: return conditional JSX
  return null;
}

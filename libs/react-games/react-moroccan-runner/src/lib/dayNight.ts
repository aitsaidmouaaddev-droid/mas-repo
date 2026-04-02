// ── Day / night cycle ─────────────────────────────────────────────────────────
// Full cycle = 120 s — same smoothstep approach as Flappy Bird canvas.

const CYCLE = 120_000; // ms

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

/**
 * Returns 1 for full day, 0 for full night.
 * Transition zones: sunset 42-50 %, sunrise 92-100 % of cycle.
 */
export function getDayFraction(nowMs: number): number {
  const t = (nowMs % CYCLE) / CYCLE;
  if (t < 0.42) return 1;
  if (t < 0.5) return 1 - smoothstep((t - 0.42) / 0.08);
  if (t < 0.92) return 0;
  return smoothstep((t - 0.92) / 0.08);
}

/** Linear interpolation between two RGB components */
export function lerpN(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * Math.max(0, Math.min(1, t)));
}

/** Lerp between two CSS rgb(...) strings using separate channel triplets */
export function lerpRGB(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number,
  t: number,
): string {
  return `rgb(${lerpN(r1, r2, t)},${lerpN(g1, g2, t)},${lerpN(b1, b2, t)})`;
}

/** Returns a star alpha 0-1 (0 during day, 1 at full night) */
export function starAlpha(df: number): number {
  return Math.max(0, 1 - df * 2);
}

import { describe, it, expect } from 'vitest';
import { getDayFraction, lerpN, lerpRGB, starAlpha } from './dayNight';

// Full cycle = 120 000 ms
const CYCLE = 120_000;

// ── getDayFraction ─────────────────────────────────────────────────────────────

describe('getDayFraction', () => {
  it('returns 1 (full day) at t=0', () => {
    expect(getDayFraction(0)).toBe(1);
  });

  it('returns 1 (full day) during day phase (t < 42%)', () => {
    expect(getDayFraction(CYCLE * 0.2)).toBe(1);
    expect(getDayFraction(CYCLE * 0.41)).toBe(1);
  });

  it('returns 0 (full night) at mid-night phase (t = 70%)', () => {
    expect(getDayFraction(CYCLE * 0.7)).toBe(0);
  });

  it('returns 0 (full night) during full night phase (50%–92%)', () => {
    expect(getDayFraction(CYCLE * 0.55)).toBe(0);
    expect(getDayFraction(CYCLE * 0.91)).toBe(0);
  });

  it('returns value between 0 and 1 during sunset transition (42%–50%)', () => {
    const df = getDayFraction(CYCLE * 0.46);
    expect(df).toBeGreaterThan(0);
    expect(df).toBeLessThan(1);
  });

  it('returns value between 0 and 1 during sunrise transition (92%–100%)', () => {
    const df = getDayFraction(CYCLE * 0.96);
    expect(df).toBeGreaterThan(0);
    expect(df).toBeLessThan(1);
  });

  it('returns 1 at exact end of cycle (wraps back to day)', () => {
    // t = 100% → 0% → full day
    expect(getDayFraction(CYCLE)).toBe(1);
  });

  it('transitions monotonically from day to night during sunset', () => {
    const times = [0.42, 0.44, 0.46, 0.48, 0.5].map((t) => getDayFraction(CYCLE * t));
    for (let i = 1; i < times.length; i++) {
      expect(times[i]).toBeLessThanOrEqual(times[i - 1]);
    }
  });

  it('transitions monotonically from night to day during sunrise', () => {
    const times = [0.92, 0.94, 0.96, 0.98, 1.0].map((t) => getDayFraction(CYCLE * t));
    for (let i = 1; i < times.length; i++) {
      expect(times[i]).toBeGreaterThanOrEqual(times[i - 1]);
    }
  });

  it('handles very large nowMs via modulo', () => {
    // 10 full cycles + a bit = same as just the bit
    const base = getDayFraction(CYCLE * 0.25);
    const large = getDayFraction(CYCLE * 10.25);
    expect(large).toBeCloseTo(base, 5);
  });
});

// ── lerpN ────────────────────────────────────────────────────────────────────

describe('lerpN', () => {
  it('returns a at t=0', () => {
    expect(lerpN(0, 255, 0)).toBe(0);
  });

  it('returns b at t=1', () => {
    expect(lerpN(0, 255, 1)).toBe(255);
  });

  it('returns midpoint at t=0.5', () => {
    expect(lerpN(0, 100, 0.5)).toBe(50);
  });

  it('clamps t below 0', () => {
    expect(lerpN(0, 100, -1)).toBe(0);
  });

  it('clamps t above 1', () => {
    expect(lerpN(0, 100, 2)).toBe(100);
  });

  it('rounds result to integer', () => {
    const result = lerpN(0, 100, 0.333);
    expect(Number.isInteger(result)).toBe(true);
  });
});

// ── lerpRGB ───────────────────────────────────────────────────────────────────

describe('lerpRGB', () => {
  it('returns first colour at t=0', () => {
    expect(lerpRGB(10, 20, 30, 200, 150, 100, 0)).toBe('rgb(10,20,30)');
  });

  it('returns second colour at t=1', () => {
    expect(lerpRGB(10, 20, 30, 200, 150, 100, 1)).toBe('rgb(200,150,100)');
  });

  it('produces intermediate colour at t=0.5', () => {
    expect(lerpRGB(0, 0, 0, 100, 100, 100, 0.5)).toBe('rgb(50,50,50)');
  });

  it('produces valid rgb(...) string format', () => {
    const result = lerpRGB(100, 150, 200, 50, 75, 100, 0.5);
    expect(result).toMatch(/^rgb\(\d+,\d+,\d+\)$/);
  });
});

// ── starAlpha ─────────────────────────────────────────────────────────────────

describe('starAlpha', () => {
  it('returns 1 at full night (df=0)', () => {
    expect(starAlpha(0)).toBe(1);
  });

  it('returns 0 at full day (df=1)', () => {
    expect(starAlpha(1)).toBe(0);
  });

  it('returns 0 at df=0.5 (half day)', () => {
    expect(starAlpha(0.5)).toBe(0);
  });

  it('returns intermediate value between day and night', () => {
    const alpha = starAlpha(0.25);
    expect(alpha).toBeGreaterThan(0);
    expect(alpha).toBeLessThanOrEqual(1);
  });

  it('never returns negative', () => {
    for (const df of [0, 0.1, 0.3, 0.5, 0.7, 1]) {
      expect(starAlpha(df)).toBeGreaterThanOrEqual(0);
    }
  });
});

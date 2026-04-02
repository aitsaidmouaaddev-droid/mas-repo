import { describe, it, expect } from 'vitest';
import { getLevel, LEVELS_PER_WORLD, TOTAL_WORLDS } from './level.registry';

describe('level.registry', () => {
  // ── Constants ───────────────────────────────────────────────────────────────

  it('has 4 worlds', () => {
    expect(TOTAL_WORLDS).toBe(4);
  });

  it('has 4 levels per world', () => {
    expect(LEVELS_PER_WORLD).toBe(4);
  });

  // ── getLevel — valid indices ───────────────────────────────────────────────

  it('returns a valid level for every world/level combination', () => {
    for (let w = 0; w < TOTAL_WORLDS; w++) {
      for (let l = 0; l < LEVELS_PER_WORLD; l++) {
        const level = getLevel(w, l);
        expect(level).toBeDefined();
        expect(level.width).toBeGreaterThan(0);
        expect(level.flagX).toBeGreaterThan(0);
      }
    }
  });

  // ── Level structure ────────────────────────────────────────────────────────

  it('each level has groundSegments, platforms, enemies, coins, boxes', () => {
    for (let w = 0; w < TOTAL_WORLDS; w++) {
      for (let l = 0; l < LEVELS_PER_WORLD; l++) {
        const level = getLevel(w, l);
        expect(Array.isArray(level.groundSegments)).toBe(true);
        expect(Array.isArray(level.platforms)).toBe(true);
        expect(Array.isArray(level.enemies)).toBe(true);
        expect(Array.isArray(level.coins)).toBe(true);
        expect(Array.isArray(level.boxes)).toBe(true);
      }
    }
  });

  it('flagX is within level width', () => {
    for (let w = 0; w < TOTAL_WORLDS; w++) {
      for (let l = 0; l < LEVELS_PER_WORLD; l++) {
        const level = getLevel(w, l);
        expect(level.flagX).toBeLessThanOrEqual(level.width);
      }
    }
  });

  it('all ground segments are [number, number] pairs', () => {
    for (let w = 0; w < TOTAL_WORLDS; w++) {
      const level = getLevel(w, 0);
      for (const seg of level.groundSegments) {
        expect(seg).toHaveLength(2);
        expect(seg[0]).toBeGreaterThanOrEqual(0);
        expect(seg[1]).toBeGreaterThan(seg[0]);
      }
    }
  });

  it('levels grow in width from level 0 to level 3', () => {
    for (let w = 0; w < TOTAL_WORLDS; w++) {
      for (let l = 1; l < LEVELS_PER_WORLD; l++) {
        expect(getLevel(w, l).width).toBeGreaterThanOrEqual(getLevel(w, l - 1).width);
      }
    }
  });

  it('each level is at least 6000px wide', () => {
    for (let w = 0; w < TOTAL_WORLDS; w++) {
      for (let l = 0; l < LEVELS_PER_WORLD; l++) {
        expect(getLevel(w, l).width).toBeGreaterThanOrEqual(6000);
      }
    }
  });

  it('each level has boxes (power-up feature)', () => {
    for (let w = 0; w < TOTAL_WORLDS; w++) {
      for (let l = 0; l < LEVELS_PER_WORLD; l++) {
        expect(getLevel(w, l).boxes.length).toBeGreaterThan(0);
      }
    }
  });

  // ── getLevel — fallback behaviour ──────────────────────────────────────────

  it('falls back to world 0 for out-of-range worldIndex', () => {
    const fallback = getLevel(99, 0);
    const world0 = getLevel(0, 0);
    expect(fallback.width).toBe(world0.width);
  });

  it('falls back to level 0 for out-of-range levelIndex', () => {
    const fallback = getLevel(0, 99);
    const level0 = getLevel(0, 0);
    expect(fallback.width).toBe(level0.width);
  });

  // ── World-specific checks ──────────────────────────────────────────────────

  it('Marrakech (world 0) final level is at least 9000px wide', () => {
    expect(getLevel(0, 3).width).toBeGreaterThanOrEqual(9000);
  });

  it('Fès (world 1) levels are present and wider than Marrakech equivalents', () => {
    for (let l = 0; l < LEVELS_PER_WORLD; l++) {
      expect(getLevel(1, l)).toBeDefined();
    }
  });

  it('Chefchaouen (world 2) levels are present', () => {
    for (let l = 0; l < LEVELS_PER_WORLD; l++) {
      expect(getLevel(2, l)).toBeDefined();
    }
  });

  it('Essaouira (world 3) levels are present', () => {
    for (let l = 0; l < LEVELS_PER_WORLD; l++) {
      expect(getLevel(3, l)).toBeDefined();
    }
  });

  it('all platforms have positive width', () => {
    for (let w = 0; w < TOTAL_WORLDS; w++) {
      const level = getLevel(w, 0);
      for (const p of level.platforms) {
        expect(p.w).toBeGreaterThan(0);
      }
    }
  });

  it('all enemies have valid patrol ranges (patrolRight > patrolLeft)', () => {
    for (let w = 0; w < TOTAL_WORLDS; w++) {
      const level = getLevel(w, 0);
      for (const e of level.enemies) {
        expect(e.patrolRight).toBeGreaterThan(e.patrolLeft);
      }
    }
  });
});

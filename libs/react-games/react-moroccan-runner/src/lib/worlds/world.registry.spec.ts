import { describe, it, expect } from 'vitest';
import { getWorld, getAllWorlds } from './world.registry';
import { TOTAL_WORLDS } from '../levels/level.registry';

describe('world.registry', () => {
  // ── getAllWorlds ─────────────────────────────────────────────────────────────

  it('returns all 4 worlds', () => {
    expect(getAllWorlds()).toHaveLength(TOTAL_WORLDS);
  });

  it('all worlds have unique ids', () => {
    const ids = getAllWorlds().map((w) => w.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('all worlds have a non-empty name', () => {
    for (const world of getAllWorlds()) {
      expect(world.name.length).toBeGreaterThan(0);
    }
  });

  // ── getWorld ────────────────────────────────────────────────────────────────

  it('returns Marrakech for world 0', () => {
    expect(getWorld(0).id).toBe('marrakech');
  });

  it('returns Fès for world 1', () => {
    expect(getWorld(1).id).toBe('fes');
  });

  it('returns Chefchaouen for world 2', () => {
    expect(getWorld(2).id).toBe('chefchaouen');
  });

  it('returns Essaouira for world 3', () => {
    expect(getWorld(3).id).toBe('essaouira');
  });

  it('falls back to Marrakech for out-of-range index', () => {
    expect(getWorld(99).id).toBe('marrakech');
  });

  it('falls back to Marrakech for negative index', () => {
    expect(getWorld(-1).id).toBe('marrakech');
  });

  // ── WorldDescriptor shape ───────────────────────────────────────────────────

  it('each world exposes required draw methods', () => {
    for (const world of getAllWorlds()) {
      expect(typeof world.drawBackground).toBe('function');
      expect(typeof world.drawGround).toBe('function');
      expect(typeof world.drawPlatform).toBe('function');
      expect(typeof world.drawCoin).toBe('function');
      expect(typeof world.drawEnemy).toBe('function');
      expect(typeof world.drawFlag).toBe('function');
    }
  });

  it('each world has groundColor and groundHeight', () => {
    for (const world of getAllWorlds()) {
      expect(world.groundColor).toBeTruthy();
      expect(world.groundHeight).toBeGreaterThan(0);
    }
  });
});

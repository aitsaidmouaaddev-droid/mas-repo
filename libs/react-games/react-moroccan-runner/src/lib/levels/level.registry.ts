import type { LevelLayout } from './level.types';
import { MARRAKECH_LEVELS } from './marrakech.levels';
import { FES_LEVELS } from './fes.levels';
import { CHEFCHAOUEN_LEVELS } from './chefchaouen.levels';
import { ESSAOUIRA_LEVELS } from './essaouira.levels';

// ── Registry ──────────────────────────────────────────────────────────────────
// To add a new world: append its levels array here.
// worldIndex matches the order in the world.registry.ts WORLD_ORDER array.

export const LEVELS_PER_WORLD = 4;

const LEVEL_REGISTRY: LevelLayout[][] = [
  MARRAKECH_LEVELS, // world 0
  FES_LEVELS, // world 1
  CHEFCHAOUEN_LEVELS, // world 2
  ESSAOUIRA_LEVELS, // world 3
];

export const TOTAL_WORLDS = LEVEL_REGISTRY.length;

export function getLevel(worldIndex: number, levelIndex: number): LevelLayout {
  const world = LEVEL_REGISTRY[worldIndex] ?? LEVEL_REGISTRY[0];
  return world[levelIndex] ?? world[0];
}

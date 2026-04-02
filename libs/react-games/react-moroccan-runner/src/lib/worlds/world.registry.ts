import type { WorldDescriptor } from './world.types';
import { MARRAKECH_WORLD } from './marrakech.world';
import { FES_WORLD } from './fes.world';
import { CHEFCHAOUEN_WORLD } from './chefchaouen.world';
import { ESSAOUIRA_WORLD } from './essaouira.world';

// ── Registry ──────────────────────────────────────────────────────────────────
// Order MUST match level.registry.ts LEVEL_REGISTRY order.
// To add a world: append both here and in level.registry.ts.

export const WORLD_REGISTRY: WorldDescriptor[] = [
  MARRAKECH_WORLD, // world 0
  FES_WORLD, // world 1
  CHEFCHAOUEN_WORLD, // world 2
  ESSAOUIRA_WORLD, // world 3
];

export function getWorld(worldIndex: number): WorldDescriptor {
  return WORLD_REGISTRY[worldIndex] ?? MARRAKECH_WORLD;
}

export function getAllWorlds(): WorldDescriptor[] {
  return WORLD_REGISTRY;
}

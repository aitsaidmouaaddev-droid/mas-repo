import type { CharacterDescriptor } from './character.types';
import { HASSAN } from './hassan.character';
import { FATIMA } from './fatima.character';

// ── Registry ──────────────────────────────────────────────────────────────────
// Add new characters here — they appear automatically on the character select screen.

const CHARACTER_REGISTRY = new Map<string, CharacterDescriptor>([
  [HASSAN.id, HASSAN],
  [FATIMA.id, FATIMA],
]);

export function getCharacter(id: string): CharacterDescriptor {
  return CHARACTER_REGISTRY.get(id) ?? HASSAN;
}

export function getAllCharacters(): CharacterDescriptor[] {
  return [...CHARACTER_REGISTRY.values()];
}

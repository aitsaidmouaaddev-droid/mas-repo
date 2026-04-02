import { describe, it, expect } from 'vitest';
import { getCharacter, getAllCharacters } from './character.registry';

describe('character.registry', () => {
  // ── getAllCharacters ─────────────────────────────────────────────────────────

  it('returns 2 characters', () => {
    expect(getAllCharacters()).toHaveLength(2);
  });

  it('all characters have unique ids', () => {
    const ids = getAllCharacters().map((c) => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('includes Hassan', () => {
    const ids = getAllCharacters().map((c) => c.id);
    expect(ids).toContain('hassan');
  });

  it('includes Fatima', () => {
    const ids = getAllCharacters().map((c) => c.id);
    expect(ids).toContain('fatima');
  });

  // ── getCharacter ─────────────────────────────────────────────────────────────

  it('returns Hassan by id', () => {
    expect(getCharacter('hassan').id).toBe('hassan');
  });

  it('returns Fatima by id', () => {
    expect(getCharacter('fatima').id).toBe('fatima');
  });

  it('falls back to Hassan for unknown id', () => {
    expect(getCharacter('unknown').id).toBe('hassan');
  });

  // ── CharacterDescriptor shape ─────────────────────────────────────────────

  it('each character has required fields', () => {
    for (const char of getAllCharacters()) {
      expect(char.id.length).toBeGreaterThan(0);
      expect(char.name.length).toBeGreaterThan(0);
      expect(char.color.length).toBeGreaterThan(0);
    }
  });

  it('each character exposes all required SFX methods', () => {
    for (const char of getAllCharacters()) {
      expect(typeof char.playJump).toBe('function');
      expect(typeof char.playCoin).toBe('function');
      expect(typeof char.playDeath).toBe('function');
      expect(typeof char.playKillEnemy).toBe('function');
      expect(typeof char.playLoseLife).toBe('function');
    }
  });

  it('each character has a draw function', () => {
    for (const char of getAllCharacters()) {
      expect(typeof char.draw).toBe('function');
    }
  });
});

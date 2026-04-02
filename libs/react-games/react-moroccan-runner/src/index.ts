export { MoroccanRunnerGameProvider } from './lib/MoroccanRunnerGameProvider';
export { MoroccanRunnerGame } from './lib/MoroccanRunnerGame';
export { MOROCCAN_RUNNER_DESCRIPTOR } from './lib/moroccan-runner.descriptor';
export { platformSlice, platformSlice as default } from './lib/platform.slice';
export type { PlatformerState, GameStatus, Platform, Coin, Enemy } from './lib/platform.slice';

export { getWorld, getAllWorlds } from './lib/worlds/world.registry';
export { getCharacter, getAllCharacters } from './lib/characters/character.registry';
export { getLevel } from './lib/levels/level.registry';
export type { WorldDescriptor } from './lib/worlds/world.types';
export type { CharacterDescriptor } from './lib/characters/character.types';
export type { LevelLayout } from './lib/levels/level.types';

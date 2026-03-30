export interface GameDescriptor {
  uniqueName: string;
  hasScore: boolean;
  hasProgress: boolean;
}

export const SNAKE_DESCRIPTOR: GameDescriptor = {
  uniqueName: 'snake',
  hasScore: true,
  hasProgress: false,
};

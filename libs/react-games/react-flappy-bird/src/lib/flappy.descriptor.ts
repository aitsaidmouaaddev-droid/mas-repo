export interface GameDescriptor {
  uniqueName: string;
  hasScore: boolean;
  hasProgress: boolean;
}

export const FLAPPY_DESCRIPTOR: GameDescriptor = {
  uniqueName: 'flappy-bird',
  hasScore: true,
  hasProgress: false,
};

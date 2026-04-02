export interface GameDescriptor {
  uniqueName: string;
  hasScore: boolean;
  hasProgress: boolean;
}

export const MOROCCAN_RUNNER_DESCRIPTOR: GameDescriptor = {
  uniqueName: 'moroccan-runner',
  hasScore: true,
  hasProgress: true,
};

export interface GameDescriptor {
  uniqueName: string;
  hasScore: boolean;
  hasProgress: boolean;
}

export interface GameProgressData {
  [key: string]: unknown;
}

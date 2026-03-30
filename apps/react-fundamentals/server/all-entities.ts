import { AuthModule } from '@mas/auth';
import { GamesModule } from '@mas/nest-games';
import { LearningModule } from './learning/learning.module';

export const ALL_ENTITIES = [
  ...AuthModule.entities,
  ...LearningModule.entities,
  ...GamesModule.entities,
] as const;

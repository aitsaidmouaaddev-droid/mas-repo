import { Field, ID, InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { User } from '@mas/auth';
import { Game } from '../game/game.entity';

@Entity('game_progress')
@Unique(['userId', 'gameId'])
@Index(['userId'])
@ObjectType()
export class GameProgress extends BaseEntity {
  @IsString()
  @Field(() => ID)
  @Column()
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @IsString()
  @Field(() => ID)
  @Column()
  gameId!: string;

  @ManyToOne(() => Game, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gameId' })
  game?: Game;

  /** Serialised JSON progress blob. Shape is game-specific. */
  @Field(() => String)
  @Column({ type: 'jsonb', default: {} })
  data!: Record<string, unknown>;
}

@InputType()
export class CreateGameProgressInput extends PickType(
  GameProgress,
  ['gameId'] as const,
  InputType,
) {
  /** JSON-serialised progress data. */
  @Field(() => String, { nullable: true })
  data?: string;
}

@InputType()
export class UpdateGameProgressInput extends PartialType(
  PickType(GameProgress, ['gameId'] as const, InputType),
) {
  @Field(() => ID)
  id!: string;

  /** JSON-serialised progress data. */
  @Field(() => String, { nullable: true })
  data?: string;
}


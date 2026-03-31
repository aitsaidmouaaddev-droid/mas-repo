import { Field, ID, InputType, Int, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { IsDateString, IsInt, IsString, Min } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '@mas/nest-graphql-typeorm-base';
import { User } from '@mas/auth';
import { Game } from '../game/game.entity';

@Entity('game_score')
@Unique(['userId', 'gameId'])
@Index(['userId'])
@ObjectType()
export class GameScore extends BaseEntity {
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

  @IsInt()
  @Min(0)
  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  bestScore!: number;

  @IsDateString()
  @Field(() => String, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true, default: null })
  achievedAt!: Date | null;
}

@InputType()
export class CreateGameScoreInput extends PickType(
  GameScore,
  ['gameId', 'bestScore'] as const,
  InputType,
) {}

@InputType()
export class UpdateGameScoreInput extends PartialType(
  PickType(GameScore, ['gameId', 'bestScore'] as const, InputType),
) {
  @Field(() => ID)
  id!: string;
}

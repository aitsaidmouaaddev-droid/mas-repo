import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VideoJobMetadata {
  @Field()
  jobId!: string;

  @Field()
  subjectId!: string;

  @Field(() => Int)
  versionNumber!: number;

  @Field()
  generatedAt!: string;

  @Field(() => Int)
  targetDuration!: number;

  @Field()
  voiceLanguage!: string;

  @Field(() => [String])
  targetPlatforms!: string[];

  @Field()
  generateShorts!: boolean;
}

@ObjectType()
export class VideoJobStrategy {
  @Field()
  angle!: string;

  @Field()
  hook!: string;

  @Field()
  promise!: string;

  @Field()
  targetAudience!: string;

  @Field()
  tone!: string;

  @Field({ nullable: true })
  cta?: string;
}

@ObjectType()
export class SceneSubtitleTracks {
  @Field()
  en!: string;

  @Field()
  fr!: string;

  @Field()
  ar!: string;
}

@ObjectType()
export class SceneVisual {
  @Field()
  type!: string;

  @Field()
  prompt!: string;

  @Field()
  style!: string;

  @Field({ nullable: true })
  cameraMotion?: string;

  @Field({ nullable: true })
  overlayText?: string;
}

@ObjectType()
export class SceneAudio {
  @Field()
  voiceLanguage!: string;

  @Field({ nullable: true })
  backgroundMusic?: string;

  @Field({ nullable: true })
  musicLevel?: string;
}

@ObjectType()
export class SceneTransition {
  @Field()
  in!: string;

  @Field()
  out!: string;
}

@ObjectType()
export class SceneData {
  @Field()
  sceneId!: string;

  @Field()
  chapterId!: string;

  @Field(() => Int)
  order!: number;

  @Field(() => Int)
  durationSeconds!: number;

  @Field()
  purpose!: string;

  @Field()
  voiceText!: string;

  @Field(() => SceneSubtitleTracks)
  subtitleTracks!: SceneSubtitleTracks;

  @Field(() => SceneVisual)
  visual!: SceneVisual;

  @Field(() => SceneAudio)
  audio!: SceneAudio;

  @Field(() => SceneTransition)
  transition!: SceneTransition;

  @Field()
  renderStrategy!: string;
}

@ObjectType()
export class ChapterData {
  @Field()
  chapterId!: string;

  @Field(() => Int)
  order!: number;

  @Field()
  title!: string;

  @Field(() => Int)
  startTimeSeconds!: number;

  @Field(() => Int)
  durationSeconds!: number;
}

@ObjectType()
export class TtsConfig {
  @Field()
  provider!: string;

  @Field()
  language!: string;

  @Field({ nullable: true })
  voiceId?: string;

  @Field({ nullable: true })
  speakingRate?: number;

  @Field({ nullable: true })
  pitch?: number;
}

@ObjectType()
export class MusicSuggestion {
  @Field()
  mood!: string;

  @Field()
  genre!: string;

  @Field({ nullable: true })
  tempo?: string;

  @Field({ nullable: true })
  reference?: string;
}

@ObjectType()
export class ThumbnailConfig {
  @Field()
  prompt!: string;

  @Field()
  style!: string;

  @Field({ nullable: true })
  overlayText?: string;

  @Field({ nullable: true })
  colorPalette?: string;
}

@ObjectType()
export class YoutubeMetadata {
  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field(() => [String])
  tags!: string[];

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  language?: string;
}

@ObjectType()
export class ShortPlanItem {
  @Field(() => Int)
  shortIndex!: number;

  @Field(() => [String])
  sceneIds!: string[];

  @Field(() => Int)
  estimatedDuration!: number;

  @Field()
  hook!: string;

  @Field({ nullable: true })
  cta?: string;
}

@ObjectType()
export class QualityCheck {
  @Field()
  rule!: string;

  @Field()
  status!: string;

  @Field({ nullable: true })
  note?: string;
}

@ObjectType()
export class RiskItem {
  @Field()
  type!: string;

  @Field()
  description!: string;

  @Field()
  severity!: string;
}

@ObjectType()
export class VideoJobData {
  @Field(() => VideoJobMetadata)
  metadata!: VideoJobMetadata;

  @Field(() => VideoJobStrategy)
  strategy!: VideoJobStrategy;

  @Field()
  voiceScript!: string;

  @Field(() => [ChapterData])
  chapters!: ChapterData[];

  @Field(() => [SceneData])
  scenes!: SceneData[];

  @Field(() => Int)
  totalDuration!: number;

  @Field(() => TtsConfig)
  ttsConfig!: TtsConfig;

  @Field(() => [MusicSuggestion])
  musicSuggestions!: MusicSuggestion[];

  @Field(() => ThumbnailConfig)
  thumbnailConfig!: ThumbnailConfig;

  @Field(() => YoutubeMetadata)
  youtubeMetadata!: YoutubeMetadata;

  @Field(() => [ShortPlanItem])
  shortsPlan!: ShortPlanItem[];

  @Field(() => [QualityCheck])
  qualityChecks!: QualityCheck[];

  @Field(() => [RiskItem])
  risks!: RiskItem[];

  @Field({ nullable: true })
  htmlReviewTemplate?: string;
}

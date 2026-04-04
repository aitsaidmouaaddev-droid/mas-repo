import { Module } from '@nestjs/common';
import { UploadModule } from '../upload/upload.module';
import { TtsService } from './tts.service';
import { SrtService } from './srt.service';
import { RenderService } from './render.service';
import { FalVideoService } from './fal-video.service';

@Module({
  imports: [UploadModule],
  providers: [TtsService, SrtService, RenderService, FalVideoService],
  exports: [RenderService],
})
export class RenderModule {}

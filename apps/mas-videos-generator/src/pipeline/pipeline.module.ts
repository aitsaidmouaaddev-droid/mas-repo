import { Module } from '@nestjs/common';
import { ClaudeModule } from '../claude/claude.module';
import { RenderModule } from '../render/render.module';
import { UploadModule } from '../upload/upload.module';
import { JobLogModule } from '../job-log/job-log.module';
import { ReviewModule } from '../review/review.module';
import { PipelineService } from './pipeline.service';
import { PipelineResolver } from './pipeline.resolver';

@Module({
  imports: [ClaudeModule, RenderModule, UploadModule, JobLogModule, ReviewModule],
  providers: [PipelineService, PipelineResolver],
  exports: [PipelineService],
})
export class PipelineModule {}

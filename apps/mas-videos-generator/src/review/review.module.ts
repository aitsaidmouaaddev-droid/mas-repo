import { Module } from '@nestjs/common';
import { ClaudeModule } from '../claude/claude.module';
import { RenderModule } from '../render/render.module';
import { ReviewService } from './review.service';

@Module({
  imports: [ClaudeModule, RenderModule],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}

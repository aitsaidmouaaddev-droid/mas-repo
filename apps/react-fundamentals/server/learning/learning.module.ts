import { Module } from '@nestjs/common';
import { QcmModule } from './qcm/qcm-module.entity';
import { QcmQuestion } from './qcm/qcm-question.entity';
import { QcmSession } from './qcm/qcm-session.entity';
import { QcmAnswer } from './qcm/qcm-answer.entity';
import { QcmProgress } from './qcm/qcm-progress.entity';
import { TdtChallenge } from './tdt/tdt-challenge.entity';
import { TdtSession } from './tdt/tdt-session.entity';
import { TdtSubmission } from './tdt/tdt-submission.entity';
import { TdtProgress } from './tdt/tdt-progress.entity';
import { QcmService } from './qcm/qcm.service';
import { QcmResolver } from './qcm/qcm.resolver';
import { TdtService } from './tdt/tdt.service';
import { TdtResolver } from './tdt/tdt.resolver';

@Module({
  providers: [QcmService, QcmResolver, TdtService, TdtResolver],
})
export class LearningModule {
  /** All TypeORM entities — add to the DataSource entities array. */
  static readonly entities = [
    QcmModule,
    QcmQuestion,
    QcmSession,
    QcmAnswer,
    QcmProgress,
    TdtChallenge,
    TdtSession,
    TdtSubmission,
    TdtProgress,
  ] as const;
}

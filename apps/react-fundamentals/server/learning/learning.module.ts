import { Module } from '@nestjs/common';
import { IdentityContext } from '@mas/nest-graphql-typeorm-base';
import { QcmModule } from './qcm/module/qcm-module.entity';
import { QcmQuestion } from './qcm/question/qcm-question.entity';
import { QcmSession } from './qcm/session/qcm-session.entity';
import { QcmAnswer } from './qcm/answer/qcm-answer.entity';
import { QcmProgress } from './qcm/progress/qcm-progress.entity';
import { TdtChallenge } from './tdt/challenge/tdt-challenge.entity';
import { TdtSession } from './tdt/session/tdt-session.entity';
import { TdtSubmission } from './tdt/submission/tdt-submission.entity';
import { TdtProgress } from './tdt/progress/tdt-progress.entity';
import { QcmModuleService } from './qcm/module/qcm-module.service';
import { QcmModuleResolver } from './qcm/module/qcm-module.resolver';
import { QcmQuestionService } from './qcm/question/qcm-question.service';
import { QcmQuestionResolver } from './qcm/question/qcm-question.resolver';
import { QcmSessionService } from './qcm/session/qcm-session.service';
import { QcmSessionResolver } from './qcm/session/qcm-session.resolver';
import { QcmAnswerService } from './qcm/answer/qcm-answer.service';
import { QcmAnswerResolver } from './qcm/answer/qcm-answer.resolver';
import { QcmProgressService } from './qcm/progress/qcm-progress.service';
import { QcmProgressResolver } from './qcm/progress/qcm-progress.resolver';
import { TdtChallengeService } from './tdt/challenge/tdt-challenge.service';
import { TdtChallengeResolver } from './tdt/challenge/tdt-challenge.resolver';
import { TdtSessionService } from './tdt/session/tdt-session.service';
import { TdtSessionResolver } from './tdt/session/tdt-session.resolver';
import { TdtSubmissionService } from './tdt/submission/tdt-submission.service';
import { TdtSubmissionResolver } from './tdt/submission/tdt-submission.resolver';
import { TdtProgressService } from './tdt/progress/tdt-progress.service';
import { TdtProgressResolver } from './tdt/progress/tdt-progress.resolver';

@Module({
  providers: [
    IdentityContext,
    // ── QCM catalog ──────────────────────────────────────────────────────────
    QcmModuleService,
    QcmModuleResolver,
    QcmQuestionService,
    QcmQuestionResolver,
    // ── QCM user data ─────────────────────────────────────────────────────────
    QcmSessionService,
    QcmSessionResolver,
    QcmAnswerService,
    QcmAnswerResolver,
    QcmProgressService,
    QcmProgressResolver,
    // ── TDT catalog ──────────────────────────────────────────────────────────
    TdtChallengeService,
    TdtChallengeResolver,
    // ── TDT user data ─────────────────────────────────────────────────────────
    TdtSessionService,
    TdtSessionResolver,
    TdtSubmissionService,
    TdtSubmissionResolver,
    TdtProgressService,
    TdtProgressResolver,
  ],
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

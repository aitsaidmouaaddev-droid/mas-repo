import { Subject } from './subject/subject.entity';
import { VideoJob } from './video-job/video-job.entity';
import { JobVersion } from './job-version/job-version.entity';
import { JobAsset } from './job-asset/job-asset.entity';
import { EmailEvent } from './email-event/email-event.entity';
import { WebhookEvent } from './webhook-event/webhook-event.entity';
import { JobLog } from './job-log/job-log.entity';
import { StatusTransition } from './status-transition/status-transition.entity';

export const ALL_ENTITIES = [
  Subject,
  VideoJob,
  JobVersion,
  JobAsset,
  EmailEvent,
  WebhookEvent,
  JobLog,
  StatusTransition,
] as const;

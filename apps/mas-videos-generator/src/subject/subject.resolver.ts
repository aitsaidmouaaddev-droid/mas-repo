import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { Subject, CreateSubjectInput, UpdateSubjectInput } from './subject.entity';
import { SubjectService } from './subject.service';

@Resolver(() => Subject)
export class SubjectResolver extends BaseResolver(Subject, CreateSubjectInput, UpdateSubjectInput) {
  constructor(service: SubjectService) {
    super(service);
  }
}

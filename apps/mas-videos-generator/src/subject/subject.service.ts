import { Injectable, Inject } from '@nestjs/common';
import { DB_ADAPTER, type IDbAdapter } from '@mas/db-contracts';
import { BaseService } from '@mas/nest-graphql-typeorm-base';
import { Subject } from './subject.entity';
import type { CreateSubjectInput, UpdateSubjectInput } from './subject.entity';

@Injectable()
export class SubjectService extends BaseService<Subject, CreateSubjectInput, UpdateSubjectInput>() {
  constructor(@Inject(DB_ADAPTER) adapter: IDbAdapter) {
    super(adapter.getRepository(Subject));
  }
}

import { Args, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { QcmQuestion, QcmQuestionData, CreateQcmQuestionInput, UpdateQcmQuestionInput } from './qcm-question.entity';
import { QcmQuestionService } from './qcm-question.service';

@Resolver(() => QcmQuestion)
export class QcmQuestionResolver extends BaseResolver(
  QcmQuestion,
  CreateQcmQuestionInput,
  UpdateQcmQuestionInput,
) {
  constructor(service: QcmQuestionService) {
    super(service);
  }

  @ResolveField(() => QcmQuestionData)
  data(
    @Parent() question: QcmQuestion,
    @Args('lang', { defaultValue: 'en' }) lang: string,
  ): QcmQuestionData {
    const raw = question.data as any;
    return {
      question: raw.question?.[lang] ?? raw.question?.['en'] ?? raw.question ?? '',
      choices: raw.choices?.[lang] ?? raw.choices?.['en'] ?? raw.choices ?? [],
      answer: raw.answer,
      tags: raw.tags ?? [],
      explanation: raw.explanation ? (raw.explanation[lang] ?? raw.explanation['en'] ?? raw.explanation) : undefined,
      docs: raw.docs,
    };
  }
}

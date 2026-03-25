import { Args, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { BaseResolver } from '@mas/nest-graphql-typeorm-base';
import { QcmModule, CreateQcmModuleInput, UpdateQcmModuleInput } from './qcm-module.entity';
import { QcmModuleService } from './qcm-module.service';

@Resolver(() => QcmModule)
export class QcmModuleResolver extends BaseResolver(
  QcmModule,
  CreateQcmModuleInput,
  UpdateQcmModuleInput,
) {
  constructor(service: QcmModuleService) {
    super(service);
  }

  @ResolveField(() => String)
  label(
    @Parent() module: QcmModule,
    @Args('lang', { defaultValue: 'en' }) lang: string,
  ): string {
    const raw = module.labelI18n;
    if (typeof raw === 'string') return raw;
    return raw?.[lang] ?? raw?.['en'] ?? '';
  }

  @ResolveField(() => String, { nullable: true })
  description(
    @Parent() module: QcmModule,
    @Args('lang', { defaultValue: 'en' }) lang: string,
  ): string | undefined {
    const raw = module.descriptionI18n;
    if (!raw) return undefined;
    if (typeof raw === 'string') return raw;
    return raw[lang] ?? raw['en'];
  }
}

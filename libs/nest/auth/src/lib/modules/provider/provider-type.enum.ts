import { registerEnumType } from '@nestjs/graphql';

export enum ProviderType {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  GITHUB = 'GITHUB',
}

registerEnumType(ProviderType, { name: 'ProviderType' });

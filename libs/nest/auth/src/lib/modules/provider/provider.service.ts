import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IdentityProvider } from './identity-provider.entity';
import { ProviderType } from './provider-type.enum';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(IdentityProvider)
    private readonly repo: Repository<IdentityProvider>,
  ) {}

  findByProvider(
    provider: ProviderType,
    providerAccountId: string,
  ): Promise<IdentityProvider | null> {
    return this.repo.findOne({ where: { provider, providerAccountId } });
  }

  findLocalByIdentity(identityId: string): Promise<IdentityProvider | null> {
    return this.repo
      .createQueryBuilder('p')
      .addSelect('p.passwordHash')
      .where('p.identityId = :identityId AND p.provider = :provider', {
        identityId,
        provider: ProviderType.LOCAL,
      })
      .getOne();
  }

  async createLocal(
    identityId: string,
    email: string,
    password: string,
  ): Promise<IdentityProvider> {
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    return this.repo.save(
      this.repo.create({
        identityId,
        provider: ProviderType.LOCAL,
        providerAccountId: email,
        passwordHash,
      }),
    );
  }

  createOAuth(data: {
    identityId: string;
    provider: ProviderType;
    providerAccountId: string;
    providerAccessToken?: string;
    providerRefreshToken?: string;
    providerTokenExpiresAt?: Date;
  }): Promise<IdentityProvider> {
    return this.repo.save(this.repo.create(data));
  }

  async validatePassword(identityId: string, password: string): Promise<boolean> {
    const record = await this.findLocalByIdentity(identityId);
    if (!record?.passwordHash) return false;
    return bcrypt.compare(password, record.passwordHash);
  }

  async updatePassword(identityId: string, newPassword: string): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await this.repo.update({ identityId, provider: ProviderType.LOCAL }, { passwordHash });
  }
}

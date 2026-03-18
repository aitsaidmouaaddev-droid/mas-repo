import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { DB_ADAPTER } from '@mas/db-contracts';
import type { IDbAdapter } from '@mas/db-contracts';
import type { DataSource } from 'typeorm';
import { Identity } from '../modules/identity/identity.entity';
import type { ProviderService } from '../modules/provider/provider.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(DB_ADAPTER) private readonly db: IDbAdapter<DataSource>,
    private readonly providerService: ProviderService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(login: string, password: string): Promise<Identity> {
    const identity = await this.db
      .getConnection()
      .getRepository(Identity)
      .findOne({
        where: [{ email: login }, { identityName: login }],
      });
    if (!identity || !identity.isActive) throw new UnauthorizedException();

    const valid = await this.providerService.validatePassword(identity.id, password);
    if (!valid) throw new UnauthorizedException();

    return identity;
  }
}

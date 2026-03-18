import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import type { Repository } from 'typeorm';
import { Identity } from '../modules/identity/identity.entity';
import type { ProviderService } from '../modules/provider/provider.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Identity) private readonly identityRepo: Repository<Identity>,
    private readonly providerService: ProviderService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(login: string, password: string): Promise<Identity> {
    const identity = await this.identityRepo.findOne({
      where: [{ email: login }, { identityName: login }],
    });
    if (!identity || !identity.isActive) throw new UnauthorizedException();

    const valid = await this.providerService.validatePassword(identity.id, password);
    if (!valid) throw new UnauthorizedException();

    return identity;
  }
}

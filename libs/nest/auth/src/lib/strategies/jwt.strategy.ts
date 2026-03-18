import { Injectable } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { IdentityService } from '../modules/identity/identity.service';
import type { JwtPayload } from '../modules/token/token.service';
import type { Identity } from '../modules/identity/identity.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly identityService: IdentityService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<Identity> {
    const identity = await this.identityService.findOne(payload.sub);
    if (!identity || !identity.isActive) throw new Error('Unauthorized');
    return identity;
  }
}

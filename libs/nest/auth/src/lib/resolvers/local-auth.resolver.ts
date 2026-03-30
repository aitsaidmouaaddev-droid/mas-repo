import { UnauthorizedException, Inject } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { DB_ADAPTER } from '@mas/db-contracts';
import type { IDbAdapter } from '@mas/db-contracts';
import type { DataSource } from 'typeorm';
import { Public } from '../decorators/public.decorator';
import type { LoginInput } from '../modules/identity/identity.entity';
import { Identity } from '../modules/identity/identity.entity';
import type { UserService } from '../modules/user/user.service';
import { CreateUserInput, User } from '../modules/user/user.entity';
import type { ProviderService } from '../modules/provider/provider.service';
import type { TokenService } from '../modules/token/token.service';
import { LoginResponse } from './core-auth.resolver';

/** Email / password login and registration mutations. Registered only when `local` is enabled. */
@Resolver()
export class LocalAuthResolver {
  constructor(
    @Inject(DB_ADAPTER) private readonly db: IDbAdapter<DataSource>,
    private readonly userService: UserService,
    private readonly providerService: ProviderService,
    private readonly tokenService: TokenService,
  ) {}

  @Public()
  @Mutation(() => LoginResponse)
  async login(@Args('input') { login, password }: LoginInput): Promise<LoginResponse> {
    const repo = this.db.getConnection().getRepository(Identity);
    const identity = await repo.findOne({
      where: [{ email: login }, { identityName: login }],
    });
    if (!identity) throw new UnauthorizedException('Invalid credentials');

    const valid = await this.providerService.validatePassword(identity.id, password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const userRepo = this.db.getConnection().getRepository(User);
    const user = await userRepo.findOne({ where: { identityId: identity.id } });
    if (!user) throw new UnauthorizedException('No user account for this identity');

    const tokens = await this.tokenService.issueTokenPair({
      sub: identity.id,
      uid: user.id,
      type: identity.type,
    });
    await repo.update(identity.id, { lastLoginAt: new Date() });

    return { ...tokens, identity };
  }

  @Public()
  @Mutation(() => LoginResponse)
  async register(
    @Args('input', { type: () => CreateUserInput }) input: CreateUserInput,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    const user = await this.userService.create(input);
    await this.providerService.createLocal(
      user.identityId!,
      input.identity.email ?? input.identity.identityName ?? '',
      password,
    );
    const tokens = await this.tokenService.issueTokenPair({
      sub: user.identityId!,
      uid: user.id,
      type: 'user',
    });
    return { ...tokens, identity: user.identity! };
  }
}

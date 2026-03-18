// ─── Modules ──────────────────────────────────────────────────────────────────
export { AuthModule } from './lib/auth.module';
export { IdentityModule } from './lib/modules/identity/identity.module';
export { UserModule } from './lib/modules/user/user.module';
export { ProviderModule } from './lib/modules/provider/provider.module';
export { TokenModule } from './lib/modules/token/token.module';

// ─── Entities ─────────────────────────────────────────────────────────────────
export {
  Identity,
  CreateIdentityInput,
  UpdateIdentityInput,
} from './lib/modules/identity/identity.entity';
export { User, CreateUserInput, UpdateUserInput } from './lib/modules/user/user.entity';
export { IdentityProvider } from './lib/modules/provider/identity-provider.entity';
export { RefreshToken } from './lib/modules/token/refresh-token.entity';

// ─── Enums ────────────────────────────────────────────────────────────────────
export { ProviderType } from './lib/modules/provider/provider-type.enum';

// ─── Services ─────────────────────────────────────────────────────────────────
export { IdentityService } from './lib/modules/identity/identity.service';
export { UserService } from './lib/modules/user/user.service';
export { ProviderService } from './lib/modules/provider/provider.service';
export { TokenService } from './lib/modules/token/token.service';
export type { JwtPayload, TokenPair } from './lib/modules/token/token.service';

// ─── Resolvers ────────────────────────────────────────────────────────────────
export { IdentityResolver } from './lib/modules/identity/identity.resolver';
export { UserResolver } from './lib/modules/user/user.resolver';
export { AuthResolver, LoginResponse } from './lib/resolvers/auth.resolver';

// ─── Guards ───────────────────────────────────────────────────────────────────
export { JwtAuthGuard } from './lib/guards/jwt-auth.guard';

// ─── Decorators ───────────────────────────────────────────────────────────────
export { CurrentIdentity } from './lib/decorators/current-identity.decorator';
export { Public, IS_PUBLIC_KEY } from './lib/decorators/public.decorator';

// ─── Strategies ───────────────────────────────────────────────────────────────
export { JwtStrategy } from './lib/strategies/jwt.strategy';
export { LocalStrategy } from './lib/strategies/local.strategy';

/**
 * Creates a typed DI injection token for a repository.
 *
 * The generic `T` is phantom — it carries the repository type at compile time
 * so consumers get inference without runtime overhead.
 *
 * @example
 * ```ts
 * export const USER_REPO = createToken<IUserRepository>('User');
 *
 * // In a NestJS provider:
 * { provide: USER_REPO.token, useClass: PrismaUserRepository }
 *
 * // In a service:
 * constructor(@Inject(USER_REPO.token) private users: IUserRepository) {}
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface RepositoryToken<_T> {
  readonly token: symbol;
  readonly name: string;
}

export function createToken<T>(name: string): RepositoryToken<T> {
  return { token: Symbol(`REPOSITORY:${name}`), name };
}

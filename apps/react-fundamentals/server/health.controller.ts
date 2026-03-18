import { Controller, Get, Inject } from '@nestjs/common';
import { DB_ADAPTER } from '@mas/db-contracts';
import type { IDbAdapter } from '@mas/db-contracts';

/**
 * Minimal health-check controller.
 *
 * GET /api/health — returns DB connection status so you can verify that
 * DbContractsModule bootstrapped the adapter correctly.
 */
@Controller('api/health')
export class HealthController {
  constructor(@Inject(DB_ADAPTER) private readonly db: IDbAdapter) {}

  @Get()
  check() {
    try {
      const conn = this.db.getConnection();
      return {
        status: 'ok',
        db:
          (conn as { isInitialized?: boolean }).isInitialized === true
            ? 'connected'
            : 'disconnected',
      };
    } catch {
      return { status: 'ok', db: 'not-initialized' };
    }
  }
}

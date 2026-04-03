import { Injectable, NestMiddleware, ForbiddenException, Logger } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

/**
 * Allows requests only from IPs listed in the ALLOWED_IPS env var.
 * In production (Azure App Service) the real client IP is in X-Forwarded-For.
 * Falls back to req.socket.remoteAddress when the header is absent (direct connections).
 *
 * ALLOWED_IPS — comma-separated list, e.g. "1.2.3.4,5.6.7.8"
 * If ALLOWED_IPS is not set the middleware allows only 127.0.0.1 / ::1.
 */
@Injectable()
export class IpWhitelistMiddleware implements NestMiddleware {
  private readonly logger = new Logger(IpWhitelistMiddleware.name);
  private readonly allowed: Set<string>;

  constructor() {
    const raw = process.env['ALLOWED_IPS'] ?? '';
    const configured = raw
      .split(',')
      .map((ip) => ip.trim())
      .filter(Boolean);

    // Always permit loopback regardless of env var
    this.allowed = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1', ...configured]);
  }

  use(req: Request, _res: Response, next: NextFunction): void {
    const forwarded = req.headers['x-forwarded-for'];
    const clientIp =
      (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]?.trim()) ??
      req.socket.remoteAddress ??
      '';

    if (this.allowed.has(clientIp)) {
      return next();
    }

    this.logger.warn(`Blocked request from ${clientIp}`);
    throw new ForbiddenException('Access denied');
  }
}

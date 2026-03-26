import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import type { GoogleOAuthResult } from '../../strategies/google.strategy';
import { Public } from '../../decorators/public.decorator';

const FRONTEND_URL = process.env['FRONTEND_URL'] ?? 'http://localhost:4205';

/**
 * REST controller for OAuth provider flows.
 *
 * Each provider needs two routes:
 *   1. Initiation — redirects the browser to the provider's consent screen.
 *   2. Callback   — receives the provider redirect, issues tokens, redirects to the frontend.
 *
 * Tokens are passed to the frontend as URL query params so the SPA can pick
 * them up in a `useEffect` and hydrate the auth state without a page reload.
 */
@Controller('auth/oauth')
export class OAuthController {
  // ── Google ───────────────────────────────────────────────────────────────

  /** Initiates the Google OAuth consent flow. */
  @Get('google')
  @Public()
  @UseGuards(AuthGuard('google'))
  googleLogin(): void {
    // Passport redirects automatically — this method body never executes.
  }

  /** Receives the Google callback, issues tokens, redirects to the frontend. */
  @Get('google/callback')
  @Public()
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req: Request, @Res() res: Response): void {
    const { identity, accessToken, refreshToken } = req.user as GoogleOAuthResult;

    const params = new URLSearchParams({
      accessToken,
      refreshToken,
      identityId: identity.id,
      email: identity.email ?? '',
      displayName: identity.displayName ?? '',
      avatarUrl: identity.avatarUrl ?? '',
    });

    res.redirect(`${FRONTEND_URL}/auth?${params.toString()}`);
  }
}

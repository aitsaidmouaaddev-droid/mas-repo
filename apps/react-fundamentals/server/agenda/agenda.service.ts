import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { google } from 'googleapis';
import type { calendar_v3 } from 'googleapis';
import { EmailService } from '@mas/nest-email';

interface OtpEntry {
  code: string;
  expiresAt: number;
}

export interface AgendaEvent {
  id: string;
  summary: string;
  description?: string;
  start: string;
  end: string;
  location?: string;
  colorId?: string;
  allDay: boolean;
}

@Injectable()
export class AgendaService {
  private readonly otpStore = new Map<string, OtpEntry>();

  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly email: EmailService,
  ) {}

  async requestOtp(password: string): Promise<void> {
    const expected = this.config.getOrThrow<string>('AGENDA_PASSWORD');
    if (password !== expected) {
      throw new UnauthorizedException('Invalid password');
    }

    const code = Math.floor(100_000 + Math.random() * 900_000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1_000;
    this.otpStore.set('current', { code, expiresAt });

    const recipient = this.config.getOrThrow<string>('AGENDA_OTP_EMAIL');
    await this.email.sendTemplate(
      'agenda-otp',
      { code },
      { to: recipient, subject: "🔐 Code d'accès agenda" },
    );
  }

  verifyOtp(code: string): string {
    const entry = this.otpStore.get('current');
    if (!entry) throw new BadRequestException('No OTP requested');
    if (Date.now() > entry.expiresAt) {
      this.otpStore.delete('current');
      throw new BadRequestException('OTP expired');
    }
    if (code !== entry.code) throw new UnauthorizedException('Invalid OTP');
    this.otpStore.delete('current');

    const secret = this.config.getOrThrow<string>('AGENDA_JWT_SECRET');
    return this.jwt.sign({ agenda: true }, { secret, expiresIn: '24h' });
  }

  validateToken(token: string): boolean {
    try {
      const secret = this.config.getOrThrow<string>('AGENDA_JWT_SECRET');
      this.jwt.verify(token, { secret });
      return true;
    } catch {
      return false;
    }
  }

  async getEvents(from: string, to: string): Promise<AgendaEvent[]> {
    const calendar = this.buildCalendarClient();
    const calendarId = this.config.getOrThrow<string>('GOOGLE_CALENDAR_ID');

    const res = await calendar.events.list({
      calendarId,
      timeMin: from,
      timeMax: to,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 200,
    });

    return (res.data.items ?? []).map((ev) => this.mapEvent(ev));
  }

  async sendReminder(eventTitle: string, eventStart: string): Promise<void> {
    const recipient = this.config.getOrThrow<string>('AGENDA_OTP_EMAIL');
    await this.email.sendTemplate(
      'agenda-reminder',
      { eventTitle, eventStart },
      { to: recipient, subject: `📅 Rappel : ${eventTitle}` },
    );
  }

  private buildCalendarClient(): calendar_v3.Calendar {
    const keyJson = this.config.getOrThrow<string>('GOOGLE_CALENDAR_KEY_JSON');
    const credentials = JSON.parse(keyJson) as {
      client_email: string;
      private_key: string;
    };
    const userEmail = this.config.get<string>('GOOGLE_CALENDAR_USER_EMAIL');

    const jwt = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
      subject: userEmail,
    });

    return google.calendar({ version: 'v3', auth: jwt });
  }

  private mapEvent(ev: calendar_v3.Schema$Event): AgendaEvent {
    const allDay = !ev.start?.dateTime;
    return {
      id: ev.id ?? `ev-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      summary: ev.summary ?? '(sans titre)',
      description: ev.description ?? undefined,
      start: ev.start?.dateTime ?? ev.start?.date ?? '',
      end: ev.end?.dateTime ?? ev.end?.date ?? '',
      location: ev.location ?? undefined,
      colorId: ev.colorId ?? undefined,
      allDay,
    };
  }
}

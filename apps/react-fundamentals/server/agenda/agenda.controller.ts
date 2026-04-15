import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Public } from '@mas/auth';
import { AgendaService } from './agenda.service';
import { AgendaJwtGuard } from './agenda-jwt.guard';
import type { AgendaEvent } from './agenda.service';

@Controller('agenda')
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  /** Step 1 — submit password, triggers OTP email. */
  @Public()
  @Post('request-otp')
  async requestOtp(@Body() body: { password: string }): Promise<void> {
    await this.agendaService.requestOtp(body.password);
  }

  /** Step 2 — submit 6-digit OTP, get a 24h agenda JWT. */
  @Public()
  @Post('verify-otp')
  verifyOtp(@Body() body: { otp: string }): { token: string } {
    const token = this.agendaService.verifyOtp(body.otp);
    return { token };
  }

  /** Returns Google Calendar events for the requested range. */
  @Public()
  @UseGuards(AgendaJwtGuard)
  @Get('events')
  async getEvents(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<{ events: AgendaEvent[] }> {
    const events = await this.agendaService.getEvents(from, to);
    return { events };
  }

  /** Sends an email reminder for a given event. */
  @Public()
  @UseGuards(AgendaJwtGuard)
  @Post('notify')
  async notify(@Body() body: { eventTitle: string; eventStart: string }): Promise<void> {
    await this.agendaService.sendReminder(body.eventTitle, body.eventStart);
  }
}

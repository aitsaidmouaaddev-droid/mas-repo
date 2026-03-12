import { Controller, Get } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- NestJS DI requires  value import for decorator metadata
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}

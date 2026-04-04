import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env['PORT'] ? Number(process.env['PORT']) : 4311;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(require('express').json({ limit: '20mb' }));
  app.use(require('express').urlencoded({ limit: '20mb', extended: true }));
  await app.listen(PORT);
  console.log(`NestJS server listening on http://localhost:${PORT}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

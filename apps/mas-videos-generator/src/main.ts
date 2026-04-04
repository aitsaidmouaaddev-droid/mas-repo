import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

const PORT = process.env['PORT'] ? Number(process.env['PORT']) : 4444;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:5555' });
  const host = process.env['NODE_ENV'] === 'production' ? '0.0.0.0' : '127.0.0.1';
  await app.listen(PORT, host);
  console.log(`mas-videos-generator listening on http://${host}:${PORT}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

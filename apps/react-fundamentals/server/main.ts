import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env['PORT'] ? Number(process.env['PORT']) : 4311;

async function bootstrap() {
  // bodyParser: false — body parsing is handled by AppModule.configure() (NestModule middleware)
  // which guarantees the 20mb limit is applied before any route handler, including Apollo's sub-router.
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.enableCors();
  await app.listen(PORT);
  console.log(`NestJS server listening on http://localhost:${PORT}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

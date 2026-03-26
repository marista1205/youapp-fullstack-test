import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 WAJIB: biar frontend bisa akses backend
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
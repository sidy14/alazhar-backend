import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

// --- (هذا هو السطر السحري) ---
// "علّم" JSON كيف يتعامل مع BigInt بتحويله إلى نص
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
// --- (نهاية السطر السحري) ---

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // تفعيل مُحلل JSON
  app.use(express.json());

  // تفعيل التحقق من صحة البيانات (الحارس)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // تفعيل CORS
  app.enableCors();

  // تشغيل الخادم
  await app.listen(3000);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
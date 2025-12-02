import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. تفعيل قراءة JSON
  app.use(express.json());

  // 2. حل مشكلة BigInt
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express'; // استيراد مكتبة express

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. تفعيل قراءة JSON (لحل مشكلة 400)
  app.use(express.json()); 

  // 2. حل مشكلة الأرقام الكبيرة BigInt (لحل مشكلة 500)
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  // 3. تفعيل التحقق من البيانات (الحارس)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // 4. السماح للواجهة الأمامية بالاتصال
  app.enableCors();

  await app.listen(3000);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
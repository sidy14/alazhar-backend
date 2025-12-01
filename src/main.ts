import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express'; // 1. استيراد express

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. (هام جداً) تفعيل قراءة JSON
  app.use(express.json());

  // 3. إصلاح مشكلة الأرقام الكبيرة (BigInt)
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  // 4. تفعيل الحارس والتحويل التلقائي
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // تحويل الأرقام والنصوص تلقائياً
      transformOptions: {
        enableImplicitConversion: true, // السماح بالتحويل الضمني
      },
    }),
  );

  // 5. السماح للواجهة الأمامية بالاتصال
  app.enableCors();

  await app.listen(3000);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
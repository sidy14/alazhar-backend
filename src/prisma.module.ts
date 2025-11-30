// src/prisma.module.ts (ملف جديد)
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <-- **(هذا هو السطر الأهم)**
@Module({
  providers: [PrismaService], // "نوفر" خدمة Prisma
  exports: [PrismaService],   // "نصدر" خدمة Prisma
})
export class PrismaModule {}
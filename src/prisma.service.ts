import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
  }

  async onModuleInit() {
    // هذا الأمر يتأكد من اتصالنا بقاعدة البيانات عند بدء تشغيل التطبيق
    await this.$connect();
  }
}
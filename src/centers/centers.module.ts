// src/centers/centers.module.ts (المُحدث)
import { Module } from '@nestjs/common';
import { CentersService } from './centers.service';
import { CentersController } from './centers.controller';
// (PrismaService ليست مطلوبة هنا بعد الآن)
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CentersController],
  providers: [
    CentersService,
    // (تم حذف "PrismaService" من هنا)
  ],
})
export class CentersModule {}
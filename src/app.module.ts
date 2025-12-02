import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { CentersModule } from './centers/centers.module';
import { BranchesModule } from './branches/branches.module';
import { AcademicYearsModule } from './academic-years/academic-years.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { StudentsModule } from './students/students.module';
import { FinanceModule } from './finance/finance.module';
import { HrModule } from './hr/hr.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ExamsModule } from './exams/exams.module';
import { UsersModule } from './users/users.module'; // <-- (1) الاستيراد

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CentersModule,
    BranchesModule,
    AcademicYearsModule,
    ClassroomsModule,
    StudentsModule,
    FinanceModule,
    HrModule,
    SubjectsModule,
    ExamsModule,
    UsersModule, // <-- (2) التسجيل في القائمة
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
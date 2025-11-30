import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, RoleName } from '../auth/roles.decorator';

@Controller('api/v1/students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // 1. تسجيل طالب
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.DIRECTOR_GENERAL, RoleName.BRANCH_MANAGER)
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  // 2. البحث عن طالب (للمالية)
  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.DIRECTOR_GENERAL, RoleName.BRANCH_MANAGER, RoleName.FINANCE_OFFICER)
  search(@Query('uniqueId') uniqueId: string) {
    return this.studentsService.findByUniqueId(uniqueId);
  }

  // 3. كشف الدرجات
  @Get(':id/transcript')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.DIRECTOR_GENERAL, RoleName.BRANCH_MANAGER, RoleName.TEACHER)
  getTranscript(@Param('id') id: string) {
    return this.studentsService.getStudentTranscript(+id);
  }

  // 4. (الجديد) جلب قائمة الطلاب
  // يستخدمها الأستاذ لجلب طلاب فصل معين
  @Get() // GET /api/v1/students?classroomId=1
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.DIRECTOR_GENERAL, RoleName.BRANCH_MANAGER, RoleName.TEACHER)
  findAll(@Query('classroomId') classroomId?: string) {
    return this.studentsService.findAll(classroomId ? +classroomId : undefined);
  }
}
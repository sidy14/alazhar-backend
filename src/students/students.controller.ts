import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, RoleName } from '../auth/roles.decorator';

@Controller('api/v1/students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // 1. تسجيل طالب (تحديث: إضافة REGISTRATION_OFFICER)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.DIRECTOR_GENERAL, RoleName.BRANCH_MANAGER, RoleName.REGISTRATION_OFFICER)
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  // 2. البحث
  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.DIRECTOR_GENERAL, RoleName.BRANCH_MANAGER, RoleName.FINANCE_OFFICER, RoleName.REGISTRATION_OFFICER)
  search(@Query('uniqueId') uniqueId: string) {
    return this.studentsService.findByUniqueId(uniqueId);
  }

  // 3. الكشف
  @Get(':id/transcript')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.DIRECTOR_GENERAL, RoleName.BRANCH_MANAGER, RoleName.TEACHER)
  getTranscript(@Param('id') id: string) {
    return this.studentsService.getStudentTranscript(+id);
  }

  // 4. القائمة
  @Get() 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.DIRECTOR_GENERAL, RoleName.BRANCH_MANAGER, RoleName.TEACHER)
  findAll(@Query('classroomId') classroomId?: string) {
    return this.studentsService.findAll(classroomId ? +classroomId : undefined);
  }
}
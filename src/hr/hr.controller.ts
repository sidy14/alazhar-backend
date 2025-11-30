import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { HrService } from './hr.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { AssignTeacherDto } from './dto/assign-teacher.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, RoleName } from '../auth/roles.decorator';

@Controller('api/v1/hr')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  // 1. تعيين موظف
  @Post('staff')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.DIRECTOR_GENERAL, RoleName.BRANCH_MANAGER)
  createStaff(@Body() createStaffDto: CreateStaffDto) {
    return this.hrService.createStaff(createStaffDto);
  }

  // 2. توزيع الأساتذة
  @Post('teacher-assignments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.DIRECTOR_GENERAL, RoleName.BRANCH_MANAGER)
  assignTeacher(@Body() assignTeacherDto: AssignTeacherDto) {
    return this.hrService.assignTeacher(assignTeacherDto);
  }

  // 3. (جديد) فصولي (للأستاذ)
  @Get('my-assignments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.TEACHER) // مسموح للأساتذة فقط
  getMyAssignments(@Request() req) {
    // نرسل رقم المستخدم من التوكن
    return this.hrService.getTeacherAssignments(+req.user.userId);
  }
}
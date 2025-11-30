import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, RoleName } from '../auth/roles.decorator';

@Controller('api/v1/classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.DIRECTOR_GENERAL, RoleName.BRANCH_MANAGER)
  create(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomsService.create(createClassroomDto);
  }

  @Get('resources')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.DIRECTOR_GENERAL, RoleName.BRANCH_MANAGER)
  getResources() {
    return this.classroomsService.getResources();
  }

  // (جديد) لوحة النتائج
  @Get(':id/results') // GET /api/v1/classrooms/1/results
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.DIRECTOR_GENERAL, RoleName.BRANCH_MANAGER)
  getResults(@Param('id') id: string) {
    return this.classroomsService.getClassroomResults(+id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.DIRECTOR_GENERAL, RoleName.BRANCH_MANAGER)
  findAll() {
    return this.classroomsService.findAll();
  }
}
import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { CentersService } from './centers.service';
import { CreateCenterDto } from './dto/create-center.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, RoleName } from '../auth/roles.decorator';

@Controller('api/v1/centers')
export class CentersController {
  constructor(private readonly centersService: CentersService) {}

  // إنشاء مركز
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.DIRECTOR_GENERAL)
  create(@Body() createCenterDto: CreateCenterDto) {
    return this.centersService.create(createCenterDto);
  }

  // (جديد) جلب قائمة المراكز
  @Get() // GET /api/v1/centers
  @UseGuards(JwtAuthGuard, RolesGuard)
  // سنسمح للمدير العام ومديري الفروع برؤية القائمة
  @Roles(RoleName.DIRECTOR_GENERAL, RoleName.BRANCH_MANAGER)
  findAll() {
    return this.centersService.findAll();
  }
}
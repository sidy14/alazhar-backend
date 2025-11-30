import { Controller, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { EnterMarksDto } from './dto/enter-marks.dto'; // <-- استيراد
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, RoleName } from '../auth/roles.decorator';

@Controller('api/v1/exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.TEACHER)
  create(@Body() createExamDto: CreateExamDto, @Request() req) {
    return this.examsService.create(createExamDto, +req.user.userId);
  }

  // --- (جديد) نقطة دخول إدخال الدرجات ---
  @Post(':id/marks') // POST /api/v1/exams/1/marks
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.TEACHER)
  enterMarks(
    @Param('id') id: string, 
    @Body() enterMarksDto: EnterMarksDto, 
    @Request() req
  ) {
    return this.examsService.enterMarks(+id, enterMarksDto, +req.user.userId);
  }

  @Post('seed-types')
  seedTypes() {
    return this.examsService.seedExamTypes();
  }
}
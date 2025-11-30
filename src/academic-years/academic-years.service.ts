import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';

@Injectable()
export class AcademicYearsService {
  constructor(private prisma: PrismaService) {}

  async create(createAcademicYearDto: CreateAcademicYearDto) {
    return this.prisma.academicYear.create({
      data: {
        name: createAcademicYearDto.name,
        // تحويل النص إلى تاريخ حقيقي
        startDate: new Date(createAcademicYearDto.startDate),
        endDate: new Date(createAcademicYearDto.endDate),
        isActive: true, // سنجعلها نشطة افتراضياً
      },
    });
  }
}
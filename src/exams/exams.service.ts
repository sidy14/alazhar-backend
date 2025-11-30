import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { EnterMarksDto } from './dto/enter-marks.dto';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateExamDto, creatorUserId: number) {
    return this.prisma.exam.create({
      data: {
        name: dto.name,
        examDate: new Date(dto.examDate),
        term: dto.term as any, // <-- (جديد)
        maxScore: dto.maxScore,
        classroomId: BigInt(dto.classroomId),
        subjectId: BigInt(dto.subjectId),
        examTypeId: dto.examTypeId,
        academicYearId: 1,
        creatorUserId: BigInt(creatorUserId),
      },
    });
  }

  async seedExamTypes() {
    await this.prisma.examType.createMany({
      data: [
        { nameAr: 'فرض محروس', nameFr: 'Devoir Surveillé' },
        { nameAr: 'اختبار فصلي', nameFr: 'Examen Trimestriel' },
        { nameAr: 'اختبار شفهي', nameFr: 'Oral' },
      ],
      skipDuplicates: true,
    });
    return { message: 'Exam types seeded!' };
  }

  async enterMarks(examId: number, dto: EnterMarksDto, teacherId: number) {
    const exam = await this.prisma.exam.findUnique({ where: { id: BigInt(examId) } });
    if (!exam) throw new NotFoundException('Exam not found');

    return this.prisma.$transaction(
      dto.marks.map((mark) =>
        this.prisma.mark.upsert({
          where: {
            examId_studentId: {
              examId: BigInt(examId),
              studentId: BigInt(mark.studentId),
            },
          },
          update: { score: mark.score, enteredByUserId: BigInt(teacherId) },
          create: {
            examId: BigInt(examId),
            studentId: BigInt(mark.studentId),
            score: mark.score,
            enteredByUserId: BigInt(teacherId),
          },
        }),
      ),
    );
  }
}
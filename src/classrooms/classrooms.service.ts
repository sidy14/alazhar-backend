import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';

@Injectable()
export class ClassroomsService {
  constructor(private prisma: PrismaService) {}

  // 1. إنشاء فصل
  async create(dto: CreateClassroomDto) {
    return this.prisma.classroom.create({
      data: {
        name: dto.name,
        capacity: dto.capacity,
        branchId: BigInt(dto.branchId),
        levelId: dto.levelId,
        educationSystemId: dto.educationSystemId,
        academicYearId: dto.academicYearId,
      },
    });
  }

  // 2. جلب الفصول
  async findAll() {
    return this.prisma.classroom.findMany({
      include: {
        branch: true,
        level: { include: { stage: true } },
        educationSystem: true,
        academicYear: true,
      },
      orderBy: { id: 'desc' }
    });
  }

  // 3. جلب الموارد
  async getResources() {
    const [branches, levels, systems, years] = await Promise.all([
      this.prisma.branch.findMany(),
      this.prisma.level.findMany({ include: { stage: true }, orderBy: { id: 'asc' } }),
      this.prisma.educationSystem.findMany(),
      this.prisma.academicYear.findMany({ where: { isActive: true } }),
    ]);
    return { branches, levels, systems, years };
  }

  // 4. (محدث) جلب نتائج الفصل مع إحصائيات الحضور
  async getClassroomResults(classroomId: number) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { classroomId: BigInt(classroomId) },
      include: {
        student: {
          include: {
            marks: {
              where: { exam: { classroomId: BigInt(classroomId) } },
              include: { exam: { include: { subject: true } } }
            }
          }
        },
        classroom: {
          include: { branch: true, academicYear: true, level: true }
        }
      }
    });

    const results = enrollments.map(enrollment => {
      const marks = enrollment.student.marks || [];
      let totalScore = 0;
      let totalMax = 0;
      const subjectsMap: any = {};

      marks.forEach(mark => {
        const score = Number(mark.score);
        const max = Number(mark.exam.maxScore);
        totalScore += score;
        totalMax += max;
        subjectsMap[mark.exam.subject.nameAr] = score;
      });

      const average = totalMax > 0 ? (totalScore / totalMax) * 20 : 0;

      return {
        studentId: enrollment.student.uniqueId, // رقم التسلسل
        studentName: enrollment.student.fullName,
        seatNumber: enrollment.seatNumber,
        gender: enrollment.student.gender,
        totalScore,
        average,
        isPassing: average >= 10,
        hasMarks: marks.length > 0, // هل شارك في الامتحانات؟
        subjects: subjectsMap
      };
    });

    // الترتيب
    results.sort((a, b) => b.average - a.average);

    const rankedResults = results.map((res, index) => ({
      ...res,
      rank: index + 1
    }));

    // حساب الإحصائيات الجديدة
    const totalRegistered = rankedResults.length;
    const participantsCount = rankedResults.filter(r => r.hasMarks).length; // عدد المشاركين
    const absenteesCount = totalRegistered - participantsCount; // عدد الغائبين

    return {
      classroom: enrollments[0]?.classroom,
      results: rankedResults,
      stats: {
        totalRegistered,
        participantsCount,
        absenteesCount
      }
    };
  }
}
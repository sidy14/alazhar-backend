import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import * as bcrypt from 'bcrypt';
import { AccountType } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  // 1. تسجيل طالب
  async create(dto: CreateStudentDto) {
    return this.prisma.$transaction(async (tx) => {
      let parentUser = await tx.user.findUnique({ where: { username: dto.parentPhone } });
      let parentProfile;

      if (!parentUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(dto.parentPhone, salt);
        parentUser = await tx.user.create({
          data: {
            username: dto.parentPhone,
            passwordHash: hashedPassword,
            fullName: dto.parentName,
            phoneNumber: dto.parentPhone,
            email: `${dto.parentPhone}@parent.alazhar`,
            accountType: AccountType.PARENT,
          },
        });
        parentProfile = await tx.parent.create({
          data: { userId: parentUser.id, parentName: dto.parentName, parentPhone: dto.parentPhone },
        });
      } else {
        parentProfile = await tx.parent.findUnique({ where: { userId: parentUser.id } });
      }

      const student = await tx.student.create({
        data: {
          fullName: dto.fullName,
          uniqueId: dto.uniqueId,
          gender: dto.gender as any,
          branchId: BigInt(dto.branchId),
          birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
          birthPlace: dto.birthPlace,
        },
      });

      await tx.parentStudentLink.create({
        data: { parentId: parentProfile.id, studentId: student.id, relationship: 'FATHER' },
      });

      const enrollment = await tx.enrollment.create({
        data: {
          studentId: student.id,
          classroomId: BigInt(dto.classroomId),
          academicYearId: dto.academicYearId,
          seatNumber: dto.seatNumber,
          financialStatus: dto.financialStatus,
        },
      });

      return { message: 'Student registered', studentId: student.id.toString(), enrollmentId: enrollment.id.toString() };
    });
  }

  // 2. (محدث) استخراج كشف الدرجات مع الملاحظات
  async getStudentTranscript(studentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: BigInt(studentId) },
      include: {
        enrollments: {
          include: {
            classroom: { include: { branch: true, level: true } },
            academicYear: true
          }
        }
      }
    });

    const marks = await this.prisma.mark.findMany({
      where: { studentId: BigInt(studentId) },
      include: {
        exam: {
          include: {
            subject: { include: { subjectUnit: true } },
            examType: true
          }
        }
      },
    });

    const classId = student.enrollments[0]?.classroomId;
    const classSize = classId ? await this.prisma.enrollment.count({ where: { classroomId: classId } }) : 0;

    const transcript = marks.map((mark) => {
      const coefficient = 1; 
      return {
        subject: mark.exam.subject.nameAr,
        unit: mark.exam.subject.subjectUnit?.nameAr || 'مواد عامة',
        examName: mark.exam.name,
        term: mark.exam.term,
        score: Number(mark.score),
        maxScore: Number(mark.exam.maxScore),
        coefficient: coefficient,
        total: Number(mark.score) * coefficient,
        appreciation: this.getAppreciation(Number(mark.score)),
        remarks: mark.comments || '' // <-- (هام جداً: جلب ملاحظات المدرس)
      };
    });

    const totalScore = transcript.reduce((sum, item) => sum + item.total, 0);
    const totalCoeff = transcript.reduce((sum, item) => sum + item.coefficient, 0);
    
    return {
      student,
      classSize,
      transcript,
      totalScore,
      totalCoeff,
      average: totalCoeff > 0 ? (totalScore / totalCoeff) : 0,
    };
  }

  private getAppreciation(score: number): string {
    if (score >= 18) return 'ممتاز';
    if (score >= 16) return 'جيد جداً';
    if (score >= 14) return 'جيد';
    if (score >= 12) return 'مستحسن';
    if (score >= 10) return 'مقبول';
    return 'ضعيف';
  }

  // 3. البحث
  async findByUniqueId(uniqueId: string) {
    return this.prisma.student.findUnique({
      where: { uniqueId },
      include: {
        enrollments: {
          include: { classroom: true },
          orderBy: { enrollDate: 'desc' },
          take: 1 
        }
      }
    });
  }

  // 4. القائمة
  async findAll(classroomId?: number) {
    return this.prisma.student.findMany({
      where: {
        enrollments: classroomId ? { some: { classroomId: BigInt(classroomId) } } : undefined,
      },
      include: {
        enrollments: { include: { classroom: true } },
      },
    });
  }
}
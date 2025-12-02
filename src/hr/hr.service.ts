import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { AssignTeacherDto } from './dto/assign-teacher.dto';
import * as bcrypt from 'bcrypt';
import { AccountType, ScopeType } from '@prisma/client';

@Injectable()
export class HrService {
  constructor(private prisma: PrismaService) {}

  // 1. تعيين موظف جديد (مع الدور)
  async createStaff(dto: CreateStaffDto) {
    return this.prisma.$transaction(async (tx) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dto.password, salt);

      // أ. إنشاء المستخدم
      const user = await tx.user.create({
        data: {
          username: dto.username,
          passwordHash: hashedPassword,
          fullName: dto.fullName,
          email: dto.email,
          phoneNumber: dto.phoneNumber,
          accountType: dto.accountType as AccountType,
        },
      });

      // ب. إنشاء الملف الوظيفي
      const staffProfile = await tx.staffProfile.create({
        data: {
          userId: user.id,
          staffIdNumber: dto.staffIdNumber,
          jobTitle: dto.jobTitle,
          hireDate: new Date(),
        },
      });

      // ج. (محدث) تعيين الدور بناءً على الاسم القادم من الواجهة
      const role = await tx.role.findUnique({
        where: { roleName: dto.roleName }, 
      });

      if (role) {
        await tx.userAssignment.create({
          data: {
            userId: user.id,
            roleId: role.id,
            scopeType: ScopeType.BRANCH, // افتراضياً للفرع (يمكن تعديله لاحقاً)
            scopeId: null, 
          },
        });
      }

      const { passwordHash, ...result } = user;
      return { ...result, staffProfile };
    });
  }

  // 2. ربط الأستاذ
  async assignTeacher(dto: AssignTeacherDto) {
    return this.prisma.teacherAssignment.create({
      data: {
        teacherUserId: BigInt(dto.teacherUserId),
        classroomId: BigInt(dto.classroomId),
        subjectId: BigInt(dto.subjectId),
        academicYearId: dto.academicYearId,
      },
    });
  }

  // 3. جلب جدول الأستاذ
  async getTeacherAssignments(userId: number) {
    return this.prisma.teacherAssignment.findMany({
      where: { teacherUserId: BigInt(userId) },
      include: { classroom: true, subject: true },
    });
  }
}
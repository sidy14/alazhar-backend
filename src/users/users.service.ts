import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 1. جلب جميع المستخدمين (مع أدوارهم)
  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        username: true,
        accountType: true,
        isActive: true,
        createdAt: true,
        // لا نجلب كلمة المرور للأمان
        assignments: {
          include: { role: true } // لنعرف دور كل مستخدم
        }
      }
    });
  }

  // 2. إعادة تعيين كلمة المرور (Reset Password)
  async resetPassword(userId: number, newPassword: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    return this.prisma.user.update({
      where: { id: BigInt(userId) },
      data: { passwordHash: hashedPassword },
    });
  }

  // 3. تفعيل/تعطيل حساب (Toggle Active)
  async toggleStatus(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: BigInt(userId) } });
    if (!user) throw new NotFoundException('المستخدم غير موجود');

    return this.prisma.user.update({
      where: { id: BigInt(userId) },
      data: { isActive: !user.isActive }, // عكس الحالة الحالية (نشط <-> معطل)
    });
  }
}
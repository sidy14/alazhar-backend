import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ScopeType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 1. تسجيل الدخول
  async signIn(username: string, pass: string): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new UnauthorizedException('بيانات اعتماد غير صالحة');
    
    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('بيانات اعتماد غير صالحة');

    const assignments = await this.prisma.userAssignment.findMany({
      where: { userId: user.id },
      include: { role: true },
    });

    const payload = {
      userId: user.id,
      username: user.username,
      accountType: user.accountType,
      assignments: assignments.map((a) => ({
        role: a.role.roleName,
        scopeType: a.scopeType,
        scopeId: a.scopeId ? a.scopeId.toString() : null,
      })),
    };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  // 2. تسجيل (للمدير)
  async signUp(dto: SignUpDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        passwordHash: hashedPassword,
        fullName: dto.fullName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        accountType: dto.accountType,
      },
    });
    const { passwordHash, ...result } = user;
    return result;
  }

  // 3. زرع الأدوار (محدث بالأدوار الجديدة)
  async seedRoles() {
    const roles = [
      { roleName: 'DIRECTOR_GENERAL', description: 'المدير العام' },
      { roleName: 'FINANCE_HEAD', description: 'المراقب المالي العام' },
      { roleName: 'CENTER_MANAGER', description: 'مدير مركز' },
      { roleName: 'BRANCH_MANAGER', description: 'مدير فرع' },
      { roleName: 'REGISTRATION_OFFICER', description: 'المراقب (مسؤول التسجيل)' },
      { roleName: 'FINANCE_OFFICER', description: 'أمين الصندوق' },
      { roleName: 'TEACHER', description: 'أستاذ' },
      { roleName: 'PARENT', description: 'ولي أمر' },
    ];
    // استخدام createMany وتجاهل التكرار
    await this.prisma.role.createMany({
      data: roles,
      skipDuplicates: true,
    });
    return { message: 'Roles seeded successfully!' };
  }

  // 4. تعيين المدير
  async assignAdminRole() {
    const adminUser = await this.prisma.user.findFirst({ where: { username: 'admin' } });
    const adminRole = await this.prisma.role.findFirst({ where: { roleName: 'DIRECTOR_GENERAL' } });
    if (!adminUser || !adminRole) throw new NotFoundException('Not found');
    
    await this.prisma.userAssignment.deleteMany({ where: { userId: adminUser.id } });
    await this.prisma.userAssignment.create({
      data: {
        userId: adminUser.id,
        roleId: adminRole.id,
        scopeType: ScopeType.INSTITUTION,
        scopeId: null,
      },
    });
    return { message: 'Admin assigned!' };
  }

  // 5. زرع بيانات المدرسة
  async seedSchoolData() {
    await this.prisma.educationSystem.createMany({
      data: [
        { nameAr: 'عربي إسلامي', nameFr: 'Arabe Islamique' },
        { nameAr: 'عربي فرنسي (مزدوج)', nameFr: 'Bilingue (Franco-Arabe)' },
      ],
      skipDuplicates: true,
    });
    const primaryStage = await this.prisma.stage.create({ data: { nameAr: 'الابتدائي', nameFr: 'Primaire' } });
    for (let i = 1; i <= 6; i++) {
      await this.prisma.level.create({ data: { nameAr: `السنة ${i}`, nameFr: `${i}ere Année`, orderIndex: i, stageId: primaryStage.id } });
    }
    const middleStage = await this.prisma.stage.create({ data: { nameAr: 'الإعدادي', nameFr: 'Collège' } });
    for (let i = 1; i <= 4; i++) {
      await this.prisma.level.create({ data: { nameAr: `السنة ${i} إعدادي`, nameFr: `${i}ere Année Collège`, orderIndex: i + 6, stageId: middleStage.id } });
    }
    return { message: 'School data seeded!' };
  }
}
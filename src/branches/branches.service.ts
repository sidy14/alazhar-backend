import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  // 1. إنشاء فرع جديد
  async create(createBranchDto: CreateBranchDto) {
    const newBranch = await this.prisma.branch.create({
      data: {
        nameAr: createBranchDto.nameAr,
        nameFr: createBranchDto.nameFr,
        address: createBranchDto.address,
        centerId: BigInt(createBranchDto.centerId),
      },
    });
    return newBranch;
  }

  // 2. (الجديد) جلب كل الفروع
  async findAll() {
    return this.prisma.branch.findMany({
      include: {
        center: true, // لجلب اسم المركز التابع له الفرع
      },
    });
  }
}
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCenterDto } from './dto/create-center.dto';

@Injectable()
export class CentersService {
  constructor(private prisma: PrismaService) {}

  // 1. إنشاء مركز
  async create(createCenterDto: CreateCenterDto) {
    return this.prisma.center.create({
      data: {
        nameAr: createCenterDto.nameAr,
        nameFr: createCenterDto.nameFr,
        address: createCenterDto.address,
      },
    });
  }

  // 2. (جديد) جلب كل المراكز
  async findAll() {
    return this.prisma.center.findMany();
  }
}
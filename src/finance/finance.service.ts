import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateExpenseDto, CreateBankDepositDto } from './dto/financial-operations.dto';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  // 1. إدخال دفعة (دخل)
  async createPayment(dto: CreatePaymentDto, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          amountPaid: dto.amount,
          paymentDate: new Date(),
          receiptNumber: `REC-${Date.now()}`,
          enrollment: { connect: { id: BigInt(dto.enrollmentId) } },
          feeType: { connect: { id: dto.feeTypeId } },
          enteredByUser: { connect: { id: BigInt(userId) } },
        },
      });

      // تصحيح: استخدام connect للمستخدم وللتسجيل
      await tx.financialAuditLog.create({
        data: {
          action: 'PAYMENT_CREATED',
          user: { connect: { id: BigInt(userId) } }, // <-- تم التعديل هنا
          enrollment: { connect: { id: BigInt(dto.enrollmentId) } }, // ربط صريح
          paymentId: payment.id, // هذا حقل عادي ليس له علاقة، لذا نتركه كما هو
          detailsJson: { amount: dto.amount, type: 'INCOME' },
        },
      });

      return payment;
    });
  }

  // 2. تسجيل مصروف (خرج)
  async createExpense(dto: CreateExpenseDto, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const expense = await tx.expense.create({
        data: {
          amount: dto.amount,
          reason: dto.reason,
          authorizedBy: dto.authorizedBy,
          branch: { connect: { id: BigInt(dto.branchId) } },
          enteredByUser: { connect: { id: BigInt(userId) } },
        },
      });

      // تصحيح: استخدام connect للمستخدم
      await tx.financialAuditLog.create({
        data: {
          action: 'EXPENSE_CREATED',
          user: { connect: { id: BigInt(userId) } }, // <-- تم التعديل هنا
          detailsJson: { amount: dto.amount, reason: dto.reason, type: 'EXPENSE' },
        },
      });

      return expense;
    });
  }

  // 3. تسجيل إيداع بنكي
  async createBankDeposit(dto: CreateBankDepositDto, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const deposit = await tx.bankDeposit.create({
        data: {
          amount: dto.amount,
          bankName: dto.bankName,
          depositDate: new Date(),
          branch: { connect: { id: BigInt(dto.branchId) } },
          enteredByUser: { connect: { id: BigInt(userId) } },
        },
      });

      // تصحيح: استخدام connect للمستخدم
      await tx.financialAuditLog.create({
        data: {
          action: 'BANK_DEPOSIT',
          user: { connect: { id: BigInt(userId) } }, // <-- تم التعديل هنا
          detailsJson: { amount: dto.amount, bank: dto.bankName, type: 'DEPOSIT' },
        },
      });

      return deposit;
    });
  }

  // 4. التقرير المالي الشامل
  async getBranchStats(branchId: number) {
    const incomeAgg = await this.prisma.payment.aggregate({
      where: {
        isActive: true,
        enrollment: {
          classroom: { branchId: BigInt(branchId) }
        }
      },
      _sum: { amountPaid: true }
    });

    const expenseAgg = await this.prisma.expense.aggregate({
      where: { branchId: BigInt(branchId) },
      _sum: { amount: true }
    });

    const depositAgg = await this.prisma.bankDeposit.aggregate({
      where: { branchId: BigInt(branchId) },
      _sum: { amount: true }
    });

    const totalIncome = Number(incomeAgg._sum.amountPaid || 0);
    const totalExpense = Number(expenseAgg._sum.amount || 0);
    const totalBank = Number(depositAgg._sum.amount || 0);

    const cashBalance = totalIncome - totalExpense - totalBank;

    return {
      branchId,
      totalIncome,
      totalExpense,
      totalBankDeposited: totalBank,
      currentCashBalance: cashBalance
    };
  }

  // 5. زرع أنواع الرسوم
  async seedFeeTypes() {
    await this.prisma.feeType.createMany({
      data: [
        { nameAr: 'رسوم التسجيل', nameFr: 'Frais d\'inscription' },
        { nameAr: 'رسوم شهرية', nameFr: 'Mensualité' },
        { nameAr: 'زي مدرسي', nameFr: 'Tenue scolaire' },
      ],
      skipDuplicates: true,
    });
    return { message: 'Fee types seeded!' };
  }
}
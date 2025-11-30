import { Controller, Post, Get, Body, UseGuards, Request, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FinanceService } from './finance.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateExpenseDto, CreateBankDepositDto } from './dto/financial-operations.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, RoleName } from '../auth/roles.decorator';

@Controller('api/v1/finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('payments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.FINANCE_OFFICER, RoleName.BRANCH_MANAGER, RoleName.DIRECTOR_GENERAL)
  createPayment(@Body() dto: CreatePaymentDto, @Request() req) {
    return this.financeService.createPayment(dto, +req.user.userId);
  }

  @Post('expenses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.BRANCH_MANAGER, RoleName.DIRECTOR_GENERAL)
  createExpense(@Body() dto: CreateExpenseDto, @Request() req) {
    return this.financeService.createExpense(dto, +req.user.userId);
  }

  // --- 3. تسجيل إيداع بنكي (مع إصلاح نوع الملف) ---
  @Post('bank-deposits')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.BRANCH_MANAGER, RoleName.DIRECTOR_GENERAL)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  createBankDeposit(
    @Body() dto: CreateBankDepositDto, 
    @Request() req,
    @UploadedFile() file: any // <-- الحل: غيرناها إلى any لتجنب خطأ TypeScript
  ) {
    if (file) {
      dto.depositSlipImage = file.filename;
    }
    
    const finalDto = {
      ...dto,
      branchId: Number(dto.branchId),
      amount: Number(dto.amount)
    };

    return this.financeService.createBankDeposit(finalDto, +req.user.userId);
  }

  @Get('stats/:branchId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.BRANCH_MANAGER, RoleName.DIRECTOR_GENERAL)
  getBranchStats(@Param('branchId') branchId: string) {
    return this.financeService.getBranchStats(+branchId);
  }

  @Post('seed-fee-types')
  seedFeeTypes() {
    return this.financeService.seedFeeTypes();
  }
}
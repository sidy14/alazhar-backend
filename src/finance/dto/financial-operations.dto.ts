import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer'; // <-- 1. استيراد أداة التحويل

// نموذج المصروفات
export class CreateExpenseDto {
  @IsNumber()
  @IsNotEmpty()
  branchId: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsNotEmpty()
  authorizedBy: string;
}

// نموذج الإيداع البنكي (هنا كان الخطأ)
export class CreateBankDepositDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number) // <-- 2. الحل: حول النص القادم من FormData إلى رقم
  branchId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number) // <-- 3. الحل: حول المبلغ أيضاً
  amount: number;

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsOptional()
  depositSlipImage?: string;
}
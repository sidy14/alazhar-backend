import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  enrollmentId: number; // رقم تسجيل الطالب (الذي حصلنا عليه في الرد السابق: 1)

  @IsNumber()
  @IsNotEmpty()
  amount: number; // المبلغ المدفوع

  @IsNumber()
  @IsNotEmpty()
  feeTypeId: number; // نوع الرسوم (1: تسجيل، 2: دراسة...)
}
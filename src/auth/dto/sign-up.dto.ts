// src/auth/dto/sign-up.dto.ts (المُحدث)
import {
  IsEmail,
  IsEnum, // <-- 1. استيراد "مدقق التعداد"
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

// 2. تعريف "التعداد" يدوياً (نسخاً من Prisma)
enum AccountType {
  STAFF = 'STAFF',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
}

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  // 3. (هذا هو التغيير الأهم)
  @IsEnum(AccountType) // أخبر الحارس أن هذا الحقل يجب أن يكون واحداً من (STAFF, TEACHER, PARENT)
  @IsNotEmpty()
  accountType: AccountType;
}
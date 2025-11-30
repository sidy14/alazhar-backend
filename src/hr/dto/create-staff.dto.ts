import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

// تعريف أنواع الحسابات المسموح بإنشائها هنا
export enum StaffAccountType {
  STAFF = 'STAFF',     // إداري
  TEACHER = 'TEACHER', // أستاذ
}

export class CreateStaffDto {
  // --- بيانات الحساب ---
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
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

  @IsEnum(StaffAccountType)
  @IsNotEmpty()
  accountType: StaffAccountType;

  // --- بيانات الملف الوظيفي ---
  @IsString()
  @IsNotEmpty()
  staffIdNumber: string; // الرقم الوظيفي (مثال: T-2025-001)

  @IsString()
  @IsNotEmpty()
  jobTitle: string; // (مثال: أستاذ لغة عربية)
}
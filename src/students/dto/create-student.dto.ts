import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsNumber } from 'class-validator';

export enum FinancialStatus { FULL = 'FULL', HALF = 'HALF', EXEMPT = 'EXEMPT' }
export enum Gender { MALE = 'MALE', FEMALE = 'FEMALE' }

export class CreateStudentDto {
  @IsString() @IsNotEmpty() fullName: string;
  @IsEnum(Gender) @IsNotEmpty() gender: Gender; // <-- (جديد)
  @IsString() @IsNotEmpty() uniqueId: string;
  @IsDateString() @IsOptional() birthDate?: string;
  @IsString() @IsOptional() birthPlace?: string;
  @IsNumber() @IsNotEmpty() branchId: number;
  @IsString() @IsNotEmpty() parentName: string;
  @IsString() @IsNotEmpty() parentPhone: string;
  @IsNumber() @IsNotEmpty() classroomId: number;
  @IsNumber() @IsNotEmpty() academicYearId: number;
  @IsString() @IsNotEmpty() seatNumber: string;
  @IsEnum(FinancialStatus) @IsNotEmpty() financialStatus: FinancialStatus;
}
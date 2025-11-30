import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateClassroomDto {
  @IsString()
  @IsNotEmpty()
  name: string; // اسم الفوج

  @IsNumber()
  @IsNotEmpty()
  branchId: number;

  @IsNumber()
  @IsNotEmpty()
  levelId: number;

  @IsNumber()
  @IsNotEmpty()
  educationSystemId: number;

  @IsNumber()
  @IsNotEmpty()
  academicYearId: number;

  @IsNumber()
  @IsOptional()
  capacity?: number;
}